import Header from "../Components/Header";
import noprofil from "../img/noprofil.png";
import Sidebar from "../Sidebar/Sidebar";
import './Account.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBasketballBall, faCoffee, faSoccerBall, faTableTennis, faTableTennisPaddleBall, faVolleyball } from "@fortawesome/free-solid-svg-icons";


export default function Account() {

    return (
        <div className="account-container">
             <Header marginTop={4}/>
                <Sidebar />
                    <h1><b>Account</b></h1>
                    <img src={noprofil} className="account-image" alt="" />
            <div className="card">
                <div className="fundal">
                
                <form action="/action_page.php">
                    <label for="fname" >FirstName:</label>
                    <input type="text" id="fname" name="fname" /><br></br>

                    <label for="fname" >LastName:</label>
                    <input type="text" id="fname" name="fname" /><br></br>

                    <label for="lname">Email:</label>
                    <input type="text" id="lname" name="lname"/><br></br>

                    <label for="fname" >Username:</label>
                    <input type="text" id="fname" name="fname" /><br></br>
                    
                    
                    <div id="outer">
                        <div class="inner"><button type="submit" class="msgBtn" onClick="return false;"  > <FontAwesomeIcon icon={faSoccerBall}/> Football</button></div>
                        <div class="inner"><button type="submit" class="msgBtn" onClick="return false;"> <FontAwesomeIcon icon={faBasketballBall} /> Basketball</button></div>
                        <div class="inner"><button type="submit" class="msgBtn" onClick="return false;" > <FontAwesomeIcon icon={faVolleyball} /> Voleyball</button></div>
                        <div class="inner"><button type="submit" class="msgBtn" onClick="return false;"> <FontAwesomeIcon icon={faTableTennisPaddleBall} /> Table-Tennis</button></div>
                        {/* <div class="inner"><button type="submit" class="msgBtn" onClick="return false;" ><FontAwesomeIcon icon={faTennis} /> Tennis</button></div> */}
                    </div>

                    <div class="inner"><button type="submit" class="msgBtn2" onClick="return false;" >Submit</button></div>
                    <div><FontAwesomeIcon icon={faCoffee} /></div>
                </form>
                </div>
            </div>
        </div>
        
    );
}