import { Response } from "express";
import { ReqExtendUser } from "../auth/reqExtendUser";
const UserModel = require("../../model/user");

async function GetUserAPI(req: ReqExtendUser, res: Response) {
    const user = req.user;

    const userRes = await UserModel.getUser(user);
    if (userRes.status === "success") {
        return res.status(200).send(userRes.body);
    } else {
        return res.status(403).send(userRes.message);
    }
}

module.exports = GetUserAPI;
