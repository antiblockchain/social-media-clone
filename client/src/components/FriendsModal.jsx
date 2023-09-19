import React, { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "./authFunctions";
import { useQuery } from "@tanstack/react-query";
import profileService from "../services/profile.service";
import axios from "axios";

export default function Friends () {

    const {user, setUser} = useContext(UserContext);
    const { id } = useParams();


    async function fetchFriends() {
        const response = await axios.get(`http://localhost:3000/profile/friends/${id}`, { withCredentials: true });
        return Array.from(response.data);
    }


const {
    status,
    error,
    data: friends,
} = useQuery({
    queryKey: ["friends"],
    queryFn: fetchFriends,
    refetchInterval: 5000,
})

if (status === "loading") return <h1>Loading...</h1>
if (status === "error") return <h1>{JSON.stringify(error)}</h1>

let friendsList = <li><p>No friends found.</p></li>
 if (friends.length > 0) {
    friendsList = friends.map((friend) => {
    return <li className="friends-list" key={friend._id}>
        <Link to={`/profile/${friend._id}`}>{friend.firstName} {friend.lastName}</Link>
</li>
    }
    );
}


    return (
        <div className="friends-list">
            <ul>
                {friendsList}
            </ul>


        </div>
    )
}
