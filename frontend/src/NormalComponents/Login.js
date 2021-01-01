import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import './Login.css';

const Login = (props) =>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailStyle, setEmailStyle] = useState("LoginEmail");
    const [passwordStyle, setPasswordStyle] = useState("LoginPassword");
    const [errorBoxStyle, setErrorBoxStyle] = useState("ErrorBoxHide");

    const login = async() => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let txt = /\s/;
        let totalAccess = 0;
        let errora = 0;
        if(email.trim() === "" || reg.test(email) === false){
            setEmailStyle("LoginEmailRED");
            errora++;
        }else{
            totalAccess = totalAccess + 1;
            setEmailStyle("LoginEmail");
        }
        if(password.trim() === "" || txt.test(password) === true || password.length < 6 || password.length > 30){
            setPasswordStyle("LoginPasswordRED");
            errora++;
        }else{
            totalAccess = totalAccess + 1;
            setPasswordStyle("LoginPassword");
        }

        if(errora !== 0){
            setErrorBoxStyle("ErrorBox");
        }
        if(totalAccess === 2){
            // Logged in Successfully
            let apicall = await fetch("http://localhost:3000/",{
                method: "post",
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    "email": email,
                    "password": password
                })
            })
            let response = await apicall.json();
            if(response.success === true){
                let user = {
                    uid: response.uid,
                    namesurname: response.namesurname
                }
                localStorage.setItem("TTTUser", JSON.stringify(user));
                props.history.push("/User/");

                setEmailStyle("LoginEmail");
                setPasswordStyle("LoginPassword");
                setEmail("");
                setPassword("");
            }else{
                setErrorBoxStyle("ErrorBox");
                setEmailStyle("LoginEmailRED");
                setPasswordStyle("LoginPasswordRED");
            }
        }
    }

    return(
        <div className="LoginBox">
            <h5 className="LoginText">Log in</h5>
            <div className="LoginInputBox">
                <div className={errorBoxStyle}>
                    <h5 className="ErrorText">Log in failed.</h5>
                    <img onClick={() => setErrorBoxStyle("ErrorBoxHide")} className="ErrorButton" src={require("../Images/xButton.png")} alt="X"/>
                </div>
                <input className={emailStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
                <input className={passwordStyle} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
                <h5 className="ForgotPassword"><Link className="Linku" to="/ForgotPassword">Forgot password ?</Link></h5>
                <button className="LoginButton" type="submit" onClick={() => login()}>Log in</button>
                <h5 className="NotaMember">Not a member ? <Link className="Linku" to="/Signup">Sign up</Link></h5>
            </div>
        </div>
    );
}

export default Login;