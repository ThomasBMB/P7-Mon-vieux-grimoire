const mongoose = require('mongoose');

const PASSWORD = 'ZZOp7JoSTWhuWnDJ'
const USER = 'thomasboudin'
const DB_URL = `mongodb+srv://${USER}:${PASSWORD}@cluster0.yrsmq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
console.log("DB_URL", DB_URL);

async function connect() {
    try {
        const res = await mongoose.connect(DB_URL)
        console.log("Connected to db")
    } catch (e) {
        console.error(e)
    }
};
connect();

const UserSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model("User", UserSchema);



module.exports = { User };