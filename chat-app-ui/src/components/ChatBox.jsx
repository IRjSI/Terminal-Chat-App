import React, { useEffect, useState } from 'react'

const ChatBox = () => {
    const [message, setMessage] = useState("")
    const [name, setName] = useState("")
    const [nameSet, setNameSet] = useState(false)
    const [messages, setMessages] = useState([])
    const [ws, setWs] = useState(null)

    const handleSubmit = (e) => {
      e.preventDefault()

      try {
        ws.send(JSON.stringify({ type: "chat", message }))
        setMessage("")
      } catch (error) {
        console.log(error)
      }
    }

    const handleRegister = (e) => {
      e.preventDefault()

      try {
        ws.send(JSON.stringify({ type: "register", name }))
        setNameSet(true)
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(() => {
      const socket = new WebSocket("ws://localhost:8080")

      socket.onmessage = (event) => {
        setMessages(prev => [...prev, event.data])
      }
      socket.onerror = (err) => console.error("WebSocket error:", err)

      setWs(socket)
      return () => socket.close()
    }, []);


  return (
    <div className="w-full h-screen mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <h3 className="text-white font-semibold text-lg text-center">Chat</h3>
        {nameSet && (
          <p className="text-blue-100 text-sm text-center mt-1">Welcome, {name}!</p>
        )}
      </div>

      {/* Messages Container */}
      <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.length === 0 && nameSet ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, key) => (
            <div key={key} className="flex justify-start">
              <div className="max-w-[85%] bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-200">
                <p className="text-gray-800 text-sm leading-relaxed">{msg}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Section */}
      {nameSet ? (
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'send')}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
            />
            <button
              onClick={handleSubmit}
              disabled={!message.trim()}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <div className="border-t border-gray-200 p-6 bg-white">
          <div className="text-center mb-4">
            <h4 className="text-gray-700 font-medium mb-2">Welcome to Chat!</h4>
            <p className="text-gray-500 text-sm">Please enter your name to get started</p>
          </div>
          <div className="flex flex-col items-center space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'register')}
              placeholder="Enter your name..."
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
            />
            <button
              onClick={handleRegister}
              disabled={!name.trim()}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Join Chat
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatBox  