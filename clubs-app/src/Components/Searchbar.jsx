import { useState } from "react";
import "./Searchbar.css";
export default function Searchbar() {

    const [club, setClub] = useState("");

    const changeText = async e => {
        const currValue = e.target.value;
        setClub(currValue);

        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: currValue
            })
        };

        const resJSON = await fetch("http://localhost:8080/search-club", options);
        const rows = await resJSON.json();
        console.log(rows);
    };  

    return (
        <div className="search-bar">
            <input className="search-input" placeholder="Search clubs..." value={club} onChange={async e => await changeText(e)} />
            <div className="results">

            </div>
        </div>
    );
};