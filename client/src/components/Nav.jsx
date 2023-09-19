import React, { useContext } from "react"
import { Link, useNavigate } from "react-router-dom";
import Auth from '../services/auth.service'
import { UserContext } from "./authFunctions";
import '../App.css'

export default function Nav () {
    const {user, setUser} = useContext(UserContext);
    const navigate = useNavigate();

    async function signOut (e) {
        e.preventDefault();
        await Auth.logout();
        await setUser(null);
        navigate("/login");
        
        

    }
    let authElement = "";
    if (user !== null) {
        authElement = <li><button onClick={signOut}>Sign Out</button></li>;
    } else {
        authElement = <><li><Link to="/sign-up">Signup</Link></li><li><Link to="/login">Login</Link></li></>
    }
    return (
        <div className="nav-container">
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    {authElement}

                </ul>
            </nav>
        </div>
    )
}