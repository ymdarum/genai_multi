import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GenAI Navigator',
  description: 'Navigate through different GenAI functionalities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
      </head>
      <body>
        <div className="flex h-screen bg-gray-100">
          <nav className="w-64 bg-white shadow-md">
            <div className="p-5">
              <h1 className="text-2xl font-bold mb-5">GenAI Navigator</h1>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/text-generation" className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded">
                    Text Generation
                  </Link>
                </li>
                <li>
                  <Link href="/chatbot" className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded">
                    Chatbot
                  </Link>
                </li>
                <li>
                  <Link href="/rag" className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded">
                    RAG
                  </Link>
                </li>
                <li>
                  <Link href="/code-generation" className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded">
                    Code Generation
                  </Link>
                </li>                
                {/* <li>
                  <Link href="/image-generation" className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded">
                    Image Generation
                  </Link>
                </li>                 */}
              </ul>
            </div>
          </nav>
          <main className="flex-1 p-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

