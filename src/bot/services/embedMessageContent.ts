import '@tensorflow/tfjs-node' // Import TensorFlow.js for Node.js backend
import * as use from '@tensorflow-models/universal-sentence-encoder'
import { Tensor2D } from '@tensorflow/tfjs-node'

// Function to embed text using Universal Sentence Encoder
const embedMessageContent = async (tokens: string[]) => {
  const tokenizedText = tokens.join(' ') // Join tokens to form a single string for embedding
  const model = await use.load()
  const embeddings = await model.embed(tokenizedText)
  return embeddings.arraySync()
}

export default embedMessageContent

// Example input text
// const tokens = ['this', 'is', 'an', 'example']
// Example usage
// embedMessageContent(tokens).then((embeddings) => {
//   console.log(embeddings)
// })
