'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Message = {
  text: string;
  sender: 'user' | 'bot';
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' as const }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    
    try {
      setLoading(true)
      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3.2',
          messages: [{
            role: 'user',
            content: input
          }],
          stream: false // Disable streaming for simpler handling
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.message && data.message.content) {
        const botMessage = { 
          text: data.message.content,
          sender: 'bot' as const 
        }
        setMessages(prev => [...prev, botMessage])
      } else {
        console.error('Unexpected response structure:', data);
        throw new Error('Unexpected response structure');
      }
    } catch (error) {
      console.error('Error details:', error)
      const errorMessage = { 
        text: 'Sorry, I encountered an error. Please try again.', 
        sender: 'bot' as const 
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-5">Chatbot</h1>
      <div className="bg-white rounded shadow p-4 h-96 overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
          >
            <span 
              className={`inline-block p-2 rounded ${
                message.sender === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200'
              }`}
            >
              {message.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <Button 
          onClick={handleSend} 
          disabled={loading || !input.trim()}
        >
          {loading ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </div>
  )
}


