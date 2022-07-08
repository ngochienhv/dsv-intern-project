import express, { Request, Response } from "express";
const auth = require("../auth/authMiddleware");
const router = express.Router();
const GetPopularTagsAPI = require("../tag/getPopularTagsAPI");

router.get("/tags", function (req, res) {
    GetPopularTagsAPI(req, res);
});

module.exports = router;
