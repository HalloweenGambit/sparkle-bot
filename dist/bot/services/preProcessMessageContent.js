import nlp from 'compromise';
import { stopWords } from '../../utils/stopWords.js';
// Define stopwords set
const stopwords = new Set(stopWords);
// Clean the text
export const cleanText = (text) => text
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove non-alphanumeric characters
    .toLowerCase() // Convert to lowercase
    .trim() // Trim whitespace from both ends
    .replace(/\s+/g, ' '); // Replace multiple spaces with a single space
const lemmatize = (tokens) => {
    // Remove stopwords and lemmatize the terms (if needed)
    const lemmas = tokens
        .filter((term) => !stopwords.has(term)) // Assuming stopwords is a Set<string>
        .map((term) => term); // No need for lemma transformation here
    return lemmas;
};
export const preProcessQuestion = async (question) => {
    try {
        const cleanedQuestion = cleanText(question);
        // Tokenize and process with Compromise
        const doc = nlp(cleanedQuestion);
        const tokens = doc.terms().out('array'); // Get array of tokens
        const lemmas = lemmatize(tokens);
        const posTags = doc.terms().out('tags'); // Get POS tags
        const namedEntities = doc.match('#Person|#Place|#Organization').out('array'); // Extract named entities
        const sentenceTokens = doc.sentences().out('array'); // Split into sentences
        const termFrequencies = tokens.reduce((freq, term) => {
            freq[term] = (freq[term] || 0) + 1;
            return freq;
        }, {});
        return {
            originalText: question,
            cleanedText: cleanedQuestion,
            lemmas,
            tokens,
            posTags,
            namedEntities,
            sentenceTokens,
            termFrequencies,
        };
    }
    catch (error) {
        console.error('Error processing question:', error);
        return {
            originalText: question,
            cleanedText: '',
            lemmas: [],
            tokens: [],
            posTags: [],
            namedEntities: [],
            sentenceTokens: [],
            termFrequencies: {},
        };
    }
};
// Example usage
// const question = 'Is this project open source?'
// const exampleResponse = await preProcessQuestion(question)
// console.log(exampleResponse)
