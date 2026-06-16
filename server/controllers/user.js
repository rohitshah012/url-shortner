const { User } = require("../models/user");
const { URL } = require("../models/url");
const { setuser, getuser } = require("../service/auth");


const { v4: uuidv4 } = require('uuid');

const gmailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/;
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

async function handleUserSignup(req, res) {

    const { name, email, password } = req.body;
    const formData = {
        name,
        email,
    };

    if (!gmailRegex.test(email)) {
        return res.render("signup", {
            error: "Email must be a valid Gmail address ending with @gmail.com.",
            formData,
        });
    }

    if (!strongPasswordRegex.test(password)) {
        return res.render("signup", {
            error: "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.",
            formData,
        });
    }

    await User.create({
        name,
        email,
        password,
    })

    const allurls = await URL.find({});

    return res.redirect("/")
}
async function handleUserLogin(req, res) {

    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user)
        return res.render("login", { error: " invalid email or password " })

  

    const Token = setuser(user);

    res.cookie("uid", Token)


    return res.redirect("/")
}

async function handleAdminLogin(req, res) {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, password });

    if (!admin || admin.role !== "ADMIN") {
        return res.render("login", { error: "Invalid email, password, or not an admin" });
    }

    const Token = setuser(admin);
    res.cookie("uid", Token);

    return res.redirect("/admin/urls");
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
    handleAdminLogin
}
