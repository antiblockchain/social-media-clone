import axios from "axios";

//Global variables

const SERVER_URL = "http://localhost:3000/";

class ProfileService {
  getProfile(id) {
    axios
      .get(SERVER_URL + "profile/" + id, { withCredentials: true })
      .then((response) => {
        return response.data;
      })
      .catch((err) => console.error(err));
  }
  sendFriend(requester, recipient) {
    return axios
      .post(
        SERVER_URL + "profile/friend/" + recipient,
        {
          requester,
          recipient,
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => console.error(err));
  }
  deleteFriend(id) {
    return axios
      .delete(SERVER_URL + "profile/friend/" + id, { withCredentials: true })
      .then(console.log("successfully deleted"))
      .catch((err) => console.error(err));
  }
  getFriends() {
    return axios
      .get(SERVER_URL + "profile/friends", { withCredentials: true })
      .then((response) => {
        return response.data;
      })
      .catch((err) => console.error(err));
  }
}

export default new ProfileService();
