'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function TextGeneration() {
  const [prompt, setPrompt] = useState('')
  const [generatedText, setGeneratedText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    try {
      setLoading(true)
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3.2',
          prompt: prompt,
          stream: false
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && typeof data.response === 'string') {
        setGeneratedText(data.response);
      } else {
        console.log('Unexpected response structure:', data);
        throw new Error('Unexpected response structure');
      }
    } catch (error) {
      console.error('Error details:', error);
      setGeneratedText('Error generating text. Please try again.');
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-5">Text Generation</h1>
      <Textarea
        placeholder="Enter your prompt here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full mb-4"
      />
      <Button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Text'}
      </Button>
      {generatedText && (
        <div className="mt-4 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Generated Text:</h2>
          <p className="whitespace-pre-wrap">{generatedText}</p>
        </div>
      )}
    </div>
  )
}

