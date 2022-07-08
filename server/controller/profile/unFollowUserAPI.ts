import { Response } from "express";
import { ReqExtendUser } from "../auth/reqExtendUser";
const UserModel = require("../../model/user");

async function UnFollowUserAPI(req: ReqExtendUser, res: Response) {
    const username = req.params.username;

    const userRes = await UserModel.unFollowUser(req.user, username);
    if (userRes.status === "success") {
        return res.status(200).send(userRes.body);
    } else {
        return res.status(403).send(userRes.message);
    }
}

module.exports = UnFollowUserAPI;
