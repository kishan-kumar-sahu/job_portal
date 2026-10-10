import path from "path";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export const parseResume = async (fileBuffer, originalName) => {
  try {
    const extension = path.extname(originalName).toLowerCase();

    let text = "";

    if (extension === ".pdf") {
      const parser = new PDFParse({
        data: fileBuffer,
      });

      const result = await parser.getText();

      text = result.text;

      await parser.destroy();
    } else if (extension === ".docx") {
      const result = await mammoth.extractRawText({
        buffer: fileBuffer,
      });

      text = result.value;
    } else {
      throw new Error(
        "Unsupported resume format. Only PDF and DOCX are supported."
      );
    }

    text = text
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (!text) {
      throw new Error("Could not extract text from the resume.");
    }

    return {
      text,
      fileType: extension.replace(".", ""),
    };
  } catch (error) {
    throw new Error(error?.message || "Failed to parse resume.");
  }
};