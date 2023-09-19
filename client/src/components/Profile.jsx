import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import ProfileService from "../services/profile.service"
import axios from "axios";
import { UserContext } from "./authFunctions";
import Friends from "./FriendsModal";

export default function Profile () {
    const {user, setUser} = useContext(UserContext);
    const [ profile, setProfile ] = useState([])
    const { id } = useParams();

    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    }

    async function handleFriend(e) {
        e.preventDefault();
        await ProfileService.sendFriend(user._id, id);
    }

    useEffect(() => {
        async function fetchProfile() {

            axios
      .get("http://localhost:3000/" + "profile/" + id, { withCredentials: true })
      .then((response) => {
        setProfile(response.data)
      })
      .catch((err) => console.error(err));

        }
        fetchProfile();
    }, [id])

    return (
        <div className="container">
            <div className="profile-header">
                <img alt="user" src="/img/profile.jpg"/>
                <h2>{profile?.firstName} {profile?.lastName}</h2>
                <p>Joined on {profile?.date?.split("T", 1)}</p>
            </div>
            <div className="profile-controls">
                <button onClick={toggleVisibility}>Friends</button> { profile?._id == user?._id ? <button>Edit profile</button> : <button onClick={handleFriend}>Add friend</button>}

            </div>
            {isVisible && <Friends/>}
            <div className="posts-container">

            </div>
        </div>
    )
}