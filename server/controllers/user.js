const { User } = require("../models/user");
const { URL } = require("../models/url");
const { setuser, getuser } = require("../service/auth");
const bcrypt = require('bcrypt');

const gmailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/;
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

async function handleUserSignup(req, res) {

    const { name, email, password } = req.body;
    const formData = {
        name,
        email,
    };

    // Validate required fields
    if (!name || !email || !password) {
        return res.render("signup", {
            error: "All fields are required.",
            formData,
        });
    }

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

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render("signup", {
                error: "Email already registered. Please use a different email.",
                formData,
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.redirect("/user/login");
    } catch (error) {
        return res.render("signup", {
            error: "Error during signup. Please try again.",
            formData,
        });
    }
}
async function handleUserLogin(req, res) {

    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        return res.render("login", { 
            error: "Email and password are required.",
            email: email || "",
        });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.render("login", { 
                error: "Invalid email or password",
                email: email || "",
            });
        }

        // Compare password with hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.render("login", { 
                error: "Invalid email or password",
                email: email || "",
            });
        }

        const Token = setuser(user);
        res.cookie("uid", Token);

        return res.redirect("/");
    } catch (error) {
        return res.render("login", { 
            error: "Error during login. Please try again.",
            email: email || "",
        });
    }
}

async function handleAdminLogin(req, res) {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        return res.render("login", { 
            error: "Email and password are required.",
            email: email || "",
        });
    }

    try {
        const admin = await User.findOne({ email });

        if (!admin || admin.role !== "ADMIN") {
            return res.render("login", { 
                error: "Invalid email, password, or not an admin",
                email: email || "",
            });
        }

        // Compare password with hashed password
        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res.render("login", { 
                error: "Invalid email, password, or not an admin",
                email: email || "",
            });
        }

        const Token = setuser(admin);
        res.cookie("uid", Token);

        return res.redirect("/admin/urls");
    } catch (error) {
        return res.render("login", { 
            error: "Error during admin login. Please try again.",
            email: email || "",
        });
    }
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
    handleAdminLogin
}
