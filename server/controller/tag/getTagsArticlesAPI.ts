import { Response } from "express";
import { ReqExtendUser } from "../auth/reqExtendUser";
const TagModel = require("../../model/tag");

async function GetTagsArticlesAPI(req: ReqExtendUser, res: Response) {
    const userRes = await TagModel.getTagsArticles(
        req.headers["x-access-token"],
        req.params.tag
    );
    if (userRes.status === "success") {
        return res.status(200).send(userRes.body);
    } else {
        return res.status(403).send(userRes.message);
    }
}

module.exports = GetTagsArticlesAPI;
