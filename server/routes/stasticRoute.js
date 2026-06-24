const express = require("express");
const { URL } = require("../models/url");
const { User } = require("../models/user");
const { restrictTo } = require("../middlewares/auth");

const Router = express.Router();

Router.get('/admin/urls', restrictTo(["ADMIN"]), async (req, res) => {
    try {
        const allUsers = await User.find({ role: "NORMAL" }).sort({ createdAt: -1 });
        
        // Get URLs and statistics for each user
        const usersWithStats = await Promise.all(
            allUsers.map(async (user) => {
                const urls = await URL.find({ Createdby: user._id }).sort({ createdAt: -1 });
                const totalVisits = urls.reduce((sum, url) => sum + url.VisitHistory.length, 0);
                
                return {
                    name: user.name,
                    email: user.email,
                    totalUrls: urls.length,
                    totalVisits: totalVisits,
                    urls: urls
                };
            })
        );

        return res.render("admin", {
            users: usersWithStats,
            user: req.user,
            baseUrl: `${req.protocol}://${req.get("host")}`,
        });
    } catch (error) {
        return res.status(500).send("Failed to load the admin dashboard.");
    }
});

Router.get('/', async (req, res, next) => {
    try {
        if (req.user?.role === "ADMIN") {
            return res.redirect("/admin/urls");
        }

        if (!req.user) {
            return res.render("home", {
                urls: [],
                user: null,
                baseUrl: `${req.protocol}://${req.get("host")}`,
            });
        }

        const allurls = await URL.find({ Createdby: req.user._id }).sort({ createdAt: -1 });
        const createdId = req.query.created;
        const createdUrl = createdId
            ? await URL.findOne({ Shortid: createdId, Createdby: req.user._id })
            : null;

        return res.render("home", {
            urls: allurls,
            user: req.user,
            id: createdUrl?.Shortid,
            baseUrl: `${req.protocol}://${req.get("host")}`,
        });
    } catch (error) {
        return next(error);
    }
});

Router.get('/signup', (req, res) => {
    if (req.user) {
        return res.redirect(req.user.role === "ADMIN" ? "/admin/urls" : "/");
    }

    return res.render("signup", { formData: {} });
});

Router.get('/login', (req, res) => {
    if (req.user) {
        return res.redirect(req.user.role === "ADMIN" ? "/admin/urls" : "/");
    }

    return res.render("login", {
        mode: req.query.mode === "admin" ? "admin" : "user",
        success: req.query.registered === "1" ? "Account created. You can now log in." : null,
        email: "",
    });
});

module.exports = Router;
