import React from "react";
import { useState } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";
import Header from "../Components/Header";
import FriendsList from "./FriendsList";

export default function Friends({ socket, socketId }) {
    
    const [selected, setSelected] = useState();
    const location = useLocation();
    const navigation = useNavigate();
    if (!location.state) navigation(-1);
    const { clubName, clubId, sport } = location.state;

    const getSelected = (newSelections) => {
        setSelected(newSelections);
    };

    const inviteToClub = async () => {
        let options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: localStorage.getItem("id")
            })
        };

        const userFetch = await fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_SERVER_PORT}/user-data`, options);
        const { username, email, socket_id } = await userFetch.json();

        selected.forEach(selection => {
            (async () => {
                const friendUsername = selection.username;
                
                options = {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: friendUsername
                    })
                };

                const friendFetchData = await fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_SERVER_PORT}/user-data`, options);
                const friendData = await friendFetchData.json();
                const friendSocketId = await friendData.socket_id;

                const notification = {
                    type: "join-invite",
                    from: username, 
                    to: friendUsername,
                    message: `${username} invited you to participate in ${clubName} club.`,
                    clubId: clubId,
                    id: localStorage.getItem("id"),
                    clubName: clubName,
                    sport: sport,
                    email: email,
                    username: username,
                    socketId: socket_id
                };
                
                const pushOptions = {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(notification)
                };

                socket.emit("push-notification", notification, friendSocketId);

                try {
                    const noitificationFetch = await fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_SERVER_PORT}/push-notification`, pushOptions);
                    const notificationResponse = await noitificationFetch.json();
                    if (!await notificationResponse.result) return;    
                    navigation(-1);
                } catch (e) {
                    console.log(e);
                }
            })();
        });
    };

    return (
        <div className="options-content">
            <Header socket={socket} socketId={socketId} />
            <FriendsList selectable={true} getSelected={getSelected} />
            <button type="button" className="add-btn" onClick={async () => await inviteToClub()}>Invite your friends to {clubName}</button>
        </div>
    );
};