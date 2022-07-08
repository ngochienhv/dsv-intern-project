import { Response } from "express";
import { ReqExtendUser } from "../auth/reqExtendUser";
const ArticleModel = require("../../model/article");

async function GetPublishedArticleAPI(req: ReqExtendUser, res: Response) {
    const author = req.query.author;
    const token = req.headers["x-access-token"];
    const userRes = await ArticleModel.getPublishedArticle(
        token,
        author,
        req.params.page
    );

    if (userRes.status === "success") {
        return res.status(200).send(userRes.body);
    } else {
        return res.status(403).send(userRes.message);
    }
}

module.exports = GetPublishedArticleAPI;
