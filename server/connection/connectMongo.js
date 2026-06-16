const mongoose = require('mongoose');




async function ConnectMongo(link) {

    await mongoose
        .connect(process.env.MONGO_URI)
        .then(() => console.log("mongodb connected!"))
        .catch(err => console.log("failed to connect mongodb ", err))
      

}

module.exports = {
    ConnectMongo

};