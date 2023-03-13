// This type file is shared between the backend and the extension.

export interface EmbeddingResult {
  embedding: number[];
  content: string;
}

export interface PageContent {
  content: string;
  url: string;
}

interface RequestBodyBase {
  apiKey: string;
}

export interface ProcessRequestBody extends RequestBodyBase, PageContent {}

export interface ReplyRequestBody extends RequestBodyBase {
  embeddings: EmbeddingResult[];
  query: string;
};

interface ResponseBodyBase {
  cost: number;
}

export interface ProcessResponseBody extends ResponseBodyBase {
  embeddings: EmbeddingResult[];
}


export interface ReplyResponseBody extends ResponseBodyBase {
  result: string;
}
