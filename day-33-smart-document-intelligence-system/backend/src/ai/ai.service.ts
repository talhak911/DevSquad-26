import { Injectable, Logger } from '@nestjs/common';
import { Agent, run, Runner } from '@openai/agents';
import { setTracingDisabled } from '@openai/agents-core';
import { createAgents } from './agents';

setTracingDisabled(true);

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);

  async chat(
    message: string,
    documentId?: string,
    fullText?: string,
  ): Promise<any> {
    const startTime = Date.now();

    // Build context with document information
    let input = message;
    if (documentId) input = `[Document ID: ${documentId}]\n${input}`;
    if (fullText)
      input = `[Document Content]\n${fullText.substring(0, 15000)}\n\n[User Question]\n${input}`;

    this.logger.log(`\n\n=== [NEW AGENTIC RUN] ===`);
    this.logger.log(`Input: ${message.substring(0, 100)}...`);

    try {
      const { routerAgent } = createAgents();
      const runner = new Runner();

      // --- TRACING LOGS ---
      const r = runner as any;

      r.on('run:start', () => {
        this.logger.log(`[System] Execution started.`);
      });

      r.on('agent:start', (ctx: any) => {
        this.logger.log(`[Agent: ${ctx.agent.name}] >>> Started Reasoning`);
      });

      r.on('agent:handoff', (ctx: any) => {
        this.logger.log(`[Handoff] → ${ctx.agent.name}`);
      });

      r.on('tool:call', (ctx: any) => {
        this.logger.log(`[Tool: ${ctx.tool.name}] Executing...`);
      });

      r.on('message:created', (msg: any) => {
        if (msg.role === 'assistant' && msg.content) {
          this.logger.log(`[Output] Assistant response generated.`);
        }
      });

      const result = await runner.run(routerAgent as any, input, {
        maxTurns: 10,
      });

      const duration = Date.now() - startTime;
      this.logger.log(`[System] Run completed in ${duration}ms.`);
      this.logger.log(`=== [RUN END] ===\n`);

      return {
        finalOutput: result.finalOutput,
        messages: (result as any).messages || [],
        agent: (result as any).agent || null,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `[System] Run failed after ${duration}ms: ${error.message}`,
      );
      throw error;
    }
  }
}
