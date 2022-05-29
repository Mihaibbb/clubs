import Header from "./Header";
import "./Home.css";
import logo from "../img/logo.png";
import Sidebar from "../Sidebar/Sidebar";
import Footer from "./Footer";
import Searchbar from "./Searchbar";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="home-container">
            <Header marginTop={4}/>
            <Sidebar />
            {localStorage.getItem("logged") && <Searchbar />}
            <div className="banner">
                <h2>Chat and play together with UniClub</h2>      
            </div>

            <div className='some-page-wrapper'>
                <div className='row'>
                    <div className='column'>
                         <div className="stangatitlu">
                            <h1>TODAY...</h1> <br></br>
                        </div>
                        <div className="text">
                            <p><b>More than 1 in 3 people is obese.</b> Sport and healthy nutrition is the only way to combat the numbers. Flow is characterised by complete immersion in an activity, to the degree that nothing else matters.
The attainment of flow is a situation in which there is a perfect match between the athletes</p>
                
                         </div>
                    </div>
                    <div className='column'>
                    <Link to="/signin">
                        {!localStorage.getItem('logged') && <button className="button"><b> - GET STARTED -</b></button>}   
                    </Link> 
                    <div className="change">
                         <h2>Be the change!</h2> 
                    </div>
                    </div>
                    <div className='column'>
                        <div className="dreaptatitlu">
                             <h1>...BE TOMORROW</h1>
                        </div>
            <div className="text">
                <p><b>Be the tomorrow you want to live in</b>, not the tomorrow life
                     hands you. Be what’s possible. Not what’s practical. Tomorrow
                      transcends fashion and redefines performance.
                       Tomorrow is honest, innovative and timeless.
                        Tomorrow is a maker. Tomorrow is a creator. Tomorrow is a designer.</p>
                
            </div>
                    </div>
                </div>
            </div>
     <div className="whyuni">
            <div id="whyus" className="banner">
                <h2>Why Us?</h2>  
            </div>   
        <div className="row">
            <div className="text1">
                <p><b>With health issues at an all-time high,</b> it is essential to participate in physical activities, 
                    especially if you spend most of your day sitting at a desk
                    .We help you achieve that creating the flow by meeting with others with the same interests as you. </p>
                </div>

                <div className="text2">
                <p><b>UniClub is the leading service in</b> bringing athletes together, 
                    as well as amateurs in any sport, creating friendships in a healthy way.
                    We are succesfully doing that through a friendly interface and simple framework.</p>
            </div>    
        </div>  
      </div>
            <div id="howworks" className="banner">
                <h2>How it works?</h2>  
            </div> 
            <div className="text3">
                <p><b>UniClub is the leading service in</b> bringing athletes together, 
                    as well as amateurs in any sport, creating friendships in a healthy way.
                    We are succesfully doing that through a friendly interface and simple framework.</p>
            </div> 
            <Footer />
        </div>
    );
}