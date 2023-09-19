import axios from "axios";

//Global variables

const SERVER_URL = "http://localhost:3000/";

class Post {
  getPost(id) {
    axios
      .get(SERVER_URL + "post/" + id)
      .then((response) => {
        return response.data;
      })
      .catch((err) => console.error(err));
  }

  getAllPosts() {
    axios
      .get(SERVER_URL + "post")
      .then((response) => {
        return response.data;
      })
      .catch((err) => console.error(err));
  }

  createPost(username, content) {
    //TO DO: validate user, check jwt and make sure it matches
    //the submitted username, and the token name
    return axios
      .post(
        SERVER_URL + "post",
        {
          username,
          content,
        },
        { withCredentials: true }
      )
      .then(() => {
        console.log("Successfully created post");
      });
  }

  deletePost(id) {
    //TODO: CHECK FOR USER
    //SEND REQUEST TO EXPRESS
    //IF USER FROM JWT MATCHES, RETURN TRUE
    //THEN IF POST OWNER OR ADMIN, DO:

    return axios
      .delete(SERVER_URL + "post/" + id, { withCredentials: true })
      .then(() => console.log("Successfully deleted"))
      .catch((err) => console.error(err));
  }
}

export default new Post();
