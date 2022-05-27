import { Link } from "react-router-dom";
import './Header.css';

export default function Header() {
    return (
        <div className="header">
            <div className="items">
                <div className="left-container">
                    <li>Why UniClub?</li>
                    <li>How it works?</li>
                </div>
                
                <div className="logo">
                    <h1>UniClub</h1>
                </div>

                <div className="right-container">
                    <Link to="/signup">
                        <li>Sign up</li>
                        <li></li>
                    </Link>
                </div>
            </div>
        </div>
    );
};