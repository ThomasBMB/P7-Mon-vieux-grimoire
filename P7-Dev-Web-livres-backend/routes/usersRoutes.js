const express = require("express");
const { signupUser, logUser } = require("../features/users");

const userRouter = express.Router();

//Routes
userRouter.post("/login", logUser);
userRouter.post("/signup", signupUser);

module.exports = { userRouter };