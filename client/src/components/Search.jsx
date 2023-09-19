import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router";


export default function Search() {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    async function handleSearch(e) {
        try {

            e.preventDefault();
            const response = await axios.get(`http://localhost:3000/profile/search?query=${encodeURIComponent(searchQuery)}`, {withCredentials: true})
            navigate(`/search`, { state: {results: response.data }});
        } catch (err) {
            console.error(err);
        }

    }

    return (
        <div className="searchbar">
            <form>
                <input name="searchQuery" placeholder="Search for user" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}></input>
                <button onClick={handleSearch}>Search</button>
            </form>
        </div>
    )
}