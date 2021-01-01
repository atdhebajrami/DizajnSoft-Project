import React, { useEffect } from "react";
import { useState } from "react";
import "./UserMenu.css";
import UserMenuItem from "./UserMenuItem";

const UserSavedList = (props) => {
    const [kaItem, setKaItem] = useState(false);
    const [input, setInput] = useState("");
    const [lista, setLista] = useState([]);
    const [showingLista, setShowingLista] = useState([]);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [render, setRender] = useState(false);

    useEffect(() => {
        search();

    }, [render])

    const search = async() => {
        let user = JSON.parse(localStorage.getItem("TTTUser"));
        if(user !== null){
            let apicall = await fetch("http://localhost:3000/User/GetSavedLiteratures",{
                method: "post",
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    uid: user.uid
                })
            })
            let response = await apicall.json();
            if(response.success === true){
                console.log("Lista: " + response.lista);
                setLista(response.lista);
                setShowingLista(response.lista);
                if(response.lista.length >= 1){
                    setKaItem(true);
                }else{
                    setKaItem(false);
                }
            }else{
                setKaItem(false);
            }
        }
    }

    const logout = () => {
        localStorage.clear();
        props.history.push("/");
    }

    const InputChanged = (text) => {
        setInput(text);
        var newlist = [];
        for(var i=0; i < lista.length; i++){
            var textlowercase = text.toLowerCase();
            var title = lista[i].title.toLowerCase();
            var author = lista[i].author.toLowerCase();
            if(title.includes(textlowercase) || author.includes(textlowercase)){
                newlist.push(lista[i]);
            }
        }
        setShowingLista(newlist);
        if(newlist.length >= 1){
            setKaItem(true);
        }else{
            setKaItem(false);
        }
    }

    return(
        <div className="UserMenuBox">
            <div className="UserMenuHeader">
                <h5 className="UserMenuPageTitle">Saved Page</h5>
                <div className="UserMenuInputBox">
                    <input className="UserMenuInput" type="text" value={input} onChange={(e) => InputChanged(e.target.value)} placeholder="Search Saved Literatures Here..."/>
                </div>
                <div className="UserMenuProfile">
                    <div className="UserMenuProfileBox" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
                        <img className="UserMenuProfileImage" src={require("../Images/Profile.png")} alt="Book Image"/>
                    </div>
                    {
                    showProfileDropdown ?
                    (<div className="UserMenuProfileDropdown">
                        <h6 className="UserMenuProfileDownloads" onClick={() => props.history.push("/User/")}>Search</h6>
                        <h6 className="UserMenuProfileDownloads">Saved</h6>
                        <h6 className="UserMenuProfileDownloads" onClick={() => props.history.push("/User/Downloads")}>Downloads</h6>
                        <h6 className="UserMenuProfileLogout" onClick={() => logout()}>Logout</h6>
                    </div>) : null
                    }
                </div>
            </div>
            <div className="UserMenuContentBox">
                <div className="UserMenuContent">
                    {
                    kaItem ?
                    showingLista.map((item,i) =>{
                        return(
                        <UserMenuItem key={i} itemData={item} history={props.history} saveText="Remove from Saved" />
                        );
                    })
                    : <h5 className="NoSearchResult">No search result.</h5>
                    }
                </div>
            </div>
        </div>
    );
}

export default UserSavedList;