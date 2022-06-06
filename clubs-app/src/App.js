import './App.css';
import {useEffect, useState} from "react";

import {
  BrowserRouter as Router, 
  Routes,
  Route
} from 'react-router-dom'

import Home from './Components/Home';
import ContactUs from './Components/ContactUs';
import Signin from './Signin Form/Signin';
import Club from './Clubs/Club';
import AddClub from './Clubs/AddClub';
import Account from './Account/Account';
import Footer from './Components/Footer';
import AddPost from './Clubs/AddPost';
import AddComment from './Clubs/AddComment';

import { io } from "socket.io-client";
import Clubs from './Clubs/Clubs';

function App() {
  const [realSocket, setRealSocket] = useState(null);
  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:8080");
    socket.on("connect", () => {
      console.log("Connected!", socket.id);
      setRealSocket(socket);
      setSocketId(socket.id);
      
    });
    if (!localStorage.getItem("email")) return;
      socket.emit("update_socket", localStorage.getItem("email"));
  }, []);
  
  

  return realSocket && (
    <div className="App">
       <div>
      <Router>
          <Routes>
            <Route path={'/contactus'} element={<ContactUs socket={realSocket} socketId={socketId} />} />
            <Route path={'/signin'} element={<Signin socket={realSocket} socketId={socketId} />} />
            <Route path={'/add-club'} element={<AddClub socket={realSocket} socketId={socketId} />} />
            <Route path={'/add-post'} element={<AddPost socket={realSocket} socketId={socketId} />} />
            <Route path={'/add-comment'} element={<AddComment socket={realSocket} socketId={socketId} />} />
            <Route path={'/clubs'} element={<Clubs socket={realSocket} socketId={socketId} />} />
            <Route path={'/clubs/:id'} element={<Club socket={realSocket} socketId={socketId} />} />
            <Route path={'/account'} element={<Account socket={realSocket} socketId={socketId} />} />
            <Route path={'/'} element={<Home socket={realSocket} socketId={socketId} />} />
          </Routes>
      </Router>
    </div>
        <p></p>
    </div>
    
  );
}

export default App;
