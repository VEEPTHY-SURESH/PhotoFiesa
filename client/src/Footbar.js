import React from "react";
import { Link } from "react-router-dom";
import './App.css'; 

function Footbar(){
    return(
        <>
            <div className="footbar">
                <Link className="footicon" to="/" style={{textDecoration:"none",color:"white"}} ><i className="fa-solid fa-house"></i></Link>
                <Link className="footicon" to="/userprofile" style={{textDecoration:"none",color:"white"}} ><i className="fa-solid fa-user"></i></Link>
                <Link className="footicon" to="/contest" style={{textDecoration:"none",color:"white"}} ><i className="fa-solid fa-globe"></i></Link>
                <Link className="footicon" to="/collection" style={{textDecoration:"none",color:"white"}} ><i className="fa-solid fa-cart-shopping"></i></Link>
            </div>
        </>
    )
}

export default Footbar;