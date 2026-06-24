const express = require("express");
const {
    handleUserSignup,
    handleUserLogin,
    handleAdminLogin,
} = require("../controllers/user");

const Router = express.Router();

Router.post("/", handleUserSignup);
Router.post("/login", handleUserLogin);
Router.post("/admin-login", handleAdminLogin);
Router.post("/logout", (req, res) => {
    res.clearCookie("uid", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });
    return res.redirect("/login");
});

module.exports = Router;
