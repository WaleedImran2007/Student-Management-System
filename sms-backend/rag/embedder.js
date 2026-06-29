import { pipeline } from '@huggingface/transformers';

let embedder = null;

async function getEmbedder() {
    if(!embedder) {
        console.log('Loading Embedding Model...');
        embedder = await pipeline(
            "feature-extraction",
            "Xenova/bge-small-en-v1.5"
        );

        console.log('Embedding Model Loaded');
    }

    return embedder;
};

export async function createEmbeddings(text) {
    const model = await getEmbedder();

    const output = await model(text, {
        pooling: "mean",
        normalize: true,
    });

    return Array.from(output.data);
}