import logo from "../img/uniclub.svg";
import '../Signin Form/Signin.css';
import { useState, useRef } from "react";
import Header from "../Components/Header";
import { Helmet } from "react-helmet";
import { useNavigate, useLocation } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBasketball, faFutbol, faFutbolBall, faPingPongPaddleBall, faSoccerBall, faVolleyball } from "@fortawesome/free-solid-svg-icons";
import SPORTS from "../Sports/Sports";
import "./AddClub.css";
import "./Switch.css";

export default function AddClub({ socket, socketid }) {

    const [clubName, setClubName] = useState("");
    const [sport, setSport] = useState('football');
    const [error, setError] = useState('');
    const [checked, setChecked] = useState(false);
    const containerRef = useRef();
    const sportsRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();

    const socketId = socketid || location.state.socketId;
    const realSocket = socket || location.state.socketId;

    console.log(SPORTS);

    const getClubId = () => {
        const length = 8;
        let result           = '';
        let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) 
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        return result;
    };
    
    const createClub = async () => {
        if (clubName.length < 4) {
            setError("Club's name must be at least 4 characters!")
            return;
        }
        const clubId = getClubId();
        console.log(clubId);
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: localStorage.getItem("username"),
                email: localStorage.getItem("email"),
                id: localStorage.getItem("id"),
                sport: sport,
                clubId: clubId,
                clubName: clubName,
                socketId: socketId,
                public: !checked
            })
        };

        const resJSON = await fetch(`${process.env.REACT_APP_URL}:${process.env.REACT_APP_SERVER_PORT}/create-club`, options);
        const res = await resJSON.json();
        if (res.error) {
            setError(res.error);
            return;
        }
        
        navigate("/clubs");
    };

    if (!localStorage.getItem("logged")) navigate("/");

    return (
        <div className="club-cont"> 
            <Header socket={realSocket} socketId={socketId} />
            <Helmet>
                <script
                src="https://kit.fontawesome.com/64d58efce2.js"
                crossorigin="anonymous"
                async
                ></script>
            </Helmet>
            <div className="container" ref={containerRef}>
                <div className="forms-container">
                    <div className="signin-signup">
                    <div className="form sign-in-form">
                        <h2 className="title">Create Club</h2>
                        <div className="input-field">
                            <i className="fas fa-user"></i>
                            <input 
                                type="text" 
                                placeholder="Club's Name..." 
                                value={clubName} 
                                onChange={e => setClubName(e.target.value)} 
                                className="club-input"
                            />
                            
                        </div>

                        <div className="sports-container" ref={sportsRef}>
                            {Object.values(SPORTS).map((sport, sportIdx) => {
                                const sportName = Object.keys(SPORTS)[sportIdx];
                                
                               
                                let sportTitle = sportName.replaceAll("_", " ");
                                sportTitle = sportTitle.charAt(0).toUpperCase() + sportTitle.slice(1);
                                
                                return (
                                    <div className={sportIdx !== 0 ? "sport" : "sport active"} onClick={e => {
                                        
                                        sportsRef.current.childNodes.forEach(child => child.classList.remove('active'));
                                        sportsRef.current.childNodes[sportIdx].classList.add("active");
                                        setSport(sportName);
                                    }}>
                                        {sport}
                                        <h3>{sportTitle}</h3>
                                    </div>
                                );
                            })}
                        </div>


                        <div className="privacy">
                        <label className="switch">
                            <input type="checkbox" className="checkbox" checked={checked} onChange={() => setChecked(check => !check)} />
                            <span className="slider round">{checked ? "Private" : "Public"}</span>
                        </label>
                        </div>
                        
                        <input value="Create Club" className="btn solid" onClick={async () => await createClub()} readOnly/>
                        <div className="errors">
                            <p>{error}</p>
                        </div>
                    </div>
                    </div>
                </div>

                <div className="panels-container">
                    <div className="panel left-panel">
                    <div className="content">
                        <h3>New here ?</h3>
                        <p>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis,
                        ex ratione. Aliquid!
                        </p>
                        
                    </div>
                    <img src={logo} className="image" alt="" />
                    </div>
                    
                </div>
            </div>
        </div>
    );
};