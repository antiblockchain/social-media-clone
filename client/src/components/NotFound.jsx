import React from "react";
import { Link } from "react-router-dom";


export default function NotFound () {

    return (
        <div className="container notfound-container">
            <h1>Sorry, <h2>the page you are looking for was not found.</h2></h1>
            <p>Maybe you clicked the wrong link, or it has not been implemented yet.</p>
            <Link to="/">Go back home?</Link>
        </div>
    )
}