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
        
        const fetchResponse = await fetch("http://localhost:8080/user-exists", options);
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
                username: username
            }),
        };
        
        const fetchResponse = await fetch("http://localhost:8080/user-data", options);
        const response = await fetchResponse.json();
        setUserData(await response);
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

        const fetchResponse = await fetch("http://localhost:8080/check-friend", options);
        const response = await fetchResponse.json();
        setIsFriend(await response.result);
    };

    const addFriend = async () => {
        
        const type = "friend";
        const message = `${localStorage.getItem("username")} sent you a friend request. Do you accept it?`;
        const to = username;
        const from = localStorage.getItem("username");
        const socketId = userData["socket_id"];

        socket.emit("push-notification", from, socketId, message, type);

        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                type,
                message,
                to,
                from
            })
        };

        const responseFetch = await fetch("http://localhost:8080/push-notification", options);
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

        const responseFetch = await fetch("http://localhost:8080/remove-friend", options);
        const response = await responseFetch.json();
        const result = await response.result;

        
    };

    useEffect(() => {
        (async () => {
            const exist = await accountExists();
            if (!await exist) navigate(-1);
            await getAccountData();
            await checkFriend();
        })();
    }, []);
    
    return (
        <div>
            <Header />
            <div className="container sign-up-mode">
                <div className="text11" >
                    <h1>Those are your account details!</h1>

                    <h3>You can easily update them!</h3>
                </div> 
                <div className="account-details">
                    <div className="image">
                        <FontAwesomeIcon icon={faUser}/>
                    </div>

                    <h2 className="name">{username}</h2>
                    <button type="button" onClick={async () => isFriend ? await removeFriend() : await addFriend()}>{isFriend ? "Remove friend" : "Send friend request"}</button>
                </div>
            </div>
        </div>
    );
};