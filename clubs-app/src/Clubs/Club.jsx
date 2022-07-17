import { createRef } from "react";
import { faAngleDown, faAngleUp, faPencil, faPlus, faTimes, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { useLocation } from "react-router-dom";
import Header from "../Components/Header";
import Sidebar from "../Sidebar/Sidebar";
import "./Club.css";
import createPalette from "@mui/material/styles/createPalette";
import plusIcon from "../img/plus.svg";

export default function Club({ socket, socketId }) {
    
    const params = useParams();

    const clubId = params.id;
    const club = localStorage.getItem("clubs") && JSON.parse(localStorage.getItem("clubs")).find(club => club.id === clubId);
    
    const [userInClub, setUserInClub] = useState(null);
    const [posts, setPosts] = useState(null);
    const [clubName, setClubName] = useState(null);
    const [clubPrivacy, setClubPrivacy] = useState(null);
    const [sport, setSport] = useState(null);
    const [currentPosts, setCurrentPosts] = useState([]);
    const [comments, setComments] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [groupUsers, setGroupUsers] = useState(null);
    const [limit, setLimit] = useState(5);
    
    const commentsRef = useRef([]);
    const commentIconsRef = useRef([]);

    const navigate = useNavigate();
    const location = useLocation();

    if (params.id.length !== 8 || !localStorage.getItem("logged")) navigate("/");

    const checkUserInClub = async () => {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                clubId,
                id: localStorage.getItem("id")
            })
        };

        const res = await fetch("http://localhost:8080/check-user-in-club", options);
        const resJSON = await res.json();
        const result = await resJSON.result;
        return await result;
        
    };

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
                clubId: clubId
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
        setGroupUsers(users);
        if (!userInClub) return;

        const yourUserRow = users.find(user => user.email === localStorage.getItem("email"));
        const idx = yourUserRow.id - 1;
        let newIdx = idx;
        while (newIdx !== 0 && !users[newIdx - 1].owner) {
            [users[newIdx], users[newIdx - 1]] = [users[newIdx - 1], users[newIdx]];
            newIdx--;
        }
      

    };

    const joinClub = async () => {
        if (clubPrivacy) {
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

            const response = await fetch("http://localhost:8080/join-club", options);
            const resJSON = await response.json();
            const joined = await resJSON.joined;
            if (await joined) navigate(`/clubs/${clubId}`);
        } else {
            const options = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    clubId: clubId
                })
            };

            try {
                const response = await fetch("http://localhost:8080/get-admin", options);
                const adminResponse = await response.json();
                const clubAdmin = await adminResponse.admin;
                const clubAdminSocket = await adminResponse.socket;
                
                if (!await clubAdmin) return;
                
                const notification = {
                    from: localStorage.getItem('username'),
                    to: clubAdmin,
                    message: `${localStorage.getItem('username')} requested to join you club!`,
                    type: "join",
                    clubId: clubId,
                    id: localStorage.getItem("id")
                };
                
                const pushOptions = {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(notification)
                };

                socket.emit("push-notification", notification.from, await clubAdminSocket, notification.message, notification.type);

                try {
                    const noitificationFetch = await fetch("http://localhost:8080/push-notification", pushOptions);
                    const notificationResponse = await noitificationFetch.json();
                    if (!await notificationResponse.result) return;    
                } catch (e) {
                    console.log(e);
                }

            } catch (e) {
                console.log(e);
            }

        }
        
    };

    const getClubData = async () => {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                clubId,
            })
        };

        const res = await fetch("http://localhost:8080/get-club-data", options);
        const resJSON = await res.json();
        const cName = await resJSON.name;
        const cSport = await resJSON.sport;
        
        setClubPrivacy(await resJSON.public);
        setClubName(cName);
        setSport(cSport);
        
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

    const deleteComment = async (postIdx, commentIdx) => {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                clubId: clubId,
                postIdx: postIdx,
                commentIdx: commentIdx
            })
        };

        const resJSON = await fetch("http://localhost:8080/delete-comment", options);
        const res = await resJSON.json();
        if (res.deleted) window.location.reload();
       
    };

    const showMorePosts = async () => {
        let options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                clubId: clubId,
                limit: currentPosts.length + limit
            })
        };

        let resJSON = await fetch("http://localhost:8080/get-posts-limit", options);
        let rows = await resJSON.json();
        setCurrentPosts(rows);

        console.log(posts.length, rows.length, limit);
        if (posts.length - rows.length >= limit * 2) setLimit(limit * 2);
        else if (posts.length - rows.length <= 0) setLimit(null);
        else setLimit(posts.length - rows.length);        
    };

    useEffect(() => {
        (async () => {
            const check = await checkUserInClub();
            setUserInClub(await check);
        })();
    }, []);

    useEffect(() => {
        
        (async () => {
           
            await getClubData();
            await getGroupUsers();
            if (!userInClub) return;
            await getFeed();
            await checkIfAdmin();

        })();
    }, [userInClub]);

    useEffect(() => {
        (async () => {
            if (posts && limit) await showMorePosts();
        })();
    }, [posts]);

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

    // if (!clubName) navigate("/");


    return groupUsers &&(
        <div>
            <Header socket={socket} socketId={socketId} />
          
            <div className="page-desc">
                <Sidebar socketId={socketId} />
            </div> 

            
            <div className="club-banner">
                <h2 className="title">{clubName}</h2>
                <div className="club-people">
                    <FontAwesomeIcon icon={groupUsers.length === 1 ? faUser : faUsers} />
                    <h3>{groupUsers.length}</h3>
                </div>

                <div className="club-icon">
                    {/*    */}
                </div>
            </div>

            {admin !== null ? <div className="posts-total">

                <div className="group-people">
                    <h2 className="title">Users</h2>
                    {groupUsers && groupUsers.map((user, idx) => (
                        <div className="user">
                            <h3>{user.username}</h3>
                        </div>
                    ))}
                </div>

                <div className="posts">
                    {currentPosts && currentPosts.map((post, idx) => (
                        <div key={idx}>
                        
                        <div className="post-container">
                            <div className="creator">
                                <FontAwesomeIcon icon={faUser} />
                                {post.creator}
                            </div>
                            <h2>{post.title}</h2>
                            <div className="content">
                                <p>{post.content}</p>
                            </div>
                            <div className="comment-container" onClick={() => navigate("/add-comment", { state: { clubId: clubId, postIdx: post.id } })}>
                                <FontAwesomeIcon icon={faPencil}/>
                            </div>
                            {comments[idx].length > 0 && 
                                <div className="show-comments" ref={ref => commentIconsRef.current[idx] = ref} onClick={() => {
                                    if (!commentsRef.current[idx]) return;
                                    commentsRef.current[idx].classList.toggle("active");
                                    commentIconsRef.current[idx].classList.toggle("active");
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
                                        <FontAwesomeIcon icon={groupUsers.length === 1 ? faUser : faUsers} />
                                        <h3>{comment.from}</h3>
                                    </div>
                                    <h2>{comment.content}</h2>
                                    {admin && 
                                        <div className="delete-comment" onClick={async () => await deleteComment(post.id, commentIdx)}>
                                            <FontAwesomeIcon icon={faTimes} />
                                        </div>
                                    }
                                </div>
                            ))}
                        </div>
                    
                        </div>
                    ))}
                    {posts && currentPosts && limit && posts.length > 0 && posts.length - currentPosts.length >= limit && <div className="show-more" onClick={() => showMorePosts()}>
                        <h3>Show {limit} MORE</h3>
                    </div>}
                </div>
            </div> : (
                <div className="join-container">
                    <h2>Would you like to join this club? </h2>
                    <button type="button" onClick={async () => await joinClub()} >{!clubPrivacy ? "Request now!" : "Join now!"}</button>
                </div>
            )}

            {admin !== null && <div className="add-icon">
                <img src={plusIcon} onClick={() => navigate("/add-post", { state: { clubId: clubId } })} />
            </div>}
        </div>
    );
};