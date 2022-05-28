import { Link } from "react-router-dom";
import logo from "../img/logo.png";
import './Footer.css';

export default function Footer() {

    const logOut = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <div className="footer">
            <div className="items">
                <div className="left-container">
                    <li>Why UniClub?</li>
                    <li>How it works?</li>
                </div>
                
                <div className="logo">
                    <Link to="/">
                        <h4>Designed by: <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">UniClub.com</a></h4>
                    </Link>
                    <img src={logo} width={50}/>
                </div>

                <div className="right-container">
                    {localStorage.getItem("logged") ? (
                        <>
                            <Link to="/account">
                                <li>Account</li>
                            </Link>                           
                            <li onClick={() => logOut()}>Log Out</li>
                        </>
                        
                    ) : (
                        <Link to="/signin">
                            <li>
                                Sign up
                            </li>
                            <li></li>
                        </Link>
                    )}
                   
                </div>
            </div>
        </div>
    );
};