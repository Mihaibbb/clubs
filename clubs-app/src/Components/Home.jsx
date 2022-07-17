import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import Header from "./Header";
import "./Home.css";
import logo from "../img/Logo.svg";
import Sidebar from "../Sidebar/Sidebar";
import Footer from "./Footer";
import Searchbar from "../SearchBar/Searchbar";
import { Link } from "react-router-dom";
import backgroundImg from "../img/background.jpg";
import airclub from "../img/airclub.svg";
import pinsSvg from '../img/pins.svg';
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp, faLayerGroup, faLink } from "@fortawesome/free-solid-svg-icons";

function Home({socket, socketId}) {

    const mapStyles = {
        width: "100%",
        height: "calc(100vh - 120px)",
        borderRadius: "20px"
    };

    // const { isLoaded } = useJsApiLoader({
    //     id: 'google-map-script',
    //     googleMapsApiKey: "AIzaSyBJd1Qxyx5LNgsVVmxQbLfn1gdiVOoMic8"
    // })
  
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [map, setMap] = useState(null);

    const featuresRef = useRef();
    const friendsRef = useRef();
    const clubsRef = useRef();


    useEffect(() => {
        (async () => {
            await getLocation();
        })();
    }, []);



    const getLocation = async () => {
        if (!navigator.geolocation) return;
        
        navigator.geolocation.getCurrentPosition(pos => {
            console.log(pos.coords);
            const coords = pos.coords;
            console.log(coords.latitude, coords.longitude);
            setLatitude(coords.latitude);
            setLongitude(coords.longitude);
        }, (err) => {
            console.error(err);
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    };


    const onLoad = useCallback(function callback(map) {
    
        const bounds = new window.google.maps.LatLngBounds({lat: latitude, lng: longitude});
        map.fitBounds(bounds);
        setMap(map);
    }, [])
  
    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    const isInVerticalViewport = (item) => {
        const bounding = item.getBoundingClientRect();
        const elementHeight = item.offsetHeight;
        
        if (bounding.top >= -elementHeight && bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) + elementHeight) return true;
        return false;
    };

    // Events

    window.addEventListener("scroll", () => {
        if (!featuresRef.current) return;
        if (isInVerticalViewport(featuresRef.current)) featuresRef.current.classList.add("animation"); 
        else featuresRef.current.classList.remove("animation"); 
        
        if (!friendsRef.current) return;
        if (isInVerticalViewport(friendsRef.current)) friendsRef.current.classList.add("animation"); 
        else friendsRef.current.classList.remove("animation"); 

        if (!clubsRef.current) return;
        if (isInVerticalViewport(clubsRef.current)) clubsRef.current.classList.add("animation"); 
        else clubsRef.current.classList.remove("animation"); 
    });

    return (
        <div className="home-container">
            <Header socket={socket} socketId={socketId} />            
            
            <div className="row maps-row">
                <div className="banner">
                    <Searchbar />

                    <h2>Elevate your clubs <br />
                        <span className="gradient-text">with UniClub.</span>
                    </h2>      
                    <p>Meet with friends all over the world that have a passion for sport. Join someone's club or create your own one.</p>
                </div>
                {/* <GoogleMap
                    mapContainerStyle={mapStyles}
                    center={{lat: latitude, lng: longitude}}
                    zoom={2.75}
                    options={{
                        styles: [
                          { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                          { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                          { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                          {
                            featureType: "administrative.locality",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#d59563" }]
                          },
                          {
                            featureType: "poi",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#d59563" }]
                          },
                          {
                            featureType: "poi.park",
                            elementType: "geometry",
                            stylers: [{ color: "#263c3f" }]
                          },
                          {
                            featureType: "poi.park",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#6b9a76" }]
                          },
                          {
                            featureType: "road",
                            elementType: "geometry",
                            stylers: [{ color: "#38414e" }]
                          },
                          {
                            featureType: "road",
                            elementType: "geometry.stroke",
                            stylers: [{ color: "#212a37" }]
                          },
                          {
                            featureType: "road",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#9ca5b3" }]
                          },
                          {
                            featureType: "road.highway",
                            elementType: "geometry",
                            stylers: [{ color: "#746855" }]
                          },
                          {
                            featureType: "road.highway",
                            elementType: "geometry.stroke",
                            stylers: [{ color: "#1f2835" }]
                          },
                          {
                            featureType: "road.highway",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#f3d19c" }]
                          },
                          {
                            featureType: "transit",
                            elementType: "geometry",
                            stylers: [{ color: "#2f3948" }]
                          },
                          {
                            featureType: "transit.station",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#d59563" }]
                          },
                          {
                            featureType: "water",
                            elementType: "geometry",
                            stylers: [{ color: "#17263c" }]
                          },
                          {
                            featureType: "water",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#515c6d" }]
                          },
                          {
                            featureType: "water",
                            elementType: "labels.text.stroke",
                            stylers: [{ color: "#17263c" }]
                          }
                        ]
                      }}
                >
                    <Marker position={ { lat: 41.881832, lng: -87.623177 }}>
                        
                    </Marker>

    
                </GoogleMap> */}
                <img src={backgroundImg} width="100%" />
          
            </div>
         
            <div id="features" className="part part-one" ref={featuresRef}>
                <h2 className="part-title">Features</h2>
                <p className="part-desc">See for yourself why Uniclub is the proper platform for making new friendship in the sports zone. </p>
                <div className="part-container">
                    <div className="column">
                        <FontAwesomeIcon icon={faLayerGroup} className="column-icon" />
                        <h3>Creating / Joining Clubs</h3>
                        <p>Uniclub lets you discover clubs that you might want to be into, giving you recommandations based on location and the sports that you like to play.</p>
                    </div>
                    <div className="column">
                        <FontAwesomeIcon icon={faCloudArrowUp} className="column-icon" />
                        <h3>Posting / Commenting</h3>
                        <p>You can post whether if you want to play with someone or you want to show an image or video. Also, you can comment to someone's post.</p>
                    </div>
                    <div className="column">
                        <FontAwesomeIcon icon={faLink} className="column-icon"/>
                        <h3>Encouraging sport</h3>
                        <p>Uniclub encourages you to make sport by finding people to practice with, that way you are motivating eachother to persue, because practicing sport alone is more unmotivating.</p>
                    </div>
                </div>
            </div>

            <div id="friends" className="part part-two" ref={friendsRef}>
                <div className="column">
                    <h2 className="column-title">Make new friends</h2>
                    <p>Here you can make new friends that have a lot in common with you, as enjoying the same sports you do. Also, you can ask them if they want to play with you.</p>
                </div>

                <div className="column">
                    <img src={airclub} width="100%" />
                </div>
            </div>

            <div id="latest-news" className="part part-three" ref={clubsRef}>
               
                <div className="column">
                    <img src={pinsSvg} />
                </div>

                <div className="column">
                    <h2 className="column-title">Latest news with clubs</h2>
                    <p>You can be part of someone's club or create your own one, this way you'll know the latest news about the sport that you are interested in.</p>
                </div>
            </div>

            {/* <div className='some-page-wrapper'>
                    <div className='row'>
                        <div className='column'>
                            <div className="stangatitlu">
                                <h1 className="down-gradient">TODAY...</h1> <br></br>
                            </div>
                            <div className="text">
                                <p>
                                    <b>More than 1 in 3 people is obese.</b> 
                                    Sport and healthy nutrition is the only way to combat the numbers. Flow is characterised by complete immersion in an activity, to the degree that nothing else matters.
                                    he attainment of flow is a situation in which there is a perfect match between the athletes
                                </p>
                    
                            </div>
                        </div>
                        <div className='column'>
                            <Link to="/signin">
                                {!localStorage.getItem('logged') && <button className="button"><b> - GET STARTED -</b></button>}   
                            </Link> 
                            <div className="change">
                                <h2 className="inspirational-message">Be the change!</h2> 
                            </div>
                        </div>
                        <div className='column'>
                            <div className="dreaptatitlu">
                                <h1 className="up-gradient">...BE TOMORROW</h1>
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
                </div>   */}
           
            <Footer />
        </div>
    );
}

export default Home;