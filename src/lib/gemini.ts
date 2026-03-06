import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined in environment variables. AI features will not work.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

// Using gemini-2.0-flash for high-speed, state-of-the-art task generation
export const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
