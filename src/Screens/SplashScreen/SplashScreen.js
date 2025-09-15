// src/components/SplashScreen.js
import React from 'react';
import './SplashScreen.css'; // Import the CSS for styling
import shkunlogo from '../Setup/Shkunlogo.png';

const SplashScreen = () => {
    return (
        <div className="splash-screen">
            <img src={shkunlogo} alt="Logo" className="splash-logo" />
            <div className="loader"></div> {/* Loader element */}
            {/* <h1>Loading...</h1> */}
        </div>
    );
};

export default SplashScreen;
