import { Article, User, Tag, Comment } from "./models";
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

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
