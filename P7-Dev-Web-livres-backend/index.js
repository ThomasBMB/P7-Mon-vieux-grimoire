const express = require("express");
const app = express();
const { User } = require("./database/mongo");
const cors = require("cors");
const bcrypt = require("bcrypt")
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get("/", function (req, res) {
    res.send("Hello World 2");
});
app.post("/api/auth/signup", signUp)
app.post("/api/auth/login", login);

app.listen(PORT);

async function signUp(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const userInDb = await User.findOne({
        email: email
    });
    console.log("userInDB", userInDb)
    if (userInDb != null) {
        res.status(400).send("Email already exists");
        return;
    }
    const user = {
        email: email,
        password: hashPassword(password)
    };
    //users.push(user);
    try {
        await User.create(user)
    } catch (e) {
        console.error(e);
        res.status(500).send("Something went wrong");
        return
    }
    res.send("Sign Up");
}

async function login(req, res) {
    const body = req.body;
    console.log('body:', body);


    const userInDb = await User.findOne({
        email: body.email
    });
    console.log('userInDb:', userInDb)
    if (userInDb == null) {
        res.status(401).send("Wrong email");
        return;
    }
    const passwordInDB = userInDb.password;
    if (!isPasswordCorrect(req.body.password, passwordInDB)) {
        res.status(401).send("Wrong password");
        return;
    }

    res.send({
        userId: userInDb._id,
        token: 'token'
    });
}

function hashPassword(password) {
    console.log("password:", password);
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    console.log("hash", hash);
    return hash;
}

function isPasswordCorrect(password, hash) {
    console.log('password:', password);
    console.log("hash:", hash);
    const isOk = bcrypt.compareSync(password, hash);
    console.log("isOk:", isOk);
    return isOk;
}