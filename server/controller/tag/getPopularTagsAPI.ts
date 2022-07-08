import { Response } from "express";
import { ReqExtendUser } from "../auth/reqExtendUser";
const TagModel = require("../../model/tag");

async function GetPopularTagsAPI(req: ReqExtendUser, res: Response) {
    const userRes = await TagModel.getPopularTags();
    if (userRes.status === "success") {
        return res.status(200).send(userRes.body);
    } else {
        return res.status(403).send(userRes.message);
    }
}

module.exports = GetPopularTagsAPI;
