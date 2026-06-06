const { getuser } = require("../service/auth");

async function RestrictToLoginUserOnly (req, res , next ){

    const userUid = req.cookies?.uid;

    if(!userUid) return res.redirect("/");

     const user = getuser(userUid)

     if(!user) return res.redirect('/')

        req.user = user;

        next();
}

module.exports = {
    RestrictToLoginUserOnly
}