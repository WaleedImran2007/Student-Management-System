import Groq from "groq-sdk";

export async function reflector(question, plan, context, answer) {
    const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY,
    });

    const prompt = `
        - You are a reviewer for a Student Management System AI.

        - Your ONLY job is to verify whether the final answer is fully supported by the provided context.

        - Do not answer the user's question.

        - Do not generate a better answer.

        - Simply judge whether the answer is correct.


        Question: ${question}

        Plan: ${plan}

        Context: ${JSON.stringify(context)}

        Answer: ${answer}

        is this answer fully supported by the context??

        Return only JSON:

        {
            "correct": true/false,
            "confidence": your_confidence_score
            "type": NONE/PLAN_ERROR/ANSWER_ERROR,
            "feedback": "Correctly explain why it is not correct"
        }

        - Example 1:

        question: What is Waleed's CGPA?
        Context: 
        {
            cgpa: 4.0,
        }

        Answer: 
        {
            cgpa: 3.7
        }

        This is the answer error not the plan error

        Response:

        {
            "correct": false,
            "confidence": your_confidence_score (how much you are confident this is correct)
            "type": ANSWER_ERROR,
            "feedback": "There is a Mistake in your answer. Kindly recheck your answer and try generating other one"
        }

        - Example 2:

        Question:
        Who has attendance below 75% and can they sit in finals?

        Plan:
        LOW_ATTENDANCE

        Context:
        Only low attendance students.

        Missing:
        Attendance Policy.

        Responce:

        {
            "correct": false,
            "confidence": your_confidence_score (how much you are confident this is correct)
            "type": PLAN_ERROR,
            "feedback": "There is a Mistake in your plan. You should also check Attendance policy to answer this question"
        }


        - Example 3:

        question: What is Waleed's CGPA?
        Context: 
        {
            cgpa: 4.0,
        }

        Answer: 
        {
            cgpa: 4.0
        }

        This is the correct response
        Response:

        {
            "correct": true,
            "confidence": your_confidence_score (how much you are confident this is correct)
            "type": NONE,
            "feedback": "You generated the correct response. No need for Retrying"
        }
    `

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0,
        response_format: {
            type: "json_object"
        },
        messages: [
            {
                role: "system",
                content: prompt
            },
        ]
    });

    return JSON.parse(completion.choices[0].message.content);
}