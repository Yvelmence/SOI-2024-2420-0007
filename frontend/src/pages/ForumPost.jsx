import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ForumPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all posts to locate the desired one
        const postsResponse = await axios.get("http://localhost:5000/api/forum");
        const foundPost = postsResponse.data.find((p) => p._id === id);
        setPost(foundPost);

        // Fetch comments for this post
        const commentsResponse = await axios.get(`http://localhost:5000/api/forum/${id}/comments`);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const response = await axios.post(`http://localhost:5000/api/forum/${id}/comments`, {
        text: newComment,
      });
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {post && (
        <>
          <h1 className="text-4xl font-bold">{post.title}</h1>
          <p className="mt-2">{new Date(post.createdAt).toLocaleString()}</p>
          <p className="mt-4">{post.content}</p>
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-64 object-cover rounded mt-4"
            />
          )}
        </>
      )}
      <div className="mt-6">
        <h2 className="text-2xl font-bold">Comments</h2>
        <div className="mt-4 bg-gray-800 p-4 rounded-lg">
          <textarea
            className="w-full p-2 bg-gray-700 rounded-lg"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            onClick={handleAddComment}
            className="mt-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg w-full"
          >
            Comment
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {comments.map((c, i) => (
            <div key={c._id || i} className="bg-gray-800 p-4 rounded-lg">
              <p>{c.text}</p>
              <span className="text-gray-400 text-sm">
                {new Date(c.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ForumPost;
