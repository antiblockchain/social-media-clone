import axios from "axios";

const SERVER_URL = "http://localhost:3000/";

class Auth {
  constructor() {
    this.currentUser = null;
  }
  // LOGIN
  async login(username, password) {
    try {
      const response = await axios.post(
        SERVER_URL + "log-in",
        {
          username,
          password,
        },
        { withCredentials: true }
      );

      if (response.data.cookies.accessToken) {
        this.currentUser = response.data.user;
        console.log("Successfully logged in");
      } else {
        console.error(response);
        throw new Error("Login failed");
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // LOGOUT
  async logout() {
    try {
      await axios.post(SERVER_URL + "sign-out", {}, { withCredentials: true });
      localStorage.removeItem("user");
      console.log("Successfully logged out");
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // REGISTER
  async register(username, password, confirmPassword, firstName, lastName) {
    try {
      await axios.post(
        SERVER_URL + "sign-up",
        {
          username,
          password,
          confirmPassword,
          firstName,
          lastName,
        },
        { withCredentials: true }
      );
      console.log("User created");
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // GET USER
  getCurrentUser() {
    return this.currentUser;
  }
}

export default new Auth();
