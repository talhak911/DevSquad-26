# Smart Document Intelligence System

A multi-agent AI platform built with the **OpenAI Agents SDK** and **Gemini 2.0 Flash** for deep PDF analysis and interactive Q&A.

## 🚀 Features

- **Multi-Agent Orchestration**: Specialized agents for Triage, Analysis, Summarization, and Q&A.
- **Agentic Handoffs**: Intelligent routing between agents based on user intent.
- **Real-Time Analysis**: Automatic document type identification and executive summary generation upon upload.
- **Grounded Q&A**: Answers are strictly based on document content using retrieval tools.
- **Premium UI**: Modern dark-mode interface with glassmorphism and smooth animations.

## 🏗️ Architecture

The system follows a star-topology multi-agent architecture:

1. **Router Agent**: Analyzes intent and delegates to specialized agents.
2. **Analysis Agent**: Identifies document structure and metadata.
3. **Summary Agent**: Distills content into summaries and highlights.
4. **Q&A Agent**: Performs grounded fact-finding using search tools.

### Tools Used
- `pdfExtraction`: Extracts raw text from PDF files.
- `chunkRetriever`: Performs keyword-based semantic search across document chunks.
- `sectionLocator`: Identifies and extracts specific sections (e.g., "Introduction").

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, Material UI v9, RTK Query, Tailwind CSS.
- **Backend**: NestJS, MongoDB (Mongoose).
- **AI**: OpenAI Agents SDK, Gemini 2.0 Flash.

## 🚦 Getting Started

### Prerequisites
- Node.js 20+
- MongoDB instance (local or Atlas)
- Gemini API Key

### Backend Setup
1. `cd backend`
2. Create `.env` from `.env.example`:
   ```env
   MONGODB_URI=your_mongodb_uri
   GEMINI_API_KEY=your_gemini_key
   ```
3. `pnpm install`
4. `pnpm start:dev`

### Frontend Setup
1. `cd frontend`
2. Create `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```
3. `pnpm install`
4. `pnpm dev`

## 🔐 Guardrails
- **Input Validation**: Programmatic checks for unsafe patterns before AI invocation.
- **Grounded Instructions**: Agents are strictly instructed to refuse external knowledge.
- **Triage Refusal**: The Router Agent can block inappropriate or unrelated queries.
