import { Injectable, Logger } from '@nestjs/common';
import { ChatGroq } from '@langchain/groq';
import {
  StateGraph,
  START,
  END,
  Annotation,
} from '@langchain/langgraph';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../products/schemas/product.schema';

// ─── State ─────────────────────────────────────────────────────────────────────

const HealthcareStateAnnotation = Annotation.Root({
  queryId: Annotation<string>(),
  query: Annotation<string>(),
  mode: Annotation<'title_search' | 'ai_search' | 'chat'>(),
  // AI search
  detectedIntent: Annotation<string>(),
  suggestedCategories: Annotation<string[]>({
    default: () => [],
    reducer: (_, update) => update ?? [],
  }),
  suggestedTags: Annotation<string[]>({
    default: () => [],
    reducer: (_, update) => update ?? [],
  }),
  // Results
  products: Annotation<any[]>({
    default: () => [],
    reducer: (_, update) => update ?? [],
  }),
  explanation: Annotation<string>(),
  error: Annotation<string | undefined>(),
});

type HealthcareState = typeof HealthcareStateAnnotation.State;

// ─── Workflow ───────────────────────────────────────────────────────────────────

@Injectable()
export class HealthcareWorkflow {
  private readonly logger = new Logger(HealthcareWorkflow.name);
  private llm: ChatGroq;
  private searchWorkflow: any;
  private chatWorkflow: any;

  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {
    this.llm = new ChatGroq({
      model: 'llama-3.1-8b-instant',
      apiKey: process.env.GROQ_API_KEY,
    });
    this.searchWorkflow = this.buildSearchWorkflow();
    this.chatWorkflow = this.buildChatWorkflow();
  }

  // ─── Intent Detector ──────────────────────────────────────────────────────────

  private async intentDetector(
    state: HealthcareState,
  ): Promise<Partial<HealthcareState>> {
    this.logger.log(`[IntentDetector] Query: ${state.query}`);
    try {
      const prompt = `You are a healthcare product intent analyzer.

User query: "${state.query}"

Analyze this query and return a JSON with:
1. "intent" - a brief description of what health need the user has (e.g. "bone health", "hair fall prevention", "vitamin C deficiency", "digestive issues")
2. "categories" - array of up to 3 product categories that would help (choose from: "Vitamins", "Supplements", "Pain Relief", "Skin Care", "Digestive Health", "Immunity", "Hair & Nail", "Bone Health", "Heart Health", "Eye Care", "Sleep & Stress", "Weight Management", "Diabetes Care", "Protein & Fitness")
3. "tags" - array of up to 5 specific ingredient/keyword tags (e.g. "calcium", "omega-3", "collagen", "biotin", "vitamin D", "probiotics")

Respond ONLY with JSON:
{"intent": "...", "categories": [...], "tags": [...]}`;

      const response = await this.llm.invoke(prompt);
      const content = response.content as string;
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        const result = JSON.parse(match[0]);
        return {
          detectedIntent: result.intent || state.query,
          suggestedCategories: result.categories || [],
          suggestedTags: result.tags || [],
        };
      }
    } catch (e) {
      this.logger.error(`[IntentDetector] ${e.message}`);
    }
    return {
      detectedIntent: state.query,
      suggestedCategories: [],
      suggestedTags: [],
    };
  }

  // ─── Product Fetcher (for AI search) ──────────────────────────────────────────

  private async productFetcher(
    state: HealthcareState,
  ): Promise<Partial<HealthcareState>> {
    this.logger.log(`[ProductFetcher] Fetching for intent: ${state.detectedIntent}`);
    try {
      const conditions: any[] = [];

      if (state.suggestedCategories.length > 0) {
        conditions.push({ category: { $in: state.suggestedCategories } });
      }
      if (state.suggestedTags.length > 0) {
        conditions.push({
          tags: {
            $in: state.suggestedTags.map((t) => new RegExp(t, 'i')),
          },
        });
      }

      let products: any[] = [];
      if (conditions.length > 0) {
        products = await this.productModel
          .find({ $or: conditions })
          .limit(8)
          .lean()
          .exec();
      }

      // Fallback: text search
      if (products.length === 0) {
        products = await this.productModel
          .find({ $text: { $search: state.detectedIntent } })
          .limit(8)
          .lean()
          .exec();
      }

      // Last resort: return all
      if (products.length === 0) {
        products = await this.productModel.find().limit(6).lean().exec();
      }

      return { products };
    } catch (e) {
      this.logger.error(`[ProductFetcher] ${e.message}`);
      return { products: [] };
    }
  }

  // ─── Explanation Generator ────────────────────────────────────────────────────

  private async explanationGenerator(
    state: HealthcareState,
  ): Promise<Partial<HealthcareState>> {
    this.logger.log(`[ExplanationGenerator] Generating explanation`);
    if (state.products.length === 0) {
      return {
        explanation:
          'No products found matching your health need. Please try a different query.',
      };
    }

    try {
      const productList = state.products
        .map((p) => `- ${p.name} (${p.category}): ${p.description.substring(0, 100)}`)
        .join('\n');

      const prompt = `You are a helpful healthcare product advisor.

User's health concern: "${state.query}"
Detected need: "${state.detectedIntent}"

Recommended products:
${productList}

Write a brief, friendly 2-3 sentence explanation of why these products are recommended for the user's health concern. Be specific and helpful. Do NOT list the products again — just explain the reasoning.`;

      const response = await this.llm.invoke(prompt);
      return { explanation: (response.content as string).trim() };
    } catch (e) {
      this.logger.error(`[ExplanationGenerator] ${e.message}`);
      return {
        explanation: `Based on your concern about "${state.detectedIntent}", these products may help.`,
      };
    }
  }

  // ─── Chat Responder ────────────────────────────────────────────────────────────

  private async chatIntentDetector(
    state: HealthcareState,
  ): Promise<Partial<HealthcareState>> {
    return this.intentDetector(state);
  }

  private async chatProductFetcher(
    state: HealthcareState,
  ): Promise<Partial<HealthcareState>> {
    return this.productFetcher(state);
  }

  private async chatResponseBuilder(
    state: HealthcareState,
  ): Promise<Partial<HealthcareState>> {
    this.logger.log(`[ChatResponseBuilder] Building chat response`);
    try {
      const productList =
        state.products.length > 0
          ? state.products
              .slice(0, 5)
              .map(
                (p) =>
                  `- **${p.name}** (${p.category}) — ₹z${p.price} — ${p.description.substring(0, 120)}`,
              )
              .join('\n')
          : 'No specific products found.';

      const prompt = `You are a friendly healthcare assistant chatbot.

User asked: "${state.query}"

Here are relevant products from our store:
${productList}

Respond in a warm, helpful tone. Format as markdown. Start with a brief answer to their question, then list the products with a 1-line explanation for EACH product of why it helps. End with a short tip. Keep it under 250 words.`;

      const response = await this.llm.invoke(prompt);
      return { explanation: (response.content as string).trim() };
    } catch (e) {
      this.logger.error(`[ChatResponseBuilder] ${e.message}`);
      return {
        explanation:
          'Sorry, I encountered an error. Please try again.',
      };
    }
  }

  // ─── Build Workflows ──────────────────────────────────────────────────────────

  private buildSearchWorkflow() {
    return new StateGraph(HealthcareStateAnnotation)
      .addNode('intentDetector', (s) => this.intentDetector(s))
      .addNode('productFetcher', (s) => this.productFetcher(s))
      .addNode('explanationGenerator', (s) => this.explanationGenerator(s))
      .addEdge(START, 'intentDetector')
      .addEdge('intentDetector', 'productFetcher')
      .addEdge('productFetcher', 'explanationGenerator')
      .addEdge('explanationGenerator', END)
      .compile();
  }

  private buildChatWorkflow() {
    return new StateGraph(HealthcareStateAnnotation)
      .addNode('intentDetector', (s) => this.chatIntentDetector(s))
      .addNode('productFetcher', (s) => this.chatProductFetcher(s))
      .addNode('responseBuilder', (s) => this.chatResponseBuilder(s))
      .addEdge(START, 'intentDetector')
      .addEdge('intentDetector', 'productFetcher')
      .addEdge('productFetcher', 'responseBuilder')
      .addEdge('responseBuilder', END)
      .compile();
  }

  // ─── Public API ───────────────────────────────────────────────────────────────

  async aiSearch(query: string): Promise<{ products: any[]; explanation: string; intent: string }> {
    const result = await this.searchWorkflow.invoke({
      queryId: `search_${Date.now()}`,
      query,
      mode: 'ai_search',
    } as HealthcareState);
    return {
      products: result.products,
      explanation: result.explanation,
      intent: result.detectedIntent,
    };
  }

  async chat(query: string): Promise<{ products: any[]; response: string }> {
    const result = await this.chatWorkflow.invoke({
      queryId: `chat_${Date.now()}`,
      query,
      mode: 'chat',
    } as HealthcareState);
    return {
      products: result.products,
      response: result.explanation,
    };
  }
}
