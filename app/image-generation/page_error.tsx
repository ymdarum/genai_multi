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
          model: 'stable-diffusion',
          prompt: prompt,
          stream: false,
          format: 'base64'
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      
      try {
        const data = JSON.parse(text);
        if (data && data.images && data.images[0]) {
          const imageData = `data:image/jpeg;base64,${data.images[0]}`;
          setImageUrl(imageData);
        } else {
          console.log('Unexpected response structure:', data);
          throw new Error('Unexpected response structure');
        }
      } catch (parseError) {
        console.error('Parse Error:', parseError);
        console.log('Raw response:', text);
        throw new Error('Failed to parse response');
      }
    } catch (error) {
      console.error('Error details:', error);
      setImageUrl('');
      alert('Failed to generate image. Please try again.');
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
          <img 
            src={imageUrl} 
            alt="Generated" 
            className="max-w-full h-auto rounded shadow"
            onError={(e) => {
              console.error('Image failed to load');
              setImageUrl('');
              alert('Failed to load generated image');
            }} 
          />
        </div>
      )}
    </div>
  )
}

