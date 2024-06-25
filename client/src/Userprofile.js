import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import './App.css';
import app from './FirebaseConfig/Firebase';
import {getAuth,onAuthStateChanged} from "firebase/auth";
import logo from './images/logo.jpg';
import defaultpic from './images/default.png';
import LikedImages from './LikedImages';
import Footer from './Footer/Footer';
import Footbar from './Footbar';


function Userprofile(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [place, setPlace] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic,setProfilePic] = useState(null);
  const [userAuth,setUser]=useState(null);
  const [userProf, setUserProf] = useState({});
  const [getImages, setImages] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [checkProfile,setCheckProfile] = useState(false);
  const [Found,setFound] = useState("");
  const [notFound,setPageFound] = useState(false);
  const [showLiked,setShowLiked] = useState(false);
  const [edit,setEdit] = useState(false);

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
    if(userAuth && userAuth.uid){

      const id = userAuth.uid;
      axios.get(`http://localhost:5000/api/profile/${id}`)
        .then(response => {
          if(!response.data){
            setCheckProfile(false)
          }
          else {
            setCheckProfile(true);
            setUserProf(response.data);
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [userAuth]);

  useEffect(() => {
    if (userAuth && userAuth.uid) {
      const id = userAuth.uid;
  
      axios.get(`http://localhost:5000/api/images/${id}`)
        .then(response => {
          if (response.data.length === 0) {
            console.log('no images found');
          } else {
            setImages(response.data);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [userAuth]);

  const handleFormSubmit = () => {
    const formData = new FormData();
    formData.append('uid',userAuth.uid);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('place', place);
    formData.append('bio', bio);
    formData.append('image', profilePic);
    console.log(profilePic);
    // formData.append('date', datee);

    axios.post('http://localhost:5000/api/profile', formData)
      .then(response => {
        console.log(response.data);
        axios.get('http://localhost:5000/api/profile')
          .then(response => {
            setUserProf(response.data);
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });

    setIsFormOpen(false);
    setEdit(false);
  };



  const handleToggleForm = () => {
    setIsFormOpen(!isFormOpen);
    
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await axios.delete(`http://localhost:5000/api/images/${imageId}`);
      setImages(getImages.filter(image => image._id !== imageId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProfile =async ()=>{
   
      const userId = sessionStorage.getItem("userId");
      console.log(userId);
      try {
       await axios.delete(`http://localhost:5000/api/profile/${userId}`);
       setUserProf({});
        
      } catch (error) {
        console.error('Error deleting profile:', error);

      }
  }

  const handleShowLiked=()=>{
    setShowLiked(!showLiked);
  }

  const handleEdit=(profile)=>{
    setEdit(true);
    setEmail(profile.email);
    setName(profile.name);
    setBio(profile.bio);
    setPlace(profile.place);
  }

  return (
    <>
    <p className='quote live'><b>{Found}</b></p>
    <div style={{display: notFound ? "none" : ""}}>
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
            
            <div className='add-profile'>
                <div className={`background-container ${isFormOpen ? 'blur-background' : ''}`}></div>
              
                <div className={`form-container ${isFormOpen ? 'open' : ''}`}>
                  <div className='inputbox'>
                                <div className='input-field'>
                                    <input required type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} />
                                    <label className="label">Enter name</label>
                                </div>

                                <div className='input-field'>
                                    <input required type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    <label className="label">Enter email</label>
                                </div>

                                <div className='input-field'>
                                    <input required type="text" className="input" value={place} onChange={(e) => setPlace(e.target.value)} />
                                    <label className="label">Enter place</label>
                                </div>

                                <div className='input-field'>
                                    <textarea style={{border:"1px solid#080808"}}  type="text" className="input" onChange={(e) => setBio(e.target.value)} />
                                    <label className="label">Enter bio</label>
                                </div>

                                <div className='input-field'>
                                    <input type="file" onChange={(e) => setProfilePic(e.target.files[0])} />
                                </div>

                              <button className='submit' onClick={handleFormSubmit}>submit</button>
                  </div>
                  <button className="add-button open close-btn" onClick={handleToggleForm}>
                    Close
                  </button>
                </div>
              </div>
          </div>
        </div>
        <button className="add-button" style={{color:"white",display: checkProfile ? "none" : ""}} onClick={handleToggleForm}>
              <i className="fa-solid fa-plus"> </i> set profile
        </button>

      {/* Image container */}
      <p className='live quote' style={{display: checkProfile ? 'none':''}}><b>set your profile</b></p>
      
      <div className="profile-container" style={{display: !checkProfile ? 'none':''}}>
          <div className='row' key={userProf._id}>
            <div>
              <img
                src={userProf.propic ? `data:image/jpeg;base64,${userProf.propic}`:defaultpic}
                alt="profile"
                style={{ height: '4rem', width: '4rem', borderRadius:'50%' }}
              /><br />
              <button style={{color:"white",display: !checkProfile ? "none" : ""}} onClick={handleDeleteProfile}>
                delete profile
              </button>
              <button style={{color:"white",backgroundColor:"blue"}} onClick={()=>handleEdit(userProf)}>
                Edit
              </button>
            </div>
            <div className='editform' style={{display:edit ? '':'none'}}>
              <div className='inputbox'>
                  <div className='input-field'>
                      <input required type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} />
                      <label className="label">Enter name</label>
                  </div>

                  <div className='input-field'>
                      <input required type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
                      <label className="label">Enter email</label>
                  </div>

                  <div className='input-field'>
                      <input required type="text" className="input" value={place} onChange={(e) => setPlace(e.target.value)} />
                      <label className="label">Enter place</label>
                  </div>

                  <div className='input-field'>
                      <textarea style={{border:"1px solid#080808"}}  type="text" className="input" onChange={(e) => setBio(e.target.value)} />
                      <label className="label">Enter bio</label>
                  </div>

                  <div className='input-field'>
                      <input type="file" onChange={(e) => setProfilePic(e.target.files[0])} />
                  </div>

                <button className='submit' onClick={handleFormSubmit}>save</button>
              </div>
            </div>
            <p style={{display: edit ? 'none':''}}><b><i className="fa-brands fa-galactic-senate"> </i> Name: </b>{userProf.name}</p>
          </div>
            <div className='row' style={{display: edit ? 'none':''}}>
              <p><b><i className="fa-solid fa-at"> </i> Email: </b>{userProf.email}</p>
              <p><b> <i className="fa-solid fa-location-dot"> </i> Place: </b>{userProf.place}</p>
            </div>
            <div className='row' style={{display: edit ? 'none':''}}>
              <p><b><i className="fa-solid fa-book-atlas"> </i> Bio: </b>{userProf.bio}</p>
            </div>
          {/* <button onClick={handleDisplay}>display</button> */}
      </div>
      <div className='userImages' style={{display:'flex'}}>
        <button onClick={handleShowLiked} style={{backgroundColor: 'black',color: 'white'}}>Your Images</button>
        <button onClick={handleShowLiked} style={{backgroundColor: 'red',color: 'black'}}>Liked Images</button>
      </div>
      
      <div className="user-images" style={{display: !showLiked ? '':'none'}}>
      {getImages && getImages
          .map((image, index) => (
            <div key={index} className="image-item">
              <button className='delete' onClick={() => handleDeleteImage(image._id)}>
                <i className="fa-solid fa-trash-can-arrow-up"></i>
              </button>
              <img
                id='image'
                src={`data:image/jpeg;base64,${image.imgData}`}
                alt={image.caption}
              />
              <p style={{"color":"black"}}>Caption: {image.caption}</p> 
            </div>
          ))
        }
       </div>
       <div className='user-images' style={{display: showLiked ? '':'none'}}>
              <LikedImages />
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

export default Userprofile;;