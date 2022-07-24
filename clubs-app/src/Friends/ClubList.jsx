import { faCheck, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useState, useRef, useEffect } from "react";
import "./Friends.css";

export default function ClubList({ clubId, getSelected }) {

    const [ clubMembers, setClubMembers ] = useState([]);
    const [ activeClubMembers, setActiveClubMembers ] = useState([]);
    const selectableRef = useRef([]);

    const getClubMembers = async () => {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: localStorage.getItem("username"),
                clubId: clubId
            })
        };

        const fetchRes = await fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_SERVER_PORT}/get-members`, options);
        const userData = await fetchRes.json();
      
        console.log(await userData);
        setClubMembers(await userData);
        
    };

    const toggleClubMember = (idx) => {
        selectableRef.current[idx].classList.toggle("active");
       
        if (selectableRef.current[idx].classList.contains("active")) setActiveClubMembers(currActiveClubMembers => {
            return [...currActiveClubMembers, clubMembers[idx].username];
        });
        else setActiveClubMembers(currActiveClubMembers => {
            return currActiveClubMembers.filter(clubMember => clubMember !== clubMembers[idx].username);
            
          
        });
    };  

    useEffect(() => {
        (async () => {
            await getClubMembers();
        })();
    }, []);

    useEffect(() => {
        console.log(activeClubMembers);
        if (activeClubMembers.length === 0) return;
        
        getSelected(activeClubMembers);
    }, [activeClubMembers]);

    return clubMembers.length !== 0 && (
        <div className="friends-list">
            {clubMembers.map((clubMember, idx) => (
                <div className="friend-container" key={idx} ref={ref => selectableRef.current[idx] = ref}  onClick={() => toggleClubMember(idx)}>
                   
                    <div className="selectable">
                        <FontAwesomeIcon className={`check-icon ${selectableRef?.current[idx]?.classList?.contains("active") ? "show" : ""}`} icon={faCheck} />
                    </div>
                    
                    <FontAwesomeIcon icon={faUser} className="user-icon" />
                    <h2>{clubMember.username}</h2>
                </div>
            ))}
        </div>
    );
};