const Firebase = require("firebase");

let appfirebase = Firebase.app("[DEFAULT]");
const db = appfirebase.firestore();

let SavedLiteratureController = {};

SavedLiteratureController.getSavedLiterature = (req,res) => {
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
};

SavedLiteratureController.addSavedLiterature = (req,res) => {
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
};

SavedLiteratureController.deleteSavedLiterature = (req,res) => {
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
};

module.exports = SavedLiteratureController;