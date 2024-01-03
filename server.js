const express = require("express");
const mongoose = require("mongoose");
const user = require('./routes/user.routes');
const cors = require("cors");
const chatbotRoutes = require("./routes/chatbot.routes");
const market = require("./routes/market.routes");

const app = express();
app.use(express.json());
require("dotenv").config();

const port = process.env.PORT || 3000; // Set a default port if not provided in the environment variables
app.use(cors());
app.use('/user', user);
app.use('/chatbot', chatbotRoutes);
app.use('/market', market);

app.use("/", (req, res) => res.send("Welcome to your own Zone!"));

const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to Database");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
};

const startServer = async () => {
    try {
        await connectToDb();
        await app.listen(port);
        console.log(`Server listening on ${port}`);
    } catch (error) {
        console.error("Error starting the server:", error);
    }
};

startServer();
