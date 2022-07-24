import { useNavigate, useParams } from "react-router-dom";
import "./Account.css";
import Header from "../Components/Header";
import { useEffect } from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function UserAccount({socket, socketId}) {
    const { username } = useParams();
    const navigate = useNavigate();

    const [isFriend, setIsFriend] = useState();
    const [userData, setUserData] = useState();

    const accountExists = async () => {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username
            })
        };
        
        const fetchResponse = await fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_SERVER_PORT}/user-exists`, options);
        const response = await fetchResponse.json();
        const result = await response.result;
        console.log(await result);
        return await result;
    };

    const getAccountData = async () => {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: username
            }),
        };
        
        const fetchResponse = await fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_SERVER_PORT}/user-data`, options);
        const response = await fetchResponse.json();
        console.log(await response);
        setUserData(await response);

        return await response;
    };

    const checkFriend = async () => {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: localStorage.getItem("username"),
                friendUsername: username
            })
        };

        const fetchResponse = await fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_SERVER_PORT}/check-friend`, options);
        const response = await fetchResponse.json();
        setIsFriend(await response.result);
    };

    const addFriend = async () => {
        const updatedUserData = await getAccountData();
        const type = "friend";
        const message = `${localStorage.getItem("username")} sent you a friend request. Do you accept it?`;
        const to = username;
        const from = localStorage.getItem("username");
        const socketId = updatedUserData["socket_id"];
        
        const notification = {
            type,
            message,
            to,
            from,
            id: localStorage.getItem("id")
        };

        socket.emit("push-notification", notification, socketId);

        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(notification)
        };

        const responseFetch = await fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_SERVER_PORT}/push-notification`, options);
        const response = await responseFetch.json();
        const result = await response.result;
        console.log("Result: ", result);
    };

    const removeFriend = async () => {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                removeFriendUsername: username,
                username: localStorage.getItem("username")
            })
        };

        const responseFetch = await fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_SERVER_PORT}/remove-friend`, options);
        const response = await responseFetch.json();
        const result = await response.result;

        
    };

    useEffect(() => {
        (async () => {
            if (localStorage.getItem("username") === username) navigate(-1);
            const exist = await accountExists();
            if (!await exist) navigate(-1);
            const data = await getAccountData();
           
            await checkFriend();
        })();
    }, []);
    
    return (
        <div>
            <Header socket={socket} socketId={socketId} />
            <div className="account-details">
                <div className="image">
                    <FontAwesomeIcon icon={faUser} className="user" />
                </div>

                <h2 className="name">{username}</h2>
                { isFriend ? <p>You are friend with <b>{username}</b></p> : <p>You are not friend with <b>{username}</b> <br /> Would you like to add him/her?</p> }
                <button type="button" onClick={async () => isFriend ? await removeFriend() : await addFriend()}>{isFriend ? "Remove friend" : "Send friend request"}</button>
            </div>
        </div>
    );
};