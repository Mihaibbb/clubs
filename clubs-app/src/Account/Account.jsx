import Header from "../Components/Header";
import logo from "../img/logo.png";
import Sidebar from "../Dreapta/Sidebar";

export default function Home() {
    return (
        <div className="home-container">
            <Header marginTop={4}/>
            <div className="page-desc">
                <Sidebar />
            </div>
           
        </div>
    );
}