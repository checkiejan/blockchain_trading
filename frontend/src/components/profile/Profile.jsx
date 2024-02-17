/*
* File name: Profile.jsx
* Author: Gia Hung Tran
* StudentID: 103509199
* Last date modified: 15/10/2023
* */
import "./Profile.css"
import ProductList from "../marketplace/ProductList";
import Button from "../common/Button";
import {useState, useEffect} from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router";
import Error404 from "../../assets/error-404.png";
import DepositForm from "./DepositForm";
import LoadingSpinner from "../common/LoadingSpinner";
/*
* Cart.jsx Component
* This component allows users review and finalize their selected assets before confirming their purchases.
* It lists the Ethereum assets that users have added to their cart and displays the total price.
* Users can check out to complete their purchases.*/


function Profile() {
    // State to control the visibility of the CheckoutForm component
    const [depositForm, setDepositForm] = useState(false); //state keep check when the form is open
    const [cookies, setCookie] = useCookies(["user"]); //get cookie
    const [userData,setUserData] = useState(null); //fecth user data
    const [balance, setBalance] = useState(0); //balance of the user
    const [loading, setLoading] = useState(true); //loading state
    const [error, setError] = useState(null); //error state
    const navigate = useNavigate();
    const isAuthenticated = () => { //check whether the user is login
        return cookies.jwt_token ? true : false;
    };
    const [authStatus, setAuthStatus] = useState(isAuthenticated());
    const config = { //send access token with api
        headers: { Authorization: `Bearer ${cookies.jwt_token}` }
    };
    const fetchBalance = async () => {
        if(isAuthenticated) //just fecth when already authenticated
        {
            try{
                const res_balance = await axios.get("http://localhost:8000/api/users/balance", config);
                let num = parseFloat(res_balance.data.data.balance);
                setBalance(num.toFixed(2)); //round to 2 places after decimal 
            }
            catch (err){
                setError(err);
                setLoading(false);
                console.log(err);
            }
        }
    };
    useEffect(() => {
        if(isAuthenticated()){           
            const fetchUserAsset = async () =>{
                axios.get("http://localhost:8000/api/users/profile",config).then(res=>{
                    setUserData(res.data.data.user);
                }).catch(err=>{ 
                    setError(err);
                    setLoading(false);
                    console.log(err);
                });
            }
            fetchBalance();
            fetchUserAsset();
            setLoading(false);
        }
    }, [depositForm]); //re-fectch user data whenever the form is closed
    if(!authStatus){ //do not allow access if not login
        return (
            <div className="center-screen">
                <h1>You need to login to access this page!</h1>
                <button onClick={()=>{navigate("/login")}}>Login</button>
            </div>
        )
    }
    if(loading) //loading state
    {
        return  <div className="center-screen">
                    <LoadingSpinner/>
                    <h1>Loading ...</h1>
                </div>;
    }
    if(error){ //error state
        return <div className="center-screen">
                    <LoadingSpinner/>
                    <p className="error-message">Error: {error.message}<br/> Try to login again</p>
                </div>;
    }
    return (
        <div className="cart">
            <div className="cart-body">
                {userData && <h1> {`${userData.user_name}'s Profile`}</h1>}
                
                <div className="btn-container">
                    {userData && <h2 >Balance: {balance} ETH</h2>}
                    
                    <Button onClick={() => setDepositForm(true)}  className="btn-deposit">Deposit</Button>
                </div>  
                {userData && userData.digital_assets.length !== 0 && <ProductList productList={userData.digital_assets} />}
                {userData && userData.digital_assets.length === 0&& 
                <div className="center-screen-profile">
                    <h2 className="error-heading">There is no asset available</h2>
                </div>}
                             
             <DepositForm fetchBalance={fetchBalance} setDepositForm={setDepositForm} opened={depositForm}/>
            </div>
        </div>
    )
}

export default Profile;