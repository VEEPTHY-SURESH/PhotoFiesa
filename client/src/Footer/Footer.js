import React from "react";
import { useNavigate,Link } from "react-router-dom";
import { getAuth,signOut } from "firebase/auth";
import app from "../FirebaseConfig/Firebase";
import 'bootstrap/dist/css/bootstrap.css';
import '../App.css';

function Footer(){

    const date = new Date().getFullYear();

    const navigate = useNavigate();

    const handleLogout=async(e)=>{

        e.preventDefault();
  
        const auth = getAuth(app);
        signOut(auth)
        .then(() => {
        // Signed up 
        sessionStorage.removeItem('userId')
            navigate('/login');
        // ...
        }).catch((error) => {
            // const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
    }

    return(
       
        <div className="footer container-fluid">
            
                <div className="social col-6">
                    <div className="media"><b>Social media</b></div>
                    <div className="link-sec">
                        <a href="https://veepthy-suresh.github.io/veepthyporfolio/"> <i className="fa-regular fa-address-card"></i> About us </a><br/>
                        <a href="https://www.instagram.com/veepthy_suresh/"> <i className="fa-brands fa-instagram"></i> Instagram  </a><br/>
                        <a href="https://www.linkedin.com/in/veepthy-suresh-453126202/"> <i className="fa-brands fa-linkedin"></i> Linkedin  </a><br/>
                        <a href="https://github.com/VEEPTHY-SURESH"> <i className="fa-brands fa-github"></i> GitHub  </a><br/>
                    </div>
                </div>
                <div className="page-links col-6">
                    <div className="pages"><b>Pages</b></div>
                    <div className="link-sec" id="link-sec">
                        <Link to="/userprofile" ><a href="no"><i className="fa-regular fa-user"> </i> Profile</a></Link><br/>
                        <Link to="/contest" ><a href="no"><i className="fa-solid fa-arrow-right"> </i> Goto Contest</a></Link><br/>
                        <Link to="/collection" ><a href="no"><i className="fa-regular fa-image"></i> Collection</a></Link><br/>
                        <Link  onClick={handleLogout}><a href="no"><i className="fa-solid fa-right-from-bracket"> </i> Logout</a></Link><br/>
                    </div>
                    <p className="date">© copy right {date} PhotoFiesta.</p>
                </div>
        </div>
        
   
    )
}


export default Footer;