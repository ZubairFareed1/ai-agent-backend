const { default: Groq } = require("groq-sdk");
const axios = require("axios");
const pool = require("../config/db");

const { getContextFromDatabase } = require("../utils/getContextFromDatabase");
const { getPreventWords } = require("../utils/getPreventWords");

// list of greeting messages
const greeting = [
  "Hello! How can I assist you today?",
  "Hi there! What can I do for you?",
  "Greetings! How may I help you?",
  "Welcome! What's on your mind?",
  "Good day! How can I assist you?",
  "Hey! What can I do for you today?",
  "Hi! How can I assist you?",
  "Hello! How can I help you?",
  "Greetings! What can I do for you?",
  "Welcome! What can I assist you with?",
];

const groqAIToken = "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";

const client = new Groq({
  apiKey: groqAIToken,
});

async function generate() {
  const chatCompletion = await client.chat.completions.create({
    messages: [
      { role: "user", content: "Explain the importance of low latency LLMs" },
    ],
    model: "llama3-8b-8192",
  });

  console.log(chatCompletion.choices[0].message.content);
}

async function getAiResponse(query) {
  try {
    const cont = (await getContextFromDatabase()).rows;
    const words = await getPreventWords();
    const isQueryValid = !words.some((word) =>
      query.toLowerCase().includes(word)
    );
    if (!isQueryValid) {
      return "we cannot provide information on this topic.";
    }
    if (
      query.toLowerCase().includes("hi") ||
      query.toLowerCase().includes("hello") ||
      query.toLowerCase().includes("hey")
    ) {
      return greeting[Math.floor(Math.random() * greeting.length)];
    }
    let context = "";
    cont.forEach((element) => {
      context += element.knowledge_base;
    });
    const question = query;

    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
    You are RAG AI Assistant.
    - - - 
    
    Context: ${context}
    
    - - -
    
    You can only answer from the given context. If question is not related to the context you must only respond with "Answer to this question is not mentioned in the given context.".
            `,
        },
        { role: "user", content: `${question}` },
      ],
      model: "llama3-8b-8192",
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null,
    });

    console.log(chatCompletion.choices[0].message.content);
    const finalResponse = chatCompletion.choices[0].message.content;

    // const result = response.data;

    return finalResponse;
  } catch (error) {
    console.error("Error while processing the question:", error.message);
  }
}

module.exports = getAiResponse;
