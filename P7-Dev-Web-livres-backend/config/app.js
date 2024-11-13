const express = require('express')
const cors = require("cors");
const app = express();
require("./../database/mongo.js")



app.use(cors());
app.use(express.json());
app.use("/" + process.env.IMAGES_FOLDER_PATH, express.static("uploads"));



module.exports = { app };