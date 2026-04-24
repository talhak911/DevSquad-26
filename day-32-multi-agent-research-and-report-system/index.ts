import 'dotenv/config'; // load env vars first
import { setTracingDisabled } from '@openai/agents-core';
import { Runner } from '@openai/agents';
import * as readline from 'readline';
import { GeminiModel } from './providers/geminiProvider';
import { managerAgent } from './agents/agents';
import { setDefaultModelProvider } from '@openai/agents';

// Disable SDK tracing — it would otherwise try to POST to api.openai.com with our Gemini key
setTracingDisabled(true);

// Create a Runner instance configured with our custom native Gemini provider

setDefaultModelProvider({
  async getModel(name?: string) {
    return new GeminiModel(name);
  },
});
const runner = new Runner();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("==========================================");
console.log("🤖 Multi-Agent Research System Initialized");
console.log("==========================================\n");
console.log("Agents:");
console.log("- Manager: Orchestrates the workflow");
console.log("- Research: Gathers facts using Tavily");
console.log("- Writer: Compiles the final report\n");
console.log("Type 'exit' or 'quit' to stop the application.\n");

function askQuestion() {
  rl.question('You: ', async (input) => {
    if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
      console.log('Goodbye!');
      rl.close();
      return;
    }

    try {
      // Execute the agent flow starting with the managerAgent
      const result = await runner.run(managerAgent, input);
      console.log(`\nAssistant: ${result.finalOutput}\n`);
    } catch (error) {
      console.error("\n[Error] Failed to process request:", error);
    }

    // Continue the loop
    askQuestion();
  });
}

askQuestion();
