import '@tensorflow/tfjs-node' // Import TensorFlow.js for Node.js backend
import * as use from '@tensorflow-models/universal-sentence-encoder'
import { Tensor2D } from '@tensorflow/tfjs-node'

// Function to embed text using Universal Sentence Encoder
const embedTokens = async (tokens: string[]) => {
  const tokenizedText = tokens.join(' ') // Join tokens to form a single string for embedding
  const model = await use.load()
  const embeddings = await model.embed([tokenizedText])
  return embeddings.arraySync()
}

export default embedTokens

// Example input text
const tokens = ['This', 'is', 'an', 'example.']

// Example usage
embedTokens(tokens).then((embeddings) => {
  console.log(embeddings)
})
