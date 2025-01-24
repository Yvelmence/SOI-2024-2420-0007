import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
  const navigate = useNavigate();
  const { user } = useUser();

  // Check if user is admin (role stored in publicMetadata.role)
  const isAdmin = user?.publicMetadata?.role === 'admin';

  // Slider data in state
  const [sliderData, setSliderData] = useState([
    {
      name: "Kidney",
      img: "./images/cardImages/kidney x100 H&E 75.jpg",
      info: "Without your kidney, your body would be filled with waste. Let's see what it looks like under the microscope!",
    },
    {
      name: "Lung",
      img: "./images/cardImages/kidney x100 H&E 76.jpg",
      info: "Lungs are essential for gaseous exchange. Ever wonder how it looks under a microscope?",
    },
    {
      name: "Liver",
      img: "./images/cardImages/kidney x100 H&E 77.jpg",
      info: "The liver is one of the largest organs in the body. Click here to find out more!",
    },
    {
      name: "Testes",
      img: "./images/cardImages/kidney x100 H&E 78.jpg",
      info: "Testes are vital in sperm production. Learn about their microscopic structure here!",
    },
    {
      name: "Small Intestine",
      img: "./images/cardImages/kidney x100 H&E 79.jpg",
      info: "The small intestine helps with nutrient absorption. Read more to discover its unique folds!",
    }
  ]);

  // Admin-only form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Form data for adding/editing
  const [formData, setFormData] = useState({ name: "", img: "", info: "" });

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
        settings: { slidesToShow: 3, slidesToScroll: 3, infinite: true, dots: true }
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 2, slidesToScroll: 2, initialSlide: 2 }
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, slidesToScroll: 1 }
      }
    ]
  };

  // -------------------------
  // ADD ITEM (Admin)
  // -------------------------
  const handleAddItem = (e) => {
    e.preventDefault();
    setSliderData([...sliderData, formData]);
    setFormData({ name: "", img: "", info: "" });
    setShowAddForm(false);
  };

  // -------------------------
  // EDIT ITEM (Admin)
  // -------------------------
  const handleEditClick = (index) => {
    setEditIndex(index);
    setFormData(sliderData[index]);
    setShowEditForm(true);
  };

  const handleUpdateItem = (e) => {
    e.preventDefault();
    const updatedData = [...sliderData];
    updatedData[editIndex] = formData;
    setSliderData(updatedData);
    setFormData({ name: "", img: "", info: "" });
    setEditIndex(null);
    setShowEditForm(false);
  };

  // -------------------------
  // DELETE ITEM (Admin)
  // -------------------------
  const handleDeleteItem = (index) => {
    setSliderData(sliderData.filter((_, i) => i !== index));
  };

  // -------------------------
  // CANCEL FORM
  // -------------------------
  const handleCancel = () => {
    setFormData({ name: "", img: "", info: "" });
    setShowAddForm(false);
    setShowEditForm(false);
    setEditIndex(null);
  };

  // -------------------------
  // READ MORE - Navigate to /tissue/:name
  // -------------------------
  const handleReadMore = (itemName) => {
    navigate(`/tissue/${itemName.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8 flex flex-col items-center justify-center relative">
      {/* Custom styling for slick dots */}
      <style>
        {`
          .custom-dots li button:before {
            color: #ec4899 !important;
            opacity: 0.25;
            font-size: 12px;
          }
          .custom-dots li.slick-active button:before {
            color: #ec4899 !important;
            opacity: 1;
          }
        `}
      </style>

      <h1 className="text-6xl font-bold text-white mb-10 text-center tracking-wider">
        Learn about Tissues here!
      </h1>

      {/* Show the add button only to admins */}
      {isAdmin && (
        <button
          onClick={() => setShowAddForm(true)}
          className="mb-8 bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition"
        >
          + Add New Tissue
        </button>
      )}

      {/* Tissue Slider */}
      <div className="max-w-7xl w-full">
        <Slider {...settings}>
          {sliderData.map((item, index) => (
            <div key={index} className="px-4 h-[500px]">
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl h-full flex flex-col transform transition-transform duration-300 hover:scale-105">
                {/* Card Image */}
                <div className="w-full h-56 flex-shrink-0">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Card Text */}
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-2xl font-bold text-white mb-4">{item.name}</h2>
                  <p className="text-gray-300 text-sm leading-relaxed flex-grow">
                    {item.info}
                  </p>

                  {/* READ MORE (visible to everyone) */}
                  <button
                    onClick={() => handleReadMore(item.name)}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 transform hover:scale-105 mt-4"
                  >
                    Read More
                  </button>

                  {/* Admin-only Edit/Delete buttons */}
                  {isAdmin && (
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => handleEditClick(index)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(index)}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* ADD FORM (admin only) */}
      {isAdmin && showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleAddItem}
            className="bg-white p-8 rounded shadow-md max-w-md w-full"
          >
            <h2 className="text-xl font-bold mb-4">Add New Tissue</h2>

            <label className="block mb-2 font-semibold">Name</label>
            <input
              type="text"
              className="block w-full mb-4 p-2 border rounded"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <label className="block mb-2 font-semibold">Image URL</label>
            <input
              type="text"
              className="block w-full mb-4 p-2 border rounded"
              value={formData.img}
              onChange={(e) => setFormData({ ...formData, img: e.target.value })}
              required
            />

            <label className="block mb-2 font-semibold">Info</label>
            <textarea
              className="block w-full mb-4 p-2 border rounded"
              rows={3}
              value={formData.info}
              onChange={(e) => setFormData({ ...formData, info: e.target.value })}
              required
            />

            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT FORM (admin only) */}
      {isAdmin && showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleUpdateItem}
            className="bg-white p-8 rounded shadow-md max-w-md w-full"
          >
            <h2 className="text-xl font-bold mb-4">Edit Tissue</h2>

            <label className="block mb-2 font-semibold">Name</label>
            <input
              type="text"
              className="block w-full mb-4 p-2 border rounded"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <label className="block mb-2 font-semibold">Image URL</label>
            <input
              type="text"
              className="block w-full mb-4 p-2 border rounded"
              value={formData.img}
              onChange={(e) => setFormData({ ...formData, img: e.target.value })}
            />

            <label className="block mb-2 font-semibold">Info</label>
            <textarea
              className="block w-full mb-4 p-2 border rounded"
              rows={3}
              value={formData.info}
              onChange={(e) => setFormData({ ...formData, info: e.target.value })}
              required
            />

            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Update
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Home;
