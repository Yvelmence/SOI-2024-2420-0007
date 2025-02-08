import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const isValidFileType = (file) => {
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  return [...validImageTypes, ...validVideoTypes].includes(file.type);
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB max file size

function Forum() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newFile, setNewFile] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/forumposts");
        if (!response.ok) throw new Error("Failed to fetch forum posts");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching forum posts:", error.message);
      }
    };
    fetchPosts();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!isValidFileType(file)) {
      alert('Please upload only images (JPEG, PNG, GIF, WEBP) or videos (MP4, WEBM, OGG)');
      e.target.value = ''; // Reset input
      return;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      alert('File size must be less than 50MB');
      e.target.value = ''; // Reset input
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewFile(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddPost = async () => {
    if (!user) {
      alert("Please log in to create a forum post.");
      return;
    }
    if (!newTitle.trim() || !newContent.trim()) {
      alert("Title and content cannot be empty.");
      return;
    }
    
    const payload = {
      title: newTitle,
      content: newContent,
      imageUrl: newFile,
      userId: user.id,
      userName: user.fullName || user.username,
      createdAt: new Date()
    };

    try {
      const response = await fetch("http://localhost:3000/api/forum", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to add post");
      const newPostData = await response.json();
      setPosts([newPostData, ...posts]);
      setNewTitle("");
      setNewContent("");
      setNewFile(null);
    } catch (error) {
      console.error("Error adding post:", error.message);
      alert("Error adding post: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center">Tissue Science Forum</h1>

      {user ? (
        <div className="mt-6 bg-gray-800 p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Create a New Post</h2>
          <input
            type="text"
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
          <input 
            type="file" 
            accept="image/*, video/*" 
            onChange={handleFileUpload}
            className="text-white" 
          />
          {newFile && (
            <div className="mt-2">
              {newFile.startsWith('data:image/') ? (
                <img
                  src={newFile}
                  alt="Preview"
                  className="mt-2 h-40 object-cover rounded-lg"
                />
              ) : (
                <video
                  src={newFile}
                  controls
                  className="mt-2 h-40 w-full rounded-lg"
                />
              )}
            </div>
          )}
          <button
            onClick={handleAddPost}
            className="mt-2 bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-lg w-full"
          >
            Post
          </button>
        </div>
      ) : (
        <p className="mt-4 text-center">Please log in to create a post.</p>
      )}

      <div className="mt-6 space-y-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-gray-800 p-4 rounded-lg"
          >
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-sm text-gray-400 mt-1">
              Posted by: {post.userName || 'Anonymous'} | {new Date(post.createdAt).toLocaleString()}
            </p>
            <p className="mt-2">{post.content}</p>
            {post.imageUrl && (
              <div className="mt-2">
                {post.imageUrl.startsWith('data:image/') ? (
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="mt-2 h-40 object-cover rounded-lg" 
                  />
                ) : post.imageUrl.startsWith('data:video/') ? (
                  <video
                    src={post.imageUrl}
                    controls
                    className="mt-2 h-40 w-full rounded-lg"
                  />
                ) : null}
              </div>
            )}
            <button
              onClick={() => navigate(`/forum/${post._id}`)}
              className="mt-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg w-full"
            >
              View Post
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Forum;