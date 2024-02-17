/*
* File name: CheckoutForm.jsx
* Author: Dang Khanh Toan Nguyen
* StudentID: 103797499
* Last date modified: 15/10/2023
* */
import Input from "../common/Input";
import "./CheckoutForm.css";
import Button from "../common/Button";
import axios from "axios";
import { useCookies } from "react-cookie";
import {useState} from "react";
import { useNavigate } from "react-router-dom";
function CheckoutForm({opened, setCheckoutForm,product}) {
    const [errMsg,setErrMsg] = useState(""); //error message
    const [successMsg,setSuccessMsg] = useState(""); //success message
    const [cookies, setCookie] = useCookies(["user"]); //get cookie
    const [isDisabled, setIsDisabled] = useState(false); //state to keep check on the disable of purchase button
    const navigate = useNavigate();
    const config = { //config to send access token to the api 
        headers: { Authorization: `Bearer ${cookies.jwt_token}`
    }
    };
    const handlePurchase = async (evt)=>{
        evt.preventDefault();
        if(!isDisabled){ //check whether allow purchase
            try {
                // Fetch user's balance first
                
                const response = await axios.get("http://localhost:8000/api/users/balance",config); //fetch user balance
                const userBalance = response.data.data.balance;
                // Check if userBalance is sufficient for purchase
                if (userBalance >= product.price) {
                    // Make the purchase request if balance is sufficient
                    console.log(`http://localhost:8000/api/assets/${product.asset_id}/purchase`, config)
                    const purchaseResponse = await axios.post(`http://localhost:8000/api/assets/${product.asset_id}/purchase`,{} ,config);
                    setErrMsg(""); //reset the error message when successfully purchase
                    setSuccessMsg("You successfully purchased the item!");
                    setIsDisabled(true) //do not allow re-purchase after buying it
                } else {
                    setErrMsg("Insufficient balance for the purchase."); //set error message to insufficient balance
                }
            } catch (err) { //catch any other errorr
                console.log("Error:", err);
                if(err.response ? true: false) //axios error
                {
                    setErrMsg(err.response.data.message)
                }
                else{ //other error
                    setErrMsg(err.message)
                }
            }    
        }
        
    }
    const handleCancel = ()=>{ //handel closing button
        if(successMsg!=""){ //if user just successully purchase, navigating them to transaction history page
            navigate("/history")
        }
        else{ //otherwise, reset all state
            setCheckoutForm(false); 
            setErrMsg(""); 
            setSuccessMsg("");
        }
    }
    return opened ? (
        <div className="checkout-form">
            <form className="checkout">
                <h2>Confirm To Buy This Asset</h2>
                <Input  type="text" readOnly={true} value={product.name}  name="first-name" label="Asset Name"/>
                <Input type="text"  readOnly value ={`${product.price} ETH`}  name="last-name" label="Price"/>
                <Input type="text" readOnly value={product.description} name="address" label="Description"/>
                {errMsg !== "" && <div className="error-notice">{errMsg}</div>}
                {successMsg !== "" && <div className="succes-notice">{successMsg}</div>}

                <div>
                    <Button onClick={handleCancel} className="cancel-button">Close</Button>
                    <Button onClick={handlePurchase} disable={isDisabled} className="purchase-button" >Purchase</Button>
                </div>
            </form>

        </div>
    ): "";
}

export default CheckoutForm;