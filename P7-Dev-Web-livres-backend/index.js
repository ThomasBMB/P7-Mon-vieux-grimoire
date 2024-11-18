const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./database/mongo.js");
const { userRouter } = require("./routes/usersRoutes.js");
const { bookRouter } = require("./routes/booksRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("images"));

// Routers
app.use("/api/auth", userRouter);
app.use("/api/books", bookRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, function () {
    console.log(`App listening on port ${PORT}!`);
});
