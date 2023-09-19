import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';


export default function Comments ({ postId }) {

    async function fetchComments() {
        const response = await axios.get(`http://localhost:3000/comment/post/${postId}`, { withCredentials: true });
        return Array.from(response.data);
        // axios.get("http://localhost:3000/post", { withCredentials: true }).then((response) => {
        //     // setPosts(Array.from(response.data));
        //     Array.from(response.data);
        // }).catch(err => console.error(err.message))
    }
//     fetchPosts();

// }, [])
    const [currentComment, setCurrentComment] = useState("");


async function createComment(e) {
    e.preventDefault();
    axios.post(`http://localhost:3000/comment/${postId}`, {
        content: currentComment,
    }, { withCredentials: true}).then(console.log("Success")).catch(err => console.error(err));

}


const {
    status,
    error,
    data: comments,
} = useQuery({
    queryKey: ["comments"],
    queryFn: fetchComments,
    refetchInterval: 5000,
})

if (status === "loading") return <h1>Loading...</h1>
if (status === "error") return <h1>{JSON.stringify(error)}</h1>


    let commentsList = comments.map((comment) => {
    return <div className="comment-container" key={comment._id}>
    <div className="comment-info">
        <h2>{comment.username}</h2>
        <p>{comment.date.split("T")[0]}</p>

    </div>
    <div className="comment-content">
        <p>{comment.content}</p>

    </div>
    <div className="comment-interact">

    </div>
</div>

    }
    
    );

    return (
        <>
        <div className="comments-container">
            {commentsList}

        </div>
        <div className="comment-input">
            <form>
                <input name="content" placeholder="Leave a comment..." value={currentComment} onChange={(e) => setCurrentComment(e.target.value)}></input>
                <button onClick={createComment}>Send</button>
            </form>
        </div>
        </>
    )

}