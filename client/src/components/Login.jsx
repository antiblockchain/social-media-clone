import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "./authFunctions";
import Auth from "../services/auth.service";
import Nav from "./Nav";
import '../styles/auth.css'

export default function Login() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);


    if (formData.username && formData.password) {

      try {
        const response = await Auth.login(formData.username, formData.password);
    
        if (response?.error) {
          setError("Invalid credentials");
        } else {
          const currentUser = Auth.getCurrentUser();
          setUser(currentUser);
          navigate("/");
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      }

    }
  };
  async function guestLogin(e) {
    e.preventDefault();
    try {
      await Auth.login("guest", "123");
      const guest = Auth.getCurrentUser();
      setUser(guest);
      navigate("/")
    } catch {
      setError("An internal error has occured.")
    }

  }

  return (
    <>
      <Nav />
      <div className="container">
        <h2>Login</h2>
        <div className="form-container">
          <form method="POST" onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <button type="submit">Submit</button>
          </form>
          {error && <p className="error">{error}</p>}
          <button className="guest-button" onClick={guestLogin}>Log in as guest</button>
        </div>
        
      </div>
    </>
  );
}
 