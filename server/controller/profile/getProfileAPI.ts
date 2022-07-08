import { Response } from "express";
import { ReqExtendUser } from "../auth/reqExtendUser";
const UserModel = require("../../model/user");

async function GetProfileAPI(req: ReqExtendUser, res: Response) {
    const token = req.headers["x-access-token"];
    const username = req.params.username;

    const userRes = await UserModel.getProfile(token, username);
    if (userRes.status === "success") {
        return res.status(200).send(userRes.body);
    } else {
        return res.status(403).send(userRes.message);
    }
}

module.exports = GetProfileAPI;
