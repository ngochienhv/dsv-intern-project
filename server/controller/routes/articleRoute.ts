import express, { Request, Response } from "express";
const auth = require("../auth/authMiddleware");
const router = express.Router();
const CreateArticleAPI = require("../article/createArticleAPI");
const GetUnpublishedArticleAPI = require("../article/getUnpublishedArticlesAPI");
const DeleteArticleAPI = require("../article/deleteArticleAPI");
const GetEditArticleAPI = require("../article/getEditArticleAPI");
const EditArticleAPI = require("../article/editArticleAPI");
const GetPublishedArticleAPI = require("../article/getPublishedArticleAPI");
const GetArticleAPI = require("../article/getArticleAPI");
const LikeUnlikeArticleAPI = require("../article/likeArticleAPI");
const BookmarkArticleAPI = require("../article/bookmarkArticleAPI");
const GetBookmarkedArticleAPI = require("../article/getBookmarkedArticleAPI");
const GlobalFeedsAPI = require("../article/globalFeedsAPI");
const GetFollowingArticlesAPI = require("../article/getFollowingArticlesAPI");
const GetTrendingArticlesAPI = require("../article/getTrendingArticlesAPI");
const SearchArticlesByTitleAPI = require("../article/searchArticlesByTitleAPI");

router.post("/articles", auth, function (req, res) {
    /* token required */
    CreateArticleAPI(req, res);
});

router.get("/articles/unpublished", auth, function (req, res) {
    /* token required */
    GetUnpublishedArticleAPI(req, res);
});

router.get("/articles/published/:page", function (req, res) {
    /* token required */
    GetPublishedArticleAPI(req, res);
});

router.delete("/articles", auth, function (req, res) {
    /* token required 
        query: articleId;
    */
    DeleteArticleAPI(req, res);
});

router.get("/articles", auth, function (req, res) {
    /* token required 
        query: articleId;
    */
    GetEditArticleAPI(req, res);
});

router.put("/articles", auth, function (req, res) {
    /* token required 
        body: {
            _id: string;
            title: string;
            content: string;
            image: string;
            description: string;
            tags: string[];
            published: boolean;
        }
    */
    EditArticleAPI(req, res);
});

router.get("/article", function (req, res) {
    /* token required 
        query: articleId;
    */
    GetArticleAPI(req, res);
});

router.post("/article/:action", auth, function (req, res) {
    /* token required 
        query: articleId;
    */
    LikeUnlikeArticleAPI(req, res);
});

router.post("/article/bm/:action", auth, function (req, res) {
    /* token required 
        query: articleId;
    */
    BookmarkArticleAPI(req, res);
});

router.get("/article/bm/:username/:page", function (req, res) {
    /* 
        param: username;
                page: number;
    */
    GetBookmarkedArticleAPI(req, res);
});

router.get("/articles/global/:page", function (req, res) {
    GlobalFeedsAPI(req, res);
});

router.get("/articles/following/:page", function (req, res) {
    /* token optional */
    GetFollowingArticlesAPI(req, res);
});

router.get("/articles/trending", function (req, res) {
    /* token optional */
    GetTrendingArticlesAPI(req, res);
});

router.get("/articles/search", function (req, res) {
    SearchArticlesByTitleAPI(req, res);
});

module.exports = router;
