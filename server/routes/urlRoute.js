const express = require("express");

const Router = express.Router();

const {
    handleGenerateNewShortURL,
    handleShowUrlAnalytics,
    handleRedirectUrl,
    handleShowAllShortUrl,
    handleDeleteShortURL,
} = require("../controllers/url");


Router.get('/', handleShowAllShortUrl);
Router.get('/:nanoid', handleRedirectUrl);
Router.get("/analytics/:nanoid", handleShowUrlAnalytics);
Router.delete("/:nanoid", handleDeleteShortURL);

Router.post("/", handleGenerateNewShortURL);

module.exports = Router;
