import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import './Signup.css';

const Signup = (props) => {
    const [namesurname, setNameSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [namesurnameStyle, setNameSurnameStyle] = useState("SignupEmail");
    const [emailStyle, setEmailStyle] = useState("SignupEmail");
    const [passwordStyle, setPasswordStyle] = useState("SignupPassword");
    const [errorBoxStyle, setErrorBoxStyle] = useState("ErrorBoxHide");

    const signup = async () => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let txt = /\s/;
        let totalAccess = 0;
        let errora = 0;
        if(namesurname.trim() === "" || namesurname.length < 4){
            setNameSurnameStyle("SignupEmailRED");
            errora++;
        }else{
            totalAccess = totalAccess + 1;
            setNameSurnameStyle("SignupEmail");
        }
        if(email.trim() === "" || reg.test(email) === false){
            setEmailStyle("SignupEmailRED");
            errora++;
        }else{
            totalAccess = totalAccess + 1;
            setEmailStyle("SignupEmail");
        }
        if(password.trim() === "" || txt.test(password) === true || password.length < 6 || password.length > 30){
            setPasswordStyle("SignupPasswordRED");
            errora++;
        }else{
            totalAccess = totalAccess + 1;
            setPasswordStyle("SignupPassword");
        }

        if(errora !== 0){
            setErrorBoxStyle("ErrorBox");
        }
        if(totalAccess === 3){
            let apicall = await fetch("http://localhost:3000/Signup",{
                method: "post",
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    "namesurname": namesurname,
                    "email": email,
                    "password": password
                })
            })
            let response = await apicall.json();
            if(response.success === true){
                let user = {
                    uid: response.uid,
                    namesurname: namesurname
                }
                localStorage.setItem("TTTUser", JSON.stringify(user));
                props.history.push("/User/");

                setNameSurname("");
                setEmail("");
                setPassword("");
            }else{
                setErrorBoxStyle("ErrorBox");
                if(response.emailError === true){
                    setEmailStyle("SignupEmailRED");
                }else{
                    setEmailStyle("SignupEmail");
                }
            }
        }
    }

    return(
        <div className="SignupBox">
            <h5 className="SignupText">Sign up</h5>
            <div className="SignupInputBox">
                <div className={errorBoxStyle}>
                    <h5 className="ErrorText">Sign up failed.</h5>
                    <img onClick={() => setErrorBoxStyle("ErrorBoxHide")} className="ErrorButton" src={require("../Images/xButton.png")} alt="X"/>
                </div>
                <input className={namesurnameStyle} type="text" value={namesurname} onChange={(e) => setNameSurname(e.target.value)} placeholder="Name & Surname" />
                <input className={emailStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
                <input className={passwordStyle} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
                <button className="SignupButton" type="submit" onClick={() => signup()}>Sign up</button>
                <h5 className="NotaMember">Already registred ? <Link className="Linku" to="/">Log in</Link></h5>
            </div>
        </div>
    );
}

export default Signup;