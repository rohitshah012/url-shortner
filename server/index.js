const express = require("express");
const { ConnectMongo } = require("./connection/connectMongo");
const path = require("path");
const cookieParser = require("cookie-parser");
const { CheckForAuthentication } = require("./middlewares/auth");

const dotenv = require ("dotenv");
dotenv.config();



const urlRoute = require("./routes/urlRoute");
const staticRoute = require("./routes/stasticRoute");
const userRoute = require("./routes/user")


const app = express();


// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
app.use(CheckForAuthentication);


//ejs setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Routes
app.use("/url", urlRoute);
app.use("/user", userRoute)
app.use("/", staticRoute);

const PORT = process.env.PORT || 5000;

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Something went wrong. Please try again.");
});

async function startServer() {
    try {
        await ConnectMongo();
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Unable to start server:", error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    startServer();
}

module.exports = { app, startServer };
