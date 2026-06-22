const mongoose = require("mongoose");

const urlschema = new mongoose.Schema({

    Shortid: {
        type: String,
        required: true,
        unique: true
    },
    RedirectUrl: {
        type: String,
        required: true

    },
    VisitHistory: [{
        timestamp: {
            type: String,
            default: () => new Date().toLocaleString()
        }
    }],
    Createdby : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    }
},
    { timestamps: true }
)

const URL = mongoose.model("url", urlschema);

module.exports = {
    URL,
}