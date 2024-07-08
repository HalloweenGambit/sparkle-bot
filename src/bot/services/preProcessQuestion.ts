import nlp from 'compromise'
import { stopWords } from '../../utils/stopWords'

// Define stopwords set
const stopwords = new Set(stopWords)

// Clean the text
const cleanText = (text) =>
  text
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove non-alphanumeric characters
    .toLowerCase() // Convert to lowercase
    .trim() // Trim whitespace from both ends
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space

const preProcessQuestion = async (question) => {
  try {
    const cleanedQuestion = cleanText(question)

    // Tokenize and process with Compromise
    const doc = nlp(cleanedQuestion)
    const terms = doc.terms().json()

    // Remove stopwords and lemmatize the terms
    const lemmas = terms
      .filter((term) => !stopwords.has(term.text))
      .map((term) => term.lemma || term.text)

    return lemmas
  } catch (error) {
    console.error('Error processing question:', error)
    return []
  }
}

// Example usage
const question = 'Is this project open source?'
preProcessQuestion(question).then((lemmas) => {
  console.log(lemmas)
})
