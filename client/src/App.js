// App.js

import React from 'react';
import {BrowserRouter,Routes, Route} from "react-router-dom";
import Home from './Home';
import Contest from './contest';
import Login from './Login/Login';
import Register from './Register/Register';
import Viewuser from './Viewuser';
import Collection from './Collection';
import Userprofile from './Userprofile';
import LikedImages from './LikedImages';
import ContextState from './Context/ConstextState';


function App() {
   return(
    <>
     
      <BrowserRouter>
      <ContextState>
          <Routes>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/" element={<Home />}></Route>
            <Route path="/userprofile" element={<Userprofile />}></Route>
            <Route path="/contest" element={<Contest />}></Route>
            <Route path="/viewuser" element={<Viewuser />}></Route>
            <Route path="/collection" element={<Collection />} ></Route>
            <Route path="/likedimages" element={<LikedImages />} ></Route>
          </Routes>
        </ContextState>
      </BrowserRouter>
      
    </>
   )
}

export default App;

