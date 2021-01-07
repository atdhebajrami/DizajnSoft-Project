'use strict';
const express = require('express');
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

let SavedLiteratureController = require(__dirname + '/SavedLiteratureController');
module.exports = function(app) {
    app.post("/User/GetSavedLiteratures", SavedLiteratureController.getSavedLiterature)
    app.post("/User/SaveLiteratures", SavedLiteratureController.addSavedLiterature);
    app.delete("/User/SaveLiteratures", SavedLiteratureController.deleteSavedLiterature);
}