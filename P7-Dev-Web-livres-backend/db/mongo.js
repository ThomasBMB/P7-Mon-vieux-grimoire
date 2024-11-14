const mongoose = require("mongoose");
const mongoUrl = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.yrsmq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

async function connect() {
    try {
        await mongoose.connect(mongoUrl);
        console.log("Connected to mongodb");
    } catch (e) {
        console.error("Error connecting to mongodb");
        console.error(e);
    }
}

connect();

