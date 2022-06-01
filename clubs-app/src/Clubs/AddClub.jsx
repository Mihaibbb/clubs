import logo from "../img/logo.png"
import '../Signin Form/Signin.css';
import { useState, useRef } from "react";
import Header from "../Components/Header";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBasketball, faPingPongPaddleBall, faSoccerBall, faVolleyball } from "@fortawesome/free-solid-svg-icons";
import "./AddClub.css";

export default function AddClub({ socket }) {

    const [clubName, setClubName] = useState("");
    const [sport, setSport] = useState('football');
    const [error, setError] = useState('');
    const containerRef = useRef();
    const sportsRef = useRef();
    const navigate = useNavigate();

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
                socketId: socket.id
            })
        };

        const resJSON = await fetch("http://localhost:8080/create-club", options);
        const res = await resJSON.json();
        if (res.error) {
            setError(res.error);
            return;
        }
        


        navigate("/");
    };

    if (!localStorage.getItem("logged")) navigate("/");

    return (
        <> 
            <Header marginTop={0}/>
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
                            />
                            
                        </div>

                        <div className="sports-container" ref={sportsRef}>
                            <div className="sport active" onClick={e => {
                                sportsRef.current.childNodes.forEach(child => child.classList.remove('active'));
                                sportsRef.current.childNodes[0].classList.add("active");
                                setSport("football");
                            }}>
                                <FontAwesomeIcon
                                    icon={faSoccerBall}
                                />
                                <h3>Football</h3>
                                
                            </div>
                            <div className="sport" onClick={e => {
                                sportsRef.current.childNodes.forEach(child => child.classList.remove('active'));
                                sportsRef.current.childNodes[1].classList.add("active");
                                setSport("basketball");
                            }}>
                                <FontAwesomeIcon
                                    icon={faBasketball}
                                />
                                <h3>Basketball</h3>
                                
                            </div>
                            <div className="sport" onClick={e => {
                                sportsRef.current.childNodes.forEach(child => child.classList.remove('active'));
                                sportsRef.current.childNodes[2].classList.add("active");
                                setSport("volley");
                            }}>
                                <FontAwesomeIcon
                                    icon={faVolleyball}
                                />
                                <h3>Volley</h3>
                                
                            </div>
                            <div className="sport" onClick={e => {
                                sportsRef.current.childNodes.forEach(child => child.classList.remove('active'));
                                sportsRef.current.childNodes[3].classList.add("active");
                                setSport("ping_pong");
                            }}>
                                <FontAwesomeIcon
                                    icon={faPingPongPaddleBall}
                                />
                                <h3>Ping Pong</h3>
                                
                            </div>
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
        </>
    );
};