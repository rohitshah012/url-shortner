const express = require("express");
const { URL } = require("../models/url");

const Router = express.Router();

Router.get('/', async (req, res) => {
    const allurls = await URL.find({});

    return res.render("home", {
        urls: allurls,
       
    });
});

Router.get('/signup', (req, res)=>{
    return res.render("signup")
})
module.exports = Router;
