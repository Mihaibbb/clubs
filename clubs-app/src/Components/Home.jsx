import Header from "./Header";
import "./Home.css";
import logo from "../img/logo.png";
import Sidebar from "../Sidebar/Sidebar";
import Footer from "./Footer";

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

            <div className='some-page-wrapper'>
                <div className='row'>
                    <div className='column'>
                         <div className="stangatitlu">
                            <h1>TODAY...</h1>
                        </div>
                        <div className="text">
                            <p><b>More than 1 in 3 people is obese.</b> Sport and healthy nutrition is the only way to combat the numbers. Flow is characterised by complete immersion in an activity, to the degree that nothing else matters.
Central to the attainment of flow is a situation in which there is a perfect match between the athletes</p>
                
                         </div>
                    </div>
                    <div className='column'>
                    <div className="change">
                         <h2>Be the change!</h2> 
                    </div>
                    <a href="./signin">
                        <button className="button"><b> - GET STARTED -</b></button>   
                    </a> 
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
            
            <div className="banner">
                <h2>Why UniClub?</h2>      
            </div>
            
            </div>
            <Footer />
        </div>
    );
}