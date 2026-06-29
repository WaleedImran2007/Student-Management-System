import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import dotenv from 'dotenv';

import Knowledge from "../models/Knowledge.js";

import { loadPDF } from "./pdfLoader.js";
import { createChunks } from "./chunker.js";
import { createEmbeddings } from "./embedder.js";

dotenv.config();
await connectDB();

async function ingest() {

    console.log('Loading pdf...');
    const text = await loadPDF('./data/student_handbook.pdf');

    console.log('Creating Chunks...');
    const chunks = await createChunks('Student Handbook' ,text);
    console.log(`Created ${chunks.length} chunks.`);

    console.log("Deleting old knowledge...");

    await Knowledge.deleteMany({document: 'Student Handbook'});

    console.log('Generating Embeddings...');

    for(const chunk of chunks) {
        const embedding = await createEmbeddings(chunk.text);

        await Knowledge.create({
            ...chunk,
            embedding
        });

        console.log(`Stored: ${chunk.title}`);
    }

    console.log("Knowledge Base Created Successfully!");
}

await ingest();
mongoose.connection.close();