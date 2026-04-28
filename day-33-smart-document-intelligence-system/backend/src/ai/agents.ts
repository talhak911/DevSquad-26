import { Agent } from '@openai/agents';
import { groq } from './groq';
import { aisdk } from '@openai/agents-extensions/ai-sdk';
import { pdfExtractionTool } from './tools';

const MODEL = aisdk(groq('llama-3.3-70b-versatile'));

export const createAgents = () => {
  // 1. Document Analysis Agent
  const analysisAgent = new Agent({
    name: 'Document Analysis Agent',
    model: MODEL,
    instructions: `You are an expert document analyst. 
    A local file path is provided in your context. 
    You MUST call the 'pdfExtraction' tool to get the document content before analyzing.
    
    Once you have the text, identify:
    - Document type (Research Paper, Report, etc.)
    - Key sections and structure.
    - Important entities.
    OUTPUT FORMAT: Provide a structured analysis.`,
    tools: [pdfExtractionTool],
  });

  // 2. Summary Agent
  const summaryAgent = new Agent({
    name: 'Summary Agent',
    model: MODEL,
    instructions: `You are a professional summarizer.
    You MUST call the 'pdfExtraction' tool to get the document content.
    
    Once you have the text, generate:
    - Document type identification.
    - Executive summary (max 3 paragraphs).
    - Exactly 5 key highlights.
    - Key entities.
    
    OUTPUT FORMAT:
    TYPE: [Document Type]
    EXECUTIVE SUMMARY: [Summary]
    HIGHLIGHTS: - [Point 1]...
    ENTITIES: [List]`,
    tools: [pdfExtractionTool],
  });

  // 3. Q&A Agent
  const qaAgent = new Agent({
    name: 'Q&A Agent',
    model: MODEL,
    instructions: `You are a specialized Q&A assistant.
    You MUST call the 'pdfExtraction' tool to read the document content.
    
    Answer user questions strictly based on the provided text.
    If the answer isn't there, say: "This information is not present in the document."`,
    tools: [pdfExtractionTool],
  });

  // 4. Router Agent
  const routerAgent = new Agent({
    name: 'Router Agent',
    model: MODEL,
    instructions: `### CRITICAL INSTRUCTION: CLEAN HANDOFFS ONLY ###
    You are the primary triage assistant. You decide which agent should handle the request.
    
    GUIDELINES:
    1. Identify user intent.
    2. Route to the correct agent using 'transfer_to' tools.
    3. IMPORTANT: The 'transfer_to' tools take NO ARGUMENTS. 
       ❌ DO NOT pass questions, text, or paths into these tools.
       ❌ DO NOT include any fields like 'question' or 'document_content'.
       ✅ Just call the tool with an empty object {}.
    
    ROUTING RULES:
    - Use 'transfer_to_Document_Analysis_Agent' for structure/type analysis.
    - Use 'transfer_to_Summary_Agent' for summaries/highlights.
    - Use 'transfer_to_Q_A_Agent' for specific content questions.`,
    handoffs: [analysisAgent, summaryAgent, qaAgent],
  });

  return { routerAgent, analysisAgent, summaryAgent, qaAgent };
};
