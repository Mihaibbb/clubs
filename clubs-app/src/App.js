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
import UserAccount from './Account/UserAccount';

import { io } from "socket.io-client";
import Clubs from './Clubs/Clubs';
import Search from './Search/Search';
import Notifications from './Notifications/Notifications';
import FriendsList from './Friends/FriendsList';
import Friends from './Friends/Friends';
import RemoveFromClub from './Friends/RemoveFromClub';

const App = () => {
    const [realSocket, setRealSocket] = useState(null);
    const [socketId, setSocketId] = useState(null);
    let counters = 0;

    useEffect(() => {
      if (counters) return;
      counters++;
      const socket = io(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_SERVER_PORT}`, { reconnection:false });
    
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
                    <Route path={'/add-club'} element={<AddClub socket={realSocket} socketid={socketId} />} />
                    <Route path={'/add-post'} element={<AddPost socket={realSocket} socketId={socketId} />} />
                    <Route path={'/add-comment'} element={<AddComment socket={realSocket} socketId={socketId} />} />
                    <Route path={'/clubs'} element={<Clubs socket={realSocket} socketId={socketId} />} />
                    <Route path={'/clubs/:id'} element={<Club socket={realSocket} socketId={socketId} />} />
                    <Route path={'/account'} element={<Account socket={realSocket} socketId={socketId} />} />
                    <Route path={'/search/:query'} element={<Search socket={realSocket} socketId={socketId} />} />
                    <Route path={'/notifications'} element={<Notifications socket={realSocket} socketId={socketId} />} />
                    <Route path={'/account/:username'} element={<UserAccount socket={realSocket} socketId={socketId} />} />
                    <Route path={'/friends'} element={<Friends socket={realSocket} socketId={socketId} />} />
                    <Route path={'/remove-from-club'} element={<RemoveFromClub socket={realSocket} socketId={socketId} />} />
                    <Route path={'/'} element={<Home socket={realSocket} socketId={socketId} />} />
                  </Routes>
              </Router>
          </div>
      </div>
      
    );
}

export default App;
