import Header from "./Header";
import "./Home.css";
import logo from "../img/logo.png";
import Sidebar from "../Sidebar/Sidebar";

export default function Home() {
    return (
        <div className="home-container">
            <Header marginTop={4}/>
            <div className="page-desc">
                <Sidebar />
                
            </div>
            <div className="banner">
                <h2>Chat and play together with UniClub</h2>      
            </div>
            
           
        </div>
    );
}