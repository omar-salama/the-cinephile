export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export type ChatMode = 'chat' | 'defend';

export interface ChatRequest {
  messages: Message[];
  mode?: ChatMode;
  defendFilm?: string;
}

export interface ChatErrorResponse {
  error: true;
  message: string;
  retryAfter?: number;
  exhausted?: boolean;
}

export interface ChatStreamResponse {
  error: false;
}

export type ChatState = 'idle' | 'loading' | 'streaming' | 'error' | 'exhausted';

export interface DefendFilm {
  title: string;
  reason: string;
}
