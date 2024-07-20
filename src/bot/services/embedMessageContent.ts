import '@tensorflow/tfjs-node' // Import TensorFlow.js for Node.js backend
import * as use from '@tensorflow-models/universal-sentence-encoder'

let model = null

const loadModel = async () => {
  if (!model) {
    model = await use.load()
  }
  return model
}

const embedMessageContent = async (tokens) => {
  const tokenizedText = tokens.join(' ')
  const model = await loadModel()
  const embeddings = await model.embed([tokenizedText])
  const embeddingArray = embeddings.arraySync()
  return embeddingArray[0]
}

export default embedMessageContent

// Example input text
// const tokens = ['this', 'is', 'an', 'example']
// Example usage
// embedMessageContent(tokens).then((embeddings) => {
//   console.log(embeddings)
// })
