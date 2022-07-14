import express, { Request, Response } from "express";
const auth = require("../auth/authMiddleware");
const router = express.Router();
const GetProfileAPI = require("../profile/getProfileAPI");
const FollowUserAPI = require("../profile/followUserAPI");
const UnFollowUserAPI = require("../profile/unFollowUserAPI");
const GetFollowersAPI = require("../profile/getFollowersAPI");
const GetFollowingsAPI = require("../profile/getFollowingsAPI");

router.get("/profiles/:username", function (req, res) {
    /* params: username */
    GetProfileAPI(req, res);
});

router.post("/profiles/:username/follow", auth, function (req, res) {
    /* params: username */
    FollowUserAPI(req, res);
});

router.delete("/profiles/:username/follow", auth, function (req, res) {
    /* params: username */
    UnFollowUserAPI(req, res);
});

router.get("/profile/:username/followers/:page", function (req, res) {
    /* header: token
     */
    GetFollowersAPI(req, res);
});

router.get("/profile/:username/followings/:page", function (req, res) {
    /* header: token
     */
    GetFollowingsAPI(req, res);
});

module.exports = router;
