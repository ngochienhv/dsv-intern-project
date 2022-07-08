import { Response } from "express";
import { ReqExtendUser } from "../auth/reqExtendUser";
const CommentModel = require("../../model/comment");

async function GetCommentAPI(req: ReqExtendUser, res: Response) {
    const userRes = await CommentModel.getComment(
        req.params.username,
        req.params.articleId
    );

    if (userRes.status === "success") {
        return res.status(200).send(userRes.body);
    } else {
        return res.status(409).send(userRes.message);
    }
}

module.exports = GetCommentAPI;
