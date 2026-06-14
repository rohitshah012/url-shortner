const { getuser } = require("../service/auth");

async function RestrictToLoginUserOnly(req, res, next) {

    const userUid = req.cookies?.uid;

    if (!userUid) return res.redirect("/login");

    const user = getuser(userUid)

    if (!user) return res.redirect('/login')

    req.user = user;

    next();
}
async function CheckAuth(req, res, next) {
      const userUid = req.cookies?.uid;
    const user = getuser(userUid)
    req.user = user;
    next();
}



module.exports = {
    RestrictToLoginUserOnly,
    CheckAuth
}