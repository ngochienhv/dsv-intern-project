import { Response, NextFunction } from "express";
import { ReqExtendUser } from "./reqExtendUser";
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const verifyToken = (req: ReqExtendUser, res: Response, next: NextFunction) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decode = jwt.verify(token, process.env.TOKEN_KEY);
        req.user = decode;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = verifyToken;
