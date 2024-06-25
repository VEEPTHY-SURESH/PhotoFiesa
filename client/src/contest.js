import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import './App.css';
import logo from './images/logo.jpg';
import Footer from './Footer/Footer';
import Footbar from './Footbar';

function Contest(){
    const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [images, setImages] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [display,setDisplay] = useState("");
  const [showLive,setLive] = useState("");
  const [Found,setFound] = useState("");
  const [notFound,setPageFound] = useState(false);

  useEffect(() => {
    // Fetch all images from the backend when the component mounts
    if(sessionStorage.getItem('userId')){
      setFound("");
      setPageFound(false);
      axios.get('http://localhost:5000/api/contest')
        .then(response => {
          const date = new Date();
          const day = date.getDay();
          if(day===0){
              setLive("Contest is Live...What are you waiting for...Get a chance to win price for your best photograph...Start uploading your best shot !")
          }else {
              setLive("");
          }
          var today = new Date();

          var dayOfWeek = today.getDay(); 
          var daysSinceLastSunday = (dayOfWeek) % 7;

          var lastSunday = new Date(today);
          lastSunday.setDate(today.getDate()- daysSinceLastSunday);

          // console.log(lastSunday.toDateString());

          setImages(response.data.filter(image => image.date === lastSunday.toDateString()));
        })
        .catch(error => {
          console.error(error);
        });
    }else{
      setFound("page not found...please login or retry after some time");
      setPageFound(true);
    }
  }, []);

  const handleImageSubmit = () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('caption', caption);
    formData.append('image', imageFile);
    // formData.append('date', datee);

    axios.post('http://localhost:5000/api/contest', formData)
      .then(response => {
        console.log(response.data);
        axios.get('http://localhost:5000/api/contest')
          .then(response => {
            setImages(response.data);
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });

    setIsFormOpen(false);
  };

  const handleToggleForm = () => {
    const date = new Date();
    const day = date.getDay();
    if(day===0){
        setLive("Contest is Live...What are you waiting for...Get a chance to win price for your best photography !")
        setIsFormOpen(!isFormOpen);
    }else {
        setIsFormOpen(false);
        setDisplay("contest will be opened on sunday!  Stay tuned!");
    }
    
  };

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
            
            <div className='add-profile'>
              <div className={`background-container ${isFormOpen ? 'blur-background' : ''}`}></div>
              
                <div className={`form-container ${isFormOpen ? 'open' : ''}`}>
                  <div className='inputbox'>
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} /><br />

                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />

                    <label>Caption:</label>
                    <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} /><br />

                    <label>Image File:</label>
                    <input type="file" onChange={(e) => setImageFile(e.target.files[0])} /><br />

                    <button className='submit' onClick={handleImageSubmit}>Submit</button>
                  </div>

                
                  <button className="add-button open close-btn" onClick={handleToggleForm}>
                    Close
                  </button>
                </div>
            </div>
          </div>
    </div>
    
    <button className="add-button" style={{color:"white"}} onClick={handleToggleForm}>
        <i className="fa-solid fa-plus"> </i> add
      </button>
      <div className='quote'><p className='photoFie'><b>Contest</b></p></div>
    <p className='live quote' style={{color:'black'}}><b>{display}</b></p>
    <p className='live' style={{color:'black'}}><b>{showLive}</b></p>
      {/* Image container */}
      <div className="image-container">
        
        {images
          .filter(image => image.caption.toLowerCase())
          .map((image, index) => (
            <div key={image._id} className="image-item">
              <img
                src={`data:image/jpeg;base64,${image.imgData}`}
                alt={image.caption}
                // style={{ height: '25rem', width: '25rem', borderRadius:'25px' }}
              />
              <div className=''>
                <p><span>Pic by : </span> <span>{image.name}</span> </p>
                <p><span>Contact : </span> <span>{image.email}</span> </p>
                <p><span>Caption : </span> <span>{image.caption}</span> </p>
                <p><span>Date : </span> <span>{image.date}</span> </p>
              </div>
            </div>
          ))}
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

export default Contest;