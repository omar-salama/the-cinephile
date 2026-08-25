import { useState, useCallback, useRef, useEffect } from 'react';

const STORAGE_KEY = 'cinephile-messages';
const EXHAUSTION_KEY = 'cinephile-exhausted-date';

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage may be full or unavailable — silently fail
  }
}

function removeStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // silently fail
  }
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export type ChatState = 'idle' | 'streaming' | 'error' | 'exhausted';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>(() => readStorage(STORAGE_KEY, []));
  const [chatState, setChatState] = useState<ChatState>(() => {
    const exhaustedDate = readStorage<string | null>(EXHAUSTION_KEY, null);
    if (exhaustedDate === new Date().toISOString().slice(0, 10)) {
      return 'exhausted';
    }
    removeStorage(EXHAUSTION_KEY);
    return 'idle';
  });
  const [streamingContent, setStreamingContent] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    writeStorage(STORAGE_KEY, messages);
  }, [messages]);

  const sendMessage = useCallback(async (
    content: string,
    mode?: 'chat' | 'defend',
    defendFilm?: string
  ) => {
    if (chatState === 'streaming' || chatState === 'exhausted') return;

    const trimmed = content.trim();
    if (!trimmed) return;

    // Truncate excessively long messages
    const safeContent = trimmed.slice(0, 4000);

    const userMessage: Message = { role: 'user', content: safeContent };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setChatState('streaming');
    setStreamingContent('');

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          ...(mode === 'defend' && { mode, defendFilm }),
        }),
        signal: controller.signal,
      });

      // Check for non-streaming error responses
      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        const data = await response.json();
        if (data.error) {
          if (data.exhausted) {
            writeStorage(EXHAUSTION_KEY, new Date().toISOString().slice(0, 10));
            setChatState('exhausted');
          } else {
            setChatState('idle');
          }
          // Show error as an assistant message
          setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
          setStreamingContent('');
          return;
        }
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      // Stream the response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Keep the last line in the buffer because it might be incomplete
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              const token = parsed.response || parsed.choices?.[0]?.delta?.content || '';
              if (token) {
                accumulated += token;
                setStreamingContent(accumulated);
              }
            } catch (e) {
              console.error("Failed to parse SSE JSON:", data);
            }
          }
        }
      }

      // Finalize the assistant message
      if (accumulated.trim()) {
        setMessages(prev => [...prev, { role: 'assistant', content: accumulated.trim() }]);
      } else {
        // Empty response from model
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "I opened my mouth to deliver a devastating critique and… nothing came out. How embarrassingly human of me. Try again.",
        }]);
      }
      setStreamingContent('');
      setChatState('idle');
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        setChatState('idle');
        setStreamingContent('');
        return;
      }
      // Network or other error
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Technical difficulties. Even the best projectors jam occasionally. Try again in a moment.",
      }]);
      setStreamingContent('');
      setChatState('idle');
    } finally {
      abortRef.current = null;
    }
  }, [messages, chatState]);

  const clearConversation = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setStreamingContent('');
    setChatState('idle');
    removeStorage(STORAGE_KEY);
    removeStorage(EXHAUSTION_KEY);
  }, []);

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return {
    messages,
    chatState,
    streamingContent,
    sendMessage,
    clearConversation,
    stopStreaming,
  };
}
