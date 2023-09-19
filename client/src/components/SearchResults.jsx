import React from "react"
import { useLocation } from "react-router"
import { Link } from "react-router-dom";
import '../App.css'
import '../styles/home.css'


export default function SearchResults () {
    const location = useLocation();
    const searchResults = location.state?.results || [];





    return (
        <div className="container search-results-container">
            <h2>Search results</h2>
            <ul>
                {searchResults.map((user) => (
                    <li key={user._id}>
                        <Link to={`/profile/${user._id}`}> {user.firstName} {user.lastName}</Link>
                    </li>
                ))}

            </ul>
        </div>
    )
}