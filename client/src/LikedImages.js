import React, { useState, useEffect, useContext} from 'react';
import { Link,useNavigate } from "react-router-dom";
import axios from 'axios';
import './App.css'; // Import the CSS file with styles
// import logo from './images/logo.jpg';
import app from './FirebaseConfig/Firebase';
import {getAuth,onAuthStateChanged} from "firebase/auth";
import UserId from './Context/Context';

function LikedImages() {
  const [getImages, setImages] = useState([]);
  const [userAuth, setUser] = useState(null);
  const [Found, setFound] = useState("");
  const [notFound, setPageFound] = useState(false);
  const { setUid } = useContext(UserId);

  const [showInput, setInput] = useState('');
  const [comment, setComment] = useState('');
  const [commentBool, setCommentBool] = useState(false);
  const [imageComments, setImageComments] = useState([]);
  const [seeAllComments, setAllComments] = useState('');
  const [toggleComment, setCommentToggle] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('userId')) {
      sessionStorage.setItem('userId', localStorage.getItem('userId'));
      setFound("");
      setPageFound(false);
      axios.get('http://localhost:5000/api/images')
        .then(response => {
          setImages(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      setFound("page not found...please login or retry after some time");
      setPageFound(true);
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const auth = getAuth(app);
    const listen = onAuthStateChanged(auth, (user) => {
      if (user && sessionStorage.getItem('userId')) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => listen();
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/api/comment')
      .then((response) => setImageComments(response.data));
  }, []);

  const handleViewProfile = (e) => {
    sessionStorage.setItem('viewId', e.target.name)
    setUid(e.target.name);
  };

  const handleHeart = async (imageId) => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      return;
    }

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

  const openComment = (imageId) => {
    setCommentBool(!commentBool);
    if (commentBool) {
      setInput(imageId);
    } else {
      setInput('');
    }
  }

  const addComment = async (imageId) => {
    if (!comment) return;
    await axios.post(`http://localhost:5000/api/comment/${imageId}/${comment}`);
    await axios.get('http://localhost:5000/api/comment')
      .then((res) => setImageComments(res.data));
    setComment('');
  }

  const showAll = (imageId) => {
    setCommentToggle(!toggleComment);
    if (toggleComment) {
      setAllComments(imageId);
    } else setAllComments('');
  }

  return (
    <>
      <div className="image-container">
        {getImages && userAuth && getImages
          .filter(image => image.likes.includes(userAuth.uid))
          .map((image, index) => (
            <div key={index} className="image-item">
              <div>
                <img
                  id='image'
                  src={`data:image/jpeg;base64,${image.imgData}`}
                  alt={image.caption}
                />
                <div className='view'>
                  <div style={{ display: 'block', width: '100%' }}>
                    <p className='caption'><b>Caption:</b> {image.caption}</p>
                    <div style={{ display: 'flex', marginLeft: '5px' }}>
                      <i className="fa-solid fa-heart heart" value={image._id} onClick={() => handleHeart(image._id)} style={{ color: 'red' }}></i>
                      <p>Likes: {image.likes.length}</p>
                    </div>
                    <button className='' onClick={() => openComment(image._id)}>comment</button>
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
                    <Link to="/viewuser" name={image.uid} onClick={handleViewProfile} style={{ textDecoration: "none", color: "black" }}>
                      Profile
                    </Link>
                  </button>
                </div>
                <p>
                  <p style={{ fontSize: '14px', display: 'flex' }}><b>Comments:</b><button className='' style={{ width: 'fit-content', height: 'fit-content' }} onClick={() => showAll(image._id)}>show</button></p>
                  <div>{seeAllComments === image._id ? imageComments.find((comment) => comment.mid === image._id)?.comments.map(msge => <p style={{ fontSize: '10px', margin: '2px 0px' }}>{msge}</p>) || <p style={{ fontSize: '10px' }}>zero comments</p> : ''}</div>
                </p>
              </div>
            </div>
          ))
        }
      </div>
    </>
  );
}

export default LikedImages;