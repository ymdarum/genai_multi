'use client'

import React, { useState } from 'react'

export default function RAGPage() {
  const [query, setQuery] = useState('')
  const [documents, setDocuments] = useState<File[]>([])
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsProcessing(true)
      const files = Array.from(e.target.files)
      setDocuments(files)

      // Process documents immediately upon upload
      const formData = new FormData()
      files.forEach(file => {
        formData.append('documents', file)
      })

      try {
        const response = await fetch('/api/rag', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Failed to process documents')
        }

        setIsProcessing(false)
      } catch (error) {
        console.error('Error processing documents:', error)
        alert('Failed to process documents. Please try again.')
        setIsProcessing(false)
        setDocuments([])
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('query', query)

      const response = await fetch('/api/rag', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      setResult(data.result)
    } catch (error) {
      console.error('Error getting response:', error)
      alert('Failed to get response. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">RAG (Retrieval Augmented Generation)</h1>
      <p className="text-gray-600 mb-8">
        Upload documents and ask questions to get contextually relevant answers.
      </p>

      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">Upload Documents</label>
        <input
          type="file"
          multiple
          accept=".txt,.pdf,.doc,.docx"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          disabled={isProcessing}
        />
        {isProcessing && (
          <p className="mt-2 text-sm text-blue-600">Processing documents...</p>
        )}
        {documents.length > 0 && !isProcessing && (
          <p className="mt-2 text-sm text-green-600">
            {documents.length} document(s) processed successfully
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Your Question</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Ask a question about your documents..."
          />
        </div>

        <button
          type="submit"
          disabled={!query || documents.length === 0 || isLoading || isProcessing}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 
            disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : 'Submit'}
        </button>
      </form>

      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Response:</h2>
          <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
            {result}
          </div>
        </div>
      )}
    </div>
  )
} 