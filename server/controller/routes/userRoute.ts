import express, { Request, Response } from "express";
const auth = require("../auth/authMiddleware");
const router = express.Router();
const signupAPI = require("../user/signupAPI");
const signinAPI = require("../user/signinAPI");
const ChangeAvatarAPI = require("../user/changeAvatarAPI");
const GetUserAPI = require("../user/getUserAPI");
const EditProfileAPI = require("../user/editProfileAPI");

router.post("/users", function (req: Request, res: Response) {
    /* body: {
        "email": string,
        "firstname": string,
        "lastname": string,
        "password": string,
    }*/
    signupAPI(req, res);
});

router.post("/users/login", function (req: Request, res: Response) {
    /* body: {
        "email": string,
        "password": string,
    }*/
    signinAPI(req, res);
});

router.post(
    "/user/change_avatar",
    auth,
    function (req: Request, res: Response) {
        /* header: token
            body: avatar base64
        */
        ChangeAvatarAPI(req, res);
    }
);

router.get("/user", auth, function (req: Request, res: Response) {
    /* header: token
     */
    GetUserAPI(req, res);
});

router.put("/user", auth, function (req: Request, res: Response) {
    /* header: token
        body: {
            firstname: string,
            lastname: string,
            username: string,
            bio: string,
            description: string
        }
     */
    EditProfileAPI(req, res);
});

module.exports = router;
