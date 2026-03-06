import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined in environment variables. AI features will not work.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

// Using gemini-3.1-flash for cutting-edge, ultra-fast task generation
export const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash" });
