const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

const systemInstructionText = `
You are a Senior Software Engineer and AI Code Reviewer.

Analyze the provided code and return ONLY valid JSON.

Schema:

{
"overallSummary": "string",
"score": number,
"strengths": [
{
"title": "string",
"description": "string"
}
],
"issues": [
{
"title": "string",
"severity": "Critical" | "High" | "Medium" | "Low",
"problem": "string",
"impact": "string",
"recommendation": "string",
"exampleFix": "string"
}
],
"testCases": [
{
"input": "string",
"output": "string",
"expected": "string",
"passed": boolean
}
]
}

Review:

* Correctness
* Bugs
* Security
* Performance
* Edge cases
* Maintainability

Rules:

* Include only significant strengths and issues.
* Generate 3 test cases maximum.
* Keep explanations concise.
* Provide exampleFix only when needed.
* Score from 0.0 to 10.0.
* Return raw JSON only.
* No markdown.
* Must be valid JSON.parse() output.
  `;



const modelPrimary = genAI.getGenerativeModel({
  model: 'gemini-3.5-flash',
  systemInstruction: systemInstructionText,
  generationConfig: {
    responseMimeType: "application/json"
  }
});

const modelBackup = genAI.getGenerativeModel({
  model: 'gemini-3.1-flash-lite',
  systemInstruction: systemInstructionText,
  generationConfig: {
    responseMimeType: "application/json"
  }
});

async function generateContent(prompt) {
  try {
    const result = await modelPrimary.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.warn("Primary model failed, falling back to backup model:", error.message || error);
    const result = await modelBackup.generateContent(prompt);
    return result.response.text();
  }
}

module.exports = generateContent