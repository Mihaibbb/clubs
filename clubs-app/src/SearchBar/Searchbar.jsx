import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import "./Searchbar.css";
import searchIcon from "../img/search.svg";
import { Navigate, useNavigate } from "react-router-dom";

export default function Searchbar({ initialValue }) {

    const [search, setSearch] = useState(initialValue);
    const navigation = useNavigate();

    const goToSearch = () => {
        if (!search || search.length === 0) return;
        navigation(`/search/${search}`);
    };

    return (
        <div className="search-bar-container">
            <input type="text" onKeyDown={e => e.key === "Enter" ? goToSearch() : null} placeholder="Search users or clubs..." value={search} onChange={e => setSearch(e.target.value)} />
            <div className="search-icon">
                <img src={searchIcon} onClick={() => goToSearch()} />
            </div>
        </div>
    );
};