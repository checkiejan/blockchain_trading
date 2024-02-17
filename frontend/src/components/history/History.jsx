/*
filename: History.jsx
Author: Anh Tuan Doan
StudentId: 103526745
last date modified: 15/10/2023
*/
import HistoryTable from "./HistoryTable";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import Error404 from "../../assets/error-404.png";
import axios from "axios";
import "./History.css";
// This component serves as a wrapper for displaying the transaction history
function History() {
    const [transaction, setTransaction] = useState([]); //save the transaction history
    const [cookies, setCookie] = useCookies(["user"]); //load cookie
    const [errMsg, setErrMsg] = useState(""); //error message
    const navigate = useNavigate();
    const isAuthenticated = () => { //check whether user login or not
        return cookies.jwt_token ? true : false;
    };
    const [authStatus, setAuthStatus] = useState(isAuthenticated());
    useEffect(()=>{
        if(isAuthenticated()) //only fetch data if user already login
        {
            const config = { //add token to fetch api
                headers: { Authorization: `Bearer ${cookies.jwt_token}`
            }
            };
            axios.get("http://localhost:8000/api/users/profile/transactions", config)
                .then(response => {
                    setTransaction(response.data.data.transactions); //set the data of transaction history
                    console.log(response.data.data.transactions)
                })
                .catch(err => {
                    console.log(err);
                    if(err.response ? true: false) //error from axios
                    {
                        setErrMsg(err.response.data.message)
                    }
                    else{ //other error
                        setErrMsg(err.message)
                    }
                });    
        }
    },[])
    if(!authStatus){ //if not login notice and navigate user to login page
        return (
            <div className="center-screen">
                <h1>You need to login to access this page!</h1>
                <button onClick={()=>{navigate("/login")}}>Login</button>
            </div>
        )
    }
    if(errMsg !==""){ //if there is error render the error
        console.log(errMsg)
        return <div className="center-screen">
        <img src={Error404} alt="" />
        <h1>{errMsg}</h1>
        </div>;    
        }
    return (
        // Main container for the transaction history section
        <div className="history">
            {/* Title for the transaction history section */}
            <h1>Transaction History</h1>
            {/* Rendering the HistoryTable component to display the list of transactions */}
             <HistoryTable transactions={transaction}/>
        </div>
    );
}

// Export the History component for use in other parts of the application
export default History;