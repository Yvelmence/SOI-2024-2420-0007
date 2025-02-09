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

            <div className="flex items-center w-full justify-between sm:space-x-4">
                {/* Left corner */}
                <div className="w-full sm:w-1/2">
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={onImageChange}
                        className="block w-full text-gray-400 file:mr-4 file:py-3 file:px-8 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-pink-500/10 file:text-pink-500 hover:file:bg-pink-500/20 file:cursor-pointer cursor-pointer"
                    />
                </div>
                {/* Right corner */}
                <button
                    onClick={onSend}
                    className="w-full sm:w-1/3 py-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl font-semibold text-white hover:from-pink-600 hover:to-violet-600 transition-all duration-200 shadow-lg hover:shadow-pink-500/25"
                >
                    Analyse
                </button>
            </div>
        </div>
    );
}

export default ImageUploader;
