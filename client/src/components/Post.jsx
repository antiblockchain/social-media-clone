import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./authFunctions";
import Post from "../services/post.service"
import axios from "axios";
import { QueryCache, useMutation, useQuery } from "@tanstack/react-query";
import Comments from "./Comments";
import { Link } from "react-router-dom";


export function UserPost ({ post }) {
    const {user, setUser} = useContext(UserContext);

    const [localLikes, setLocalLikes] = useState("");

    const [commentVisibility, setCommentVisibility] = useState(false);

    async function toggleComment(e) {
      e.preventDefault();
      setCommentVisibility(!commentVisibility);
    }


    async function handleClick(e) {
        e.preventDefault();
        await Post.deletePost(post._id);
    }

      // Define a query key unique to each post's likes
  const queryKey = ['likes', post._id];

  // Define a function to fetch likes for the post
  const fetchLikes = async () => {
    const response = await axios.get(`http://localhost:3000/like/post/${post._id}`, {
      withCredentials: true,
    });
    return response.data;
  };

  // Use useQuery to fetch and cache likes data
  const { status, error, data: likes } = useQuery(queryKey, fetchLikes, {
    initialData: localLikes,
    refetchInterval: 5000, // Optionally set a refetch interval
  });

  // Define a mutation function to handle liking a post
  const likePostMutation = useMutation(
    async () => {
        setLocalLikes(localLikes + 1);
      await axios.post(
        'http://localhost:3000/like',
        {
          userId: user._id,
          postId: post._id,
        },
        { withCredentials: true }
      );
    },
    {
      // Invalidate the likes query when the mutation is successful
      onSettled: () => {
        QueryCache.invalidateQueries(queryKey);
      },
    }
  );

  // Handle liking a post when the "Like" button is clicked
  const handleLike = (e) => {
    e.preventDefault();
    likePostMutation.mutate();
  };
  useEffect(() => {
    fetchLikes().then((initialLikes) => {
      setLocalLikes(initialLikes);
    });
  }, []);

    
  if (status === "loading") return <p>Loading...</p>
  if (status === "error") return <p>Failed to fetch data</p>


   
    return (
      <>
        <div className="post-container">
            <div className="post-meta">
              <img alt={post.username} src="./img/profile.jpg" />
                <Link to={"/profile/" + post.username}>{post.username}</Link >
                <p>{post.date.split("T")[0]}</p>
            </div>
            <div className="post-content">
                <p>{post.content}</p>
            </div>
            <div className="post-interact">
                <button onClick={handleLike}>Like</button>
                <p>{localLikes}</p>
                <button onClick={toggleComment}>comments</button>
                <p>share</p>
                {user?.username == post.username ? <button onClick={handleClick}>Delete post</button> : <></>}
            </div>
            {commentVisibility && <Comments postId={post._id}/>}
        </div>
        <hr />
        </>
    )
} 