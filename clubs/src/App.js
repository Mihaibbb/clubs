import logo from './logo.svg';
import './App.css';
import {useState} from "react";

function App() {
  const [number, setNumber] = useState(0);

  return (
    <div className="App">
        <p>Hello world!</p>
    </div>
  );
}

export default App;
