/* eslint-disable react/prop-types */ 
import React, { useContext, useEffect, useState } from "react"
import { UserContext } from "./authFunctions"
import Login from "./Login";
import '../styles/home.css';
import TextareaAutosize from 'react-textarea-autosize';
import Post from '../services/post.service';
import axios from "axios";
import { UserPost } from "./Post";
import { useQuery } from "@tanstack/react-query";
import Search from "./Search";
 

export default function Home ( ) {
    const {user, setUser} = useContext(UserContext);

        async function fetchPosts() {
            try {
                const response = await axios.get("http://localhost:3000/post", { withCredentials: true });
                return Array.from(response.data);

            } catch (err) {
                console.error(err.message);
            }

        }

    async function createPost(e) {
        e.preventDefault();
        let content = e.target[0].value;
        let username = user.username;
        await Post.createPost(username, content);

        e.target[0].value = "";

    }


    const {
        status,
        error,
        data: posts,
    } = useQuery({
        queryKey: ["posts"],
        queryFn: fetchPosts,
        refetchInterval: 5000,
    });

    if (status === "loading") return <p>Loading...</p>
    if (status === "error") return <p>Failed to fetch data</p>


    if(user !== null) {

        return (

            <>
            <div className="container">
            <Search/>
                <div className="welcome-container">
                <form className="post-form" onSubmit={createPost}>
                    <TextareaAutosize name="content" placeholder="Whats on your mind?"></TextareaAutosize>
                <button name="username">Create post</button>
                </form>
                </div>
                <div className="posts-container">
                    {posts.map((post) => 
                        <UserPost post={post} key={post._id}></UserPost>

                    )}

                    
                </div>
            </div>
            </>
        )

    } else {
        return (

            <Login />
        )
    }



}