import { User } from "./models";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const shortid = require("shortid");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const verifyToken = async (token: string) => {
    let userId = "";
    if (token !== "undefined") {
        userId = await jwt.verify(token, process.env.TOKEN_KEY).user_id;
    }
    return userId;
};

exports.userSignUp = async function (body: {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
}) {
    try {
        const { email, password, firstname, lastname } = body;

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return {
                status: "fail",
                message: "Emails already registered",
                body: null,
            };
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return {
                status: "fail",
                message: "Users already exists",
                body: null,
            };
        }

        const encryptedPass = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email: email,
            username: firstname + "." + lastname + (await shortid.generate()),
            password: encryptedPass,
            profile: {
                firstname: firstname,
                lastname: lastname,
            },
        });

        const token = jwt.sign(
            { user_id: newUser._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "30d",
            }
        );

        newUser.token = token;

        return {
            status: "success",
            message: "User created",
            body: {
                email: newUser.email,
                name:
                    newUser.profile.lastname + " " + newUser.profile.firstname,
                token: newUser.token,
                avatar: newUser.profile.avatar
                    ? newUser.profile.avatar.toString("base64")
                    : "",
                username: newUser.username,
            },
        };
    } catch (err) {
        console.log(err);
    }
};

exports.userSignIn = async function (body: {
    email: string;
    password: string;
}) {
    try {
        const { email, password } = body;

        const user = await User.findOne({ email: email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "30d",
                }
            );

            user.token = token;
            return {
                status: "success",
                message: "User loged in",
                body: {
                    email: user.email,
                    name: user.profile.lastname + " " + user.profile.firstname,
                    token: user.token,
                    avatar: user.profile.avatar
                        ? user.profile.avatar.toString("base64")
                        : "",
                    username: user.username,
                },
            };
        } else {
            return { status: "fail", message: "User not found!", body: null };
        }
    } catch (err) {
        console.log(err);
    }
};

exports.changeAvatar = async function (
    user: {
        user_id: string;
        email: string;
        iat: number;
        exp: number;
    },
    avatar: string
) {
    const { user_id } = user;
    let avaBuffer = Buffer.from(avatar.split(",")[1], "base64");

    let res = {};

    await User.findOne({ _id: user_id })
        .then((doc) => {
            doc.profile.avatar = avaBuffer;
            doc.save();
            res = {
                status: "success",
                message: "Updated avatar successfully!",
                body: null,
            };
        })
        .catch((err) => {
            console.log(err);
            res = {
                status: "fail",
                message: "Could not update avatar!",
                body: null,
            };
        });

    return res;
};

exports.getUser = async function (user: {
    user_id: string;
    email: string;
    iat: number;
    exp: number;
}) {
    const { user_id } = user;

    const doc = await User.findOne({ _id: user_id });
    if (doc) {
        return {
            status: "success",
            message: "Found profile!",
            body: {
                ...doc.profile,
                username: doc.username,
                avatar: doc.profile.avatar
                    ? doc.profile.avatar.toString("base64")
                    : "",
                own: true,
                followersCount: doc.profile.followers.length,
                followingCount: doc.profile.following.length,
            },
        };
    } else {
        return {
            status: "fail",
            message: "Could not find profile!",
            body: null,
        };
    }
};

exports.editProfile = async function (
    user: {
        user_id: string;
        email: string;
        iat: number;
        exp: number;
    },
    body: {
        firstname: string;
        lastname: string;
        username: string;
        description: string;
        bio: string;
    }
) {
    const { user_id } = user;
    const { firstname, lastname, username, description, bio } = body;
    let res = {};

    const userExist = await User.findOne({ username: username });
    if (userExist && userExist._id.toString() !== user_id) {
        res = {
            status: "fail",
            message: "Username already exists!",
            body: null,
        };

        return res;
    }
    await User.findOne({ _id: user_id })
        .then((doc) => {
            doc.username = username;
            doc.profile = {
                ...doc.profile,
                firstname: firstname,
                lastname: lastname,
                description: description,
                bio: bio,
            };
            doc.save();
            res = {
                status: "success",
                message: "Updated profile successfully!",
                body: null,
            };
        })
        .catch((err) => {
            console.log(err);
            res = {
                status: "fail",
                message: "Could not update profile!",
                body: null,
            };
        });

    return res;
};

exports.getProfile = async function (token: string, username: string) {
    const user_id = await verifyToken(token);
    const user = await User.findOne({ username: username });

    if (user) {
        return {
            status: "success",
            message: "Found profile!",
            body: {
                ...user.profile,
                username: user.username,
                avatar: user.profile.avatar
                    ? user.profile.avatar.toString("base64")
                    : "",
                followed:
                    user_id.length > 0 &&
                    user.profile.followers.indexOf(user_id) > -1,
                own: user_id === user._id.toString(),
            },
        };
    } else {
        return {
            status: "fail",
            message: "Could not find profile!",
            body: null,
        };
    }
};

exports.followUser = async function (
    user: {
        user_id: string;
        email: string;
        iat: number;
        exp: number;
    },
    username: string
) {
    const { user_id } = user;
    let res = {};
    await User.findOne({ _id: user_id })
        .then(async (user) => {
            await User.findOne({ username: username })
                .then((followUser) => {
                    followUser.profile.followers.push(user._id);
                    followUser.save();
                    user.profile.following.push(followUser._id);
                    user.save();
                    res = {
                        status: "success",
                        message: "Follow user successfully!",
                        body: followUser.profile,
                    };
                })
                .catch((err) => {
                    res = {
                        status: "fail",
                        message: "Follow user failed!",
                        body: err,
                    };
                });
        })
        .catch((err) => {
            res = {
                status: "fail",
                message: "Follow user failed!",
                body: err,
            };
        });

    return res;
};

exports.unFollowUser = async function (
    user: {
        user_id: string;
        email: string;
        iat: number;
        exp: number;
    },
    username: string
) {
    const { user_id } = user;
    let res = {};
    await User.findOne({ _id: user_id })
        .then(async (user) => {
            await User.findOne({ username: username })
                .then((followUser) => {
                    followUser.profile.followers.remove(user._id);
                    followUser.save();
                    user.profile.following.remove(followUser._id);
                    user.save();
                    res = {
                        status: "success",
                        message: "Unfollow user successfully!",
                        body: followUser.profile,
                    };
                })
                .catch((err) => {
                    res = {
                        status: "fail",
                        message: "Unfollow user failed!",
                        body: err,
                    };
                });
        })
        .catch((err) => {
            res = {
                status: "fail",
                message: "Unfollow user failed!",
                body: err,
            };
        });

    return res;
};
