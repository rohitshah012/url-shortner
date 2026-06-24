const { getuser } = require("../service/auth");
const { User } = require("../models/user");

async function CheckForAuthentication(req, res, next) {
    const token = req.cookies?.uid;
    req.user = null;

    if (!token) return next();

    const payload = getuser(token);
    if (!payload) {
        res.clearCookie("uid");
        return next();
    }

    try {
        req.user = await User.findById(payload._id).select("_id name email role");
        if (!req.user) {
            res.clearCookie("uid");
        }
        return next();
    } catch (error) {
        return next(error);
    }
}

function restrictTo(roles = []) {
    return function (req, res, next) {
        if (!req.user) {
            return res.redirect(`/login?next=${encodeURIComponent(req.originalUrl)}`);
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).send("You are not authorized to view this page.");
        }

        return next();
    };
}

module.exports = {
    CheckForAuthentication,
    restrictTo,
};
