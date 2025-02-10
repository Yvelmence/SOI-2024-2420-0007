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
        // Sort before setting state
        const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts);
      } catch (error) {
        console.error("Error fetching forum posts:", error.message);
      }
    };
    fetchPosts();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!isValidFileType(file)) {
      alert('Please upload only images (JPEG, PNG) or videos (MP4)');
      e.target.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert('File size must be less than 50MB');
      e.target.value = '';
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            Tissue Science Forum
          </h1>
          <p className="text-gray-400">Join the discussion with fellow scientists and researchers</p>
        </div>

        {/* Create Post Section */}
        {user ? (
          <div className="mb-12 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">Create a New Post</h2>
            <div className="space-y-4">
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-200 text-white placeholder-gray-400"
                placeholder="Post Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <textarea
                className="w-full px-4 py-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-200 text-white placeholder-gray-400 min-h-[120px]"
                placeholder="Write your discussion..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              />
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*, video/*" 
                  onChange={handleFileUpload}
                  className="block w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-500/10 file:text-pink-500 hover:file:bg-pink-500/20 file:cursor-pointer cursor-pointer"
                />
              </div>
              {newFile && (
                <div className="mt-4">
                  {newFile.startsWith('data:image/') ? (
                    <img
                      src={newFile}
                      alt="Preview"
                      className="rounded-xl h-48 w-full object-cover"
                    />
                  ) : (
                    <video
                      src={newFile}
                      controls
                      className="rounded-xl h-48 w-full object-cover"
                    />
                  )}
                </div>
              )}
              <button
                onClick={handleAddPost}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl font-semibold text-white hover:from-pink-600 hover:to-violet-600 transition-all duration-200 shadow-lg hover:shadow-pink-500/25"
              >
                Post Discussion
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-12 text-center py-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50">
            <p className="text-gray-300 text-lg">Please log in to create a post</p>
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-pink-500/50 transition-all duration-300 group"
            >
              <h2 className="text-2xl font-bold text-white mb-2 break-words">
                {post.title}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                <span>{post.userName || 'Anonymous'}</span>
                <span>•</span>
                <span>{new Date(post.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-gray-300 break-words whitespace-pre-wrap line-clamp-3 mb-4">
                {post.content}
              </p>
              {post.imageUrl && (
                <div className="mb-4">
                  {post.imageUrl.startsWith('data:image/') ? (
                    <img 
                      src={post.imageUrl} 
                      alt={post.title}
                      className="rounded-xl h-48 w-full object-cover" 
                    />
                  ) : post.imageUrl.startsWith('data:video/') ? (
                    <video
                      src={post.imageUrl}
                      controls
                      className="rounded-xl h-48 w-full object-cover"
                    />
                  ) : null}
                </div>
              )}
              <button
                onClick={() => navigate(`/forum/${post._id}`)}
                className="w-full py-3 bg-gray-700/50 rounded-xl font-semibold text-white hover:bg-gray-700/50 transition-all duration-300 group-hover:bg-gradient-to-r hover:from-pink-500 hover:to-violet-500"
              >
                View Full Discussion
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Forum;