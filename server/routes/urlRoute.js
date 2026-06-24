const express = require("express");
const { restrictTo } = require("../middlewares/auth");

const Router = express.Router();

const {
    handleGenerateNewShortURL,
    handleShowUrlAnalytics,
    handleRedirectUrl,
    handleShowAllShortUrl,
    handleDeleteShortURL,
} = require("../controllers/url");


Router.get("/", restrictTo(["NORMAL", "ADMIN"]), handleShowAllShortUrl);
Router.post("/", restrictTo(["NORMAL", "ADMIN"]), handleGenerateNewShortURL);
Router.get("/analytics/:nanoid", restrictTo(["NORMAL", "ADMIN"]), handleShowUrlAnalytics);
Router.delete("/:nanoid", restrictTo(["NORMAL", "ADMIN"]), handleDeleteShortURL);

// Redirects must stay public so shortened links can be shared.
Router.get("/:nanoid", handleRedirectUrl);

module.exports = Router;
