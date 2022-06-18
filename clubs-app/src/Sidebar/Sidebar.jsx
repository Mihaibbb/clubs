import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBasketball, faPingPongPaddleBall, faPlus, faSoccerBall, faTimes, faVolleyball } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import SPORTS from "../Sports/Sports";
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
  left: ${({ sidebar }) => (sidebar ? "0" : "-100%")};

  transition: left 650ms ease-in-out;
  
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


  
const Sidebar = (socketId) => {
  
  const [sidebar, setSidebar] = useState(false);
  const [personalClubs, setPersonalClubs] = useState(null);
  const [members, setMembers] = useState([]);
  let started = false;
  const showSidebar = () => setSidebar(sideBar => !sideBar);
  const navigate = useNavigate();
  
  const getMembers = async (clubId) => {
    console.log(clubId);
      const options = {
          method: 'POST',
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              clubId: clubId,
          })
      };

      try {

        const resJSON = await fetch("http://localhost:8080/people-in-club", options);
        const res = await resJSON.json();
        console.log(await res.people, await res.id);
        console.log(res, res.people, members);
        if (!res || !res.people) return;
          
        setMembers(currMembers => {
          console.log(currMembers);
          
          return [...currMembers, {people: res.people, id: res.id}];
        });
      } catch(e) {
        console.log(e);
      }

  };

  useEffect(() => {
    (async () => {
      if (!localStorage.getItem("logged") || started) return;
      started = true;
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
      const currClubs = [];
      const realClubs = clubs.clubs.filter(club => {
        const found = currClubs.some(currClub => currClub === club.id);
        currClubs.push(club.id);
        return !found;
      });
      
      setPersonalClubs(realClubs);
      console.log(realClubs);
      realClubs.forEach(async club => {
        console.log("club here");
        console.log(club)
        await getMembers(club.id);
        
      });

      localStorage.setItem("clubs", JSON.stringify(realClubs));
    })();
  }, []);

  useEffect(() => {
    const newMembers = members && members.filter((member, idx) => members.indexOf(member) === idx);
    console.log(newMembers, members);
  }, [members]);

  
  return personalClubs && members &&  (
    <>
      <div>
        <Nav>
          <NavIcon to="#" onClick={showSidebar}>
            <FontAwesomeIcon icon={faBars} className="icon" />
          </NavIcon>
        </Nav>
        <SidebarNav sidebar={sidebar} >
          <SidebarWrapper>
            <NavIcon to="#" onClick={showSidebar}>
              <FontAwesomeIcon icon={faTimes} className="icon" />
            </NavIcon>
            <div className="sidebar-groups">
              {personalClubs.map((item, index) => {
                return (
                  <div className="group-container" key={index} onClick={() => navigate(`/clubs/${item.id}`)}>
                    <div className="icon">
                      {SPORTS[item.sport]}
                    </div>
                    <h3>{item.name}</h3>
                    <h4>{members[index]?.people}</h4>
                  </div>
                );
              })}
            </div>
          </SidebarWrapper>
          <div
            className="icon add-container"
          >
            <h2 onClick={() => navigate("/add-club", { state: { socketId: socketId } })}>Create Club</h2>
          </div>
        </SidebarNav>

      </div>
    </>
  );
};
  
export default Sidebar;