import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

function TissueDetails() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [tissue, setTissue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState(null);

  useEffect(() => {
    const fetchTissue = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/tissues');
        if (!response.ok) throw new Error('Failed to fetch tissues');
        const tissues = await response.json();
        const foundTissue = tissues.find(t => 
          t.name.toLowerCase() === name.toLowerCase()
        );
        
        if (!foundTissue) {
          throw new Error('Tissue not found');
        }
        
        setTissue(foundTissue);
        setEditedInfo(foundTissue);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTissue();
  }, [name]);

  const handleSave = async () => {
    if (!editedInfo.name.trim() || !editedInfo.info.trim()) {
      alert('Name and information cannot be empty');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/tissues/${tissue._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedInfo.name.trim(),
          info: editedInfo.info.trim(),
          img: editedInfo.img,
          userId: user.id
        }),
      });

      if (!response.ok) throw new Error('Failed to update tissue');
      const updatedData = await response.json();
      setTissue(updatedData);
      setIsEditing(false);
      // Navigate to the new URL if name changed
      if (updatedData.name.toLowerCase() !== name.toLowerCase()) {
        navigate(`/tissue/${updatedData.name.toLowerCase()}`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this tissue?')) return;

    try {
      const response = await fetch(`/api/tissues/${tissue._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id })
      });

      if (!response.ok) throw new Error('Failed to delete tissue');
      navigate('/'); // Redirect to home after successful deletion
    } catch (err) {
      setError(err.message);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditedInfo({ ...editedInfo, img: reader.result });
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!tissue) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <p className="text-xl">No information found for {name}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
          >
            ← Back to Home
          </button>
          {user && (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg"
              >
                Edit Information
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Title</label>
                <input
                  type="text"
                  value={editedInfo.name}
                  onChange={(e) => setEditedInfo({
                    ...editedInfo,
                    name: e.target.value
                  })}
                  className="w-full bg-gray-700 text-white p-3 rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Information</label>
                <textarea
                  value={editedInfo.info}
                  onChange={(e) => setEditedInfo({
                    ...editedInfo,
                    info: e.target.value
                  })}
                  className="w-full h-40 bg-gray-700 text-white p-4 rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-white"
                />
                {editedInfo.img && (
                  <img
                    src={editedInfo.img}
                    alt="Preview"
                    className="mt-2 max-h-48 rounded-lg"
                  />
                )}
              </div>

              <div className="flex space-x-2 pt-4">
                <button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg flex-1"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedInfo(tissue);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 p-6 rounded-lg">
            <h1 className="text-4xl font-bold capitalize mb-6">{tissue.name}</h1>
            
            {tissue.img && (
              <img
                src={tissue.img}
                alt={tissue.name}
                className="w-full max-h-96 object-contain rounded-lg mb-6 bg-gray-700"
              />
            )}

            <p className="text-gray-300 text-lg leading-relaxed">
              {tissue.info}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TissueDetails;