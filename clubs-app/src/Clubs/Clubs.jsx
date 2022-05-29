import { faAngleDown, faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import Header from "../Components/Header";
import Sidebar from "../Sidebar/Sidebar";
import "./Clubs.css";

export default function Clubs() {
    
    const params = useParams();
    const navigate = useNavigate();
    const clubId = params.id;
    const clubName = localStorage.getItem("clubs") && JSON.parse(localStorage.getItem("clubs")).find(club => club.id === clubId).name;
    console.log(params.id);

    const [posts, setPosts] = useState(null);
    const [comments, setComments] = useState(null);
    const commentsRef = useRef();

    if (params.id.length !== 8 || !localStorage.getItem("logged")) navigate("/");

    useEffect(() => {
        (async () => {
            let options = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    clubId: clubId
                })
            };

            let resJSON = await fetch("http://localhost:8080/get-posts", options);
            let rows = await resJSON.json();
            setPosts(rows);

            options = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    clubId: clubId,
                })
            };

            resJSON = await fetch("http://localhost:8080/get-comments", options);
            const res = await resJSON.json();
            const elements = await res.comments;
            setComments(elements);
        })();
    }, []);

    useEffect(() => {
        console.log(comments);
    }, [comments])

    return clubName && (
        <div>
            <Header />
            <div className="page-desc">
                <Sidebar />
            </div> 

            <h2 className="title">{clubName} Club</h2>

            <div className="posts">
                {posts && posts.map((post, idx) => (
                    <>
                     
                    <div className="post-container" key={idx}>
                        <div className="creator">
                            <p><span>Created by: </span> <b>{post.creator}</b></p>  
                        </div>
                        <h2>{post.title}</h2>
                        <div className="content ">
                            <p>{post.content}</p>
                        </div>
                        <div className="comment-container" onClick={() => navigate("/add-comment", { state: { clubId: clubId, postIdx: posts.length - idx - 1 } })}>
                            <FontAwesomeIcon icon={faPencil}/>
                        </div>
                        <div className="show-comments" onClick={() => commentsRef?.current?.classList?.toggle("active")}>
                            <FontAwesomeIcon icon={faAngleDown} />
                        </div>
                        
                    </div>

                    <div className="comments"ref={commentsRef}>
                        {comments && comments[idx].map((comment, commentIdx) => (
                            <div className="comment" key={commentIdx}>
                                <div className="creator">
                                    <p>{comment.from}</p>
                                </div>
                                <h2>{comment.content}</h2>
                            </div>
                        ))}
                    </div>
                   
                    </>
                    ))}
                </div>

            <div>
                <FontAwesomeIcon 
                    icon={faPlus}
                    className="add-icon"
                    onClick={() => navigate("/add-post", { state: { clubId: clubId } })}
                />
            </div>

        </div>
    );
};