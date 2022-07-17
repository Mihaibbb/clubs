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

    const ignoreNotification = async (idx) => {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                dbId: idx,
                id: localStorage.getItem("id")
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
        } catch (e) {
            console.log(e);
        }

    };

    const acceptFriendNotification = async () => {
        
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
                                    <button type="button" className="notification-btn accept-btn">Accept</button>
                                    <button type="button" className="notification-btn ignore-btn">Ignore</button>
                                </div>
                            ) : notification.type === "friend" ? (
                                <div>
                                    <button type="button" className="notification-btn accept-btn">Accept</button>
                                    <button type="button" className="notification-btn ignore-btn">Ignore</button>
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