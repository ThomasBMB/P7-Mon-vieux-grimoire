const { app } = require("./config/app");
const { usersRouter } = require("./controllers/users.controller");
const { booksRouter } = require("./controllers/books.controller");
const PORT = process.env.PORT || 4000;

app.get("/", function (req, res) {
    res.send("Hello World");
});

app.use("/api/auth", usersRouter);
app.use("/api/books", booksRouter);

app.listen(PORT);