import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./authFunctions";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Requests from "./Requests";

export default function Left () {



    const {user, setUser} = useContext(UserContext);






    return (
        <div className="left-sidebar">
            <div className="user-info">
                <ul>
                    <li>
                        <img alt="John Doe" src="/img/profile.jpg" />
                        <Link to={"/profile/" + user?._id}>{user?.firstName} {user?.lastName}</Link>
                    </li>
                    <li>
                        <Link to={"/profile/" + user?._id + "/friends"}>Friends</Link>
                    </li>

                </ul>
            </div>
            <Requests />
            <p>Shortcuts</p>
            <div className="user-shortcuts">
                <ul>
                <li>
                        <Link to="/store">Store</Link>
                    </li>
                    <li>
                        <Link to="/chat">Chat</Link>
                    </li>
                </ul>
            </div>

        </div>
    )
}
