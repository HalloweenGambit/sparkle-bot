import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config(".env.local");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
