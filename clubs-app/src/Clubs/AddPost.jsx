import logo from "../img/logo.png"
import '../Signin Form/Signin.css';
import { useState, useRef } from "react";
import Header from "../Components/Header";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBasketball, faPingPongPaddleBall, faSoccerBall, faVolleyball } from "@fortawesome/free-solid-svg-icons";
import "./AddClub.css";

export default function AddPost({ socket }) {

    const [postName, setPostName] = useState("");
    const [postContent, setPostContent] = useState("");
    const [sport, setSport] = useState('football');
    const containerRef = useRef();
    const sportsRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();
    const { clubId } = location.state;

    const getClubId = () => {
        const length = 8;
        let result           = '';
        let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) 
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        return result;
    };
    
    const createPost = async () => {
        if (postName.length < 4) return;
        
        console.log(clubId);
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content: postContent,
                title: postName,
                username: localStorage.getItem("username"),
                clubId: clubId
            })
        };

        const resJSON = await fetch("http://localhost:8080/create-post", options);
        const res = await resJSON.json();
        if (res.error) {
            alert("ERROR!");
            return;
        }
        socket.emit("update_feed", clubId, localStorage.getItem("email"));
        navigate(-1);
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
                        <h2 className="title">Create a post</h2>
                        <div className="input-field">
                            <i className="fas fa-user"></i>
                            <input 
                                type="text" 
                                placeholder="Post title..." 
                                value={postName} 
                                onChange={e => setPostName(e.target.value)} 
                            />
                        </div>
                        
                        <textarea 
                            rows={7} 
                            placeholder="Content..."
                            value={postContent}
                            onChange={e => setPostContent(e.target.value)}
                        ></textarea>
            
                        <input value="Create Post" className="btn solid" onClick={async () => await createPost()} readOnly/>
                        
                    </div>
                    </div>
                </div>

                <div className="panels-container">
                    <div className="panel left-panel">
                    <div className="content">
                        <h3>Post content!</h3>
                        <p>
                        Post something that you teammates can see. Remember to keep a decent language!
                        Have fun!
                        </p>
                        
                    </div>
                    <img src={logo} className="image" alt="" />
                    </div>
                    
                </div>
            </div>
        </>
    );
};