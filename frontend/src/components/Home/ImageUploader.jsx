import React from 'react';

function ImageUploader({ onImageChange, onSend, image }) {
    return (
        <div className="relative flex flex-col items-center justify-center w-[100%] h-[20%] p-2.5">
            {image && (
                <div className="mb-2.5">
                    <img
                        src={image}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border border-yellow-500"
                    />
                </div>
            )}
            <div className="absolute bottom-4 flex items-center w-[70%] justify-between">
                <div className="relative w-[30%]">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <button
                        className="w-[70%] p-2.5 rounded-lg border-none outline-none bg-pink-600 text-white cursor-pointer hover:opacity-75"
                    >
                        Upload
                    </button>
                </div>
                <button
                    onClick={onSend}
                    className="w-[20%] p-2.5 rounded-lg border-none outline-none bg-pink-600 text-white cursor-pointer hover:opacity-75"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default ImageUploader;
