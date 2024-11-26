import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { type, prompt } = body

    switch (type) {
      case 'text':
        const completion = await openai.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "gpt-3.5-turbo",
        })
        return NextResponse.json({ result: completion.choices[0].message.content })

      case 'image':
        const image = await openai.images.generate({
          prompt,
          n: 1,
          size: "1024x1024",
        })
        return NextResponse.json({ result: image.data[0].url })

      case 'code':
        const codeCompletion = await openai.chat.completions.create({
          messages: [
            { 
              role: "system", 
              content: "You are a helpful programming assistant. Provide only code as response, no explanations." 
            },
            { role: "user", content: prompt }
          ],
          model: "gpt-3.5-turbo",
        })
        return NextResponse.json({ result: codeCompletion.choices[0].message.content })

      case 'chat':
        const chatCompletion = await openai.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "gpt-3.5-turbo",
        })
        return NextResponse.json({ result: chatCompletion.choices[0].message.content })

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }
  } catch (error) {
    console.error('AI API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 