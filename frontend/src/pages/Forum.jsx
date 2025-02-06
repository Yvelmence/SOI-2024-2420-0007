import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

function Forum() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  // States for new post creation
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newImage, setNewImage] = useState(null); // Will store the base64 string of the image

  // Fetch posts from the backend on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("Fetching forum posts from backend...");
        const response = await axios.get("http://localhost:3000/api/forum");
        console.log("Fetched posts:", response.data);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching forum posts:", error);
      }
    };
    fetchPosts();
  }, []);

  // Handle image upload: convert file to base64 string
  const handleNewImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log("Image converted to base64:", reader.result);
      setNewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Axios POST: Create a new forum post
  const handleAddPost = async () => {
    if (!user) {
      alert("Please log in to create a forum post.");
      return;
    }
    if (!newTitle.trim() || !newContent.trim()) {
      alert("Title and content are required.");
      return;
    }

    const postData = {
      title: newTitle,
      content: newContent,
      imageUrl: newImage, // can be null if no image is uploaded
      userId: user.id, // using Clerk's user id
    };

    console.log("Sending POST request with data:", postData);

    try {
      const response = await axios.post("http://localhost:3000/api/forum", postData, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Post created successfully:", response.data);
      setPosts([...posts, response.data]);
      // Clear form fields
      setNewTitle("");
      setNewContent("");
      setNewImage(null);
    } catch (error) {
      console.error("Error adding forum post:", error.response ? error.response.data : error);
      alert("Error creating post. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center">Tissue Science Forum</h1>

      {/* New Post Form: Only visible if the user is logged in */}
      {user ? (
        <div className="mt-6 bg-gray-800 p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Create a New Post</h2>
          <input
            className="w-full p-2 bg-gray-700 rounded-lg mb-2"
            placeholder="Post Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <textarea
            className="w-full p-2 bg-gray-700 rounded-lg mb-2"
            placeholder="Write your discussion..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <input type="file" accept="image/*" onChange={handleNewImageUpload} />
          {newImage && (
            <img src={newImage} alt="Preview" className="mt-2 h-40 object-cover" />
          )}
          <button
            onClick={handleAddPost}
            className="mt-2 bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-lg w-full"
          >
            Post
          </button>
        </div>
      ) : (
        <p className="mt-6 text-center text-gray-400">
          Please log in to create a forum post.
        </p>
      )}

      {/* List of Forum Posts */}
      <div className="mt-6 space-y-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-gray-800 p-4 rounded-lg cursor-pointer"
            onClick={() => navigate(`/forum/${post._id}`)}
          >
            <h2 className="text-xl font-bold">{post.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Forum;
