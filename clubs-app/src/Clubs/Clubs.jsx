import { useParams } from "react-router";
import Header from "../Components/Header";
import Sidebar from "../Sidebar/Sidebar";

export default function Clubs() {
    
    const params = useParams();
    console.log(params.id);
    if (params.id.length !== 8 || !localStorage.getItem("logged")) return;
    
    return (
        <div>
            <Header />
            <div className="page-desc">
                <Sidebar />
                
            </div> 
        </div>
    );
};