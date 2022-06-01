import logo from "../img/logo.png"
import '../Signin Form/Signin.css';
import { useState, useRef } from "react";
import Header from "../Components/Header";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBasketball, faPingPongPaddleBall, faSoccerBall, faVolleyball } from "@fortawesome/free-solid-svg-icons";
import "./AddClub.css";

export default function AddComment({ socket }) {

    const [commentName, setCommentName] = useState("");
    const [postContent, setPostContent] = useState("");
    const containerRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();
    const { clubId, postIdx } = location.state;
    
    const createComment = async () => {
        if (postContent.length < 3) return;
        
        console.log(clubId);
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content: postContent,
                username: localStorage.getItem("username"),
                clubId: clubId,
                postId: postIdx + 1,
                email: localStorage.getItem("email")
            })
        };

        const resJSON = await fetch("http://localhost:8080/create-comment", options);
        const res = await resJSON.json();
        console.log(clubId, postIdx);
        if (res.error) {
            alert(res.error);
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
                        <h2 className="title">Create a comment</h2>
                        {/* <div className="input-field">
                            <i className="fas fa-user"></i>
                            <input 
                                type="text" 
                                placeholder="Post title..." 
                                value={commentName} 
                                onChange={e => setCommentName(e.target.value)} 
                            />
                        </div> */}
                        
                        <textarea 
                            rows={7} 
                            placeholder="Content..."
                            value={postContent}
                            onChange={e => setPostContent(e.target.value)}
                        >

                        </textarea>

                        <input value="Create Comment" className="btn solid" onClick={async () => await createComment()} readOnly/>

                    </div>
                    </div>
                </div>

                <div className="panels-container">
                    <div className="panel left-panel">
                    <div className="content">
                        <h3>Write a comment on a post!</h3>
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