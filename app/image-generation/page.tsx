'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ImageGeneration() {
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
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
          model: 'llava',
          prompt: prompt,
          stream: false  // Disable streaming to get a single JSON response
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Read the response as text first
      const text = await response.text();
      
      try {
        // Try to parse the response as JSON
        const data = JSON.parse(text);
        if (data && data.response) {
          setImageUrl(data.response);
        } else {
          console.log('Unexpected response structure:', data);
          throw new Error('Unexpected response structure');
        }
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.log('Raw response:', text);
        throw new Error('Failed to parse response as JSON');
      }
    } catch (error) {
      console.error('Error details:', error);
      setImageUrl('');
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-5">Image Generation</h1>
      <Input
        placeholder="Describe the image you want to generate..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full mb-4"
      />
      <Button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Image'}
      </Button>
      {imageUrl && (
        <div className="mt-4">
          <img src={imageUrl} alt="Generated" className="max-w-full h-auto rounded shadow" />
        </div>
      )}
    </div>
  )
}

