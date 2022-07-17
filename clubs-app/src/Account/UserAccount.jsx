import { useNavigate, useParams } from "react-router-dom";
import "./Account.css";
import Header from "../Components/Header";
import { useEffect } from "react";
import { useState } from "react";

export default function UserAccount({socket, socketId}) {
    const { username } = useParams();
    const navigate = useNavigate();

    const [isFriend, setIsFriend] = useState();
    const [userData, setUserData] = useState();

    const accountExists = async () => {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username
            })
        };
        
        const fetchResponse = await fetch("http://localhost:8080/user-exists", options);
        const response = await fetchResponse.json();
        const result = await response.result;
        console.log(await result);
        return await result;
    };

    const getAccountData = async () => {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username
            })
        };
        
        const fetchResponse = await fetch("http://localhost:8080/user-data", options);
        const response = await fetchResponse.json();
        setUserData(await response);
    };

    useEffect(() => {
        (async () => {
            const exist = await accountExists();
            if (!await exist) navigate(-1);
            await getAccountData();
        })();
    }, []);
    
    return (
        <div>
            <Header />
            <div className="container sign-up-mode">
                <div className="text11" >
                    <h1>Those are your account details!</h1>

                    <h3>You can easily update them!</h3>
                </div> 
                <div className="account-details">
                    
                </div>
            </div>
        </div>
    );
};