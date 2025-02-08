// Forum.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

function Forum() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState(null);

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

  const handleImageUpload = (e, setImageFunction) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageFunction(reader.result);
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
      imageUrl: newImage,
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
      setNewImage(null);
    } catch (error) {
      console.error("Error adding post:", error.message);
      alert("Error adding post: " + error.message);
    }
  };

  const handleEditPost = async (postId) => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert("Title and content cannot be empty.");
      return;
    }

    const payload = {
      title: editTitle,
      content: editContent,
      imageUrl: editImage,
      userId: user.id
    };

    try {
      const response = await fetch(`http://localhost:3000/api/forum/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) throw new Error("Failed to update post");
      const updatedPost = await response.json();
      
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? updatedPost : post
        )
      );
      setEditingPostId(null);
      setEditTitle("");
      setEditContent("");
      setEditImage(null);
    } catch (error) {
      console.error("Error updating post:", error.message);
      alert("Error updating post: " + error.message);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/forum/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id })
      });

      if (!response.ok) throw new Error("Failed to delete post");
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error.message);
      alert("Error deleting post: " + error.message);
    }
  };

  const handleAdminDeletePost = async (postId) => {
    if (!user || user.publicMetadata?.role !== 'admin') {
      alert('Admin access required');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/forum/admin/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminId: user.id })
      });

      if (!response.ok) throw new Error("Failed to delete post");
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error.message);
      alert("Error deleting post: " + error.message);
    }
  };

  const startEditing = (post) => {
    setEditingPostId(post._id);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditImage(post.imageUrl);
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
            accept="image/*" 
            onChange={(e) => handleImageUpload(e, setNewImage)}
            className="text-white" 
          />
          {newImage && (
            <img
              src={newImage}
              alt="Preview"
              className="mt-2 h-40 object-cover rounded-lg"
            />
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
            {editingPostId === post._id ? (
              // Edit form
              <div>
                <input
                  type="text"
                  className="w-full p-2 bg-gray-700 rounded-lg mb-2"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <textarea
                  className="w-full p-2 bg-gray-700 rounded-lg mb-2"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleImageUpload(e, setEditImage)}
                  className="text-white mb-2" 
                />
                {editImage && (
                  <img
                    src={editImage}
                    alt="Edit Preview"
                    className="mt-2 h-40 object-cover rounded-lg"
                  />
                )}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditPost(post._id)}
                    className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg flex-1"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingPostId(null);
                      setEditTitle("");
                      setEditContent("");
                      setEditImage(null);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Post display
              <>
                <h2 className="text-xl font-bold">{post.title}</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Posted by: {post.userName || 'Anonymous'} | {new Date(post.createdAt).toLocaleString()}
                </p>
                <p className="mt-2">{post.content}</p>
                {post.imageUrl && (
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="mt-2 h-40 object-cover rounded-lg" 
                  />
                )}
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => navigate(`/forum/${post._id}`)}
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg flex-1"
                  >
                    View Post
                  </button>
                  {user && (user.id === post.userId || user.publicMetadata?.role === 'admin') && (
                    <div className="flex space-x-2 flex-1">
                      {user.id === post.userId && (
                        <button
                          onClick={() => startEditing(post)}
                          className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg flex-1"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => 
                          user.publicMetadata?.role === 'admin' 
                            ? handleAdminDeletePost(post._id) 
                            : handleDeletePost(post._id)
                        }
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg flex-1"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Forum;