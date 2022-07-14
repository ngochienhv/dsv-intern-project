import { Response } from "express";
import { ReqExtendUser } from "../auth/reqExtendUser";
const ArticleModel = require("../../model/article");

async function GetBookmarkedArticleAPI(req: ReqExtendUser, res: Response) {
    const username = req.params.username;

    const userRes = await ArticleModel.getBookmarkArticle(
        req.headers["x-access-token"],
        username,
        req.params.page
    );
    if (userRes.status === "success") {
        return res.status(200).send(userRes.body);
    } else {
        return res.status(403).send(userRes.body);
    }
}

module.exports = GetBookmarkedArticleAPI;
