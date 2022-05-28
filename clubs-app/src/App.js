import './App.css';
import {useState} from "react";
import React from 'react';

import {
  BrowserRouter as Router, 
  Routes,
  Route
} from 'react-router-dom'

import Home from './Components/Home';
import AboutUs from './Components/AboutUs';
import ContactUs from './Components/ContactUs';
import Signin from './Aterizare/Signin';
import Sidebar from './Sidebar/Sidebar';

function App() {
  
  return (
    <div className="App">
       <div>
      <Router>
          <Routes>
            <Route path={'/AboutUs'} element={<AboutUs/>}></Route>
            <Route path={'/ContactUs'} element={<ContactUs/>}></Route>
            <Route path={'/Signin'} element={<Signin/>}></Route>
            <Route path={'/Sidebar'} element={<Sidebar/>}></Route>
            <Route path={'/'} element={<Home/>}></Route>
          </Routes>
      </Router>
    </div>
        <p></p>

    </div>
  );
}

export default App;
