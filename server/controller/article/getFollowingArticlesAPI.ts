import { Response } from "express";
import { ReqExtendUser } from "../auth/reqExtendUser";
const ArticleModel = require("../../model/article");

async function GetFollowingArticlesAPI(req: ReqExtendUser, res: Response) {
    const userRes = await ArticleModel.getFollowingPosts(
        req.headers["x-access-token"],
        req.params.page
    );

    if (userRes.status === "success") {
        return res.status(200).send(userRes.body);
    } else {
        return res.status(404).send(userRes.body);
    }
}

module.exports = GetFollowingArticlesAPI;
