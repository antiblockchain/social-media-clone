import React from "react";
import Nav from "./Nav";
import Auth from '../services/auth.service'
import { useNavigate } from "react-router";

export default function Signup () {
    const navigate = useNavigate();
    
    async function signup(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        await Auth.register(formJson.username, formJson.password, formJson.confirmPassword, formJson.firstName, formJson.lastName);
        navigate("/login");
    }
    return (
        <>
        <Nav></Nav>
        <div className="container">
            <h2>Signup</h2>
            <div className="form-container">
                <form method="POST" onSubmit={signup} autoComplete="on">
                    <label htmlFor="username">Username</label>
                    <input name="username"></input>

                    <label htmlFor="firstName" type="given-name">First Name</label>
                    <input name="firstName" required></input>
                    <label htmlFor="lastName" type="family-name">Last Name</label>
                    <input name="lastName" required></input>
                    <label htmlFor="password">Password</label>
                    <input name="password" type="password" required></input>
                    <label htmlFor="confirmPassword">Confirm password</label>
                    <input name="confirmPassword" type="password" required></input>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
        </>
    )
}