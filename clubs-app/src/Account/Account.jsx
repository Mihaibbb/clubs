import noprofil from "../img/noprofil.png"
import './Account.css';
import { useState, useRef } from "react";
import Header from "../Components/Header";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router";

export default function Account() {

  const containerRef = useRef();
 
  const [firstName, setFirstName] = useState(localStorage.getItem("first-name"));
  const [lastName, setLastName] = useState(localStorage.getItem("last-name"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [email, setEmail] = useState(localStorage.getItem("email"));
    
  const updateAccount = async () => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            username: username,
            email: email,
            id: localStorage.getItem("id")
        })
    };

    await fetch("http://localhost:8080/update-account", options);
    localStorage.setItem("first-name", firstName);
    localStorage.setItem("last-name", lastName);
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
};

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
              <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}/>
            </div>

            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <input type="submit" value="Update account" className="solid btn" onClick={async () => await updateAccount()} />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

