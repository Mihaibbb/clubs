import { useEffect } from "react"; 
import { faBell, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import logo from "../img/Logo.svg";
import './Header.css';
import { useState } from "react";

export default function Header({ socket, socketId }) {


    const logOut = () => {
        localStorage.clear();
        window.location.reload();
    };

    const location = useLocation();

    const navigate = useNavigate();
    
    return (
        <div className="header">
            <div className="items">
                <div className="left-container">
                    {location.pathname === "/" ? (
                        <>
                            <li><a href="#features">Features</a></li>
                            {/* <li><a href="#friends">Our advantage</a></li>
                            <li><a href="#latest-news">Why Uniclub?</a></li> */}
                        </>
                    ) : null}

                    {localStorage.getItem("id") ? <Link to="/clubs">
                        <li>Clubs</li>
                    </Link> : null}
                </div>
                
                <div className="logo">
                    <Link to="/">
                        <img src={logo} width="100%"/>
                    </Link>
                   
                </div>

                <div className="right-container">
                    {localStorage.getItem("logged") ? (
                        <>
                            <li>
                                <div className="notifications-item" onClick={() => navigate("/notifications")} >
                                    <FontAwesomeIcon 
                                        icon={faBell}
                                        className="notifications-icon"
                                    />

                                </div>
                                
                            </li>
                            <Link to="/account">
                                <li>Account</li>
                            </Link>                           
                            <li onClick={() => logOut()}>Log Out</li>
                        </>
                        
                    ) : (
                        <Link to="/signin">
                            <li>
                                Sign in
                            </li>
                            <li></li>
                        </Link>
                    )}
                   
                </div>
            </div>
        </div>
    );
};