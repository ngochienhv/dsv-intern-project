import { Response } from "express";
import { ReqExtendUser } from "../auth/reqExtendUser";
const UserModel = require("../../model/user");

async function editProfileAPI(req: ReqExtendUser, res: Response) {
    const user = req.user;
    const body = req.body;

    const userRes = await UserModel.editProfile(user, body);
    if (userRes.status === "success") {
        return res.status(200).send(userRes.message);
    } else {
        return res.status(409).send(userRes.message);
    }
}

module.exports = editProfileAPI;
