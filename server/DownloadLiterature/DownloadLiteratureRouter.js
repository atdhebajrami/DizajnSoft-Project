'use strict';
const express = require('express');
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

let DownloadLiteratureController = require(__dirname + '/DownloadLiteratureController');
module.exports = function(app) {
    app.post("/User/GetDownloadLiteratures", DownloadLiteratureController.getDownloadLiteratures);
    app.post("/User/DownloadLiteratures", DownloadLiteratureController.addDownloadLiteratures);
    app.delete("/User/DownloadLiteratures", DownloadLiteratureController.deleteDownloadLiteratures);
}