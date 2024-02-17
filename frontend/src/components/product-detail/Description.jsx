/*
filename: Description.jsx
Author: Gia Hung Tran
StudentId: 103509199
last date modified: 15/10/2023
*/
// React component for the product description section
import React, {useEffect, useState} from "react";
import "./Description.css";
import {Link} from "react-router-dom";
import Button from "../common/Button";
import CheckoutForm from "./CheckoutForm";
import { useCookies } from "react-cookie";
import axios from "axios";
// Description component receives product details as props
const Description = ({product,id,owner_id,date, name, price, category, seller, description = "lorem", available}) => {
    const [checkoutForm, setCheckoutForm] = useState(false); //state to keep state of opeing the checkout form
    const [checkUser,setCheckUser] = useState(false); //keep track whether user has the right to purchase the item or not
    const [cookies, setCookie] = useCookies(["user"]); //get the cookie
    const isAuthenticated = () => { //check whether user login or not
        return cookies.jwt_token ? true : false;
    };
    const [authStatus, setAuthStatus] = useState(isAuthenticated());
    useEffect(()=>{
        if(isAuthenticated()) //just check when user login
    {
        const config = { //config to send access token with api
            headers: { Authorization: `Bearer ${cookies.jwt_token}`
        }
        };
        axios.get("http://localhost:8000/api/users/profile", config)
        .then(res=>{
            let current_id = res.data.data.user.user_id;
            if(current_id != owner_id){ //if user does not own the asset then they have the right to buy
                setCheckUser(true);
            }
        })
    }
    },[checkoutForm]) //re-check whenever user close the checkout form 
    
    return (
        // Main container for the product description
        <div className="wrapper-description">
             {/* Container for product name and price */}
            <div className="container-brief">
                <div className="item-name"> {name} ({category}) </div>
                <div className="item-price"> {price} ETH</div>
            </div>
             {/* Product description and seller details */}
            <div className="item-description"> 
                <div className="item-owner">Seller: {seller}</div>
                <div className="item-owner">Created Date: {date}</div>
                {description} 
            </div>
             {/* Buy button container only allow if user has the right*/}
             {authStatus && checkUser && available &&  <div className="container-button">
                <Button onClick={() => setCheckoutForm(true)}>Buy</Button>
            </div>}
           
            <CheckoutForm setCheckoutForm={setCheckoutForm} product={product} opened={checkoutForm}/>
        </div>
    );
}

export default Description;
