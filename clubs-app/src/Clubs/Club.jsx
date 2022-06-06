import { createRef } from "react";
import { faAngleDown, faPencil, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { useLocation } from "react-router-dom";
import Header from "../Components/Header";
import Sidebar from "../Sidebar/Sidebar";
import "./Club.css";

export default function Club({ socket }) {
    
    const params = useParams();

    const clubId = params.id;
    const club = localStorage.getItem("clubs") && JSON.parse(localStorage.getItem("clubs")).find(club => club.id === clubId);
    const clubName = club?.name;

    const [posts, setPosts] = useState(null);
    const [comments, setComments] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [groupUsers, setGroupUsers] = useState(null);
    const [limit, setLimit] = useState(10);
    const commentsRef = useRef([]);

    const navigate = useNavigate();
    const location = useLocation();

    if (params.id.length !== 8 || !localStorage.getItem("logged")) navigate("/");

    const checkIfAdmin = async () => {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: localStorage.getItem("id"),
                clubId: clubId
            })
        };

        const checkJSON = await fetch("http://localhost:8080/check-admin", options);
        const check = await checkJSON.json();
        setAdmin(await check.admin);
    };

    const getFeed = async () => {
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
                limit: limit
            })
        };

        resJSON = await fetch("http://localhost:8080/get-comments", options);
        const res = await resJSON.json();
        const elements = await res.comments;
        setComments(elements);
    };  

    const getGroupUsers = async () => {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                clubId: clubId,
            })
        };

        const resJSON = await fetch("http://localhost:8080/group-users", options);
        const res = await resJSON.json();
        const users = await res.users;
        console.log(await users);
        const yourUserRow = users.find(user => user.email === localStorage.getItem("email"));
        const idx = yourUserRow.id - 1;
        let newIdx = idx;
        while (newIdx !== 0 && !users[newIdx - 1].owner) {
            [users[newIdx], users[newIdx - 1]] = [users[newIdx - 1], users[newIdx]];
            newIdx--;
        }
        console.log(users);
        setGroupUsers(users);

    };

    const deletePost = async (postId) => {
       
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                clubId: clubId,
                postIdx: postId
            })
        };

        const resJSON = await fetch("http://localhost:8080/delete-post", options);
       
        const res = await resJSON.json();
        console.log(res);
        window.location.reload(); 
    };

    const deleteComment = async (postsNumber, postIdx, commentIdx) => {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                clubId: clubId,
                postIdx: postsNumber - postIdx,
                commentIdx: commentIdx
            })
        };

        await fetch("http://localhost:8080/delete-comment", options);
    };

    useEffect(() => {
        (async () => {
            await getFeed();
            await checkIfAdmin();
            await getGroupUsers();
        })();
    }, []);

    // Update feed
    useEffect(() => {
        socket.on("new_feed", async () => {
            console.log('new feed');
            await getFeed();
        });
    }, []);

    useEffect(() => {
        if (!posts) return;
        
        posts.forEach((post, idx) => {
           
        });
    }, [posts]);

   

    if (!clubName) navigate("/");


    return admin !== null && (
        <div>
            <Header />
            <div className="page-desc">
                <Sidebar />
            </div> 

            <h2 className="title">{clubName}</h2>

            <div className="posts-total">

                <div className="group-people">
                    <h2 className="title">Users</h2>
                    {groupUsers && groupUsers.map((user, idx) => (
                        <div className="user">
                            <h3>{user.username}</h3>
                        </div>
                    ))}
                </div>

                <div className="posts">
                    {posts && posts.map((post, idx) => (
                        <div key={idx}>
                        
                        <div className="post-container">
                            <div className="creator">
                                <p><span>Created by: </span> <b>{post.creator}</b></p>  
                            </div>
                            <h2>{post.title}</h2>
                            <div className="content">
                                <p>{post.content}</p>
                            </div>
                            <div className="comment-container" onClick={() => navigate("/add-comment", { state: { clubId: clubId, postIdx: post.id } })}>
                                <FontAwesomeIcon icon={faPencil}/>
                            </div>
                            {comments[idx].length > 0 && 
                                <div className="show-comments" onClick={() => {
                                    if (!commentsRef.current[idx]) return;
                                    commentsRef.current[idx].classList.toggle("active");
                                    
                                }}>
                                    <FontAwesomeIcon icon={faAngleDown} />
                                </div>
                            }

                            {admin && <div className="delete-post" onClick={async () => await deletePost(post.id)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </div>}
                            
                        </div>

                        <div className="comments" ref={ref => {
                            console.log(commentsRef);
                            commentsRef.current[idx] = ref;
                        }}>
                            { comments && comments[idx] && comments[idx].map((comment, commentIdx) => (
                                <div className="comment" key={commentIdx}>
                                    <div className="creator">
                                        <p>{comment.from}</p>
                                    </div>
                                    <h2>{comment.content}</h2>
                                </div>
                            ))}
                        </div>
                    
                        </div>
                    ))}
                    {posts && <div className="show-more">
                        <h3>Show {limit * 2} MORE</h3>
                    </div>}
                </div>
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