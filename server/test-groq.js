const Groq = require("groq-sdk");
const dotenv = require("dotenv");

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function testGroq() {
  try {
    console.log("Testing Groq connection...");

    const response = await groq.chat.completions.create({
      model: "qwen/qwen3.8-27b",
      messages: [
        {
          role: "user",
          content: "Reply with only the word: SUCCESS"
        }
      ],
      temperature: 0,
      max_completion_tokens: 20,
      reasoning_effort: "none"
    });

    console.log("Groq response:");
    console.log(response.choices[0].message.content);

  } catch (error) {
    console.error("Groq test failed:");
    console.error(error);
  }
}

testGroq();