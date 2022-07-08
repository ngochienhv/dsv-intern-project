import { Request, Response } from "express";
const UserModel = require("../../model/user");

async function signinAPI(req: Request, res: Response) {
    const body = req.body;
    const userRes = await UserModel.userSignIn(body);
    if (userRes.status === "success") {
        return res.status(200).send(userRes.body);
    } else {
        return res.status(400).send(userRes.message);
    }
}

module.exports = signinAPI;
