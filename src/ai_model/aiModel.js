const axios = require('axios');

async function getAiResponse() {
    try {
        const question = "who born in africa?";
        const context =
            "Elon Musk was born in Pretoria, South Africa. Trees are vital for life on Earth, providing oxygen, absorbing carbon dioxide, and offering shade and shelter. They prevent soil erosion, support biodiversity, and enhance natural beauty.";

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
        console.log(result.score)
        const answer = result.answer || ""; // Extract answer
        const score = result.score || 0; // Extract score (if available)

        // Validation: Check if the answer is meaningful and high confidence
        const isAnswerValid = answer.trim() !== ""; // Ensure the answer is non-empty

        // Respond based on validation
        const finalResponse = (isAnswerValid && score > 0.1)
            ? `${answer}`
            : "Try another question, as the answer is not in the given context.";

        console.log(finalResponse);
    } catch (error) {
        console.error("Error while processing the question:", error.message);
    }
}

getAiResponse()
module.exports = getAiResponse