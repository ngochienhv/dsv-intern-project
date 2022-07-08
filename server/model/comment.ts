import { Article, User, Tag, Comment } from "./models";
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

exports.createComment = async (
    user: {
        user_id: string;
        email: string;
        iat: number;
        exp: number;
    },
    articleId: string,
    content: string
) => {
    const { user_id } = user;

    let res = {};
    await Comment.create({
        user: user_id,
        article: articleId,
        content: content,
        time: new Date()
            .toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
            .replace(",", ""),
    })
        .then(async (comment) => {
            await Article.findOne({ _id: articleId })
                .then((article) => {
                    article.comments.push(comment._id);
                    article.save();
                })
                .catch((err) => {
                    res = {
                        status: "fail",
                        message: "Commented fail!",
                        body: err,
                    };
                });

            await User.findOne({ _id: comment.user }).then((user) => {
                res = {
                    status: "success",
                    message: "Commented successfully!",
                    body: {
                        _id: comment._id,
                        content: comment.content,
                        user: {
                            firstname: user.profile.firstname,
                            lastname: user.profile.lastname,
                            username: user.username,
                            avatar: user.profile.avatar
                                ? user.profile.avatar.toString("base64")
                                : "",
                        },
                        time: comment.time,
                        own: true,
                    },
                };
            });
        })
        .catch((err) => {
            res = {
                status: "fail",
                message: "Commented fail!",
                body: err,
            };
        });

    return res;
};

exports.getComment = async (username: string, articleId: string) => {
    let res = {};
    await Comment.find({ article: articleId })
        .populate("user")
        .then((comments) => {
            let tempComments = comments.map((comment) => ({
                _id: comment._id,
                content: comment.content,
                user: {
                    firstname: comment.user.profile.firstname,
                    lastname: comment.user.profile.lastname,
                    username: comment.user.username,
                    avatar: comment.user.profile.avatar
                        ? comment.user.profile.avatar.toString("base64")
                        : "",
                },
                time: comment.time,
                own: username === comment.user.username ? true : false,
            }));
            tempComments = tempComments.reverse();
            res = {
                status: "success",
                message: "Get comments successfully!",
                body: tempComments,
            };
        })
        .catch((err) => {
            res = {
                status: "fail",
                message: "Get comments failed!",
                body: err,
            };
        });
    return res;
};

exports.deleteComment = async (commentId: string) => {
    let res = {};

    await Comment.deleteOne({ _id: commentId })
        .then((comment) => {
            res = {
                status: "success",
                message: "Delete comment successfully!",
                body: comment,
            };
        })
        .catch((err) => {
            res = {
                status: "fail",
                message: "Delete comment failed!",
                body: err,
            };
        });

    return res;
};
