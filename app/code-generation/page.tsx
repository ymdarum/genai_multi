'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function CodeGeneration() {
  const [prompt, setPrompt] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
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
          model: 'codellama',
          prompt: prompt,
          stream: false
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && typeof data.response === 'string') {
        setGeneratedCode(data.response);
      } else {
        console.log('Unexpected response structure:', data);
        throw new Error('Unexpected response structure');
      }
    } catch (error) {
      console.error('Error details:', error);
      setGeneratedCode('Error generating code. Please try again.');
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-5">Code Generation</h1>
      <Textarea
        placeholder="Describe the code you want to generate..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full mb-4"
      />
      <Button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Code'}
      </Button>
      {generatedCode && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Generated Code:</h2>
          <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
            <code className="whitespace-pre-wrap">{generatedCode}</code>
          </pre>
        </div>
      )}
    </div>
  )
}

