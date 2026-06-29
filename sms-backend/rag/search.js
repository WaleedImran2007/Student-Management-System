import Knowledge from '../models/Knowledge.js';

import { createEmbeddings } from './embedder.js';
import { cosineSimilarity } from './similarity.js';

export async function searchKnowledge(question) {
    const questionEmbedding = await createEmbeddings(question);

    const chunks = await Knowledge.find();

    const scoredChunks = [];

    for (const chunk of chunks) {
        const similarity = cosineSimilarity(questionEmbedding, chunk.embedding);

        scoredChunks.push({
            document: chunk.document,
            title: chunk.title,
            text: chunk.text,
            similarity,
        });
    }

    scoredChunks.sort((a, b) => b.similarity - a.similarity);

    const threshold = 0.55;

    const relevantChunks = scoredChunks.filter(
        chunk => chunk.similarity >= threshold
    )

    if(relevantChunks.length > 0) {
        return relevantChunks.slice(0, 3);
    }

    return scoredChunks.slice(0, 3);
}