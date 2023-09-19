import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import ProfileService from "../services/profile.service"
import { UserContext } from "./authFunctions";



export default function Requests() {
    const {user, setUser} = useContext(UserContext);

async function handleRequest (e) {

    if(e.target.value) {
        //ACCEPT REQUEST
        await ProfileService.sendFriend(user._id, e.target.value);
    } else {
        //DENY, delete doc
    }
}


async function fetchRequests() {
  try {
    const response = await axios.get(`http://localhost:3000/profile/friend-requests-pending`, { withCredentials: true });
    return Array.from(response.data);

  } catch (err) {
    console.error(err)
  }

}
//     fetchPosts();

// }, [])



const {
    status,
    error,
    data: requests,
} = useQuery({
    queryKey: ["requests"],
    queryFn: fetchRequests,
    refetchInterval: 10000,
})

if (status === "loading") return <p>Loading...</p>
if (status === "error") return <p>Failed to fetch data</p>


  let requestsList = <p>No requests found.</p>;
  if (requests.length > 0) {
    requestsList = requests.map((request) => (
      <li key={request._id}>
        <div className="requested-user">
          <img alt="user" src="./img/profile.jpg" />
          <Link to={`/profile/${request.requester.userId}`}>{request.requester.firstName} {request.requester.lastName}</Link>
        </div>
        <div className="follow-options">
          <button value={request.requester._id} onClick={handleRequest}>Accept</button>
          <button value={null} onClick={handleRequest}>Deny</button>
        </div>
      </li>
    ));
  }
console.log(requestsList);
    return (
        <div className="user-requests">
            <p className="request-message">Friend requests</p>
            <ul> {requestsList} </ul>
        </div>
    )
}