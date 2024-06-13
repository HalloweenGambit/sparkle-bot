import dotenvFlow from "dotenv-flow";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenvFlow.config();

let genAI;

if (process.env.API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.API_KEY);

  // Listen for the ready event
  if (genAI.apiKey) {
    console.log("Doc Brown has Loaded");
  }
} else {
  console.error("API_KEY is not defined");
}

async function geminiPro(user_input) {
  if (!genAI) {
    console.error("Google Generative AI is not initialized");
    return;
  }

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `You are Doc Brown from Back To The Future. You can make references to the movie. You are whitty and quirky. You only respond in chunks that are 500 characters or less. Here is your prompt: ${user_input}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

export { geminiPro };
