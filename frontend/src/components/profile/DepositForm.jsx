/*
* File name: DepositForm.jsx
* Author: Gia Hung Tran
* StudentID: 103509199
* Last date modified: 15/10/2023
* */
import Input from "../common/Input";
import "./DepositForm.css";
import Button from "../common/Button";
import axios from "axios";
import { useCookies } from "react-cookie";
import {useState} from "react";

function DepositForm({opened, setDepositForm}) {
    const [errMsg,setErrMsg] = useState(""); //error message
    const [successMsg,setSuccessMsg] = useState(""); //success message
    const [cookies, setCookie] = useCookies(["user"]); //get cookie
    const [cardNumber, setCardNumber] = useState(''); //store card number
    const [expiryDate, setExpiryDate] = useState(''); //store expirydate
    const [cvv, setCvv] = useState(''); //store cvv
    const [amount,setAmount] = useState(0);//store amount
    const [cardholderName, setCardholderName] = useState('');//store card holder name
    const config = { //config to send access token to api
        headers: { Authorization: `Bearer ${cookies.jwt_token}`
    }
    };
    const resetAll = ()=>{ //reset all state when successfully deposit or close the form
        setCardNumber("");
        setExpiryDate("");
        setCvv("");
        setCardholderName("");
        setAmount("");

    }
    const handleDeposit = (evt)=>{
        evt.preventDefault();
        axios.put("http://localhost:8000/api/users/balance",{ //api to deposit
            "amount": amount,
            "card_number": cardNumber,
            "card_holder": cardholderName,
            "expiry_date": expiryDate,
            "cvv": cvv
            },config).then(res=>{
                console.log(res);
                setErrMsg(""); //reset all error message
                setSuccessMsg("You successfully depositted");
                resetAll();
            })
            .catch(err=>{
                console.log(err)
                if(err.response ? true: false) //axios error
                {
                    setErrMsg(err.response.data.message)
                }
                else{//other error
                    setErrMsg(err.message)
                }
            })
    }
    return opened ? ( //just render when it is in opened state
        <div className="checkout-form">
            <form className="checkout">
                <h2 className="header-deposit">Input Your Card to Deposit</h2>
                <div className="wrapper-ipt">
                    <label className="label-ipt" htmlFor="card-number">Card Number</label><br/>
                    <input className="deposit-ipt"  type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="xxxx xxxx xxxx xxxx"  name="card-number" label="Card Number"/>
                </div>

                <div className="wrapper-ipt">
                    <label className="label-ipt" htmlFor="card-holder">Card Holder</label><br/>
                    <input className="deposit-ipt" type="text" value={cardholderName} onChange={e => setCardholderName(e.target.value)}  placeholder="Cardholder Name"   name="card-holder" label=" Holder"/>
                </div>
                <div  className="row">
                    <div className="wrapper-ipt half">
                        <label className="label-ipt" htmlFor="expiry-date">Expiry Date</label><br/>
                        <input className="deposit-ipt" type="text" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} placeholder="MM-YYYY" name="expiry-date" label="Expiry Date"/>
                    </div>

                    <div className="wrapper-ipt half">
                        <label className="label-ipt" htmlFor="cvv">CVV</label><br/>
                        <input className="deposit-ipt" type="text" value={cvv} onChange={e => setCvv(e.target.value)} placeholder="CVV" name="cvv" label="CVV"/>
                    </div>
                </div>

                <div className="wrapper-ipt">
                    <label className="label-ipt" htmlFor="amount">Amount</label><br/>
                    <input className="deposit-ipt" step="0.01" type="number" value={amount} onChange={e => setAmount(e.target.value)} name="amount" label="Amount"/>
                </div>
                {errMsg !== "" && <div className="error-notice">{errMsg}</div>}
                {successMsg !== "" && <div className="succes-notice">{successMsg}</div>}
                <div>
                    <Button onClick={handleDeposit} className="purchase-button" >Deposit</Button>
                    {/* reset all state when closing */}
                    <Button onClick={() => {setDepositForm(false); setErrMsg(""); setSuccessMsg("")}} className="cancel-button">Close</Button>
                </div>
            </form>

        </div>
    ): "";
}

export default DepositForm;