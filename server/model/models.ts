import { ObjectId } from "mongodb";
import * as mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
    slug: { type: String, default: "" },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    content: { type: String, default: "" },
    tags: [{ type: ObjectId, default: null, ref: "Tag" }],
    image: { type: Buffer, default: null },
    lastUpdated: { type: String, default: "" },
    published: { type: Boolean, default: false },
    favorited: [{ type: ObjectId, default: null, ref: "User" }],
    bookmarked: [{ type: ObjectId, default: null, ref: "User" }],
    comments: [{ type: ObjectId, default: null, ref: "Comment" }],
    author: { type: ObjectId, ref: "User" },
});

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    username: { type: String, unique: true },
    password: { type: String },
    profile: {
        firstname: { type: String },
        lastname: { type: String },
        avatar: { type: Buffer, default: null },
        description: { type: String, default: null },
        bio: { type: String, default: null },
        followers: [{ type: ObjectId, default: null, ref: "User" }],
        following: [{ type: ObjectId, default: null, ref: "User" }],
        bookmarks: [{ type: ObjectId, default: null, ref: "Article" }],
        articles: [{ type: ObjectId, default: null, ref: "Article" }],
    },
});

const tagSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    articles: [{ type: ObjectId, ref: "Article" }],
});

const commentSchema = new mongoose.Schema({
    content: { type: String },
    time: { type: String },
    article: { type: ObjectId, ref: "Article" },
    user: { type: ObjectId, ref: "User" },
    reply: [{ type: ObjectId, ref: "Comment", default: null }],
    parent: { type: ObjectId, ref: "Comment", default: null },
});

articleSchema.pre(
    "deleteOne",
    { query: true, document: false },
    async function () {
        let id = await this.getQuery()["_id"];
        await User.findOne({ "profile.articles": id })
            .then((user) => {
                user.profile.articles.remove(id);
                user.save();
            })
            .catch((err) => {
                console.log(err);
            });

        await User.find({ "profile.bookmarks": id })
            .then(async (users) => {
                await Promise.all(
                    users.map(async (user) => {
                        user.profile.bookmarks.remove(id);
                        user.save();
                    })
                );
            })
            .catch((err) => {
                console.log(err);
            });

        await Tag.find({ articles: id })
            .then(async (tags) => {
                await Promise.all(
                    tags.map(async (tag) => {
                        tag.articles.remove(id);
                        tag.save();
                    })
                );
            })
            .catch((err) => {
                console.log(err);
            });

        await Comment.deleteMany({ article: id });
    }
);

commentSchema.pre(
    "deleteOne",
    { query: true, document: false },
    async function () {
        let id = await this.getQuery()["_id"];

        await Article.findOne({ comments: id })
            .then((article) => {
                article.comments.remove(id);
                article.save();
            })
            .catch((err) => {
                console.log(err);
            });
    }
);

export const User = mongoose.model("User", userSchema);

export const Article = mongoose.model("Article", articleSchema);

export const Tag = mongoose.model("Tag", tagSchema);

export const Comment = mongoose.model("Comment", commentSchema);
