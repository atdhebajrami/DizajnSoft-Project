import React from "react";
import { useState, useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import UserMenu from "./UserMenu";
import UserSelectedItem from "./UserSelectedItem";
import UserSavedList from "./UserSavedList";
import UserDownloadList from "./UserDownloadList";

const UserPages = (props) => {
    const [auth, setAuth] = useState(true);

    useEffect(() => {
        Start();

    }, [props.location.pathname])

    const Start = async () => {
        let user = JSON.parse(localStorage.getItem("TTTUser"));
        if(user !== null){
            let verify = await VerifyUser(user.uid);
            if(verify === true){
                setAuth(true);
            }else{
                localStorage.removeItem("TTTUser");
                setAuth(false);
            }
        }else{
            setAuth(false);
        }
    }

    const VerifyUser = async (uid) => {
        let apicall = await fetch("http://localhost:3000/VerifyUser",{
            method: "post",
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                "uid": uid
            })
        })
        let response = await apicall.json();
        if(response.success === true){
            return true;
        }else{
            return false;
        }
    }

    return(
        <div>
            {
            auth ?
            <Switch>
                <Route path="/User/Downloads" component={UserDownloadList} />
                <Route path="/User/Saved" component={UserSavedList} />
                <Route path="/User/SelectedItem" component={UserSelectedItem} />
                <Route path="/User/" component={UserMenu} />
            </Switch>
            : (<Redirect to="/" />)
            }
        </div>
    );
}

export default UserPages;