import { Response } from "express";
import { ReqExtendUser } from "../auth/reqExtendUser";
const ArticleModel = require("../../model/article");

async function BookmarkArticleAPI(req: ReqExtendUser, res: Response) {
    const userRes = await ArticleModel.bookmarkArticle(
        req.user,
        req.params.action,
        req.query.articleId
    );

    if (userRes.status === "success") {
        return res.status(200).send(userRes.body);
    } else {
        return res.status(403).send(userRes.body);
    }
}

module.exports = BookmarkArticleAPI;
