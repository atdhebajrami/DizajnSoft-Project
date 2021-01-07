'use strict';
const express = require('express');
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

let ReviewController = require(__dirname + '/ReviewController');
module.exports = function(app) {
    app.post("/User/LiteratureReview", ReviewController.addLiteratureReview);
}