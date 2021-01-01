import React, { useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";

const Hyrje = (props) => {
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem("TTTUser"));
        if(user !== null){
            setAuth(true);
        }else{
            setAuth(false);
        }

    }, [props.location.pathname])

    return (
        <div>
        {
        auth ? (<Redirect to="/User/" />)
        :
        <Switch>
            <Route exact path="/Signup" component={Signup} />
            <Route exact path="/ForgotPassword" component={ForgotPassword} />
            <Route exact path="/" component={Login} />
        </Switch>
        }
        </div>
    );
}

export default Hyrje;