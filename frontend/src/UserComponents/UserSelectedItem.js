import React, { useEffect, useState } from "react";

const UserSelectedItem = () => {
    const [bookfree, setBookFree] = useState(false);
    const [saveText, setSaveText] = useState("");
    const [id, setID] = useState("");
    const [image, setImage] = useState("");
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [review, setReview] = useState("");
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        Start();
        
    }, []);

    const Start = async () => {
        let item = JSON.parse(localStorage.getItem("SelectedItem"));
        if(item !== null){
            setID(item.id);
            setImage(item.image);
            setTitle(item.title);
            setAuthor(item.author);
            setDescription(item.description);
            setPrice(item.price);
            setReviews(item.reviews);
            setSaveText(item.saveText);
            if(item.price <= 0){
                setBookFree(true);
            }
        }else{
            alert("No Selected Item.");
        }
    }

    const payLiterature = () => {
        setBookFree(true);
    }

    const downloadLiterature = async () => {
        let user = JSON.parse(localStorage.getItem("TTTUser"));
        if(user !== null){
            let apicall = await fetch("http://localhost:3000/User/DownloadLiteratures",{
                method: "post",
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    uid: user.uid,
                    literature: id
                })
            })
            let response = await apicall.json();
            if(response.success === true){
                alert("Literature downloaded (file should be downloaded in device).");
            }else{
                alert("Literature downloading failed.");
            }
        }
    }

    const saveLiterature = async () => {
        let user = JSON.parse(localStorage.getItem("TTTUser"));
        if(user !== null){
            if(saveText === "Save"){
                let apicall = await fetch("http://localhost:3000/User/SaveLiteratures",{
                    method: "post",
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({
                        uid: user.uid,
                        literature: id
                    })
                })
                let response = await apicall.json();
                if(response.success === true){
                    alert("Literature saved.");
                    setSaveText("Remove from Saved");
                }else{
                    if(response.alreadysaved === true){
                        alert("Literature already saved.");
                        setSaveText("Remove from Saved");
                    }else{
                        alert("Literature saving failed.");
                    }
                }
            }else{
                let apicall = await fetch("http://localhost:3000/User/SaveLiteratures",{
                    method: "delete",
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({
                        uid: user.uid,
                        literature: id
                    })
                })
                let response = await apicall.json();
                if(response.success === true){
                    alert("Literature removed from Saved.");
                    setSaveText("Save");
                }else{
                    alert("Literature removing from Saved failed.");
                }
            }
        }
    }

    const addReview = async () => {
        let user = JSON.parse(localStorage.getItem("TTTUser"));
        if(user !== null){
            let apicall = await fetch("http://localhost:3000/User/LiteratureReview",{
                method: "post",
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    uid: user.uid,
                    user: user.namesurname,
                    literature: id,
                    text: review
                })
            })
            let response = await apicall.json();
            if(response.success === true){
                alert("Review added.");
                var newlist = reviews;
                var newreview = {
                    text: review,
                    user: user.namesurname
                }
                newlist.push(newreview);
                setReviews(newlist);
                setReview("");
            }else{
                alert("Review failed.");
            }
        }
    }

    return(
        <div className="UserSelectedBox">
            <div className="UserSelectedImageBox">
                <img className="UserSelectedImage" src={image} alt="Book Image"/>
            </div>
            <h4 className="UserSelectedText">{title}</h4>
            <h6 className="UserSelectedText">by {author}</h6>
            <h6 className="UserSelectedText">{description}</h6>
            {
                bookfree ?
                (<button className="UserSelectedButton" onClick={() => downloadLiterature()}>Download</button>)
                : (<button className="UserSelectedButton" onClick={() => payLiterature()}>Pay {price}$</button>)
            }
            <button className="UserSelectedButton" onClick={() => saveLiterature()}>{saveText}</button>
            <div className="UserSelectedReviewBox">
                <input className="UserSelectedReviewInput" type="text" value={review} onChange={(e) => setReview(e.target.value)} placeholder="Leave a review..."/>
                <button className="UserSelectedButton" onClick={() => addReview()}>Submit Review</button>
            </div>
            <h5 className="UserSelectedText" style={{borderBottom:"1px solid black"}}>Reviews</h5>
            {
                reviews.map((item,i) =>{
                    return(
                    <div>
                        <h6 style={{marginTop:"10px"}}>{item.text} by {item.user}</h6>
                    </div>
                    );
                  })
            }
        </div>
    );
}

export default UserSelectedItem;