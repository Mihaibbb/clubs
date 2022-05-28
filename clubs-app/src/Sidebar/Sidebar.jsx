import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { SidebarData } from "./SidebarData";
import SubMenu from "./SubMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import "./Sidebar.css";

const Nav = styled.div`
  background: #15171c;
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
  background: #15171c;
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  transition: all 650ms ease-in-out;
  left: ${({ sidebar }) => (sidebar ? "0" : "-100%")};
  
  z-index: 10;
`;
  
const SidebarWrap = styled.div`
  width: 100%;
`;
  
const Sidebar = () => {
  
  const [sidebar, setSidebar] = useState(false);
  const [personalClubs, setPersonalClubs] = useState(null);
  const members = new Array();
  const showSidebar = () => setSidebar(!sidebar);
  const navigate = useNavigate();

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
      console.log(clubs);
      setPersonalClubs(await clubs.clubs);
      await clubs.length > 0 && await clubs.forEach(async club => await getMembers(club.id));
    })();
  }, []);

  const getMembers = async (clubId) => {
      const options = {
          method: 'POST',
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              clubId: clubId,
              email: localStorage.getItem("email")
          })
      };

      const resJSON = await fetch("http://localhost:8080/get-members", options);
      const res = await resJSON.json();
      members.push(await res.members);
      
  };
  
  return personalClubs && (
    <>
      <div>
        <Nav>
          <NavIcon to="#"  onClick={showSidebar}>
            <FontAwesomeIcon icon={faBars} className="icon" />
          </NavIcon>
        </Nav>
        <SidebarNav sidebar={sidebar} >
          <SidebarWrap>
            <NavIcon to="#">
              <FontAwesomeIcon icon={faTimes} className="icon" onClick={showSidebar} />
            </NavIcon>
            {personalClubs.map((item, index) => {
              return (
                <div className="group-container">
                  <div className=""></div>
                  <h3>{item.name}</h3>
                  <h4>{members[index]}</h4>
                </div>
              );
            })}
          </SidebarWrap>
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