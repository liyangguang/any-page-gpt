import {encode} from 'gpt-3-encoder';
import { Configuration, OpenAIApi, type ChatCompletionRequestMessage } from "openai";

const EMBEDDING_SKIPPING_THRESHOLD_IN_TOKENS = 10;  // Skip embedding content that is too short (e.g. just a title)
const COMPLETION_PROMPT_TOKEN_MAX_RATIO = .7;  // Max ratio of the prompt out of the total token limit

enum Model {
  TEXT_EMBEDDING_ADA_002 = 'text-embedding-ada-002',
  GPT_CHAT_TURBO_0301 = 'gpt-3.5-turbo-0301',
}

const PREFIX = `You are an assistant that can answer questions based on a list of context.
Answer the question only within the context. If the answer is not covered in the context, do not use external knowledge or create new information.`;

export const MODEL_MAX_TOKEN = 4096;

export function countTokens(input: string): number {
  return encode(input).length;
}

export async function runChatCompletion(apiKey: string, messages: ChatCompletionRequestMessage[]): Promise<string> {
  const openai = new OpenAIApi(new Configuration({apiKey}));

  try {
    const totalLimit = MODEL_MAX_TOKEN;
    const responseMaxTokenCount = totalLimit - countTokens(messages.map((m) => m.content).join(' '));
    if (responseMaxTokenCount / totalLimit <= 1 - COMPLETION_PROMPT_TOKEN_MAX_RATIO) throw new Error(`Prompt is too long compared to the total limit.`);

    const response = await openai.createChatCompletion({
      model: Model.GPT_CHAT_TURBO_0301,
      messages,
      temperature: 0,
    });
    const result = response.data.choices[0].message?.content || '';
    return result;
  } catch (error) {
    throw handleError(error, 'Chat');
  }
}

export async function runEmbedding(apiKey: string, contentArray: string[], skipMinSizeCheck = false) {
  const openai = new OpenAIApi(new Configuration({apiKey}));

  try {
    console.debug('[OpenAI] Calculating embedding.', contentArray)
    const tokenLimit = MODEL_MAX_TOKEN;
    const acceptableContentArray = contentArray.filter((contentPiece) => {
      const contentSize = countTokens(contentPiece);
      if (contentSize > tokenLimit) throw new Error(`Input exceeds model token limit. (${contentSize} > ${tokenLimit}. Raw content piece: ${contentPiece})`);
      return skipMinSizeCheck || contentSize > EMBEDDING_SKIPPING_THRESHOLD_IN_TOKENS;
    });
    if (!acceptableContentArray.length) return [];

    // `openai.createEmbedding` accepts batch `input` by default
    const response = await openai.createEmbedding({model: Model.TEXT_EMBEDDING_ADA_002, input: acceptableContentArray});
    return response.data.data.map((e, index) => {
      return {
        embedding: e.embedding,
        content: acceptableContentArray[index],
      };
    });
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
    if (pieceTokenCount < EMBEDDING_SKIPPING_THRESHOLD_IN_TOKENS) continue;
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
