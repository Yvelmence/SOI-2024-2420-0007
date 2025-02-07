import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from '@clerk/clerk-react';

function ForumPost() {
 const { id } = useParams();
 const { user } = useUser();
 const [post, setPost] = useState(null);
 const [comments, setComments] = useState([]);
 const [newComment, setNewComment] = useState("");
 const [editingCommentId, setEditingCommentId] = useState(null);
 const [editedCommentText, setEditedCommentText] = useState("");

 useEffect(() => {
   const fetchData = async () => {
     try {
       const postResponse = await fetch(`http://localhost:3000/api/forum/${id}`);
       if (!postResponse.ok) throw new Error('Post not found');
       const postData = await postResponse.json();
       setPost(postData);

       const commentsResponse = await fetch(`http://localhost:3000/api/forum/${id}/comments`);
       if (!commentsResponse.ok) throw new Error('Failed to fetch comments');
       const commentsData = await commentsResponse.json();
       setComments(commentsData);
     } catch (error) {
       console.error("Error:", error);
     }
   };
   fetchData();
 }, [id]);

 const handleAddComment = async () => {
   if (!user) {
     alert("Please log in to comment");
     return;
   }
   if (!newComment.trim()) return;

   try {
     const response = await fetch(`http://localhost:3000/api/forum/${id}/comments`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         postId: id,
         text: newComment,
         userId: user.id,
         userName: user.fullName || user.username
       }),
     });

     if (!response.ok) throw new Error('Failed to add comment');
     const newCommentData = await response.json();
     setComments(prevComments => [newCommentData, ...prevComments]);
     setNewComment("");
   } catch (error) {
     console.error("Error:", error);
   }
 };

 const handleEditComment = async () => {
   if (!editedCommentText.trim()) return;

   try {
     const response = await fetch(`http://localhost:3000/api/forum/comments/${editingCommentId}`, {
       method: 'PUT',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         text: editedCommentText,
         userId: user.id
       }),
     });

     if (!response.ok) throw new Error('Failed to edit comment');
     
     setComments(prevComments => 
       prevComments.map(comment => 
         comment._id === editingCommentId 
           ? { ...comment, text: editedCommentText } 
           : comment
       )
     );
     setEditingCommentId(null);
     setEditedCommentText("");
   } catch (error) {
     console.error("Error:", error);
   }
 };

 const handleDeleteComment = async (commentId) => {
   try {
     const response = await fetch(`http://localhost:3000/api/forum/comments/${commentId}`, {
       method: 'DELETE',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ userId: user.id })
     });

     if (!response.ok) throw new Error('Failed to delete comment');
     
     setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
   } catch (error) {
     console.error("Error:", error);
   }
 };

 const handleAdminDeleteComment = async (commentId) => {
   if (!user || user.publicMetadata?.role !== 'admin') {
     alert('Admin access required');
     return;
   }

   try {
     const response = await fetch(`http://localhost:3000/api/forum/admin/comments/${commentId}`, {
       method: 'DELETE',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ adminId: user.id })
     });

     if (!response.ok) throw new Error('Failed to delete comment');
     
     setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
   } catch (error) {
     console.error("Error:", error);
   }
 };

 if (!post) return <div className="min-h-screen bg-gray-900 text-white p-8">Loading...</div>;

 return (
   <div className="min-h-screen bg-gray-900 text-white p-8">
     <h1 className="text-4xl font-bold">{post.title}</h1>
     <div className="flex items-center mt-2 text-gray-400">
       <p>Posted by: {post.userName || 'Anonymous'}</p>
       <span className="mx-2">•</span>
       <p>{new Date(post.createdAt).toLocaleString()}</p>
     </div>
     <p className="mt-4 text-lg">{post.content}</p>
     {post.imageUrl && (
       <img
         src={post.imageUrl}
         alt={post.title}
         className="w-full max-h-96 object-contain rounded-lg mt-4 bg-gray-700"
       />
     )}

     <div className="mt-8">
       <h2 className="text-2xl font-bold mb-4">Comments</h2>
       {user ? (
         <div className="bg-gray-800 p-4 rounded-lg">
           <textarea
             className="w-full p-3 bg-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
             placeholder="Write a comment..."
             value={newComment}
             onChange={(e) => setNewComment(e.target.value)}
             rows="3"
           />
           <button
             onClick={handleAddComment}
             className="mt-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg w-full transition duration-200"
           >
             Post Comment
           </button>
         </div>
       ) : (
         <p className="text-center py-4 bg-gray-800 rounded-lg">
           Please log in to comment
         </p>
       )}

       <div className="mt-6 space-y-4">
         {comments.map((comment) => (
           <div key={comment._id} className="bg-gray-800 p-4 rounded-lg">
             <div className="flex items-center justify-between mb-2">
               <p className="font-medium text-blue-400">
                 {comment.userName || 'Anonymous'}
               </p>
               <span className="text-sm text-gray-400">
                 {new Date(comment.createdAt).toLocaleString()}
               </span>
             </div>
             
             {editingCommentId === comment._id ? (
               <div>
                 <textarea
                   className="w-full p-2 bg-gray-700 rounded-lg mb-2"
                   value={editedCommentText}
                   onChange={(e) => setEditedCommentText(e.target.value)}
                   rows="3"
                 />
                 <div className="flex space-x-2">
                   <button
                     onClick={handleEditComment}
                     className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg w-full"
                   >
                     Save
                   </button>
                   <button
                     onClick={() => {
                       setEditingCommentId(null);
                       setEditedCommentText("");
                     }}
                     className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg w-full"
                   >
                     Cancel
                   </button>
                 </div>
               </div>
             ) : (
               <div className="flex justify-between items-center">
                 <p className="text-gray-100 flex-grow">{comment.text}</p>
                 {user && (
                   <div className="flex space-x-2 ml-2">
                     {(user.id === comment.userId || user.publicMetadata?.role === 'admin') && (
                       <button
                         onClick={() => 
                           user.publicMetadata?.role === 'admin' 
                             ? handleAdminDeleteComment(comment._id) 
                             : handleDeleteComment(comment._id)
                         }
                         className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded-lg text-sm"
                       >
                         Delete
                       </button>
                     )}
                     {user.id === comment.userId && (
                       <button
                         onClick={() => {
                           setEditingCommentId(comment._id);
                           setEditedCommentText(comment.text);
                         }}
                         className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded-lg text-sm"
                       >
                         Edit
                       </button>
                     )}
                   </div>
                 )}
               </div>
             )}
           </div>
         ))}
       </div>
     </div>
   </div>
 );
}

export default ForumPost;