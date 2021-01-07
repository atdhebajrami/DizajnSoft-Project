const express = require('express');
const Firebase = require("firebase");
var bcrypt = require('bcryptjs');
var bodyParser = require("body-parser");
const path = require('path');
const app = express();

app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, './frontend/build')));
app.use(bodyParser.json());

const firebaseConfig = require("./firebaseuser.json");

let appfirebase = Firebase.initializeApp(firebaseConfig);
const db = appfirebase.firestore();

require("./server/User/UserRouter")(app);
require("./server/Literature/LiteratureRouter")(app);
require("./server/SavedLiterature/SavedLiteratureRouter")(app);
require("./server/DownloadLiterature/DownloadLiteratureRouter")(app);
require("./server/Review/ReviewRouter")(app);

app.route('/*').get(function(req, res) { 
    return res.sendFile(path.join(__dirname, './frontend/build/index.html')); 
});

app.listen(process.env.PORT || 3000);