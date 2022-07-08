import { Response } from "express";
import { ReqExtendUser } from "../auth/reqExtendUser";
const ArticleModel = require("../../model/article");

async function GlobalFeedsAPI(req: ReqExtendUser, res: Response) {
    const token = req.headers["x-access-token"];
    const page = req.params.page;
    const userRes = await ArticleModel.globalFeeds(token, page);

    if (userRes.status === "success") {
        return res.status(200).send(userRes.body);
    } else {
        return res.status(403).send(userRes.message);
    }
}

module.exports = GlobalFeedsAPI;
