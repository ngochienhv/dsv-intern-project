import { Response } from "express";
import { ReqExtendUser } from "../auth/reqExtendUser";
const ArticleModel = require("../../model/article");

async function GetUnpublishedArticleAPI(req: ReqExtendUser, res: Response) {
    const userRes = await ArticleModel.getUnpublishedArticle(req.user);

    if (userRes.status === "success") {
        return res.status(200).send(userRes.body);
    } else {
        return res.status(403).send(userRes.message);
    }
}

module.exports = GetUnpublishedArticleAPI;
