import { Response } from "express";
import { ReqExtendUser } from "../auth/reqExtendUser";
const ArticleModel = require("../../model/article");

async function DeleteArticleAPI(req: ReqExtendUser, res: Response) {
    const userRes = await ArticleModel.deleteArticle(req.query.articleId);

    if (userRes.status === "success") {
        return res.status(200).send(userRes.body);
    } else {
        return res.status(403).send(userRes.message);
    }
}

module.exports = DeleteArticleAPI;
