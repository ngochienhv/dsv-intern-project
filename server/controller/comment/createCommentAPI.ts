import { Response } from "express";
import { ReqExtendUser } from "../auth/reqExtendUser";
const CommentModel = require("../../model/comment");

async function CreateCommentAPI(req: ReqExtendUser, res: Response) {
    const userRes = await CommentModel.createComment(
        req.user,
        req.params.articleId,
        req.body.content
    );

    if (userRes.status === "success") {
        return res.status(200).send(userRes.body);
    } else {
        return res.status(409).send(userRes.message);
    }
}

module.exports = CreateCommentAPI;
