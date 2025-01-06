import React, { useState } from 'react'
import axios from 'axios'
import ImageUploader from '../components/Home/ImageUploader'
import MessageList from '../components/Home/MessageList'

function Home() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const [image, setImage] = useState(null)

  const handleSend = async () => {
    if (input.trim() || image) {
      const userMessage = { image, text: input }
      setMessages(prevMessages => [...prevMessages, userMessage])
      setInput("")

      if (image) {
        try {
          const predictionText = await predictImage(image)
          const botMessage = {
            image: null,
            text: `Prediction: ${predictionText}`,
          }
          setMessages(prevMessages => [...prevMessages, botMessage])
        } catch (error) {
          console.error("Prediction error:", error)
          const errorMessage = {
            image: null,
            text: `Error: ${error.message}. Please try again.`,
          }
          setMessages(prevMessages => [...prevMessages, errorMessage])
        }
      }
      setImage(null)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file')
        return
      }
      const imageUrl = URL.createObjectURL(file)
      setImage(imageUrl)
    }
  }

  const predictImage = async (imageUrl) => {
    try {
      const formData = new FormData()
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      formData.append('image', blob)

      const res = await axios.post('http://localhost:5000/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      return `${res.data.label} (${res.data.confidence} confidence)`
    } catch (error) {
      throw new Error("Failed to get prediction from the server")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-gray-900">

      {/* Output */}
      <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 transition-colors duration-200">
        <MessageList messages={messages} />
      </div>

      {/* Buttons */}
      <ImageUploader
        onImageChange={handleImageChange}
        onSend={handleSend}
        image={image}
      />
    </div>
  )
}

export default Home