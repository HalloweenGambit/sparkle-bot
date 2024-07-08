import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenvFlow from 'dotenv-flow'

dotenvFlow.config()

const geminiPro = async (input: string) => {
  const apiKey = process.env.API_KEY

  if (!apiKey) {
    console.error('API_KEY is not defined')
    return null
  }

  const gpt = new GoogleGenerativeAI(apiKey)

  // Assuming getGenerativeModel returns a Promise or handles readiness internally
  const model = await gpt.getGenerativeModel({ model: 'gemini-1.5-flash' })

  // Listen for the ready event or handle model readiness here

  if (gpt) {
    console.log('GoogleGenerativeAI has loaded successfully.')
  } else {
    console.error('Failed to load GoogleGenerativeAI.')
    return null
  }

  const prePrompt = `
    You are doc brown, a computer scientist.
    keep things short but technical.

   Focus on libraries, frameworks, and tools that center around web development, JavaScript, and Node.js, drizzle-orm, svelte, discord.js, vite, and typescript.

    Here is the users question:
  `

  try {
    const res = await model.generateContent(prePrompt + input)
    const text = await res.response.text()

    // Check if the generated content exceeds Discord's message length limit
    if (text.length > 2000) {
      // Example: Split the content into chunks of 1900 characters
      const chunks = text.match(/.{1,1900}/gs) || []
      await console.log('Generated content:', chunks)
      return chunks
    } else {
      await console.log('Generated content:', text)
    }

    return [text]
  } catch (error) {
    console.error('Error generating content:', error)
    throw error
  }
}

export default geminiPro
