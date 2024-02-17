/*
File name: Marketplace.jsx
Author: Anh Tuan Doan
Student ID: 103526745
Last date modified: 15/10/2023
 */
import "./Marketplace.css";
import LoadingSpinner from "../common/LoadingSpinner";
import ProductList from "./ProductList";
import {useState, useEffect} from "react";
import Error404 from "../../assets/error-404.png";
import axios from 'axios';
import { useLocation } from "react-router-dom";
function Marketplace() {
    const [data, setData] = useState([]); //data of assets fetched by the api
    const [loading, setLoading] = useState(true); //loading state
    const [error, setError] = useState(null); //error message
    const location = useLocation(); //location to extract query from the api
    useEffect(() => {
        // The API endpoint
        setLoading(true); //set loading state to true when first load
        setError(null);
        const apiUrl = 'http://localhost:8000/api/assets/';
        let fullURL =""
        if(location.search==""){ //if this is the normal marketplace without any sorting task
            fullURL = `${apiUrl}?availability=true`; //just fetch assets available for trading
        }
        else{
            fullURL = `${apiUrl}${location.search}&availability=true`; //extract the sort query
        }
        axios.get(fullURL)
            .then(response => {
                setData(response.data.data.digital_assets); //set data of found assets
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
                console.log(err.response ? true : false);
            });
    }, [location.search]); //re-fecth the api whenever the query is changed

    if(loading) //loading status
    {
        return  <div className="center-screen">
                    <LoadingSpinner/>
                    <h1>Loading ...</h1>
                </div>;
    }
    if(error){ //error status
        if(error.response ? true : false) //axios error
        {
            return <div className="center-screen">
            <h1>{error.response.data.message}</h1>
            </div>;    
        }
        else{ //other error
            return <div className="center-screen">
            <img src={Error404} alt="" />
            <h1>{error.message}</h1>
        </div>;
    
        }
    }
    return (
        // Main container for the marketplace
        <div className="marketplace">
            <div className="marketplace-body">
                <div className="container">
                    {/* Marketplace title */}
                    <h1>The Marketplace</h1>
                </div>
                {/* Rendering the list of products */}
                {loading && <p>Loading...</p>}
                {!loading && <ProductList productList={data} />}
            </div>
        </div>
    );
}

// Export the Marketplace component for use in other parts of the application
export default Marketplace;