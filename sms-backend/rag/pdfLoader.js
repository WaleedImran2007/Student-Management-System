import { PDFParse } from "pdf-parse";

export async function loadPDF(filePath) {
    const parser = new PDFParse({
        url: filePath
    });

    const result = await parser.getText();

    await parser.destroy();

    return result.text;
}