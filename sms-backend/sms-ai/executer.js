import { registry } from "./registry.js";
import Groq from "groq-sdk";

export async function executer(plan, user, originalMessage, history = []) {
    const context = {};

    for(const step of plan.plan) {
        const tool = registry[step.tool];

        if (!tool) {
            console.warn(`Unknown tool in plan: ${step.tool}`);
            continue;
        }

        await tool(context, step, user);
    }

    // synthesize a natural-language reply from context
    const answer = await synthesize(context, user, originalMessage, history);

    return {
        answer,
        context
    }
}

async function synthesize(context, user, originalMessage, history) {
    if (context.directReply) return context.directReply;

    // If a tool flagged a permission error, return that.
    if (context.error) return context.error;

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const systemPrompt = `
        You are a helpful assistant for a Student Management System.

        Address the user by their first name when appropriate, especially in greetings.

        Be friendly, concise, and professional.

        Never invent data. Use only the information provided.

        Donot tell the user which tool is enable. For example: Hi user it seems general chat is enabled.

        If the user uses pronouns like "his", "her", "their" etc — resolve who they mean from conversation history.

        You will receive data collected from the database and your job is to answer
        the user's original question in a clear, professional, and concise way.
        Never make up data. Only use what is provided to you.
        If the data is empty, say so politely.
        Keep replies under 200 words unless a detailed report was requested.
    `;

    const conversationHistory = history
    .filter(m => m.role === 'user' || m.role === 'ai')
    .map(m => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.content,
    }));


    const userPrompt = `
        Original question: "${originalMessage}"

        Current User:
        Name: ${user.username}
        Role: ${user.role}

        Collected data:
        ${JSON.stringify(context, null, 2)}

        Answer the question using only the data above and conversation history.
    `;

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
        messages: [
            { role: "system", content: systemPrompt },
            ...conversationHistory,
            { role: "user",   content: userPrompt  }
        ]
    });

    return completion.choices[0].message.content;
}