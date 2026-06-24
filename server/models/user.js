const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim: true,
    },
    email : {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    role : {
        type: String,
        required : true,
        enum: ["NORMAL", "ADMIN"],
        default : "NORMAL"
    },
    password: {
         type: String,
        required: true,
       
    }
}, {timestamps : true})
 
const User = mongoose.model('user', userSchema);

module.exports = {
    User,
}
