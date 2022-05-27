import './App.css';
import {useState} from "react";
import React from 'react'

import {
  BrowserRouter as Router, 
  Routes,
  Route
} from 'react-router-dom'

import Home from './Components/Home'
import AboutUs from './Components/AboutUs'
import ContactUs from './Components/ContactUs'

function App() {
  
  return (
    <div className="App">

       <div>
      <Router>
          <Routes>
            <Route path={'/AboutUs'} component={AboutUs}></Route>
            <Route path={'/ContactUs'} component={ContactUs}></Route>
            <Route path={'/'} component={Home}></Route>
          </Routes>
      </Router>
    </div>
        <p></p>

    </div>
  );
}

export default App;
