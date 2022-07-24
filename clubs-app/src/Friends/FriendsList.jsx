import { faCheck, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useState, useRef, useEffect } from "react";
import "./Friends.css";

export default function FriendsList({ selectable, styleProps, getSelected }) {

    const [ friends, setFriends ] = useState([]);
    const [ activeFriends, setActiveFriends ] = useState([]);
    const selectableRef = useRef([]);

    const getFriends = async () => {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: localStorage.getItem("id")
            })
        };

        const fetchRes = await fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_SERVER_PORT}/user-data`, options);
        const userData = await fetchRes.json();
        const dbFriends = JSON.parse(await userData.friends);
        setFriends(dbFriends);
        
    };

    const toggleFriend = (idx) => {
        selectableRef.current[idx].classList.toggle("active");
        console.log(selectableRef.current[idx]);
        if (selectableRef.current[idx].classList.contains("active")) setActiveFriends(currActiveFriends => {
            return [...currActiveFriends, friends[idx].username];
        });
        else setActiveFriends(currActiveFriends => {
            return currActiveFriends.filter(friend => friend !== friends[idx].username);
        });
    };  

    useEffect(() => {
        (async () => {
            await getFriends();
        })();
    }, []);

    useEffect(() => {
        if (activeFriends.length === 0) return;
        getSelected(activeFriends);
    }, [activeFriends]);

    return friends.length !== 0 && (
        <div className="friends-list" style={{...styleProps}}>
            {friends.map((friend, idx) => (
                <div className="friend-container" key={idx} ref={ref => selectableRef.current[idx] = ref}  onClick={() => toggleFriend(idx)}>
                    {selectable ? (
                        <div className="selectable">
                            <FontAwesomeIcon className={`check-icon ${selectableRef?.current[idx]?.classList?.contains("active") ? "show" : ""}`} icon={faCheck} />
                        </div>
                    ) : null}
                    <FontAwesomeIcon icon={faUser} className="user-icon" />
                    <h2>{friend.username}</h2>
                </div>
            ))}
        </div>
    );
};