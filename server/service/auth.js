const jwt = require("jsonwebtoken");

const dotenv = require ("dotenv");

dotenv.config();


function setuser(user) {

    return jwt.sign({
        _id: user._id,
        email: user.email,
        role: user.role,
    },
        process.env.JWT_SECRET);
}

function getuser(Token) {
    if (!Token) return null
   
    try {
         return jwt.verify(Token, process.env.JWT_SECRET)
        
    } catch (error) {
        return null
        
    }


}

module.exports = {
    setuser,
    getuser


}
