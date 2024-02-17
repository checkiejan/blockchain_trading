/*
filename: LoadinSpinner.jsx
Author: Gia Hung Tran
StudentId: 103509199
last date modified: 15/10/2023
*/
import React from "react";
import "./LoadingSpinner.css";

export default function LoadingSpinner() { //component for loading spinner while in the state of loading
  return (
    <div className="spinner-container">
      <div className="loading-spinner"></div>
    </div>
  );
}