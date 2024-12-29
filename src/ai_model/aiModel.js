const axios = require('axios');
const pool = require('../config/db');

const { getContextFromDatabase} = require('../utils/getContextFromDatabase')

async function getAiResponse(query) {
    try {
       const cont = (await getContextFromDatabase()).rows;
       let context = '';
       cont.forEach((element) => {
          context += element.knowledge_base;
         });         
         const question = query;
        
        const response = await axios.post(      
            'https://api-inference.huggingface.co/models/deepset/roberta-base-squad2',
            {
                inputs: { question, context },
            },
            {
                headers: {
                    Authorization: `Bearer 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`,
                },
            }
        );

        const result = response.data;

        const answer = result.answer || "";
        const score = result.score || 0;
        
        const isAnswerValid = answer.trim() !== "";
        
        const finalResponse = (isAnswerValid && score > 0.05)
        ? `${answer}`
        : "Try another question, as the answer is not in the given context.";
        
          return finalResponse;
    } catch (error) {
        console.error("Error while processing the question:", error.message);
    }
}

module.exports = getAiResponse