import { faCheck, faTimes, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import "./Notifications.css";

export default function Notifications({socket, socketId}) {

    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);

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

        try {

            const request = await fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_SERVER_PORT}/get-notifications`, options);
            const response = await request.json();
            console.log(await response.notifications);
            setNotifications(await response.notifications);
           
        } catch (e) {
            console.log(e);
        }

    };

    const ignoreNotification = async (dbId) => {
       
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: localStorage.getItem("id"),
                dbId: dbId
            })
        };

        try {
          
            const fetchResponse = await fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_SERVER_PORT}/remove-notification`, options);
            const response = await fetchResponse.json();
            console.log("IGNORE");
            console.log(await response);
            if (!await response.result) return;
            setNotifications(currNotif => {
                return currNotif.filter((notif, idx) => idx === dbId);
            });

            window.location.reload();

        } catch (e) {
            console.log(e);
        }
    };

    const joinClubNotification = async (id, clubId, sport, clubName, username, email, socketId, idx) => {
        console.log(id);
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                clubId: clubId,
                username: username,
                email: email,
                socketId: socketId,
                sport: sport,
                clubName: clubName
            })
        };

        try {
            

            const response = await fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_SERVER_PORT}/join-club`, options);
            const resJSON = await response.json();
            const joined = await resJSON.joined;
            if (await joined && id === localStorage.getItem("id")) navigate(`/clubs/${clubId}`);
            console.log('..');
            await ignoreNotification(idx);
        } catch (e) {
            alert(e);
        }

    };

    const acceptFriendNotification = async (friendId, idx) => {
        console.log(friendId);
        let userDataOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: localStorage.getItem("id")
            })
        };

        let dataFetch = await fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_SERVER_PORT}/user-data`, userDataOptions);
        const { username } = await dataFetch.json();

        userDataOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: friendId
            })
        };

        dataFetch = await fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_SERVER_PORT}/user-data`, userDataOptions);
        const data = await dataFetch.json();
        const friendUsername = await data.username;
        console.log(username, friendUsername);
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                friendUsername
            })
        };

        const options2 = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: friendUsername,
                friendUsername: username
            })
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_SERVER_PORT}/add-friend`, options);
            const response2 = await fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_SERVER_PORT}/add-friend`, options2);
            const { result } = await response.json();
        
            const { friendSocketId } = await response2.json();
            const message = `${username} accepted your friend request!`;
            console.log(result);
            const notification = {
                from: username,
                to: friendUsername,
                type: undefined,
                 message: message
            };

            if (result) {
                console.log("here here here");
                await ignoreNotification(idx);
                socket.emit("push-notification",  friendSocketId);
                
                const pushOptions = {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(notification)
                };

                const pushRequest = await fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_SERVER_PORT}/push-notification`, pushOptions);
                const pushResponse = await pushRequest.json();
                console.log(pushResponse.result);
            }
            
        } catch (e) {
            console.log(e);
        }
    };


    useEffect(() => {
        socket.on("pull-notification", (notification) => {
            console.log("HELLLO", notification);
            setNotifications(currNotifications => {
                const newNotifications = currNotifications.unshift(notification);
                return newNotifications;
            });
        });
    }, []);

    useEffect(() => {
        (async () => {
            await getNotifications();
        })();
    }, []);


    return (
        <div className="notifications-container">
            <Header socket={socket} socketId={socketId} />
            <div className="notifications">
                {notifications && notifications.length !== 0 && notifications.map((notification, idx) => (
                    <>
                        <div className="notification" key={idx}>
                            <h2 className="from">From: <FontAwesomeIcon icon={faUser} className="user-icon" /> {notification.from}</h2>
                            <p className="message">{notification.message}</p>
                            
                            <div className="close-notification" onClick={async () => await ignoreNotification(idx)}>
                                <FontAwesomeIcon icon={faTimes} className="close-icon" />
                            </div>
                        
                        </div>
                        <div className="type">
                            {notification.type === "join" ? (
                                <>
                                <button 
                                    type="button" 
                                    className="notification-btn accept-btn"
                                    onClick={async () => await joinClubNotification(notification.id, notification.clubId, notification.sport, notification.clubName, notification.username, notification.email, notification.socketId, idx)}
                                    >
                                        <p>Accept <FontAwesomeIcon icon={faCheck} /></p>
                                    </button>
                                    <button 
                                    type="button" 
                                    className="notification-btn ignore-btn"
                                    onClick={async () => await ignoreNotification(idx)}
                                    >
                                        <p>Ignore <FontAwesomeIcon icon={faTimes} /></p>
                                    </button>
                                </>
                            ) : notification.type === "friend" ? (
                                <>
                                    <button 
                                    type="button" 
                                    className="notification-btn accept-btn"
                                    onClick={async () => await acceptFriendNotification(notification.id, idx)}
                                    >
                                        <p>Accept <FontAwesomeIcon icon={faCheck} /></p>
                                    </button>
                                    <button 
                                    type="button" 
                                    className="notification-btn ignore-btn"
                                    onClick={async () => await ignoreNotification(idx)}
                                    >
                                        <p>Ignore <FontAwesomeIcon icon={faTimes} /></p>
                                    </button>
                                </>
                            ) : notification.type === "join-invite" ? (
                                <>
                                <button 
                                    type="button" 
                                    className="notification-btn accept-btn"
                                    onClick={async () => await joinClubNotification(localStorage.getItem("id"), notification.clubId, notification.sport, notification.clubName, notification.username, notification.email, notification.socketId, idx)}
                                    >
                                        <p>Accept <FontAwesomeIcon icon={faCheck} /></p>
                                    </button>
                                    <button 
                                    type="button" 
                                    className="notification-btn ignore-btn"
                                    onClick={async () => await ignoreNotification(idx)}
                                    >
                                        <p>Ignore <FontAwesomeIcon icon={faTimes} /></p>
                                    </button>
                                </>
                            ) : null}
                        </div>
                    </>
                ))}
            </div>

        <div className="go-up"></div>
    </div>
    );
};