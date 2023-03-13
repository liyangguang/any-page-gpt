import {encode} from 'gpt-3-encoder';
import { Configuration, OpenAIApi, type ChatCompletionRequestMessage } from "openai";
import type {EmbeddingResponse, ChatCompletionResponse} from '$lib/types';
import {OPENAI_API_KEY} from '$env/static/private';

const COMPLETION_PROMPT_TOKEN_MAX_RATIO = .7;  // Max ratio of the prompt out of the total token limit

enum Model {
  TEXT_EMBEDDING_ADA_002 = 'text-embedding-ada-002',
  GPT_CHAT_TURBO_0301 = 'gpt-3.5-turbo-0301',
}

const PREFIX = `You are an assistant that can answer questions based on a list of context coming from a web page.
Answer the question only within the context.
If the answer is not covered in the context, do not use external knowledge or create new information.`;

export const MODEL_MAX_TOKEN = 4096;
const EMBEDDING_DOLLAR_PRE_TOKEN = 0.0004 / 1000;
const CHAT_COMPLETION_DOLLAR_PRE_TOKEN = 0.002 / 1000;

export function countTokens(input: string): number {
  return encode(input).length;
}

function getOpenAiClient(apiKey: string): OpenAIApi {
  return new OpenAIApi(new Configuration({apiKey: apiKey || OPENAI_API_KEY}));
}

export async function runChatCompletion(apiKey: string, messages: ChatCompletionRequestMessage[]): Promise<ChatCompletionResponse> {
  const openai = getOpenAiClient(apiKey);

  try {
    const totalLimit = MODEL_MAX_TOKEN;
    const responseMaxTokenCount = totalLimit - countTokens(messages.map((m) => m.content).join(' '));
    if (responseMaxTokenCount / totalLimit <= 1 - COMPLETION_PROMPT_TOKEN_MAX_RATIO) throw new Error(`Prompt is too long compared to the total limit.`);

    const response = await openai.createChatCompletion({
      model: Model.GPT_CHAT_TURBO_0301,
      messages,
      temperature: 0,
    });
    console.log('completion', response.data)
    const result = response.data.choices[0].message?.content || '';
    return {result, cost: (response.data.usage?.total_tokens || 0) * CHAT_COMPLETION_DOLLAR_PRE_TOKEN};
  } catch (error) {
    throw handleError(error, 'Chat');
  }
}

export async function runEmbedding(apiKey: string, contentArray: string[]): Promise<EmbeddingResponse> {
  const openai = getOpenAiClient(apiKey);

  try {
    console.info('[OpenAI] Calculating embedding.', contentArray)
    if (!contentArray.length) return {embeddings: [], cost: 0};

    // `openai.createEmbedding` accepts batch `input` by default
    const response = await openai.createEmbedding({model: Model.TEXT_EMBEDDING_ADA_002, input: contentArray});
    const embeddings = response.data.data.map((e, index) => {
      return {
        embedding: e.embedding,
        content: contentArray[index],
      };
    });
    return {
      embeddings,
      cost: response.data.usage.total_tokens * EMBEDDING_DOLLAR_PRE_TOKEN,
    }
  } catch (error) {
    throw handleError(error, 'Embedding');
  }
}

const STATIC_TEXT_TOKEN_RESERVE = 50;
function getMaxContextWithoutExceedingLimit(allContext: string[], modelLimit: number, fixedPartTokenCount: number): string[] {
  const remainingTokenForContext = modelLimit * (1 - COMPLETION_PROMPT_TOKEN_MAX_RATIO) - STATIC_TEXT_TOKEN_RESERVE - fixedPartTokenCount;
  if (remainingTokenForContext < 0) throw new Error('Prefix and question is too long');

  const context: string[] = [];
  let currentTokenCount = 0
  for (const piece of allContext) {
    const pieceTokenCount = countTokens(piece);
    if (currentTokenCount + pieceTokenCount > remainingTokenForContext) {
      break;
    }
    context.push(piece);
    currentTokenCount += pieceTokenCount;
  }
  return context;
}

export function constructChatMessages(allContext: string[], query: string): ChatCompletionRequestMessage[] {
  const context = getMaxContextWithoutExceedingLimit(allContext, MODEL_MAX_TOKEN, countTokens(PREFIX) + countTokens(query))

  // Note: the indentation and spacing below is intentiona.
  return [
    {role: 'system', content: PREFIX},
    {role: 'user', content: context.map((context, index) => `  ${index + 1}. ${context}`).join('\n')},
    {role: 'user', content: query},
  ];
}

// Just being lazy to find/type the error properly.
interface ApiError {
  response?: {
    status: string;
    data: {
      error: {
        message: string;
      }
    };
  }
  message?: string;
}

function handleError(error: unknown, source?: string): Error {
  const typedError = error as ApiError;
  if (typedError.response) {
    console.error(typedError.response);
  } else {
    console.error(typedError);
  }
  const errorItself = typedError.response?.data.error || typedError;
  return new Error(`[OpenAI] ${source} failed: ${errorItself.message}`, {cause: errorItself});
}
