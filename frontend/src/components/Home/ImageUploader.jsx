import React from 'react';

function ImageUploader({ onImageChange, onSend, image }) {
    return (
      <div className="relative flex flex-col items-center justify-center w-full p-4 space-y-4">
        {image && (
          <div className="mb-4">
            <img
              src={image}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-xl border-2 border-pink-500/50 shadow-lg shadow-pink-500/20"
            />
          </div>
        )}
  
        <div className="flex flex-col items-center w-full space-y-4 sm:space-y-0 sm:flex-row sm:gap-4">
          <div className="relative w-full sm:w-2/3">
            <input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <button className="w-full py-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl font-semibold text-white hover:from-pink-600 hover:to-violet-600 transition-all duration-200 shadow-lg hover:shadow-pink-500/25">
              Upload Image
            </button>
          </div>
          <button
            onClick={onSend}
            className="w-full sm:w-1/3 py-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl font-semibold text-white hover:from-pink-600 hover:to-violet-600 transition-all duration-200 shadow-lg hover:shadow-pink-500/25"
          >
            Analyze
          </button>
        </div>
      </div>
    );
  }

export default ImageUploader;
