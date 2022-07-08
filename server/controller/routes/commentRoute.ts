import express, { Request, Response } from "express";
const auth = require("../auth/authMiddleware");
const router = express.Router();
const CreateCommentAPI = require("../comment/createCommentAPI");
const GetCommentAPI = require("../comment/getCommentAPI");
const DeleteCommentAPI = require("../comment/deleteCommentAPI");

router.post("/article/:articleId/comment", auth, function (req, res) {
    /* params: articleId */
    CreateCommentAPI(req, res);
});

router.get("/article/:articleId/:username/comment", function (req, res) {
    /* params: username, articleId */
    GetCommentAPI(req, res);
});

router.delete("/article/comment", auth, function (req, res) {
    /* query: commentId */
    DeleteCommentAPI(req, res);
});

module.exports = router;
