import React,{useState} from 'react';
import { Link,useNavigate } from "react-router-dom";
import app from '../FirebaseConfig/Firebase';
import {getAuth,signInWithEmailAndPassword,sendPasswordResetEmail} from "firebase/auth";
import './style1.css';


function Login(){
    const [email, setEmail]= useState("");
    const [password,setPassword]=useState("");
    const navigate = useNavigate();
    
    const handleChange=(e)=>{
        if(e.target.name==="email") setEmail(e.target.value);
        if(e.target.name==='password') setPassword(e.target.value);
    }
    const validateEmail = (email) => {
        const emailRegex = /^[\w-\.0-9]+@([\w-]+\.)+[\w-]{2,4}$/;
        return emailRegex.test(email);
      };

      const validatePassword = (password) => {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{:;"'?/>.<,])(?=.*[a-zA-Z]).{8,}$/;
        return passwordRegex.test(password);
      };


    const handleSubmit=(e)=>{

        e.preventDefault();

        if (!validateEmail(email)) {
            alert('Invalid email address');
          } else {
            if (!validatePassword(password)) {
                alert('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter,one number and one special char');
              } else {
                    const auth = getAuth(app);
                     signInWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                    
                        const user = userCredential.user;
                        console.log(user);
                        localStorage.setItem('userId',auth.currentUser.uid);
                        // sessionStorage.setItem('userId',auth.currentUser.uid);
                        navigate('/')
                 
                    }).catch((error) => {
                
                        alert("user not found");
                    });
              }
          }

        
    }

    const handleResetPass=()=>{
        const auth = getAuth();
            sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log("sent reset mail");
                alert("a reset email has been sent to your email");
            })
            .catch((error) => {
                // const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);
                // ..
            });
    }
    
    return(
        <>
            <div className='login'>
                <form className="form-control">
                    <p className="title">Login</p>
                    <div className='input-field'>
                        <input className='input' onChange={handleChange}  type="text" name="email" required/>
                        <label className="label">Enter Email</label>
                    </div>

                    <div className='input-field'>
                        <input className='input' onChange={handleChange} type="text" name="password"  required/>
                        <label className="label">Enter Password</label>
                    </div>
                    <button className="submit-btn" onClick={handleSubmit}>Login</button>
                    <span><Link to="/register" style={{textDecoration:"none",color:"black"}} >Register</Link></span><span>forgot password ? <button onClick={handleResetPass}>Reset</button></span>
                </form>
            </div>  
        </>
    )
}

export default Login;