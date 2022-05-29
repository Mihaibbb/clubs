import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { SidebarData } from "./SidebarData";
import SubMenu from "./SubMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBasketball, faPingPongPaddleBall, faPlus, faSoccerBall, faTimes, faVolleyball } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import "./Sidebar.css";

const Nav = styled.div`
  background: linear-gradient(135deg, var(--darkest-green), var(--lightest-green));
  height: 80px;
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin: 1rem;
`;
  
const NavIcon = styled(Link)`
 
  font-size: 2rem;
  height: 80px;
  width: 100%;
  max-width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  
`;
  
const SidebarNav = styled.nav`
  background: #15171C;
  width: 350px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  transition: all 350ms ease-in-out;
  left: ${({ sidebar }) => (sidebar ? "0" : "-100%")};
  
  z-index: 10;
`;
  
const SidebarWrap = styled.div`
  width: 100%;
`;

const SidebarWrapper = styled.div`
  
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 90vh;
  overflow: auto;
`;

const SPORTS = {
  football: <FontAwesomeIcon icon={faSoccerBall} />,
  basketball: <FontAwesomeIcon icon={faBasketball} />,
  volley: <FontAwesomeIcon icon={faVolleyball} />,
  ping_pong: <FontAwesomeIcon icon={faPingPongPaddleBall} />
};
  
const Sidebar = () => {
  
  const [sidebar, setSidebar] = useState(false);
  const [personalClubs, setPersonalClubs] = useState(null);
  const [members, setMembers] = useState([]);
  const showSidebar = () => setSidebar(!sidebar);
  const navigate = useNavigate();

  
  const getMembers = async (clubId) => {
    console.log('here');
      const options = {
          method: 'POST',
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              clubId: clubId,
          })
      };

      const resJSON = await fetch("http://localhost:8080/people-in-club", options);
      const res = await resJSON.json();
      console.log(await res.people);
      
      setMembers(currMembers => {
        console.log(currMembers);
        return [...currMembers, res.people];
    });
      
  };

  useEffect(() => {
    (async () => {
      if (!localStorage.getItem("logged")) return;

      const options = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: localStorage.getItem("id")
        })
      };

      const resJSON = await fetch("http://localhost:8080/get-clubs", options);
      const clubs = await resJSON.json();
      console.log("CLUUUUBS", clubs, clubs.clubs);
     
      setPersonalClubs(await clubs.clubs);
      clubs.clubs.forEach(async club => {
      console.log("ok ok")
      await getMembers(club.id);
      localStorage.setItem("clubs", JSON.stringify(clubs.clubs));
    });
    })();
  }, []);

  
  return personalClubs && (
    <>
      <div>
        <Nav>
          <NavIcon to="#"  onClick={showSidebar}>
            <FontAwesomeIcon icon={faBars} className="icon" />
          </NavIcon>
        </Nav>
        <SidebarNav sidebar={sidebar} >
          <SidebarWrapper>
            <NavIcon to="#" onClick={showSidebar}>
              <FontAwesomeIcon icon={faTimes} className="icon" />
            </NavIcon>
            {personalClubs.map((item, index) => {
              return (
                <div className="group-container" key={index} onClick={() => navigate(`/clubs/${item.id}`)}>
                  <div className="icon">
                    {SPORTS[item.sport]}
                  </div>
                  <h3>{item.name}</h3>
                  <h4>{members[index]}</h4>
                </div>
              );
            })}
          </SidebarWrapper>
          <div
            className="icon add-container"
          >
            <h2 onClick={() => navigate("/add-club")}>Create Group</h2>
          </div>
        </SidebarNav>

      </div>
    </>
  );
};
  
export default Sidebar;