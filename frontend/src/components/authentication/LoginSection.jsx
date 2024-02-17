/*
filename: LoginSection.jsx
Author: Gia Hung Tran
StudentId: 103509199
last date modified: 15/10/2023
*/
// Required Libraries and Modules
import React, { useState, useEffect } from "react";
import "./LoginSection.css";
import { useNavigate } from "react-router-dom";
import {CookiesProvide, useCookies} from "react-cookie";
import axios from 'axios';
/**
 * LoginSection Component
 * 
 * This component provides a user interface for logging into the application.
 * It contains input fields for the username and password, a "Remember me" checkbox, 
 * and a button to submit the login form.
 */
const LoginSection = ({authStatus, setAuthStatus}) => {
    // Hooks
    const navigate = useNavigate(); // Hook from react-router for programmatic navigation
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        rememberMe: false,
    });
    const [errMsg, setErrMsg] = useState("");
    const [cookies, setCookie] = useCookies(["user"]);


    /**
     * Handle input changes and update the formData state.
     * 
     * @param {Object} evt - The event object from the input field.
     */
    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    /**
     * Toggle the state of the "Remember me" checkbox.
     */
    const handleCheckboxChange = () => {
        setFormData(prevState => ({ ...prevState, rememberMe: !prevState.rememberMe }));
    };

    const saveJWTinCookie = (token)=>{
        const currentDate = new Date();
        const expiryDate = new Date(currentDate);
        expiryDate.setDate(currentDate.getDate() + 2);
        setCookie('jwt_token', token, {
            expires: expiryDate,
            path: '/',
        })
    }

    /**
     * Handle the form submission.
     * For the purpose of this example, it redirects the user to the marketplace.
     */
    const handleSubmit = (evt) => {
        evt.preventDefault();
        axios.post("http://localhost:8000/api/auth/login/",{ //api to login
            "email": evt.target.email.value.trim(), 
            "password": evt.target.password.value,
        }).then(res => {
            saveJWTinCookie(res.data.data.access_token); //save token into cookie
            setAuthStatus(true); 
            console.log(authStatus);
            navigate("/marketplace"); //navigate to marketplace
        }).catch(err => {
            if(err.response ? true: false) //axios error
            {
                setErrMsg(err.response.data.message)
            }
            else{ //other error
                setErrMsg(err.message)
            }
        });

    };

    return (
        <form method="POST" onSubmit={handleSubmit} className="form-container" id="login-form">
            <h2>Account Login</h2>
            {/* Username Input */}
            <label className="label-form" htmlFor="email">Email</label>
            <input className="ipt-form"
                type="text"
                placeholder="email@xyz.com"
                value={formData.email}
                onChange={handleChange}
                name="email"
                id="email"
            />
            {/* Password Input */}
            <label className="label-form" htmlFor="password">Password</label>
            <input className="ipt-form"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                id="password"
                name="password"
            />
            {errMsg !== "" && <p className="error-notice">{errMsg}</p>}
            {/* Login Button */}
            <button type ="submit" className="btn-submit" > Login</button>
        </form>
    );
}

export default LoginSection;
