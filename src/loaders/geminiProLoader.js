import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenvFlow from "dotenv-flow";

dotenvFlow.config();

const geminiPro = (input) => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("API_KEY is not defined");
    return null;
  }

  const gpt = new GoogleGenerativeAI(apiKey);

  // Listen for the ready event
  if (gpt) {
    console.log("Doc Brown has Loaded on geminiPro");
  } else {
    console.error("geminiPro Failed to Load");
    return null;
  }

  return gpt(input);
};

export default geminiPro;
