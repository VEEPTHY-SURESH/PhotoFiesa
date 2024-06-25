import React, {useState} from 'react';
import { Link ,useNavigate} from "react-router-dom";
import app from '../FirebaseConfig/Firebase';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import './style2.css';


function Register(){

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
                createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    navigate("/login");
                // ...
                }).catch((error) => {
                    alert("Oops! register failed");
                });
            }
          }

    }
    
    return(
        <>
            <div className='login'>
                <form className="form-control">
                    <p className="title">Register</p>
                    <div className='input-field'>
                        <input className='input' onChange={handleChange}  type="text" name="email" required/>
                        <label className="label" >Enter Email</label>
                    </div>

                    <div className='input-field'>
                        <input className='input' onChange={handleChange} type="text" name="password"  required/>
                        <label className="label" >Enter Password</label>
                    </div>
                    
                    <button className="submit-btn" onClick={handleSubmit}>Register</button><Link to="/" style={{textDecoration:"none",color:"black"}} ><span>Login</span></Link>
                </form>
            </div>
        </>
    )
}

export default Register;