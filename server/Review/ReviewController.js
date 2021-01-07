const Firebase = require("firebase");

let appfirebase = Firebase.app("[DEFAULT]");
const db = appfirebase.firestore();

let ReviewController = {};

ReviewController.addLiteratureReview = (req,res) => {
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
};

module.exports = ReviewController;