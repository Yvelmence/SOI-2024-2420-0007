import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [sliderData, setSliderData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if user is admin
  const isAdmin = user?.publicMetadata?.role === 'admin';

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    img: "",
    info: ""
  });

  // Fetch tissues data from the database
  useEffect(() => {
    const fetchTissues = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/tissues");
        if (!response.ok) throw new Error("Failed to fetch tissues");
        const data = await response.json();
        setSliderData(data);
      } catch (error) {
        console.error("Error fetching tissues:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTissues();
  }, []);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...formData, img: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Add new tissue
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.info.trim() || !formData.img) {
      alert("All fields are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/tissues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          img: formData.img,
          info: formData.info,
          userId: user.id
        }),
      });

      if (!response.ok) throw new Error("Failed to add tissue");
      const newTissue = await response.json();
      setSliderData([...sliderData, newTissue]);
      setFormData({ name: "", img: "", info: "" });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding tissue:", error);
      alert("Error adding tissue: " + error.message);
    }
  };

  // Edit tissue
  const handleEditClick = (index) => {
    setEditIndex(index);
    setFormData(sliderData[index]);
    setShowEditForm(true);
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.info.trim()) {
      alert("Name and info are required.");
      return;
    }

    try {
      const tissueId = sliderData[editIndex]._id;
      const response = await fetch(`http://localhost:3000/api/tissues/${tissueId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          img: formData.img,
          info: formData.info,
          userId: user.id
        }),
      });

      if (!response.ok) throw new Error("Failed to update tissue");
      const updatedTissue = await response.json();
      
      setSliderData(sliderData.map((item, i) =>
        i === editIndex ? updatedTissue : item
      ));
      setFormData({ name: "", img: "", info: "" });
      setEditIndex(null);
      setShowEditForm(false);
    } catch (error) {
      console.error("Error updating tissue:", error);
      alert("Error updating tissue: " + error.message);
    }
  };

  // Delete tissue
  const handleDeleteItem = async (index) => {
    if (!window.confirm("Are you sure you want to delete this tissue?")) {
      return;
    }

    try {
      const tissueId = sliderData[index]._id;
      const response = await fetch(`http://localhost:3000/api/tissues/${tissueId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id })
      });

      if (!response.ok) throw new Error("Failed to delete tissue");
      setSliderData(sliderData.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting tissue:", error);
      alert("Error deleting tissue: " + error.message);
    }
  };

  // Slider settings
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    dotsClass: "slick-dots custom-dots",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const handleCancel = () => {
    setFormData({ name: "", img: "", info: "" });
    setShowAddForm(false);
    setShowEditForm(false);
    setEditIndex(null);
  };

  const handleReadMore = (itemName) => {
    navigate(`/tissue/${itemName.toLowerCase()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8 flex flex-col items-center justify-center relative">
      <h1 className="text-6xl font-bold text-white mb-10 text-center tracking-wider">
        Learn about Tissues here!
      </h1>

      {/* Admin Controls */}
      {isAdmin && (
        <button
          onClick={() => setShowAddForm(true)}
          className="mb-8 bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition"
        >
          + Add New Tissue
        </button>
      )}

      {/* Add Form */}
      {isAdmin && showAddForm && (
        <form
          onSubmit={handleAddItem}
          className="mb-4 p-4 bg-gray-800 rounded-lg w-full max-w-md"
        >
          <h2 className="text-xl text-white font-bold mb-4">Add a New Tissue</h2>
          <div className="mb-4">
            <label className="block text-white mb-2">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="E.g. Heart"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full px-3 py-2 rounded text-white"
            />
            {formData.img && (
              <img
                src={formData.img}
                alt="Preview"
                className="mt-2 max-h-40 object-contain"
              />
            )}
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Info</label>
            <textarea
              className="w-full px-3 py-2 rounded"
              value={formData.info}
              onChange={(e) => setFormData({ ...formData, info: e.target.value })}
              placeholder="Enter tissue description"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Edit Form */}
      {isAdmin && showEditForm && (
        <form
          onSubmit={handleUpdateItem}
          className="mb-4 p-4 bg-gray-800 rounded-lg w-full max-w-md"
        >
          <h2 className="text-xl text-white font-bold mb-4">Edit Tissue</h2>
          <div className="mb-4">
            <label className="block text-white mb-2">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full px-3 py-2 rounded text-white"
            />
            {formData.img && (
              <img
                src={formData.img}
                alt="Preview"
                className="mt-2 max-h-40 object-contain"
              />
            )}
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Info</label>
            <textarea
              className="w-full px-3 py-2 rounded"
              value={formData.info}
              onChange={(e) => setFormData({ ...formData, info: e.target.value })}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Update
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Tissue Slider or Empty State */}
      <div className="max-w-7xl w-full">
        {sliderData.length > 0 ? (
          <Slider {...settings}>
            {sliderData.map((item, index) => (
              <div key={index} className="px-4">
                <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl h-[600px] flex flex-col transform transition-transform duration-300 hover:scale-105">
                  <div className="w-full h-56 flex-shrink-0">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-2xl font-bold text-white mb-4 break-words">
                      {item.name}
                    </h2>
                    <p className="text-gray-300 text-sm leading-relaxed flex-grow overflow-auto break-words">
                      {item.info}
                    </p>

                    <div className="mt-auto">
                      <button
                        onClick={() => handleReadMore(item.name)}
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 transform hover:scale-105 mb-2"
                      >
                        Read More
                      </button>

                      {isAdmin && (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleEditClick(index)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-2 rounded-lg transition text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(index)}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-2 rounded-lg transition text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <div className="text-center text-white p-8 bg-gray-800 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">No Tissues Available</h2>
            <p className="text-gray-300">
              {isAdmin 
                ? "Click the 'Add New Tissue' button above to add your first tissue!"
                : "Please check back later for tissue information."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;