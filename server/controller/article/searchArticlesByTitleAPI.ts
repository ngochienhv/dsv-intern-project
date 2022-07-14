import { Response } from "express";
import { ReqExtendUser } from "../auth/reqExtendUser";
const ArticleModel = require("../../model/article");

async function SearchArticlesByTitleAPI(req: ReqExtendUser, res: Response) {
    const userRes = await ArticleModel.searchArticlesByTitle(
        req.headers["x-access-token"],
        req.query.searchString
    );

    if (userRes.status === "success") {
        return res.status(200).send(userRes.body);
    } else {
        return res.status(404).send(userRes.body);
    }
}

module.exports = SearchArticlesByTitleAPI;
