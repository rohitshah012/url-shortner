const { User } = require("../models/user");
const { URL } = require("../models/url");

async function handleUserSignup(req, res) {

    const {name , email , password} = req.body;

   await User.create({
        name,
        email,
        password
    })
    
     const allurls = await URL.find({});

     return res.render("home", { urls: allurls })
}

module.exports = {
    handleUserSignup
}
