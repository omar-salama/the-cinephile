import { useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { StreamingIndicator } from './StreamingIndicator';
import type { Message } from '../hooks/useChat';

interface ChatWindowProps {
  messages: Message[];
  streamingContent: string;
  isStreaming: boolean;
}

export function ChatWindow({ messages, streamingContent, isStreaming }: ChatWindowProps) {
  // Only scroll when the user sends a new message
  useEffect(() => {
    if (messages.length === 0) return;
    
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === 'user') {
      const scrollUserMessageToTop = () => {
        const userMessageEl = document.getElementById(`message-${messages.length - 1}`);
        const container = userMessageEl?.closest('.overflow-y-auto');
        if (userMessageEl && container) {
          // Precisely calculate the top position minus a 24px (1.5rem) breathing gap
          container.scrollTo({
            top: userMessageEl.offsetTop - 16,
            behavior: 'smooth'
          });
        }
      };
      setTimeout(scrollUserMessageToTop, 50);
    }
  }, [messages.length]); 

  return (
    <div 
      className="flex-1 overflow-y-auto py-4 space-y-4 pb-[80vh] relative"
      style={{ overflowAnchor: 'none' }}
    >
      {messages.map((msg, i) => (
        <ChatMessage 
          key={i} 
          id={`message-${i}`} 
          role={msg.role} 
          content={msg.content} 
          animate={msg.role === 'user'} 
        />
      ))}
      {isStreaming && streamingContent && (
        <ChatMessage role="assistant" content={streamingContent} isStreaming />
      )}
      {isStreaming && !streamingContent && (
        <StreamingIndicator />
      )}
    </div>
  );
}
