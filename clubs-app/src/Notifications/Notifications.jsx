import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";

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

            const request = await fetch("http://localhost:8080/get-notifications", options);
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
                dbId
            })
        };

        try {
            const fetchResponse = await fetch("http://localhost:8080/remove-notification", options);
            const response = await fetchResponse.json();
            if (!response.result) return;

        } catch (e) {
            console.log(e);
        }
    };

    const joinClubNotification = async (id, clubId) => {

        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                clubId: clubId
            })
        };

        try {
            const response = await fetch("http://localhost:8080/join-club", options);
            const resJSON = await response.json();
            const joined = await resJSON.joined;
            if (await joined) navigate(`/clubs/${clubId}`);
            console.log('..');

        } catch (e) {
            console.log(e);
        }

    };

    const acceptFriendNotification = async (id, friendId) => {

        let userDataOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id
            })
        };

        let dataFetch = await fetch("http://localhost:8080/user-data", userDataOptions);
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

        dataFetch = await fetch("http://localhost:8080/user-data", userDataOptions);
        const data = await dataFetch.json();
        const friendUsername = await data.username;

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
            const response = await fetch("http://localhost:8080/add-friend", options);
            const response2 = await fetch("http://localhost:8080/add-friend", options2);
            const { result } = await response.json();
            const { result2, friendSocketId } = await response2.json();
            const message = `${username} accepted your friend request!`;
            if (result && result2) socket.emit("push-notification", username, friendSocketId, message, undefined);
            
        } catch (e) {
            console.log(e);
        }
    };


    useEffect(() => {
        socket.on("pull-notification", (notification) => {
            alert("HELLLO", notification);
            setNotifications(currNotifications => {
                currNotifications.unshift(notification);
                return currNotifications;
            });
        })
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
                    <div className="notification" key={idx}>
                        <h2 className="from">Hello</h2>
                        <p className="message">{notification.message}</p>
                        <div className="type">
                            {notification.type === "join" ? (
                                <div>
                                   <button 
                                    type="button" 
                                    className="notification-btn accept-btn"
                                    onClick={() => joinClubNotification(notification.id, notification.clubId)}
                                    >
                                        <p>Accept</p>
                                    </button>
                                    <button 
                                    type="button" 
                                    className="notification-btn ignore-btn"
                                    onClick={() => ignoreNotification(idx + 1)}
                                    >
                                        <p>Ignore</p>
                                    </button>
                                </div>
                            ) : notification.type === "friend" ? (
                                <div>
                                    <button 
                                    type="button" 
                                    className="notification-btn accept-btn"
                                    onClick={() => acceptFriendNotification(notification.id)}
                                    >
                                        <p>Accept</p>
                                    </button>
                                    <button 
                                    type="button" 
                                    className="notification-btn ignore-btn"
                                    onClick={() => ignoreNotification(idx + 1)}
                                    >
                                        <p>Ignore</p>
                                    </button>
                                </div>
                            ) : notification.type === "join-invite" ? (
                                <div>
                                   <button 
                                    type="button" 
                                    className="notification-btn accept-btn"
                                    onClick={() => joinClubNotification(localStorage.getItem("id"), notification.clubId)}
                                    >
                                        <p>Accept</p>
                                    </button>
                                    <button 
                                    type="button" 
                                    className="notification-btn ignore-btn"
                                    onClick={() => ignoreNotification(idx + 1)}
                                    >
                                        <p>Ignore</p>
                                    </button>
                                </div>
                            ) : null}
                        </div>

                        <div className="close-notification">
                            <FontAwesomeIcon icon={faTimes} className="close-icon" />
                        </div>
                    
                    </div>
                ))}
            </div>

        <div className="go-up"></div>
    </div>
    );
};