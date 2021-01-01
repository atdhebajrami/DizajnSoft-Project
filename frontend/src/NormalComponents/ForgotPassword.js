import React from "react";
import { useState } from "react";
import './ForgotPassword.css';

const ForgotPassword = (props) =>{
    const [email, setEmail] = useState("");
    const [emailStyle, setEmailStyle] = useState("ForgotPasswordEmail");
    const [errorBoxStyle, setErrorBoxStyle] = useState("ErrorBoxHide");
    const [successBoxStyle, setSuccessBoxStyle] = useState("SuccessBoxHide");

    const next = async () => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let txt = /\s/;
        let totalAccess = 0;
        let errora = 0;
        if(email.trim() === "" || reg.test(email) === false){
            setEmailStyle("ForgotPasswordEmailRED");
            errora++;
        }else{
            totalAccess = totalAccess + 1;
            setEmailStyle("ForgotPasswordEmail");
        }

        if(errora !== 0){
            setSuccessBoxStyle("SuccessBoxHide");
            setErrorBoxStyle("ErrorBox");
        }
        if(totalAccess === 1){
            // Password reset sent to Email
            let apicall = await fetch("http://localhost:3000/ForgotPassword",{
                method: "post",
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    "email": email,
                })
            })
            let response = await apicall.json();
            if(response.success === true){
                setSuccessBoxStyle("SuccessBox");
                setErrorBoxStyle("ErrorBoxHide");
                setEmail("");
            }else{
                setErrorBoxStyle("ErrorBox");
                setSuccessBoxStyle("SuccessBoxHide");
            }
        }
    }

    return(
        <div className="ForgotPasswordBox">
            <h5 className="ForgotPasswordText">Recover Password</h5>
            <div className="ForgotPasswordInputBox">
                <div className={successBoxStyle}>
                    <h5 className="SuccessText">Recover Password sent to Email.</h5>
                    <img onClick={() => setSuccessBoxStyle("SuccessBoxHide")} className="SuccessButton" src={require("../Images/xButton.png")} alt="X"/>
                </div>
                <div className={errorBoxStyle}>
                    <h5 className="ErrorText">Recover password failed.</h5>
                    <img onClick={() => setErrorBoxStyle("ErrorBoxHide")} className="ErrorButton" src={require("../Images/xButton.png")} alt="X"/>
                </div>
                <input className={emailStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
                <button className="ForgotPasswordButton" type="submit" onClick={() => next()}>Done</button>
                <h5 onClick={() => props.history.goBack()} className="ForgotPasswordCancel">Cancel</h5>
            </div>
        </div>
    );
}

export default ForgotPassword;