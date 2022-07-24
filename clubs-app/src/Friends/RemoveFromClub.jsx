import { faCakeCandles } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import ClubList from "./ClubList";
import "./Friends.css";

export default function RemoveFromClub({ socket, socketId }) {
    
    const [selected, setSelected] = useState();
    const location = useLocation();
    const navigate = useNavigate();

    const { clubId, clubName } = location.state;

    const getSelected = (newSelections) => {
        console.log(newSelections);
        setSelected(newSelections);
    };

    const removeFromClub = () => {
        selected.forEach(selection => {
            (async () => {
                console.log(selection, clubName, clubId, `${process.env.REACT_APP_URL}:${process.env.REACT_APP_SERVER_PORT}/remove-from-club`);
                const options = {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: selection,
                        clubId: clubId
                    })
                };
                try {
                    const request = await fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_SERVER_PORT}/remove-from-club`, options);
                    const { result } = await request.json();
                    if (await result) navigate(-1);
                } catch (e) {
                    console.log(e);
                }
             
            })();
        });
    };

    return (
        <div className="options-content">
            <Header socket={socket} socketId={socketId} />
            <ClubList getSelected={getSelected} clubId={clubId} />
            <button type="button" className="add-btn" onClick={() => removeFromClub()}>Remove people from {clubName}</button>
        </div>
    );
};