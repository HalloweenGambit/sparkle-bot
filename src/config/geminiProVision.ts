import * as fs from 'fs'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.API_KEY)

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString('base64'),
      mimeType,
    },
  }
}

export async function geminiProVision() {
  //   const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  //   const prompt =
  //     "What is the difference between the two images? Understand whats written on the paper.";
  //   const imageParts = [
  //     fileToGenerativePart("pen.jpg", "image/jpeg"),
  //     fileToGenerativePart("page-and-pen.jpg", "image/jpeg"),
  //   ];
  //   const result = await model.generateContent([prompt, ...imageParts]);
  //   const response = await result.response;
  //   const text = response.text();
  //   console.log(text);
}

geminiProVision()
