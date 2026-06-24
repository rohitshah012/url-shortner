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
            type: Date,
            default: Date.now
        }
    }],
    Createdby : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required: true
    }
},
    { timestamps: true }
)

const URL = mongoose.model("url", urlschema);

module.exports = {
    URL,
}
