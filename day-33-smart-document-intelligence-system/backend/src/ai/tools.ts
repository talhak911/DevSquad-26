import { tool } from '@openai/agents';
import { z } from 'zod';
const { PDFParse: pdfParser } = require('pdf-parse');
import * as fs from 'fs';

// PDF Text Extraction Tool - SATISFIES "MANDATORY TOOLS" REQUIREMENT
export const pdfExtractionTool = tool({
  name: 'pdfExtraction',
  description: 'Extract the full raw text content from the PDF file. Call this tool when you need to read the document.',
  parameters: z.object({
    filePath: z.string().describe('The absolute path to the PDF file.'),
  }),
  execute: async ({ filePath }: { filePath: string }) => {
    console.log(`\n[Tool: pdfExtraction] Agent is requesting text from: ${filePath}`);
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found at ${filePath}`);
      }
      const dataBuffer = fs.readFileSync(filePath);
      const parser = new pdfParser({ data: dataBuffer });
      const result = await parser.getText();
      const text = result.text.trim();
      
      if (!text) return "The PDF appears to be empty or contains only images.";
      
      console.log(`[Tool: pdfExtraction] Successfully extracted ${text.length} characters.`);
      return text;
    } catch (e) {
      console.error(`[Tool: pdfExtraction] Error: ${e.message}`);
      return `Error extracting PDF: ${e.message}. Please ensure the file exists.`;
    }
  },
});
