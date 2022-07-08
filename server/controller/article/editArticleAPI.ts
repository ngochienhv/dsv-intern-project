import { Response } from "express";
import { ReqExtendUser } from "../auth/reqExtendUser";
const ArticleModel = require("../../model/article");

async function EditArticleAPI(req: ReqExtendUser, res: Response) {
    const userRes = await ArticleModel.editArticle(req.body);

    if (userRes.status === "success") {
        return res.status(200).send(userRes.message);
    } else {
        return res.status(409).send(userRes.message);
    }
}

module.exports = EditArticleAPI;
