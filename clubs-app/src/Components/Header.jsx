import { useEffect, useState } from "react"; 
import { faBell, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import logo from "../img/Logo.svg";
import './Header.css';

export default function Header({ socket, socketId }) {


    const logOut = () => {
        localStorage.clear();
        window.location.reload();
    };

    const location = useLocation();
    const navigate = useNavigate();

    const [currNotifications, setNotifications] = useState([]);

    const getNotifications = async () => {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: localStorage.getItem("id")
            })
        };

        const notificationsRequest = await fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_SERVER_PORT}/get-notifications`, options);
        const { notifications } = await notificationsRequest.json();
        setNotifications(await notifications);
    };

    useEffect(() => {
        (async () => {
            await getNotifications();
        })();
    }, []);
    
    useEffect(() => {
        socket.on("pull-notification", (notification) => {
            console.log("HELLLO", notification);
            setNotifications(currNotifications => {
                return [...currNotifications, notification];
            });
        });
    }, []);

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
                            <li className="notification">
                                <div className="notifications-item" onClick={() => navigate("/notifications")} >
                                    <FontAwesomeIcon 
                                        icon={faBell}
                                        className="notifications-icon"
                                    />
                                    <div className="notifications-counter">
                                        {currNotifications.length > 0 && <p>{currNotifications.length}</p>}
                                    </div>
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