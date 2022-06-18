import { Link } from "react-router-dom";
import logo from "../img/uniclub.svg";
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
                <a href="#whyus">Why us?</a>
                <a href="#howworks">How it works?</a>
                </div>
                
                <div className="logo">
                    <Link to="/">
                        <h4>Designed by: </h4>
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