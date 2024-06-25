// App.js

import React, { useState, useEffect, useContext} from 'react';
import { Link,useNavigate } from "react-router-dom";
import axios from 'axios';
import './App.css'; // Import the CSS file with styles
import logo from './images/logo.jpg';
import app from './FirebaseConfig/Firebase';
import {getAuth,signOut,onAuthStateChanged} from "firebase/auth";
import UserId from './Context/Context';
import 'bootstrap/dist/css/bootstrap.css';
import Footer from './Footer/Footer';
import Footbar from './Footbar';


function Home() {
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [images, setImages] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userAuth,setUser]=useState(null);
  const [Found,setFound] = useState("");
  const [notFound,setPageFound] = useState(false);
  const {setUid} = useContext(UserId);
  // const [likedImages,setLikedImages] = useState([]);
  // const [imageLikes,setImageLikes] = useState([]);
  const [showInput,setInput] = new useState('');
  const [comment,setComment] = new useState('');
  const [commentBool,setCommentBool] = new useState(false);
  const [imageComments,setImageComments] = useState([]);
  const [seeAllComments, setAllComments] = useState('');
  const [toggleComment,setCommentToogle] = useState(false);

  const navigate=useNavigate();

 

  useEffect(() => {
    if(localStorage.getItem('userId')){
      sessionStorage.setItem('userId',localStorage.getItem('userId'));
      setFound("");
      setPageFound(false);
      axios.get('http://localhost:5000/api/images')
      .then(response => {
          setImages(response.data);   
      })
      .catch(error => {
        console.log(error);
      });
    }else{
      setFound("page not found...please login or retry after some time");
      setPageFound(true);
      navigate('/login');
    }
  }, [navigate]);

  useEffect(()=>{
    const auth = getAuth(app);
    const listen = onAuthStateChanged(auth,(user)=>{
      if(user && sessionStorage.getItem('userId')){
        setUser(user);
      }else{
        setUser(null);
      }
    });

    return  () => listen();
  },[]);

  // useEffect(() => {
    
  //   if(localStorage.getItem('userId') && userAuth && userAuth.uid){
  //     sessionStorage.setItem('userId',localStorage.getItem('userId'));
  //     const userId = userAuth.uid;
      
  //     axios.get(`http://localhost:5000/api/like/${userId}`)
  //     .then(response => {
  //         setLikedImages(response.data.likedImages);
  //         axios.get('http://localhost:5000/api/cntlike')
  //         .then(response=>{
  //           setImageLikes(response.data);
  //         }).catch(error=>{
  //           console.log(error);
  //         });
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  //   }
    
  // }, [userAuth]);

  useEffect(()=>{
    axios.get('http://localhost:5000/api/comment')
    .then((response)=>setImageComments(response.data));
    
  },[])

  

  const handleImageSubmit = () => {

    const formData = new FormData();
    formData.append('uid',userAuth.uid);
    formData.append('caption', caption);
    formData.append('image', imageFile);
    // formData.append('date', Sunday.toDateString());

    axios.post('http://localhost:5000/api/images', formData)
      .then(response => {
        // console.log(response.data);
        axios.get('http://localhost:5000/api/images')
          .then(response => {
            // console.log(response.data);
            setImages(response.data);
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });

      setIsFormOpen(false)
  };

  const handleLike=(e)=>{

    console.log(e.target.value);
    const localImages = JSON.parse(localStorage.getItem('localImages')) || [];
    const liked = localImages.filter(id => id !== e.target.value);
    localStorage.setItem('localImages', JSON.stringify([...liked,e.target.value]));
  }

  const handleToggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };


  const handleLogout=async(e)=>{

      e.preventDefault();

      const auth = getAuth(app);
      signOut(auth)
      .then(() => {
      // Signed up
      localStorage.removeItem('userId');
      sessionStorage.removeItem('userId')
          navigate('/login');
      // ...
      }).catch((error) => {
          // const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage);
      });
  }


  const handleViewProfile = (e) => {
    sessionStorage.setItem('viewId',e.target.name)
    setUid(e.target.name);
  };

  const handleHeart =async (imageId)=>{
    const userId = sessionStorage.getItem("userId");

    // Check if userId exists
    if (!userId) {
      return;
    }

    // Check if likedImages exists
    // if (!likedImages) {
    //   return;
    // }

    axios.post(`http://localhost:5000/api/like/${userId}/${imageId}`)
    .then(response => {
            axios.get('http://localhost:5000/api/images')
            .then(response => {
                setImages(response.data);   
            })
            .catch(error => {
              console.log(error);
            });
        }).catch(error => {
              console.error(error);
        });
  }

  const openComment =(imageId)=>{
    setCommentBool(!commentBool);
    if(commentBool){
      setInput(imageId);
    }else{
      setInput('');
    }
    
  }

  const addComment= async (imageId)=>{
    if(!comment) return;
    await axios.post(`http://localhost:5000/api/comment/${imageId}/${comment}`);
    await axios.get('http://localhost:5000/api/comment')
    .then((res)=>setImageComments(res.data));
    setComment('');
  }

const showAll =(imageId)=>{
  setCommentToogle(!toggleComment);
  if(toggleComment){
    setAllComments(imageId);
  }else setAllComments('');
  
}

  return (
    <>
    <p className='quote live'><b>{Found}</b></p>
    <div style={{display: notFound ? "none" : "block"}}>
      <header className="nav" >
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
            <Link style={{color:"white"}} onClick={handleLogout}><i className="fa-solid fa-right-from-bracket"> </i> Logout</Link>
            
            <div className='add-profile'>
                          <div className={`background-container ${isFormOpen ? 'blur-background' : ''}`}></div>
                          <div className={`form-container ${isFormOpen ? 'open' : ''}`}>
                            <div className='inputbox'>

                              <label>Caption:</label>
                              <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} required /><br />

                              <label>Image File:</label>
                              <input type="file" onChange={(e) => setImageFile(e.target.files[0])} required /><br />

                              <button className='submit' onClick={handleImageSubmit}>Submit</button>
                            </div>
                            <button className="add-button close-btn open" onClick={handleToggleForm}>
                              Close
                            </button>
                          </div>
              </div>
          </div>
        </header>

        <button className="add-button" style={{color:"white"}} onClick={handleToggleForm}>
              <i className="fa-solid fa-plus"> </i> add
        </button>
        
      
    <div id='photosec'>
      
      <div className='quote'><p className='photoFie'><b>PhotoFieSta</b></p></div>
      <div className='quote'><p className='live'><i>"Unleash Your Creativity, One Click at a Time: Join Our Community of Passionate Photographers!"</i></p></div>
      {/* <buuton onClick={handleDisplay}>display</buuton> */}
      
      {/* Image container */}
      <div className="image-container">
      {images.map((image, index) => (
        <div key={index} className="image-item">
          <button className='like' value={image._id} onClick={handleLike}><i className="fa-solid fa-plus"> </i></button>
          
          <img
            id='image'
            src={`data:image/jpeg;base64,${image.imgData}`}
            alt={image.caption}
          />
          <div className='view' >
            <div style={{display:'block',width:'100%'}}>
              <p className='caption'><b>Caption:</b> {image.caption}</p> 
              <div style={{display:'flex',marginLeft:'5px'}}>
                <i className="fa-solid fa-heart heart" value={image._id} onClick={() => handleHeart(image._id)} style={{ color: image.likes.includes(sessionStorage.getItem("userId")) ? 'red':'black' }}></i>
                <p>Likes: {image.likes.length}</p>
              </div>
              <button className='' onClick={()=>openComment(image._id)}>comment</button>
              <div style={{ display: showInput === image._id ? 'flex' : 'none' }}>
                <input
                  id='comment'
                  type='text'
                  placeholder='Add a comment...'
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  style={{ display: showInput ? 'block' : 'none' }}
                  onClick={() => addComment(image._id)}
                >
                  add
                </button>
              </div>
            </div>
            <button className='profile'>
              <Link to="/viewuser" name={image.uid} onClick={handleViewProfile} style={{textDecoration:"none",color:"black"}} >
                Profile
              </Link>
            </button> 
          </div>
          <p>
            <p style={{fontSize:'14px',display:'flex'}}><b>Comments:</b><button className='' style={{width:'fit-content',height:'fit-content'}} onClick={()=>showAll(image._id)}>show</button></p>

            <div>
              {seeAllComments === image._id 
                ? imageComments.find((comment) => comment.mid === image._id)?.comments.map((msge, idx) => (
                    <p key={idx} style={{fontSize:'10px',margin:'2px 0px'}}>{msge}</p>
                  )) || <p style={{fontSize:'10px'}}>zero comments</p>
                : ''}
            </div>
          </p>
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

export default Home;

