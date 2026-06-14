const express = require("express");
const { URL } = require("../models/url");

const Router = express.Router();

Router.get('/', async (req, res) => {

    if (!req.user) return res.redirect("/login");
    const allurls = await URL.find({ Createdby: req.user._id });

    return res.render("home", {
        urls: allurls,
    });
});

Router.get('/signup', (req, res)=>{
    return res.render("signup")
})

Router.get('/login', (req, res)=>{
    return res.render("login")
})

module.exports = Router;
