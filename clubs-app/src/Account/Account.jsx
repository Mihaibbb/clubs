import noprofil from "../img/noprofil.png"
import './Account.css';
import { useState, useRef } from "react";
import Header from "../Components/Header";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router";

export default function Account() {

  const containerRef = useRef();
  const [emailIn, setEmailIn] = useState("");
  const [passwordIn, setPasswordIn] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [usernameUp, setUsernameUp] = useState("");
  const [emailUp, setEmailUp] = useState("");
  const [passwordUp, setPasswordUp] = useState("");

  const navigate = useNavigate();    
    
  const signUpForm = async () => {
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: emailUp,
        password: passwordUp,
        firstName: firstName,
        lastName: lastName,
        username: usernameUp,
        socket_id: "012032-4023"
      })
    };

    const resJSON = await fetch("http://localhost:8080/signup", options);
    const res = await resJSON.json();

    if (res.error) {
      return;
    }

    localStorage.setItem("id", await res.id);
    localStorage.setItem("logged", true);
    localStorage.setItem("email", emailUp);
    localStorage.setItem("first-name", firstName);
    localStorage.setItem("last-name", lastName);
    localStorage.setItem("username", usernameUp);
    alert("User registered!");
    navigate("/");
   
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
      <div className="text11" >
         <h1>Those are your account details!</h1>

         <h3>You can easily update them!
         </h3>
        </div> 
        <div className="signin-signup">
          <div className="form sign-up-form">
          
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
        <div className="panel right-panel">
          <div className="content">
            <h3>One of us ?</h3>
            <p>
            We are glad to have you back on our platform to optimize your lifestyle. Welcome back!
            </p>
            <button className="btn transparent" id="sign-in-btn" onClick={() => containerRef.current.classList.remove('sign-up-mode')}>
              Sign in
            </button>
          </div>
    </div>
  </div>
    </>
  );
};

