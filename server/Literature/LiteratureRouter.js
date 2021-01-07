'use strict';
const express = require('express');
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

let LiteratureController = require(__dirname + '/LiteratureController');
module.exports = function(app) {
    app.get("/Literatures", LiteratureController.getLiteratures);
}