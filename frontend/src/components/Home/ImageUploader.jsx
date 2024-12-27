import React from 'react'

function ImageUploader({ onImageChange, onSend, image }) {
    return (
        <div className="flex flex-col items-center justify-center w-[100%] h-[20%] p-2.5">
            {image && (
                <div className="mb-2.5">
                    <img
                        src={image}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border border-green-500"
                    />
                </div>
            )}
            <div className="flex items-center w-[70%] justify-between">
                <input
                    type="file"
                    accept="image/*"
                    onChange={onImageChange}
                    className="w-[30%] p-2.5 m-2.5"
                />
                <button
                    onClick={onSend}
                    className="w-[20%] p-2.5 rounded-lg border-none outline-none bg-green-600 text-white cursor-pointer hover:opacity-75"
                >
                    Send
                </button>
            </div>
        </div>
    )
}

export default ImageUploader