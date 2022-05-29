import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
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

    if (params.id.length !== 8 || !localStorage.getItem("logged")) navigate("/");

    useEffect(() => {
        (async () => {
            const options = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    clubId: clubId
                })
            };

            const resJSON = await fetch("http://localhost:8080/get-posts", options);
            const rows = await resJSON.json();
            setPosts(rows);
        })();
    }, []);

    return clubName && (
        <div>
            <Header />
            <div className="page-desc">
                <Sidebar />
            </div> 

            <h2 className="title">{clubName} Club</h2>

            <div className="posts">
                {posts && posts.map((post, idx) => (
                    <div className="post-container">
                        <div className="creator">
                            <span>Created by: </span> <b>{post.creator}</b>  
                        </div>
                        <h2>{post.title}</h2>
                        <div className="content ">
                        <p>{post.content}</p>
                        </div>
                        
                    </div>
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