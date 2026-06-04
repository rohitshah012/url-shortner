const express = require("express");

const Router = express.Router();

const {
    handleGenerateNewShortURL,
    handleShowUrlAnalytics,
    handleRedirectUrl,
    handleShowAllShortUrl,
} = require("../controllers/url");


Router.get('/', handleShowAllShortUrl);
Router.get('/:nanoid', handleRedirectUrl);
Router.get("/analytics/:nanoid", handleShowUrlAnalytics);


Router.post("/", handleGenerateNewShortURL);

module.exports = Router;
