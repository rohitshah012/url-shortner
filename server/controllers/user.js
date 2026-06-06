const { User } = require("../models/user");
const { URL } = require("../models/url");
const { setuser, getuser } = require("../service/auth");


const { v4: uuidv4 } = require('uuid');

async function handleUserSignup(req, res) {

    const { name, email, password } = req.body;

    await User.create({
        name,
        email,
        password
    })

    const allurls = await URL.find({});

    return res.redirect("/")
}
async function handleUserLogin(req, res) {

    const { email, password } = req.body;



    const user = await User.findOne({ email, password });

    if (!user)
        return res.render("login", { error: " invalid email or password " })

    const sessionId = uuidv4();

    setuser(sessionId, user);

    res.cookie("uid", sessionId)


    return res.redirect("/")
}

module.exports = {
    handleUserSignup,
    handleUserLogin
}
