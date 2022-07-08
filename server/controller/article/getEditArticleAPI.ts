import { Response } from "express";
import { ReqExtendUser } from "../auth/reqExtendUser";
const ArticleModel = require("../../model/article");

async function GetEditArticleAPI(req: ReqExtendUser, res: Response) {
    const userRes = await ArticleModel.getEditArticle(req.query.articleId);

    if (userRes.status === "success") {
        return res.status(200).send(userRes.body);
    } else {
        return res.status(404).send(userRes.message);
    }
}

module.exports = GetEditArticleAPI;
