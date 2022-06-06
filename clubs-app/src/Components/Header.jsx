import { Link, useLocation } from "react-router-dom";
import logo from "../img/logo.png";
import './Header.css';

export default function Header({marginTop}) {

    const logOut = () => {
        localStorage.clear();
        window.location.reload();
    };

    const location = useLocation();

    
    return (
        <div className="header" style={{marginTop: `${marginTop}px`}}>
            <div className="items">
                <div className="left-container">
                    {location.pathname === "/" ? (
                        <>
                            <a href="#whyus">Why us?</a>
                            <a href="#howworks">How it works?</a>
                        </>
                    ) : null}
                    <Link to="/clubs">
                        <li>Clubs</li>
                    </Link>
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
                            </Link>                           
                            <li onClick={() => logOut()}>Log Out</li>
                        </>
                        
                    ) : (
                        <Link to="/signin">
                            <li>
                                Sign in
                            </li>
                            <li></li>
                        </Link>
                    )}
                   
                </div>
            </div>
        </div>
    );
};