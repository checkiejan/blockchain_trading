/*
filename: ProductCreation.jsx
Author: Anh Tuan Doan
StudentId: 103526745
last date modified: 15/10/2023
*/
import ProductForm from "./ProductForm";
import "./ProductCreation.css";
import { useNavigate} from "react-router-dom";
import {useState} from "react";
import { useCookies} from "react-cookie";
// ProductCreation component definition
function ProductCreation() {
    const [cookies, setCookie] = useCookies(["user"]);//get the cookie
    const isAuthenticated = () => { //check if the user already logined or not
        return cookies.jwt_token ? true : false;
    };
    const [authStatus, setAuthStatus] = useState(isAuthenticated());
    const navigate = useNavigate();
    if(!authStatus){ // if user has not logined, dont allow access
        return (
            <div className="center-screen">
                <h1>You need to login to access this page!</h1>
                <button onClick={()=>{navigate("/login")}}>Login</button> 
            </div>
        )
    }

    return (
        // Main container for the product creation section
        <div className="product-creation">
            {/* Heading for the product creation section */}
            <h1>Sell a new product</h1>
            {/* Embedding the ProductForm component to capture product details */}
            <ProductForm/>
        </div>
    );
}

// Export the ProductCreation component
export default ProductCreation;