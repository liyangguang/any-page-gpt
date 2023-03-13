export interface EmbeddingResult {
  embedding: number[];
  content: string;
}

export interface EmbeddingResponse {
  embeddings: EmbeddingResult[];
  cost: number;
}


export interface ChatCompletionResponse {
  result: string;
  cost: number;
}
