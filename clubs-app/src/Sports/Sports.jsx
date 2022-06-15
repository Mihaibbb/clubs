import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBasketball, faPingPongPaddleBall, faPlus, faSoccerBall, faTimes, faVolleyball } from "@fortawesome/free-solid-svg-icons";

const SPORTS = {
    football: <FontAwesomeIcon icon={faSoccerBall} />,
    basketball: <FontAwesomeIcon icon={faBasketball} />,
    volley: <FontAwesomeIcon icon={faVolleyball} />,
    ping_pong: <FontAwesomeIcon icon={faPingPongPaddleBall} />
};
  
export default SPORTS;