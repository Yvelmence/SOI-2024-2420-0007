import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
  // 1. Grab user info from Clerk
  const { user } = useUser();

  // 2. Check for an admin role in user's public metadata (adjust as needed)
  const isAdmin = user?.publicMetadata?.role === "admin";

  // 3. Slider items in state
  const [sliderData, setSliderData] = useState([
    {
      name: "Kidney",
      img: "./images/cardImages/kidney x100 H&E 75.jpg",
      info: "Without your kidney, your body would be filled with waste. ...",
    },
    {
      name: "Lung",
      img: "./images/cardImages/kidney x100 H&E 76.jpg",
      info: "Lungs are important organs that help with gaseous exchange. ...",
    },
    {
      name: "Liver",
      img: "./images/cardImages/kidney x100 H&E 77.jpg",
      info: "The liver is one of the largest organs in the body ...",
    },
    {
      name: "Testes",
      img: "./images/cardImages/kidney x100 H&E 78.jpg",
      info: "Other than the ovaries, the testes also play a role in reproduction. ...",
    },
    {
      name: "Small Intestine",
      img: "./images/cardImages/kidney x100 H&E 79.jpg",
      info: "The small intestine helps with digestion and absorption of nutrients. ...",
    }
  ]);

  // 4. State to control forms
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // 5. Form data
  const [formData, setFormData] = useState({
    name: "",
    img: "",
    info: ""
  });

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

 
  // ADD ITEM
  const handleAddItem = (e) => {
    e.preventDefault();
    setSliderData([...sliderData, formData]);
    setFormData({ name: "", img: "", info: "" });
    setShowAddForm(false);
  };

  // EDIT ITEM
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

  // DELETE ITEM
  const handleDeleteItem = (index) => {
    setSliderData(sliderData.filter((_, i) => i !== index));
  };

  // CANCEL ANY FORM
  const handleCancel = () => {
    setFormData({ name: "", img: "", info: "" });
    setShowAddForm(false);
    setShowEditForm(false);
    setEditIndex(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8 flex flex-col items-center justify-center">
      {/* Slick custom dots style */}
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

      {/* Only show "Add New Tissue" if user is admin */}
      {isAdmin && (
        <button
          onClick={() => setShowAddForm(true)}
          className="mb-8 bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition"
        >
          + Add New Tissue
        </button>
      )}

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
                  <h2 className="text-2xl font-bold text-white mb-4">{item.name}</h2>
                  <p className="text-gray-300 text-sm leading-relaxed flex-grow">
                    {item.info}
                  </p>

                  {/* Show Edit/Delete only if admin */}
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

      {/* ADD FORM (Admin only) */}
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

      {/* EDIT FORM (Admin only) */}
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
