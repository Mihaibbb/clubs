import logo from './logo.svg';
import './App.css';
import {useState} from "react";
import React from 'react'

import {
  BrowserRouter as Router, 
  Switch,
  Route
} from 'react-router-dom'

import Home from './components/Home'
import AboutUs from './components/AboutUs'
import ContactUs from './components/ContactUs'

function App() {
  const [number, setNumber] = useState(0);

  return (
    <div className="App">
       <div>
      <Router>
          <Switch>
            <Route path={'/AboutUs'} component={AboutUs}></Route>
            <Route path={'/ContactUs'} component={ContactUs}></Route>
            <Route path={'/'} component={Home}></Route>
          </Switch>
      </Router>
    </div>
    </div>
  );
}

export default App;
