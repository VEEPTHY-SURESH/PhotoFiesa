
import React, { useState, useEffect, useContext } from 'react';
import { Link} from "react-router-dom";
import axios from 'axios';
import './App.css'; // Import the CSS file with styles
import logo from "./images/logo.jpg"
import app from './FirebaseConfig/Firebase';
import {getAuth,onAuthStateChanged} from "firebase/auth";
import defaultpic from './images/default.png';
import UserId from './Context/Context';
import Footer from './Footer/Footer';
import Footbar from './Footbar';


function Viewuser() {
  const [userProf, setUserProf] = useState({});
  const [getImages, setImages] = useState([]);

  const [userAuth,setUser]=useState("");
  const [Found,setFound] = useState("");
  const [notFound,setPageFound] = useState(false);
  const [checkProfile,setCheckProfile] = useState(false);


  const { uid } = useContext(UserId);

  useEffect(()=>{
    if(sessionStorage.getItem("userId")){
      setFound("");
      setPageFound(false);
    const auth = getAuth(app);
    const listen = onAuthStateChanged(auth,(user)=>{
      if(user){
        setUser(user);
      }else{
        setUser(null);
      }
    });
    return  () => listen();
  }else{
    setFound("page not found...please login or retry after some time");
    setPageFound(true);
  }
  },[]);

  useEffect(() => {
    const viewId = sessionStorage.getItem('viewId');

    if(userAuth && viewId){
      axios.get(`http://localhost:5000/api/profile/${viewId}`)
        .then(response => {
          if(!response.data){
            setCheckProfile(false);
          }
            else {
              setCheckProfile(true);
              setUserProf(response.data);
            }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [userAuth,uid]);


  useEffect(() => {

    const viewId = sessionStorage.getItem('viewId');
    
    if (userAuth && viewId) { 
          axios.get(`http://localhost:5000/api/images/${viewId}`)
          .then(response => { 
            setImages(response.data);
          })
          .catch(error => {
            console.error(error);
          });
    }
  }, [userAuth,uid]);
  


  return (
    <>
    <p className='quote live'><b>{Found}</b></p>
    <div style={{display: notFound ? "none" : "block"}}>
      <div className="nav">
              <input type="checkbox" id="nav-check" />
              <div className="nav-header">
                <div className="nav-title" >
                  <Link to="/" style={{textDecoration:"none",color:"red"}} ><img className="logo" style={{"width":"2rem","height":"2rem","borderRadius":"50%"}} src={logo} alt="my web logo" /></Link>
                </div>
              </div>
              <div className="nav-btn">
                <label htmlFor="nav-check">
                  <span></span>
                  <span></span>
                  <span></span>
                </label>
              </div>
              
              <div className="nav-links">
                
                <Link to="/userprofile" style={{textDecoration:"none",color:"white"}} ><i className="fa-regular fa-user"> </i> Profile</Link>
                <Link to="/contest" style={{textDecoration:"none",color:"white"}} ><i className="fa-solid fa-arrow-right"> </i> Goto Contest</Link>
                <Link to="/collection" style={{textDecoration:"none",color:"white"}} ><i className="fa-regular fa-image"></i> Collection</Link>
              </div>
            </div>
      <div >
      <p className='live quote' style={{display:checkProfile ? 'none':''}}><b>user profile not found</b></p>
    <div className="profile-container" style={{display:!checkProfile ? 'none':''}}>
          <div className='row1' key={userProf._id}>
            <img
              src={userProf.propic ? `data:image/jpeg;base64,${userProf.propic}`:defaultpic}
              alt="profile"
              style={{ height: '4rem', width: '4rem', borderRadius:'50%' }}
            />
            <p><b><i className="fa-brands fa-galactic-senate"> </i> Name: </b>{userProf.name}</p>
          </div>
            <div className='row'>
              <p><b><i className="fa-solid fa-at"> </i> Email: </b>{userProf.email}</p>
              <p><b> <i className="fa-solid fa-location-dot"> </i> Place: </b>{userProf.place}</p>
            </div>
            <div className='row'>
              <p><b><i className="fa-solid fa-book-atlas"> </i> Bio: </b>{userProf.bio}</p>
            </div>
      </div>
      {/* <p className='live quote' style={{display: noData ? "":'none'}}><i>no images found</i></p> */}
      <p className='live quote' ><b>User Images</b></p>
      <div className="user-images">
              {getImages && getImages
                .map((image, index) => (
                  <div key={index} className="image-item">
                    <img
                      id='image'
                      src={`data:image/jpeg;base64,${image.imgData}`}
                      alt={image.caption}
                    />
                  
                    <p style={{"color":"black"}}>Caption: {image.caption}</p> 
                  </div>
              ))}
            </div>
        </div>
        <div id="page-container">
          <div id="content-wrap">
            <Footer />
          </div>
        </div> 
        <div id='footbar'>
          <Footbar />
        </div>
  </div>
</>
  );
}

export default Viewuser;

