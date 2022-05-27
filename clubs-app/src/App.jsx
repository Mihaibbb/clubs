import './App.css';
import {useState} from "react";
import React from 'react'

import {
  BrowserRouter, 
  Routes,
  Route
} from 'react-router-dom';

import Home from './Components/Home';
import AboutUs from './Components/AboutUs';
import ContactUs from './Components/ContactUs';
export default function App() {
  
  return (
      <BrowserRouter>
          <Routes> 
            <Route path="/" element={<Home />} />
          </Routes>
      </BrowserRouter>
  );
}


