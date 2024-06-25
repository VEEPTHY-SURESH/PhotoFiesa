import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import './App.css'; // Import the CSS file with styles
import logo from './images/logo.jpg';
import Footer from './Footer/Footer';
import Footbar from './Footbar';


function Collection(){
    const [images, setImages] = useState([]);
    const [likedImages, setLiked] = useState([]);
    const [localImages,setLocalImages] = useState([]);
    const [Found,setFound] = useState("");
    const [notFound,setPageFound] = useState(false);

    useEffect(() => {
      if (sessionStorage.getItem('userId')) {
          setFound("");
          setPageFound(false);
          axios.get('http://localhost:5000/api/images')
            .then(response => {
                setImages(response.data || []);
            })
            .catch(error => {
                console.error(error);
            });

        const localPics = JSON.parse(localStorage.getItem('localImages')) || [];
            setLocalImages(localPics);
        } else {
            setFound("page not found...please login or retry after some time");
            setPageFound(true);
        }
    }, []);

    useEffect(() => {
      if (images.length === 0 || localImages.length === 0) return;
  
      // Filter liked images based on localImages
      const liked = images.filter(image => localImages.includes(image._id));
      setLiked(liked);
    }, [images, localImages]);
  
    const deleteItem = (id) => {
      const updatedLocalImages = localImages.filter(imageId => imageId !== id);
      setLocalImages(updatedLocalImages);
      localStorage.setItem('localImages', JSON.stringify(updatedLocalImages));
  
      // Update liked images
      const updatedLikedImages = likedImages.filter(image => image._id !== id);
      setLiked(updatedLikedImages);
    };

    return (
      <>
      <p className='quote live'><b>{Found}</b></p>
        <div style={{display: notFound ? "none" : "block"}}>
          
          <div className="nav" >
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

          <div className='quote'><p className='photoFie'><b>Your Collection</b></p></div>
    
          {/* Image container */}
          <div className="image-container">
            {likedImages && likedImages.map((image, index) => (
              <div key={index} className="image-item">
                <button className='delete' onClick={() => deleteItem(image._id)}>
                  <span><i className="fa-solid fa-trash-can-arrow-up"></i></span>
                </button>
                <img
                  id='image'
                  src={`data:image/jpeg;base64,${image.imgData}`}
                  alt={image.caption}
                />
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

export default Collection;