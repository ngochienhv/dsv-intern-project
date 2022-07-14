import express, { Request, Response } from "express";
const auth = require("../auth/authMiddleware");
const router = express.Router();
const GetPopularTagsAPI = require("../tag/getPopularTagsAPI");
const GetTagsArticlesAPI = require("../tag/getTagsArticlesAPI");

router.get("/tags", function (req, res) {
    GetPopularTagsAPI(req, res);
});

router.get("/tags/:tag", function (req, res) {
    GetTagsArticlesAPI(req, res);
});

module.exports = router;
