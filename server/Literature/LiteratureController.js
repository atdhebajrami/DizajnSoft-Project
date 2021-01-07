const Firebase = require("firebase");

let appfirebase = Firebase.app("[DEFAULT]");
const db = appfirebase.firestore();

let LiteratureController = {};

LiteratureController.getLiteratures = (req,res) => {
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
};

module.exports = LiteratureController;