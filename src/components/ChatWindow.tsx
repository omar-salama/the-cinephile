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
      // Delay slightly to ensure DOM has painted the new message
      setTimeout(() => {
        const userMessageEl = document.getElementById(`message-${messages.length - 1}`);
        if (userMessageEl) {
          userMessageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }
  }, [messages.length]); 

  return (
    <div 
      className="flex-1 overflow-y-auto py-4 space-y-4 pb-[80vh]"
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
