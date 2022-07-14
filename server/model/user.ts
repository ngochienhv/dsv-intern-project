import { User } from "./models";
import { user } from "./typesDef";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const shortid = require("shortid");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// const client = new OAuth2Client(
//     "186405993485-66lcpstbso7gdl14jj99dpuj45pvrth5.apps.googleusercontent.com"
// );
// async function verify() {
//     const ticket = await client.verifyIdToken({
//         idToken:
//             "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFiZDY4NWY1ZThmYzYyZDc1ODcwNWMxZWIwZThhNzUyNGM0NzU5NzUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2NTc3MDYwOTYsImF1ZCI6IjE4NjQwNTk5MzQ4NS02NmxjcHN0YnNvN2dkbDE0amo5OWRwdWo0NXB2cnRoNS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExMDQyMzc0Nzg5NDE0MDU2MDEzMiIsImVtYWlsIjoibmdvY2hpZW4xMjNodkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXpwIjoiMTg2NDA1OTkzNDg1LTY2bGNwc3Ric283Z2RsMTRqajk5ZHB1ajQ1cHZydGg1LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwibmFtZSI6Ikhp4buDbiBOZ3V54buFbiBOZ-G7jWMiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUl0YnZtbTBwYnQ5amMwWnZCX3RkWkVUWUhUQjhzU1F4MDd3VE9jNkxKYkk9czk2LWMiLCJnaXZlbl9uYW1lIjoiSGnhu4NuIiwiZmFtaWx5X25hbWUiOiJOZ3V54buFbiBOZ-G7jWMiLCJpYXQiOjE2NTc3MDYzOTYsImV4cCI6MTY1NzcwOTk5NiwianRpIjoiNjRjZGZjOWRiMGE1ODc0MmU2NmNlOGZkMWJiMzA0Y2Q0NjU4MGQyOCJ9.JefduKmtizqJadZ8qM5dxENDR9N3l9vr8151FOaRJell4GEHCtUJhFNEM0st84Bp8iCor2HMgL_wx_Wc8iOImkIlNrHQEkMXvNqXXzacmXelMFkJSKGX0Vx4M5AjZCEQFNoUDEwxQa9HSHpk59lali6fAqKcgr8nMWFLkOeyBZZfVfrvg3gAc35dbFVuzjlDhv6CoWKsjBAooJspvjHGXp-pqEwVfSWXOL42Xo5KMalpk2iR8pkVdK0soA3XtghkRjCdWrPkx2SY--eTpHDTqiqaoKUFQGjb-0BhiOyMhsL8rM1evAZE1Olq4FeG9GbsV_gECXGUayKsSlymyy74Jw",
//         audience:
//             "186405993485-66lcpstbso7gdl14jj99dpuj45pvrth5.apps.googleusercontent.com", // Specify the CLIENT_ID of the app that accesses the backend
//         // Or, if multiple clients access the backend:
//         //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
//     });
//     const payload = ticket.getPayload();
//     const userid = payload["sub"];
//     // If request specified a G Suite domain:
//     // const domain = payload['hd'];
//     console.log(payload);
//     console.log(userid);
// }
// verify().catch(console.error);

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
                avatar: newUser.profile.avatar,
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
                    avatar: user.profile.avatar,
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

    let res = {};
    await User.findOne({ _id: user_id })
        .then((doc) => {
            doc.profile.avatar = avatar;
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
                avatar: doc.profile.avatar,
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
                avatar: user.profile.avatar,
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

exports.getFollowers = async function (
    token: string,
    username: string,
    pageOffset: number
) {
    let res = {};
    let user_id = "";
    if (token) {
        user_id = await verifyToken(token);
    }
    let perPage = 6,
        page = Math.max(0, pageOffset);

    await User.findOne({ username: username })
        .populate("profile.followers")
        .then((user) => {
            res = {
                status: "success",
                message: "Get followers successfully!",
                body: user.profile.followers
                    .slice(page * perPage, (page + 1) * perPage)
                    .map((follower: user) => ({
                        _id: follower._id,
                        username: follower.username,
                        firstname: follower.profile.firstname,
                        lastname: follower.profile.lastname,
                        avatar: follower.profile.avatar,
                        followed:
                            user_id.length > 0 &&
                            follower.profile.followers.indexOf(user_id) > -1,
                        own: user_id === follower._id.toString(),
                    })),
            };
        })
        .catch((error) => {
            console.log(error);

            res = {
                status: "fail",
                message: "Get followers failed!",
                body: error,
            };
        });
    return res;
};

exports.getFollowings = async function (
    token: string,
    username: string,
    pageOffset: number
) {
    let res = {};
    let user_id = "";
    if (token) {
        user_id = await verifyToken(token);
    }
    let perPage = 6,
        page = Math.max(0, pageOffset);

    await User.findOne({ username: username })
        .populate("profile.following")
        .then((user) => {
            res = {
                status: "success",
                message: "Get followers successfully!",
                body: user.profile.following
                    .slice(page * perPage, (page + 1) * perPage)
                    .map((follower: user) => ({
                        _id: follower._id,
                        username: follower.username,
                        firstname: follower.profile.firstname,
                        lastname: follower.profile.lastname,
                        avatar: follower.profile.avatar,
                        followed:
                            user_id.length > 0 &&
                            follower.profile.followers.indexOf(user_id) > -1,
                        own: user_id === follower._id.toString(),
                    })),
            };
        })
        .catch((error) => {
            console.log(error);

            res = {
                status: "fail",
                message: "Get followers failed!",
                body: error,
            };
        });
    return res;
};
