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

app.post("/", (req,res) => {
    try{
        var userEmail = null;
        var emaillowercase = req.body.email.toLowerCase();

        db.collection("/User").get().then(snapshot =>{
            snapshot.docs.forEach(doc =>{
                if(doc.data().email === emaillowercase){
                    userEmail = doc.data().email;
                }
            })
        }).then(() => {
            if(userEmail !== null){
                Firebase.auth().signInWithEmailAndPassword(userEmail, req.body.password).then(() =>{
                    var namesurname;
                    db.collection("/User").get().then(snapshot =>{
                        snapshot.docs.forEach(doc =>{
                            if(doc.id === Firebase.auth().currentUser.uid){
                                namesurname = doc.data().namesurname;
                            }
                        })
                    }).then(() => {
                        let response = {
                            uid: Firebase.auth().currentUser.uid,
                            namesurname: namesurname,
                            success: true
                        }
                        res.json(response);
                    }).catch(() => {
                        let response = {
                            uid: null,
                            success: false
                        }
                        res.json(response);
                    })
                }).catch(() => {
                    let response = {
                        uid: null,
                        success: false
                    }
                    res.json(response);
                })
            }else{
                let response = {
                    uid: null,
                    success: false
                }
                res.json(response);
            }
        })
    }catch(error){
        let response = {
            uid: null,
            success: false
        }
        res.json(response);
    }
})

app.post("/Signup", async (req,res) => {
    try{
        var emaillowercase = req.body.email.toLowerCase();
        var userExist = {
            emailExist: false
        };
        db.collection("/User").get().then(snapshot => {
            snapshot.docs.forEach(doc => {
                if(doc.data().email === emaillowercase){
                    userExist.emailExist = true;
                }
            })
        }).then(async () =>{
            if(userExist.emailExist === false){
                var salt = await bcrypt.genSalt();
                var hashedPassword = await bcrypt.hash(req.body.password , salt);
                Firebase.auth().createUserWithEmailAndPassword(emaillowercase, req.body.password).then(user => {
                    db.collection("/User").doc(user.user.uid).set({
                        namesurname: req.body.namesurname,
                        email: emaillowercase,
                        password: hashedPassword
                    });
                    response = {
                        uid: user.user.uid,
                        success: true
                    }
                    res.json(response);
                }).catch(() => {
                    let response = {
                        uid: null,
                        success: false
                    }
                    res.json(response);
                })
            }else{
                let response = {
                    uid: null,
                    success: false,
                    emailError: userExist.emailExist
                }
                res.json(response);
            }
        })
    }catch(error){
        let response = {
            uid: null,
            success: false,
        }
        res.json(response);
    }
})

app.post("/ForgotPassword", (req,res) => {
    try{
        const emaillowercase = req.body.email.toLowerCase();
        var emailExist = false;
        db.collection("/User").get().then(snapshot => {
            snapshot.docs.forEach(doc => {
                if(doc.data().email === emaillowercase){
                    emailExist = true;
                }
            })
        }).then(() => {
                if(emailExist === true){
                    Firebase.auth().sendPasswordResetEmail(emaillowercase).then(() => {
                        let response = {
                            success: true
                        }
                        res.json(response);
                    })
                }else{
                    let response = {
                        success: false
                    }
                    res.json(response);
                }
            })
    }catch(error){
        let response = {
            success: false
        }
        res.json(response);
    }
})

app.post("/VerifyUser", (req,res) => {
    var docRef = db.collection("/User").doc(req.body.uid);
    docRef.get().then(doc => {
        if(doc.exists){
            let response = {
                success: true
            }
            res.json(response);
        }else{
            let response = {
                success: false
            }
            res.json(response);
        }
    }).catch(() => {
        let response = {
            success: false
        }
        res.json(response);
    })
})

app.get("/Literatures", (req,res) => {
    try{
        var lista = [];
        var reviews = [];
        db.collection("/Reviews").get().then(snapshot =>{
            snapshot.docs.forEach(docc =>{
                var review = {
                    user: docc.data().user,
                    literature: docc.data().literature,
                    text: docc.data().text
                }
                reviews.push(review);
            })
        }).then(() => {
            db.collection("/Literatures").get().then(snapshot =>{
                snapshot.docs.forEach(doc =>{
                    var itemreviews = [];
                    for(var i=0; i < reviews.length; i++){
                        if(doc.id === reviews[i].literature){
                            itemreviews.push(reviews[i]);
                        }
                    }
                    var item = {
                        id: doc.id,
                        image: doc.data().image,
                        title: doc.data().title,
                        description: doc.data().description,
                        author: doc.data().author,
                        price: doc.data().price,
                        reviews: itemreviews
                    }
                    lista.push(item);
                })
            }).then(() => {
                let response = {
                    success: true,
                    lista: lista
                }
                res.json(response);
            })
        })
    }catch(error){
        let response = {
            success: false
        }
        res.json(response);
    }
})

app.post("/User/GetSavedLiteratures", (req,res) => {
    try{
        var lista = [];
        var reviews = [];
        db.collection("/Reviews").get().then(snapshot =>{
            snapshot.docs.forEach(docc =>{
                var review = {
                    user: docc.data().user,
                    literature: docc.data().literature,
                    text: docc.data().text
                }
                reviews.push(review);
            })
        }).then(() => {
            db.collection("/Literatures").get().then(snapshot =>{
                snapshot.docs.forEach(doc =>{
                    var itemreviews = [];
                    for(var i=0; i < reviews.length; i++){
                        if(doc.id === reviews[i].literature){
                            itemreviews.push(reviews[i]);
                        }
                    }
                    var item = {
                        id: doc.id,
                        image: doc.data().image,
                        title: doc.data().title,
                        description: doc.data().description,
                        author: doc.data().author,
                        price: doc.data().price,
                        reviews: itemreviews
                    }
                    lista.push(item);
                })
            }).then(() => {
                var finallist = [];
                db.collection("/SaveLiteratures").get().then(snapshot =>{
                    snapshot.docs.forEach(doc =>{
                        for(var i=0; i < lista.length; i++){
                            if(doc.data().userID === req.body.uid && doc.data().literature === lista[i].id){
                                finallist.push(lista[i]);
                            }
                        }
                    })
                }).then(() => {
                    let response = {
                        success: true,
                        lista: finallist
                    }
                    res.json(response);
                })
            })
        })
    }catch(error){
        let response = {
            success: false
        }
        res.json(response);
    }
})

app.post("/User/SaveLiteratures", (req,res) => {
    try{
        var alreadysaved = false;
        db.collection("/SaveLiteratures").get().then(snapshot =>{
            snapshot.docs.forEach(docc =>{
                if(docc.data().userID === req.body.uid && docc.data().literature === req.body.literature){
                    alreadysaved = true;
                }
            })
        }).then(() => {
            if(!alreadysaved){
                let docref = db.collection("/User").doc(req.body.uid);
                docref.get().then(doc => {
                if(doc.exists){
                    db.collection("/SaveLiteratures").doc().set({
                        userID: req.body.uid,
                        literature: req.body.literature
                    }).then(() => {
                        let response = {
                            success: true
                        }
                        res.json(response);
                    }).catch(() => {
                        let response = {
                            success: false
                        }
                        res.json(response);
                    })
                }else{
                    let response = {
                        success: false
                    }
                    res.json(response);
                }
            })
            }else{
                let response = {
                    success: false,
                    alreadysaved: true
                }
                res.json(response);
            }
            
        })
    }catch(error){
        let response = {
            success: false
        }
        res.json(response);
    }
})

app.delete("/User/SaveLiteratures", (req,res) => {
    try{
        let docref = db.collection("/User").doc(req.body.uid);
        docref.get().then(doc => {
            if(doc.exists){
                db.collection("/SaveLiteratures").get().then(snapshot =>{
                    snapshot.docs.forEach(docc =>{
                        if(docc.data().userID === req.body.uid && docc.data().literature === req.body.literature){
                            db.collection("/SaveLiteratures").doc(docc.id).delete().then(function() {
                                let response = {
                                    success: true
                                }
                                res.json(response);
                            }).catch(() => {
                                let response = {
                                    success: false
                                }
                                res.json(response);
                            })
                        }
                    })
                }).catch(() => {
                    let response = {
                        success: false
                    }
                    res.json(response);
                })
            }
        }).catch(() => {
            let response = {
                success: false
            }
            res.json(response);
        })
    }catch(error){
        let response = {
            success: false
        }
        res.json(response);
    }
})





app.post("/User/GetDownloadLiteratures", (req,res) => {
    try{
        var lista = [];
        let docref = db.collection("/User").doc(req.body.uid);
        docref.get().then(doc => {
            if(doc.exists){
                db.collection("/Literatures").get().then(snapshot =>{
                    snapshot.docs.forEach(doc =>{
                        var item = {
                            id: doc.id,
                            image: doc.data().image,
                            title: doc.data().title,
                            description: doc.data().description,
                            author: doc.data().author,
                            price: doc.data().price
                        }
                        lista.push(item);
                    })
                }).then(() => {
                    var finallist = [];
                    db.collection("/DownloadLiteratures").get().then(snapshot =>{
                        snapshot.docs.forEach(docc =>{
                            for(var i=0; i < lista.length; i++){
                                if(docc.data().userID === req.body.uid && docc.data().literature === lista[i].id){
                                    finallist.push(lista[i]);
                                }
                            }
                        })
                    }).then(() => {
                        let response = {
                            success: true,
                            lista: finallist
                        }
                        res.json(response);
                    }).catch(() => {
                        let response = {
                            success: false
                        }
                        res.json(response);
                    })
                }).catch(() => {
                    let response = {
                        success: false
                    }
                    res.json(response);
                })
            }
        }).catch(() => {
            let response = {
                success: false
            }
            res.json(response);
        })
    }catch(error){
        let response = {
            success: false
        }
        res.json(response);
    }
})

app.post("/User/DownloadLiteratures", (req,res) => {
    try{
        var alreadydownloaded = false;
        db.collection("/DownloadLiteratures").get().then(snapshot =>{
            snapshot.docs.forEach(docc =>{
                if(docc.data().userID === req.body.uid && docc.data().literature === req.body.literature){
                    alreadydownloaded = true;
                }
            })
        }).then(() => {
            if(!alreadydownloaded){
                let docref = db.collection("/User").doc(req.body.uid);
                docref.get().then(doc => {
                if(doc.exists){
                    db.collection("/DownloadLiteratures").doc().set({
                        userID: req.body.uid,
                        literature: req.body.literature
                    }).then(() => {
                        let response = {
                            success: true
                        }
                        res.json(response);
                    }).catch(() => {
                        let response = {
                            success: false
                        }
                        res.json(response);
                    })
                }else{
                    let response = {
                        success: false
                    }
                    res.json(response);
                }
            })
            }else{
                let response = {
                    success: false
                }
                res.json(response);
            }
            
        })
    }catch(error){
        let response = {
            success: false
        }
        res.json(response);
    }
})

app.delete("/User/DownloadLiteratures", (req,res) => {
    try{
        let docref = db.collection("/User").doc(req.body.uid);
        docref.get().then(doc => {
            if(doc.exists){
                db.collection("/DownloadLiteratures").get().then(snapshot =>{
                    snapshot.docs.forEach(docc =>{
                        if(docc.data().userID === req.body.uid){
                            db.collection("/DownloadLiteratures").doc(docc.id).delete().then(function() {
                                let response = {
                                    success: true
                                }
                                res.json(response);
                            }).catch(() => {
                                let response = {
                                    success: false
                                }
                                res.json(response);
                            })
                        }
                    })
                }).catch(() => {
                    let response = {
                        success: false
                    }
                    res.json(response);
                })
            }
        }).catch(() => {
            let response = {
                success: false
            }
            res.json(response);
        })
    }catch(error){
        let response = {
            success: false
        }
        res.json(response);
    }
})






app.post("/User/LiteratureReview", (req,res) => {
    try{
        let docref = db.collection("/User").doc(req.body.uid);
        docref.get().then(doc => {
            if(doc.exists){
                db.collection("/Reviews").doc().set({
                    userID: req.body.uid,
                    user: req.body.user,
                    literature: req.body.literature,
                    text: req.body.text
                }).then(() => {
                    let response = {
                        success: true
                    }
                    res.json(response);
                }).catch(() => {
                    let response = {
                        success: false
                    }
                    res.json(response);
                })
            }else{
                let response = {
                    success: false
                }
                res.json(response);
            }
        })
    }catch(error){
        let response = {
            success: false
        }
        res.json(response);
    }
})

app.route('/*').get(function(req, res) { 
    return res.sendFile(path.join(__dirname, './frontend/build/index.html')); 
});

app.listen(process.env.PORT || 3000);