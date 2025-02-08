import React from 'react';

function ImageUploader({ onImageChange, onSend, image }) {
    return (
        <div className="relative flex flex-col items-center justify-center w-full p-2.5 space-y-4">
            {image && (
                <div className="mb-2.5">
                    <img
                        src={image}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border border-yellow-500"
                    />
                </div>
            )}

            <div className="flex flex-col items-center w-full space-y-4 sm:space-y-0 sm:flex-row sm:justify-between">
                <div className="relative w-full sm:w-2/5">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <button
                        className="w-full p-2.5 rounded-lg border-none outline-none bg-pink-600 text-white cursor-pointer hover:opacity-75"
                    >
                        Upload
                    </button>
                </div>
                <button
                    onClick={onSend}
                    className="w-full sm:w-1/4 p-2.5 rounded-lg border-none outline-none bg-pink-600 text-white cursor-pointer hover:opacity-75"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default ImageUploader;
