import { Response } from "express";
import { ReqExtendUser } from "../auth/reqExtendUser";
const UserModel = require("../../model/user");

async function getFollowersAPI(req: ReqExtendUser, res: Response) {
    const token = req.headers["x-access-token"];
    const username = req.params.username;
    const pageOffset = req.params.page;

    const userRes = await UserModel.getFollowers(token, username, pageOffset);
    if (userRes.status === "success") {
        return res.status(200).send(userRes.body);
    } else {
        return res.status(403).send(userRes.message);
    }
}

module.exports = getFollowersAPI;
