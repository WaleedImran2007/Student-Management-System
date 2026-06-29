export function createChunks(documentName, text) {
    // REMOVE PAGE NUMBERS -- 1 of 3 --
    text = text.replace(/--\s*\d+\s*of\s*\d+\s*--/g, '');

    // SPLIT BEFORE EACH NUMBERED HEADING
    const sections = text.split(/(?=^\d+\.\s)/m);

    const chunks = [];

    for(const section of sections) {
        // it will give:
        // 1. Admission Rules
        // • Students must complete online registration after receiving the admission offer.
        let chunkText = section.trim();

        // skip empty text
        if(!chunkText) continue;

        // Skip anything before the first numbered section
        if (!/^\d+\.\s/.test(chunkText)) continue;

        // firstLine = 1. Admission Rules
        const firstLine = chunkText.split("\n")[0].trim();
        chunkText = chunkText.split("\n").slice(1).join("\n").trim();

        // delete number like 1. so title = Admission Rules
        const title = firstLine.replace(/^\d+\.\s*/, '');

        chunks.push({
            document: documentName,
            title,
            chunkIndex: chunks.length,
            text: chunkText,
        });
    }

    return chunks;
}