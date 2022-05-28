import Header from "../Components/Header";
import noprofil from "../img/noprofil.png";
import Sidebar from "../Sidebar/Sidebar";
import './Account.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBasketballBall, faCoffee, faSoccerBall, faTableTennis, faTableTennisPaddleBall, faUser, faVolleyball } from "@fortawesome/free-solid-svg-icons";


export default function Account() {

    return (
        <div className="account-container">
             <Header marginTop={4}/>
                <Sidebar />
                <h1 className="title"><b>Account</b></h1>
                <FontAwesomeIcon 
                    icon={faUser}
                    className="account-image"
                />
            <div className="card">
                <div className="fundal">
                    <div className="account-inputs">
                        <div className="account-input">
                            <label for="fname" >FirstName: </label>
                            <input type="text" id="fname" name="fname" /><br></br>
                        </div>

                        <div className="account-input">
                            <label for="fname" >LastName: </label>
                            <input type="text" id="lname" name="lname" /><br></br>
                        </div>

                        <div className="account-input">
                            <label for="fname" >Username: </label>
                            <input type="text" id="username" name="username" /><br></br>
                        </div>

                        <div className="account-input">
                            <label for="fname" >Email: </label>
                            <input type="text" id="email" name="email" /><br></br>
                        </div>
                    </div>
                    
                    
                    
                    <div id="outer">
                        <div class="inner"><button type="submit" class="msgBtn" onClick="return false;"  > <FontAwesomeIcon icon={faSoccerBall}/> Football</button></div>
                        <div class="inner"><button type="submit" class="msgBtn" onClick="return false;"> <FontAwesomeIcon icon={faBasketballBall} /> Basketball</button></div>
                        <div class="inner"><button type="submit" class="msgBtn" onClick="return false;" > <FontAwesomeIcon icon={faVolleyball} /> Voleyball</button></div>
                        <div class="inner"><button type="submit" class="msgBtn" onClick="return false;"> <FontAwesomeIcon icon={faTableTennisPaddleBall} /> Table-Tennis</button></div>
                        {/* <div class="inner"><button type="submit" class="msgBtn" onClick="return false;" ><FontAwesomeIcon icon={faTennis} /> Tennis</button></div> */}
                    </div>

                    <div class="inner"><button type="submit" class="msgBtn2" onClick="return false;" >Submit</button></div>
                    
                </div>
            </div>
        </div>
        
    );
}