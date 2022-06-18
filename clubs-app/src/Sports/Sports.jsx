import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBaseball, faBaseballBall, faTennisBall, faBaseballBatBall, faBasketball, faBicycle, faFootball, faFutbol, faFutbolBall, faGolfBall, faPersonSwimming, faPingPongPaddleBall, faPlus, faSoccerBall, faTimes, faVolleyball, faDumbbell, faWater } from "@fortawesome/free-solid-svg-icons";
import { FormControl } from "@mui/material";

const SPORTS = {
    football: <FontAwesomeIcon icon={faFutbolBall} />,
    basketball: <FontAwesomeIcon icon={faBasketball} />,
    volley: <FontAwesomeIcon icon={faVolleyball} />,
    ping_pong: <FontAwesomeIcon icon={faPingPongPaddleBall} />,
    tennis: <FontAwesomeIcon icon="fa-solid fa-tennis" />,
    american_football: <FontAwesomeIcon icon={faFootball} />,
    swimming: <FontAwesomeIcon icon={faPersonSwimming} />,
    baseball: <FontAwesomeIcon icon={faBaseballBatBall} />,
    cyclism: <FontAwesomeIcon icon={faBicycle} />,
    golf: <FontAwesomeIcon icon={faGolfBall} />,
    water_polo: <FontAwesomeIcon icon={faWater} />,
    weight_lifting: <FontAwesomeIcon icon={faDumbbell} />
};
  
export default SPORTS;