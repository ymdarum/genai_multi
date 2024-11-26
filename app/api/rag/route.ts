import { NextRequest, NextResponse } from 'next/server'
import { ChatOllama } from '@langchain/ollama'
import { OllamaEmbeddings } from '@langchain/ollama'
import { MemoryVectorStore } from "langchain/vectorstores/memory"
import { Document } from '@langchain/core/documents'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

// Initialize Ollama clients with correct model names
const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",  // This is correct for embeddings
  baseUrl: "http://localhost:11434/",
  requestOptions: {
    // Remove headers as it is not defined in the type
  }
})

const chatModel = new ChatOllama({
  baseUrl: "http://localhost:11434/",
  model: "llama3.2",
  temperature: 0.3
})

let vectorStore: MemoryVectorStore | null = null

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const files = formData.getAll('documents') as File[]
    const query = formData.get('query') as string

    if (files.length > 0) {
      try {
        // Process documents
        const documents: Document[] = []
        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 500,
          chunkOverlap: 50,
          separators: ["\n\n", "\n", " ", ""],
          keepSeparator: false
        })

        for (const file of files) {
          const text = await file.text()
          if (text.trim().length === 0) {
            continue; // Skip empty files
          }
          const chunks = await textSplitter.createDocuments([text])
          documents.push(...chunks)
        }

        if (documents.length === 0) {
          throw new Error('No valid documents to process');
        }

        // Create vector store
        vectorStore = await MemoryVectorStore.fromDocuments(
          documents,
          embeddings
        )

        return NextResponse.json({ 
          message: 'Documents processed successfully',
          chunkCount: documents.length 
        })
      } catch (error) {
        console.error('Document processing error:', error);
        return NextResponse.json({ 
          error: 'Failed to process documents',
          details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 400 })
      }
    }

    if (query && vectorStore) {
      try {
        // Perform similarity search
        const relevantDocs = await vectorStore.similaritySearch(query, 3)
        
        // Generate context-aware response
        const context = relevantDocs.map((doc: Document) => doc.pageContent).join('\n\n')
        
        // Use LangChain's ChatOllama to handle the response properly
        const response = await chatModel.invoke([
          ["system", "You are a helpful AI assistant. Using only the following context, please answer the question. If the answer cannot be found in the context, say 'I cannot find the answer in the provided context.'"],
          ["human", `Context: ${context}\n\nQuestion: ${query}`]
        ])

        // Return the response content
        return NextResponse.json({ 
          result: response.content,
          status: 'success'
        })
      } catch (error) {
        console.error('Query processing error:', error)
        return NextResponse.json({ 
          error: 'Failed to process query',
          details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
      }
    }

    return NextResponse.json(
      { error: 'Invalid request - No query or documents not processed' },
      { status: 400 }
    )
  } catch (error) {
    console.error('RAG API Error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 