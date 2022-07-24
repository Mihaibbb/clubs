import { faLock, faLockOpen, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../Components/Header";
import Searchbar from "../SearchBar/Searchbar";
import "./Search.css";

export default function Search({socket, socketId}) {
    const { query } = useParams();

    const [userResults, setUserResults] = useState([]);
    const [clubResults, setClubResults] = useState([]);

    const navigation = useNavigate();

    useEffect(() => {
        (async () => {
            console.log('here');
            await getResults();
        })();
    }, [query]);

    const getResults = async () => {

        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: query,
                id: localStorage.getItem("id")
            })
        };

        const responseClubs = await fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_SERVER_PORT}/search-club`, options);
        const responseUsers = await fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_SERVER_PORT}/search-people`, options);
        const resClubs = await responseClubs.json();
        const resUsers = await responseUsers.json();
        console.log(resClubs, resUsers);
        setClubResults(resClubs);
        setUserResults(resUsers);
    }

    return (
        <div>
            <Header socket={socket} socketId={socketId} />
            <div className="search-container">
                <Searchbar initialValue={query} />
            </div>

            {
                <div className="response-container">
                    <div className="clubs-response">
                        <h2 className="category-title">{clubResults.length} clubs found</h2>
                        {clubResults && clubResults.map((clubResult, idx) => (
                            <div className="club-result result" key={idx} onClick={() => navigation(`/clubs/${clubResult.club_id}`)}>
                                <h3 className="club-name">{clubResult.club_name} {!clubResult.privacy ? <FontAwesomeIcon icon={faLock}/> : <FontAwesomeIcon icon={faLockOpen} />}</h3>
                                <p>Club ID: {clubResult.club_id}</p>
                                <div className="people"><FontAwesomeIcon icon={faUsers} /> {clubResult.people}</div>
                            </div>
                        ))}
                    </div>
                    <div className="users-response">
                        <h2 className="category-title">{userResults.length} users found</h2>
                        {userResults && userResults.map((userResult, idx) => (
                            <div className="user-result result" key={idx} onClick={() => navigation(`/account/${userResult.username}`)}>
                                <h3><FontAwesomeIcon icon={faUser} /> {userResult.username}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    );
}; 