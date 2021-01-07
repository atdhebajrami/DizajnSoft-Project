'use strict';
const express = require('express');
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

let UserController = require(__dirname + '/UserController');
module.exports = function(app) {
    app.post("/", UserController.login);
    app.post("/Signup", UserController.signup);
    app.post("/ForgotPassword", UserController.forgotpassword);
    app.post("/VerifyUser", UserController.verifyuser);
}