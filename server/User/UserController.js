const Firebase = require("firebase");
var bcrypt = require('bcryptjs');

let appfirebase = Firebase.app("[DEFAULT]");
const db = appfirebase.firestore();

let UserController = {};

UserController.login = (req,res) => {
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
};

UserController.signup = (req,res) => {
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
};

UserController.forgotpassword = (req,res) => {
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
};

UserController.verifyuser = (req,res) => {
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
};

module.exports = UserController;