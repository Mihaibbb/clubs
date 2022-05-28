import logo from "../img/logo.png"
import '../Signin Form/Signin.css';
import { useState, useRef } from "react";
import Header from "../Components/Header";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBasketball, faPingPongPaddleBall, faSoccerBall, faVolleyball } from "@fortawesome/free-solid-svg-icons";
import "./AddClub.css";

export default function AddClub() {

    const [clubName, setClubName] = useState("");
    const containerRef = useRef();
    const navigate = useNavigate();
    //const [sport, setSport] = useState("football")

    const createClub = async () => {
        if (clubName.length < 4) return;
    };

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
                        <h2 className="title">Sign in</h2>
                        <div className="input-field">
                            <i className="fas fa-user"></i>
                            <input 
                                type="text" 
                                placeholder="Club's Name..." 
                                value={clubName} 
                                onChange={e => setClubName(e.target.value)} 
                            />
                            
                        </div>

                        <div className="sports-container">
                            <div className="sport">
                                <FontAwesomeIcon
                                    icon={faSoccerBall}
                                />
                                <h3>Football</h3>
                                
                            </div>
                            <div className="sport">
                                <FontAwesomeIcon
                                    icon={faBasketball}
                                />
                                <h3>Basketball</h3>
                                
                            </div>
                            <div className="sport">
                                <FontAwesomeIcon
                                    icon={faVolleyball}
                                />
                                <h3>Volley</h3>
                                
                            </div>
                            <div className="sport">
                                <FontAwesomeIcon
                                    icon={faPingPongPaddleBall}
                                />
                                <h3>Ping Pong</h3>
                                
                            </div>
                        </div>
                        
                        <input value="Create Club" className="btn solid" onClick={async () => await createClub()} />
                        <p className="social-text">Or Sign in with social platforms</p>
                        <div className="social-media">
                        <a href="#" className="social-icon">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" className="social-icon">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="#" className="social-icon">
                            <i className="fab fa-google"></i>
                        </a>
                        <a href="#" className="social-icon">
                            <i className="fab fa-linkedin-in"></i>
                        </a>
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