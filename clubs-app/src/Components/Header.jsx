import { Link } from "react-router-dom";
import logo from "../img/logo.png";
import './Header.css';

export default function Header({marginTop}) {

    const logOut = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <div className="header" style={{marginTop: `${marginTop}px`}}>
            <div className="items">
                <div className="left-container">
                    <li>Why UniClub?</li>
                    <li>How it works?</li>
                </div>
                
                <div className="logo">
                    <Link to="/">
                        <h1>UniClub</h1>
                    </Link>
                    <img src={logo} width={50}/>
                </div>

                <div className="right-container">
                    {localStorage.getItem("logged") ? (
                        <>
                        <Link to="/account">
                        <li>Account</li>
                            <li onClick={() => logOut()}>Log Out</li>
                        </Link>
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