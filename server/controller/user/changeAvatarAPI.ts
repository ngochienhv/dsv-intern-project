import { Response } from "express";
import { ReqExtendUser } from "../auth/reqExtendUser";
const UserModel = require("../../model/user");

async function ChangeAvatarAPI(req: ReqExtendUser, res: Response) {
    const user = req.user;
    const avatar = req.body.avatar;

    const userRes = await UserModel.changeAvatar(user, avatar);
    if (userRes.status === "success") {
        return res.status(200).send(userRes.message);
    } else {
        return res.status(500).send(userRes.message);
    }
}

module.exports = ChangeAvatarAPI;
