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

        // Extract result
        const result = response.data;

      //   console.log(result)
        const answer = result.answer || ""; // Extract answer
        const score = result.score || 0; // Extract score (if available)
        
        // // Validation: Check if the answer is meaningful and high confidence
        const isAnswerValid = answer.trim() !== ""; // Ensure the answer is non-empty
        
        // // Respond based on validation
        const finalResponse = (isAnswerValid && score > 0.05)
        ? `${answer}`
        : "Try another question, as the answer is not in the given context.";
        
      //   console.log(finalResponse);
          return finalResponse;
    } catch (error) {
        console.error("Error while processing the question:", error.message);
    }
}

// getAiResponse("When Allama Iqbal dead?")
module.exports = getAiResponse