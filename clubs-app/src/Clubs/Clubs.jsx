import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import SPORTS from "../Sports/Sports";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Clubs.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faLock, faLockOpen, faPlus } from "@fortawesome/free-solid-svg-icons";
import addIcon from "../img/plus.svg";

export default function Clubs({socket, socketId}) {

    const [sidebar, setSidebar] = useState(false);
    const [personalClubs, setPersonalClubs] = useState(null);
    const [members, setMembers] = useState([]);
    const [updater, setUpdater] = useState(0);
    let started = false;
    const showSidebar = () => setSidebar(!sidebar);
    const navigate = useNavigate();
    const location = useLocation();

    const getMembers = async (clubId) => {
      console.log(clubId);
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                clubId: clubId,
            })
        };
  
        try {
  
          const resJSON = await fetch("http://localhost:8080/people-in-club", options);
          const res = await resJSON.json();
          console.log(await res.people, await res.id);
          console.log(res, res.people, members);
          if (!res || !res.people) return;
            
          setMembers(currMembers => {
            console.log(currMembers);
            
            return [...currMembers, {people: res.people, id: res.id}];
          });
        } catch(e) {
          console.log(e);
        }
    };

    const changePrivacy = async (clubId, privacy) => {
      console.log('change privacy');
     
      const options = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          clubId: clubId,
          privacy: privacy
        })
      };
      window.location.reload();
      await fetch("http://localhost:8080/change-privacy", options);
     
    };
  
    useEffect(() => {
      (async () => {
        if (!localStorage.getItem("logged") || started) return;
        console.log('in effect');
        started = true;
        const options = {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id: localStorage.getItem("id")
          })
        };
  
        const resJSON = await fetch("http://localhost:8080/get-clubs", options);
        const clubs = await resJSON.json();
        console.log("CLUUUUBS", clubs, clubs.clubs);
        const currClubs = [];
        const realClubs = clubs.clubs.filter(club => {
          const found = currClubs.some(currClub => currClub === club.id);
          currClubs.push(club.id);
          return !found;
        });
        
        setPersonalClubs(realClubs);
        console.log(realClubs);
        realClubs.forEach(async club => {
            console.log("club here");
            console.log(club)
            await getMembers(club.id);
        });
  
        localStorage.setItem("clubs", JSON.stringify(realClubs));
      })();
    }, [updater]);
  
    useEffect(() => {
      const newMembers = members && members.filter((member, idx) => members.indexOf(member) === idx);
      console.log(newMembers, members);
    }, [members]);

    return personalClubs && (
        <div className="clubs">
            <Header socket={socket} socketId={socketId} />
            {/* {personalClubs.length > 0 && <h2 className="clubs-title">Your clubs</h2>} */}
            <div className={personalClubs.length === 0 ? "clubs-container empty" : "clubs-container"}>
                {personalClubs.length > 0 && personalClubs.map((personalClub, clubIdx) => (
                    
                        <div className="club" key={clubIdx} onClick={(e) => {
                            console.log(e.target.tagName);
                            if (e.target.tagName.toLowerCase() === "path" || e.target.tagName.toLowerCase() === "svg") return;
                            navigate(`/clubs/${personalClub.id}`)
                        }}>
                            <div className="icon">
                                {SPORTS[personalClub.sport]}
                            </div>
                            <div className="club-title">
                                <h3>{personalClub.name} 

                                </h3>
                            </div>
                            <div className="club-people">
                                <h4>{members[clubIdx]?.people === 1 ? "1 Person" : `${members[clubIdx]?.people} people`}</h4>
                            </div>
                            {personalClub.owner && (
                                <div className="owner">
                                    <FontAwesomeIcon icon={faCrown} />
                                </div>
                            )}

                            <div 
                                className="privacy-container" 
                                onClick={async () => personalClub.owner ? await changePrivacy(personalClub.id, !personalClub.public) : null}
                            >
                                <FontAwesomeIcon 
                                    className="privacy-icon" icon={personalClub.public ? faLockOpen : faLock}
                                />
                            </div>
                        </div>
                    
                ))}

                <h2 className="centered-title">{personalClubs.length === 0 ? "No clubs" : ""}</h2>

                
                <div className="add-icon">
                  <img src={addIcon} onClick={() => navigate("/add-club", { state: { socket: socket, socketId: socketId} })} />
              </div>
                
            </div>
        </div>
    );
};