import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import Requests from "./Requests";

export default function Right () {

    async function fetchFriendRequests() {
        const response = await axios.get("http://localhost:3000/post", { withCredentials: true });
        return Array.from(response.data);
    }



async function handleRequest(e) {
    e.preventDefault();

}


const {
    status,
    error,
    data: friends,
} = useQuery({
    queryKey: ["friends"],
    queryFn: fetchFriendRequests,
    refetchInterval: 20000,
});

if (status === "loading") return <h1>Loading...</h1>
if (status === "error") return <h1>{JSON.stringify(error)}</h1>






    return (
        <div className="right-sidebar">
            <Requests />
            <div className="post-suggestions">
                Suggested for you
                <ul>
                <li>
                        <Link to="/post/:id">Cool post</Link>
                        <p>cool description</p>
                    </li>
                    <li>
                        <Link to="/post/:id">Cool post</Link>
                        <p>cool description</p>
                    </li>
                </ul>
            </div>
        </div>
    )
}