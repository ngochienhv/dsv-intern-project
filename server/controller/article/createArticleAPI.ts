import { Response } from "express";
import { ReqExtendUser } from "../auth/reqExtendUser";
const ArticleModel = require("../../model/article");

async function CreateArticleAPI(req: ReqExtendUser, res: Response) {
    const userRes = await ArticleModel.createArticle(req.user);

    if (userRes.status === "success") {
        return res.status(200).send(userRes.body);
    } else {
        return res.status(409).send(userRes.message);
    }
}

module.exports = CreateArticleAPI;
