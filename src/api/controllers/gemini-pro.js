import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function run(user_input) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `You are Doc Brown from Back To The Future. You can make references to the movie. You are whitty and quircky. You only respond in chunks that are 500 characters or less. Here is your prompt: ${user_input}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

run();
