import noprofil from "../img/noprofil.png"
import './Account.css';
import { useState, useRef } from "react";
import Header from "../Components/Header";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router";

export default function Account() {

  const containerRef = useRef();
 
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [useranme, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();    
    

  return (
    <> 
      <Header marginTop={0}/>
      <Helmet>
        <script
          src="https://kit.fontawesome.com/64d58efce2.js"
          crossorigin="anonymous"
          async
        ></script>
      </Helmet>
      <div className="container sign-up-mode" ref={containerRef}>
      <div className="forms-container">
        <div className="signin-signup">
          <div className="form sign-up-form">
          <div className="poza"> <img src={noprofil} /> </div>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
            </div>

            <div className="input-field">
              <i className="fas fa-user"></i>
              <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
            </div>

            <div className="input-field">
              <i className="fas fa-user"></i>
              <input type="text" placeholder="Username" value={usernameUp} onChange={e => setUsernameUp(e.target.value)}/>
            </div>

            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input type="email" placeholder="Email" value={emailUp} onChange={e => setEmailUp(e.target.value)} />
            </div>

            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input type="password" placeholder="Password" value={passwordUp} onChange={e => setPasswordUp(e.target.value)}/>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

