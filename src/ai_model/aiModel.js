const axios = require('axios');

async function getAiResponse(query) {
    try {
        const question = query;
        const context =
            `Here are some key points about Allama Iqbal's life:

1. **Early Life**:
   - Born on November 9, 1877, in Sialkot, Punjab, which is now in Pakistan.
   - Completed his early education in Sialkot and later studied at Government College, Lahore.

2. **Education**:
   - Went to Europe for further studies; earned a degree in philosophy from the University of Cambridge and a doctorate from the University of Munich in Germany.

3. **Philosophical Influence**:
   - Influenced by German philosophy, especially the works of Goethe and Nietzsche, as well as the poetry of Persian and Urdu poets.

4. **Literary Contributions**:
   - Renowned poet and philosopher, known for his Urdu and Persian poetry.
   - Major works include "Shikwa" (Complaint), "Jawab-e-Shikwa" (Response to the Complaint), and "Bang-e-Dra" (The Call of the Marching Bell).

5. **Political Involvement**:
   - Advocated for the rights of Muslims in British India and was a key figure in the Pakistan Movement.
   - Emphasized the need for a separate nation for Muslims.

6. **Vision of Pakistan**:
   - Envisioned a separate homeland for Muslims, which later became Pakistan, and is often referred to as Mufakkir-e-Pakistan (The Thinker of Pakistan).

7. **Death**:
   - Died on April 21, 1938, in Lahore, and is buried in the Iqbal Park, Lahore.

8. **Legacy**:
   - Regarded as a national poet of Pakistan and celebrated for his philosophical thoughts on self-discovery and spirituality.
   - His ideas continue to influence Pakistani culture, politics, and education.

9. **Recognition**:
   - Various institutions, parks, and roads are named after him in Pakistan and around the world.
   - His birthday is celebrated as Iqbal Day in Pakistan.

These points highlight the significant aspects of Allama Iqbal's life, his contributions to literature, philosophy, and the political landscape of South Asia.`;

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

        console.log(result)
        return result.answer;
        // const answer = result.answer || ""; // Extract answer
        // const score = result.score || 0; // Extract score (if available)

        // // Validation: Check if the answer is meaningful and high confidence
        // const isAnswerValid = answer.trim() !== ""; // Ensure the answer is non-empty

        // // Respond based on validation
        // const finalResponse = (isAnswerValid && score > 0.1)
        //     ? `${answer}`
        //     : "Try another question, as the answer is not in the given context.";

        // console.log(finalResponse);
    } catch (error) {
        console.error("Error while processing the question:", error.message);
    }
}

// getAiResponse("When Allama Iqbal dead?")
module.exports = getAiResponse