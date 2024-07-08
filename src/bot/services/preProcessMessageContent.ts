import nlp from 'compromise'
import { stopWords } from '../../utils/stopWords'

// Define stopwords set
const stopwords = new Set(stopWords)

// Clean the text
const cleanText = (text: string) =>
  text
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove non-alphanumeric characters
    .toLowerCase() // Convert to lowercase
    .trim() // Trim whitespace from both ends
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space

const lemmatize = (tokens: string[]): string[] => {
  // Remove stopwords and lemmatize the terms (if needed)
  const lemmas = tokens
    .filter((term) => !stopwords.has(term)) // Assuming stopwords is a Set<string>
    .map((term) => term) // No need for lemma transformation here

  return lemmas
}

const preProcessQuestion = async (question: string) => {
  try {
    const cleanedQuestion = cleanText(question)

    // Tokenize and process with Compromise
    const doc = nlp(cleanedQuestion)
    return doc
  } catch (error) {
    console.error('Error processing question:', error)
    return []
  }
}

// Example usage
const question = 'Is this project open source?'
const exampleResponse = await preProcessQuestion(question)
console.log(exampleResponse)
