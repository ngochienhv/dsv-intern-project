import { Article, User, Tag, Comment } from "./models";
import { ObjectId } from "mongodb";
const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const verifyToken = async (token: string) => {
    let userId = "";
    if (token !== "undefined") {
        userId = await jwt.verify(token, process.env.TOKEN_KEY).user_id;
    }
    return userId;
};

exports.getPopularTags = async function () {
    let res = {};
    await Tag.aggregate([
        {
            $project: {
                name: 1,
                articlesCount: { $size: "$articles" },
            },
        },
        { $sort: { articlesCount: -1 } },
        { $limit: 10 },
    ])
        .then((tags) => {
            let tempTags = tags.map((tag) => tag.name);
            res = {
                status: "success",
                message: "Get popular tags successfully!",
                body: tempTags,
            };
        })
        .catch((err) => {
            console.log(err);
            res = {
                status: "fail",
                message: "Get popular tags failed!",
                body: err,
            };
        });

    return res;
};

exports.getTagsArticles = async function (token: string, tag: string) {
    let res = {};
    let userId = "";
    if (token) {
        userId = await verifyToken(token);
    }

    await Tag.findOne({ name: tag })
        .populate("articles")
        .populate({
            path: "articles",
            populate: { path: "tags", model: "Tag" },
        })
        .sort({ lastUpdated: -1 })
        .populate({
            path: "articles",
            populate: { path: "author", model: "User" },
        })
        .then((tag) => {
            res = {
                status: "success",
                message: "Get articles by tag successfully!",
                body: tag.articles.map(
                    (article: {
                        _id: string;
                        title: string;
                        description: string;
                        slug: string;
                        tags: {
                            _id: string;
                            name: string;
                            articles: string[];
                        }[];
                        favoritesCount: number;
                        favorited: ObjectId[];
                        bookmarked: ObjectId[];
                        lastUpdated: string;
                        author: {
                            username: string;
                            _id: string;
                            profile: {
                                firstname: string;
                                lastname: string;
                                avatar: Buffer;
                            };
                        };
                    }) => ({
                        _id: article._id,
                        title: article.title,
                        tags: article.tags.map(
                            (tag: {
                                _id: string;
                                name: string;
                                articles: string[];
                            }) => tag.name
                        ),
                        slug: article.slug,
                        favoritesCount: article.favorited.length,
                        favorited:
                            userId.length > 0 &&
                            article.favorited.indexOf(new ObjectId(userId)) >
                                -1,
                        bookmarked:
                            userId.length > 0 &&
                            article.bookmarked.indexOf(new ObjectId(userId)) >
                                -1,
                        lastUpdated: article.lastUpdated,
                        author: {
                            username: article.author.username,
                            _id: article.author._id,
                            firstname: article.author.profile.firstname,
                            lastname: article.author.profile.lastname,
                            avatar: article.author.profile.avatar
                                ? article.author.profile.avatar.toString(
                                      "base64"
                                  )
                                : "",
                        },
                        own: userId === article.author._id.toString(),
                    })
                ),
            };
        })
        .catch((err) => {
            console.log(err);

            res = {
                status: "fail",
                message: "Get articles by tag failed!",
                body: err,
            };
        });
    return res;
};
