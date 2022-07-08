import { Request, Response } from "express";
const UserModel = require("../../model/user");

async function signupAPI(req: Request, res: Response) {
    const body = req.body;
    const userRes = await UserModel.userSignUp(body);
    if (userRes.status === "success") {
        return res.status(200).json(userRes.body);
    } else {
        return res.status(409).send(userRes.message);
    }
}

module.exports = signupAPI;
