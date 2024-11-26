'use client'

import React from 'react'

export default function Home() {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-5">Welcome to GenAI Navigator</h1>
        <p className="text-gray-600 mb-8">
          Explore the following Generative AI functionalities using the navigation menu on the left:
        </p>
        <ul className="list-disc pl-5 text-gray-600 mb-8">
          <li>Text Generation: Generate human-like text based on prompts.</li>
          <li>Image Generation: Create images from textual descriptions.</li>
          <li>Code Generation: Generate code snippets based on requirements.</li>
          <li>Chatbot: Interact with a chatbot for various queries.</li>
          <li>RAG: Upload documents and ask questions to get contextually relevant answers.</li>
        </ul>
      </div>
    )
}
  
  