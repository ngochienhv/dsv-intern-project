import { Article, User, Tag } from "./models";
import { ObjectId } from "mongodb";
const path = require("path");
const slugify = require("slugify");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const verifyToken = async (token: string) => {
    let userId = "";
    if (token !== "undefined") {
        userId = await jwt.verify(token, process.env.TOKEN_KEY).user_id;
    }
    return userId;
};

exports.createArticle = async function (user: {
    user_id: string;
    email: string;
    iat: number;
    exp: number;
}) {
    const { user_id } = user;
    let res = {};
    await Article.create({
        lastUpdated: new Date()
            .toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
            .replace(",", ""),
        author: user_id,
        content: "<p>Your story starts here</p>",
    })
        .then(async (article) => {
            await User.findOne({ _id: user_id })
                .then((user) => {
                    user.profile.articles.push(article._id.toString());
                    user.save();
                })
                .catch((error) => {
                    res = {
                        status: "fail",
                        message: "Error creating article!",
                        body: { error },
                    };
                    return res;
                });
            res = {
                status: "success",
                message: "Create new article successfully!",
                body: {
                    article: article._id.toString(),
                },
            };
        })
        .catch((error) => {
            res = {
                status: "fail",
                message: "Error creating article!",
                body: { error },
            };
        });

    return res;
};

exports.getUnpublishedArticle = async function (user: {
    user_id: string;
    email: string;
    iat: number;
    exp: number;
}) {
    const { user_id } = user;

    let res = {};
    await Article.find({ author: user_id, published: false })
        .then((articles) => {
            let tempArticles = articles.map(
                ({ title, author, _id, lastUpdated, content }) => ({
                    title,
                    author,
                    _id,
                    lastUpdated,
                    content:
                        content.length > 150
                            ? content.substring(0, 150).replace(/<[^>]+>/g, "")
                            : content.replace(/<[^>]+>/g, ""),
                })
            );
            res = {
                status: "success",
                message: "Get unpublished articles successfully!",
                body: tempArticles,
            };
        })
        .catch((error) => {
            res = {
                status: "fail",
                message: "Get unpublished articles fail!",
                body: error,
            };
        });

    return res;
};

exports.getPublishedArticle = async function (
    token: string,
    author: string,
    pageOffset: number
) {
    let res = {};
    let perPage = 3,
        page = Math.max(0, pageOffset);
    const user_id = await verifyToken(token);
    const authors = await User.findOne({ username: author });
    let author_id = "";
    if (authors) {
        author_id = authors._id;
    }
    await Article.find({ author: author_id, published: true })
        .populate("author")
        .populate("tags")
        .limit(perPage)
        .skip(perPage * page)
        .then((articles) => {
            let tempArticles = articles.map(
                ({
                    title,
                    author,
                    _id,
                    lastUpdated,
                    description,
                    tags,
                    image,
                    favorited,
                    bookmarked,
                    slug,
                }) => ({
                    title,
                    author: {
                        username: author.username,
                        _id: author._id,
                        firstname: author.profile.firstname,
                        lastname: author.profile.lastname,
                        avatar: author.profile.avatar
                            ? author.profile.avatar.toString("base64")
                            : "",
                    },
                    _id,
                    lastUpdated,
                    description,
                    tags: tags.map(
                        (tag: {
                            _id: string;
                            name: string;
                            articles: string[];
                        }) => tag.name
                    ),
                    image: image
                        ? "data:image/jpeg;base64," + image.toString("base64")
                        : null,
                    favoritesCount: favorited.length,
                    favorited:
                        user_id.length > 0 &&
                        favorited.indexOf(new ObjectId(user_id)) > -1
                            ? true
                            : false,
                    bookmarked:
                        user_id.length > 0 &&
                        bookmarked.indexOf(new ObjectId(user_id)) > -1
                            ? true
                            : false,
                    slug,
                })
            );
            res = {
                status: "success",
                message: "Get published articles successfully!",
                body: tempArticles,
            };
        })
        .catch((error) => {
            res = {
                status: "fail",
                message: "Get published articles fail!",
                body: error,
            };
        });

    return res;
};

exports.deleteArticle = async function (articleId: string) {
    let res = {};
    await Article.deleteOne({ _id: articleId })
        .then(async (article) => {
            res = {
                status: "success",
                message: "Delete article successfully!",
                body: article,
            };
        })
        .catch((error) => {
            res = {
                status: "fail",
                message: "Delete article fail!",
                body: error,
            };
        });

    return res;
};

exports.getEditArticle = async function (articleId: string) {
    let res = {};
    await Article.findOne({ _id: articleId })
        .populate("tags")
        .then((article) => {
            res = {
                status: "success",
                message: "Get article successfully!",
                body: {
                    _id: article._id,
                    title: article.title,
                    content: article.content,
                    description: article.description,
                    tags: article.tags.map(
                        (tag: {
                            _id: string;
                            name: string;
                            articles: string[];
                        }) => tag.name
                    ),
                    published: article.published,
                    slug: article.slug,
                    image: article.image
                        ? "data:image/jpeg;base64," +
                          article.image.toString("base64")
                        : null,
                    favoritesCount: article.favoritesCount,
                    author: article.author,
                },
            };
        })
        .catch((err) => {
            res = {
                status: "fail",
                message: "Get article fail!",
                body: err,
            };
        });
    return res;
};

exports.editArticle = async function (body: {
    _id: string;
    title: string;
    content: string;
    image: string;
    description: string;
    tags: string[];
    published: boolean;
    tagDel: string[];
}) {
    const { _id, title, content, image, description, tags, published, tagDel } =
        body;

    const tagsRes = await Promise.all(
        tags.map(async (tag: string) => {
            const tempTag = await Tag.findOne({ name: tag });
            if (tempTag) {
                if (tempTag.articles.indexOf(_id) === -1) {
                    tempTag.articles.push(_id);
                    tempTag.save();
                    return tempTag._id;
                } else if (tempTag.articles.indexOf(_id) > -1) {
                    return tempTag._id;
                }
            } else {
                let tg;
                await Tag.create({ name: tag })
                    .then(async (tag) => {
                        tag.articles.push(_id);
                        tag.save();
                        tg = tag._id;
                    })
                    .catch((error) => console.log(error));
                return tg;
            }
        })
    );

    if (tagDel && tagDel.length > 0) {
        await Promise.all(
            tagDel.map(async (tag) => {
                const tempTag = await Tag.findOne({ name: tag });
                if (tempTag) {
                    tempTag.articles.remove(_id);
                    tempTag.save();
                }
            })
        );
    }

    let imgBuffer = image ? Buffer.from(image.split(",")[1], "base64") : null;
    let res = {};
    await Article.findOne({ _id: _id })
        .then((doc) => {
            (doc.title = title),
                (doc.content =
                    content === "<p>&nbsp;</p>" || content === "<p><br></p>"
                        ? "<p>Your story starts here</p>"
                        : content),
                (doc.description = description),
                (doc.tags = tagsRes),
                (doc.published = published),
                (doc.image = imgBuffer),
                (doc.lastUpdated = new Date()
                    .toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
                    .replace(",", "")),
                (doc.slug = title ? slugify(title) : null);
            doc.save();
            res = {
                status: "success",
                message: "Saved successfully!",
                body: doc,
            };
        })
        .catch((error) => {
            console.log(error);
            res = {
                status: "fail",
                message: "Failed to save!",
                body: error,
            };
        });

    return res;
};

exports.getArticle = async function (token: string, articleId: string) {
    let res = {};
    let userId = await verifyToken(token);

    await Article.findOne({ _id: articleId })
        .populate({
            path: "author",
            populate: {
                path: "profile.articles",
                model: "Article",
            },
        })
        .populate("tags")
        .then((article) => {
            res = {
                status: "success",
                message: "Get article successfully!",
                body: {
                    _id: article._id,
                    title: article.title,
                    content: article.content,
                    description: article.description,
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
                        article.favorited.indexOf(new ObjectId(userId)) > -1,

                    bookmarked:
                        userId.length > 0 &&
                        article.bookmarked.indexOf(new ObjectId(userId)) > -1,
                    lastUpdated: article.lastUpdated,
                    author: {
                        username: article.author.username,
                        _id: article.author._id,
                        firstname: article.author.profile.firstname,
                        lastname: article.author.profile.lastname,
                        avatar: article.author.profile.avatar
                            ? article.author.profile.avatar.toString("base64")
                            : "",
                        description: article.author.profile.description,
                        followed:
                            userId.length > 0 &&
                            article.author.profile.followers.indexOf(userId) >
                                -1,
                    },
                    own: userId === article.author._id.toString(),
                    otherArticles: article.author.profile.articles
                        .filter(
                            (article: { _id: string; published: boolean }) =>
                                article._id.toString() !== articleId &&
                                article.published === true
                        )
                        .map(
                            (article: {
                                _id: string;
                                title: string;
                                tags: { name: string }[];
                                slug: string;
                                lastUpdated: string;
                            }) => {
                                return {
                                    _id: article._id,
                                    title: article.title,
                                    tag: article.tags[0].name,
                                    slug: article.slug,
                                    lastUpdated: article.lastUpdated,
                                };
                            }
                        ),
                },
            };
        })
        .catch((err) => {
            console.log(err);
            res = {
                status: "fail",
                message: "Get article fail!",
                body: err,
            };
        });
    return res;
};

exports.likeUnlikeArticle = async function (
    user: {
        user_id: string;
        email: string;
        iat: number;
        exp: number;
    },
    action: string,
    articleId: string
) {
    const { user_id } = user;
    let res = {};
    await Article.findOne({ _id: articleId })
        .then((article) => {
            if (action === "like") {
                article.favorited.push(user_id);
            } else {
                article.favorited.remove(user_id);
            }

            article.save();
            res = {
                status: "success",
                message: "Liked article successfully!",
                body: article,
            };
        })
        .catch((error) => {
            res = {
                status: "fail",
                message: "Liked article failed!",
                body: error,
            };
        });
    return res;
};

exports.bookmarkArticle = async function (
    user: {
        user_id: string;
        email: string;
        iat: number;
        exp: number;
    },
    action: string,
    articleId: string
) {
    const { user_id } = user;
    let res = {};
    await User.findOne({ _id: user_id })
        .then(async (user) => {
            if (action === "bookmark") {
                user.profile.bookmarks.push(articleId);
            } else {
                user.profile.bookmarks.remove(articleId);
            }

            user.save();
            await Article.findOne({ _id: articleId })
                .then((article) => {
                    if (action === "bookmark") {
                        article.bookmarked.push(user_id);
                    } else {
                        article.bookmarked.remove(user_id);
                    }
                    article.save();
                    res = {
                        status: "success",
                        message: "Bookmark article saved successfully!",
                        body: article,
                    };
                })
                .catch((err) => {
                    res = {
                        status: "fail",
                        message: "Bookmark article saved failed!",
                        body: err,
                    };
                });
        })
        .catch((err) => {
            res = {
                status: "fail",
                message: "Bookmark article saved failed!",
                body: err,
            };
        });
    return res;
};

exports.getBookmarkArticle = async function (
    username: string,
    pageOffset: number
) {
    let res = {};
    let perPage = 3,
        page = Math.max(0, pageOffset);
    await User.findOne({ username: username })
        .populate({
            path: "profile.bookmarks",
            populate: {
                path: "author",
                model: User,
            },
        })
        .populate({
            path: "profile.bookmarks",
            populate: {
                path: "tags",
                model: Tag,
            },
        })
        .limit(perPage)
        .skip(perPage * page)
        .then((user) => {
            if (user) {
                let tempArticles = user.profile.bookmarks.map(
                    ({
                        title,
                        author,
                        _id,
                        lastUpdated,
                        description,
                        tags,
                        image,
                        favorited,
                        bookmarked,
                        slug,
                    }: {
                        title: string;
                        author: {
                            username: string;
                            _id: string;
                            profile: {
                                firstname: string;
                                lastname: string;
                                avatar: Buffer;
                            };
                        };
                        _id: string;
                        lastUpdated: string;
                        description: string;
                        tags: {
                            _id: string;
                            name: string;
                            articles: string[];
                        }[];
                        image: Buffer;
                        favorited: ObjectId[];
                        bookmarked: ObjectId[];
                        slug: string;
                    }) => ({
                        title,
                        author: {
                            username: author.username,
                            _id: author._id,
                            firstname: author.profile.firstname,
                            lastname: author.profile.lastname,
                            avatar: author.profile.avatar
                                ? author.profile.avatar.toString("base64")
                                : "",
                        },
                        _id,
                        lastUpdated,
                        description,
                        tags: tags.map(
                            (tag: {
                                _id: string;
                                name: string;
                                articles: string[];
                            }) => tag.name
                        ),
                        image: image
                            ? "data:image/jpeg;base64," +
                              image.toString("base64")
                            : null,
                        favoritesCount: favorited.length,
                        favorited: favorited.indexOf(user._id) > -1,
                        bookmarked: bookmarked.indexOf(user._id) > -1,
                        slug,
                    })
                );
                res = {
                    status: "success",
                    message: "Get bookmarked articles successfully!",
                    body: tempArticles,
                };
            }
        })

        .catch((err) => {
            res = {
                status: "fail",
                message: "Get bookmarked articles failed!",
                body: err,
            };
        });

    return res;
};

exports.globalFeeds = async function (token: string, pageOffset: number) {
    let user_id = await verifyToken(token);
    let res = {};
    let perPage = 3,
        page = Math.max(0, pageOffset);
    await Article.find({ published: true })
        .populate("author")
        .populate("tags")
        .limit(perPage)
        .skip(perPage * page)
        .then((articles) => {
            let tempArticles = articles.map(
                ({
                    title,
                    author,
                    _id,
                    lastUpdated,
                    description,
                    tags,
                    image,
                    favorited,
                    bookmarked,
                    slug,
                }) => ({
                    title,
                    author: {
                        username: author.username,
                        _id: author._id,
                        firstname: author.profile.firstname,
                        lastname: author.profile.lastname,
                        avatar: author.profile.avatar
                            ? author.profile.avatar.toString("base64")
                            : "",
                    },
                    _id,
                    lastUpdated,
                    description,
                    tags: tags.map(
                        (tag: {
                            _id: string;
                            name: string;
                            articles: string[];
                        }) => tag.name
                    ),
                    image: image
                        ? "data:image/jpeg;base64," + image.toString("base64")
                        : null,
                    favoritesCount: favorited.length,
                    favorited:
                        user_id.length > 0 &&
                        favorited.indexOf(new ObjectId(user_id)) > -1,
                    bookmarked:
                        user_id.length > 0 &&
                        bookmarked.indexOf(new ObjectId(user_id)) > -1,
                    slug,
                    own:
                        user_id.length > 0 && user_id === author._id.toString(),
                })
            );
            res = {
                status: "success",
                message: "Get global feeds successfully!",
                body: tempArticles,
            };
        })
        .catch((err) => {
            console.log(err);

            res = {
                status: "fail",
                message: "Get global feeds failed!",
                body: err,
            };
        });
    return res;
};

exports.getFollowingPosts = async function (token: string, pageOffset: number) {
    if (!token) {
        return {
            status: "fail",
            message: "Get following articles failed!",
            body: [],
        };
    }
    let perPage = 3,
        page = Math.max(0, pageOffset);
    let user_id = await verifyToken(token);
    let res = {};
    await User.findOne({ _id: user_id })
        .then(async (user) => {
            await Article.find({ author: { $in: user.profile.following } })
                .populate("author")
                .populate("tags")
                .limit(perPage)
                .skip(perPage * page)
                .then((articles) => {
                    let tempArticles = articles.map(
                        ({
                            title,
                            author,
                            _id,
                            lastUpdated,
                            description,
                            tags,
                            image,
                            favorited,
                            bookmarked,
                            slug,
                        }) => ({
                            title,
                            author: {
                                username: author.username,
                                _id: author._id,
                                firstname: author.profile.firstname,
                                lastname: author.profile.lastname,
                                avatar: author.profile.avatar
                                    ? author.profile.avatar.toString("base64")
                                    : "",
                            },
                            _id,
                            lastUpdated,
                            description,
                            tags: tags.map(
                                (tag: {
                                    _id: string;
                                    name: string;
                                    articles: string[];
                                }) => tag.name
                            ),
                            image: image
                                ? "data:image/jpeg;base64," +
                                  image.toString("base64")
                                : null,
                            favoritesCount: favorited.length,
                            favorited:
                                user_id.length > 0 &&
                                favorited.indexOf(new ObjectId(user_id)) > -1,
                            bookmarked:
                                user_id.length > 0 &&
                                bookmarked.indexOf(new ObjectId(user_id)) > -1,
                            slug,
                            own:
                                user_id.length > 0 &&
                                user_id === author._id.toString(),
                        })
                    );
                    res = {
                        status: "success",
                        message: "Get following articles successfully!",
                        body: tempArticles,
                    };
                })
                .catch((err) => {
                    res = {
                        status: "fail",
                        message: "Get following articles failed!",
                        body: err,
                    };
                });
        })
        .catch((err) => {
            res = {
                status: "fail",
                message: "Get following articles failed!",
                body: err,
            };
        });

    return res;
};

exports.getTrendingArticle = async function () {
    await Article.aggregate([
        {
            $project: {
                title: 1,
                author: 1,
                slug: 1,
                lastUpdated: 1,
                favoriteCount: { $size: "$favorited" },
                bookmarkedCount: { $size: "$bookmarked" },
            },
        },
        { $sort: { favoriteCount: -1, bookmarkedCount: -1 } },
        { $limit: 6 },
    ]).then((res) => console.log(res));
};
