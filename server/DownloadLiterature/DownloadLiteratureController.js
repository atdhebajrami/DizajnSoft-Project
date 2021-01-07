const Firebase = require("firebase");

let appfirebase = Firebase.app("[DEFAULT]");
const db = appfirebase.firestore();

let DownloadLiteratureController = {};

DownloadLiteratureController.getDownloadLiteratures = (req,res) => {
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
};

DownloadLiteratureController.addDownloadLiteratures = (req,res) => {
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
};

DownloadLiteratureController.deleteDownloadLiteratures = (req,res) => {
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
};

module.exports = DownloadLiteratureController;