import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
  const navigate = useNavigate();
  const { user } = useUser();

  // Check if user is admin
  const isAdmin = user?.publicMetadata?.role === 'admin';

  // -------------------------
  // Load from localStorage OR use the provided dataset
  // -------------------------
  const [sliderData, setSliderData] = useState(() => {
    const storedTissues = localStorage.getItem("tissues");
    return storedTissues
      ? JSON.parse(storedTissues)
      : [
          {
            name: "Kidney",
            img: "./images/cardImages/kidney x100 H&E 75.jpg",
            info: "Without your kidney, your body would be filled with waste. Let's see what it looks like under the microscope!"
          },
          {
            name: "Lung",
            img: "./images/cardImages/kidney x100 H&E 76.jpg",
            info: "Lungs are essential for gaseous exchange. Ever wonder how it looks under a microscope?"
          },
          {
            name: "Liver",
            img: "./images/cardImages/kidney x100 H&E 77.jpg",
            info: "The liver is one of the largest organs in the body. Click here to find out more!"
          },
          {
            name: "Testes",
            img: "./images/cardImages/kidney x100 H&E 78.jpg",
            info: "Testes are vital in sperm production. Learn about their microscopic structure here!"
          },
          {
            name: "Small Intestine",
            img: "./images/cardImages/kidney x100 H&E 79.jpg",
            info: "The small intestine helps with nutrient absorption. Read more to discover its unique folds!"
          }
        ];
  });

  // -------------------------
  // Persist to localStorage if sliderData changes
  // -------------------------
  useEffect(() => {
    localStorage.setItem("tissues", JSON.stringify(sliderData));
  }, [sliderData]);

  // -------------------------
  // Admin-only form states
  // -------------------------
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // -------------------------
  // Form data
  // -------------------------
  const [formData, setFormData] = useState({
    name: "",
    img: "",
    info: ""
  });

  // -------------------------
  // Slider settings
  // -------------------------
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

  // Helper: update localStorage & state
  const saveToLocalStorage = (data) => {
    localStorage.setItem("tissues", JSON.stringify(data));
    setSliderData(data);
  };

  // -------------------------
  // ADD ITEM (Admin)
  // -------------------------
  const handleAddItem = (e) => {
    e.preventDefault();
    // Prevent adding empty fields
    if (!formData.name.trim() || !formData.img.trim() || !formData.info.trim()) {
      return;
    }
    const updatedData = [...sliderData, formData];
    saveToLocalStorage(updatedData);

    // Reset form and hide
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
    if (!formData.name.trim() || !formData.img.trim() || !formData.info.trim()) {
      return;
    }
    const updatedData = sliderData.map((item, i) =>
      i === editIndex ? formData : item
    );
    saveToLocalStorage(updatedData);

    // Reset form and hide
    setFormData({ name: "", img: "", info: "" });
    setEditIndex(null);
    setShowEditForm(false);
  };

  // -------------------------
  // DELETE ITEM (Admin)
  // -------------------------
  const handleDeleteItem = (index) => {
    const updatedData = sliderData.filter((_, i) => i !== index);
    saveToLocalStorage(updatedData);
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
  // Navigate to /tissue/:name
  // -------------------------
  const handleReadMore = (itemName) => {
    navigate(`/tissue/${itemName.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8 flex flex-col items-center justify-center relative">
      <h1 className="text-6xl font-bold text-white mb-10 text-center tracking-wider">
        Learn about Tissues here!
      </h1>

      {/* Admin-only: "Add" button */}
      {isAdmin && (
        <button
          onClick={() => setShowAddForm(true)}
          className="mb-8 bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition"
        >
          + Add New Tissue
        </button>
      )}

      {/* -------------------------
        ADD FORM (only if showAddForm=true)
      ------------------------- */}
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
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="E.g. Heart"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Image URL</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded"
              value={formData.img}
              onChange={(e) =>
                setFormData({ ...formData, img: e.target.value })
              }
              placeholder="E.g. ./images/cardImages/heart.jpg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Info</label>
            <textarea
              className="w-full px-3 py-2 rounded"
              value={formData.info}
              onChange={(e) =>
                setFormData({ ...formData, info: e.target.value })
              }
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

      {/* -------------------------
        EDIT FORM (only if showEditForm=true)
      ------------------------- */}
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
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Image URL</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded"
              value={formData.img}
              onChange={(e) =>
                setFormData({ ...formData, img: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Info</label>
            <textarea
              className="w-full px-3 py-2 rounded"
              value={formData.info}
              onChange={(e) =>
                setFormData({ ...formData, info: e.target.value })
              }
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

      {/* -------------------------
        Tissue Slider
      ------------------------- */}
      <div className="max-w-7xl w-full">
        <Slider {...settings}>
          {sliderData.map((item, index) => (
            <div key={index} className="px-4 h-[500px]">
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl h-full flex flex-col transform transition-transform duration-300 hover:scale-105">
                <div className="w-full h-56 flex-shrink-0">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {item.name}
                  </h2>
                  <p className="text-gray-300 text-sm leading-relaxed flex-grow">
                    {item.info}
                  </p>

                  {/* READ MORE BUTTON */}
                  <button
                    onClick={() => handleReadMore(item.name)}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 transform hover:scale-105 mt-4"
                  >
                    Read More
                  </button>

                  {/* Admin-only Edit/Delete Buttons */}
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
    </div>
  );
}

export default Home;
