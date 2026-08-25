import { useCallback, useState } from 'react';
import { Header } from './components/Header';
import { ConversationStarters } from './components/ConversationStarters';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { TheaterClosed } from './components/TheaterClosed';
import { useChat } from './hooks/useChat';
import { DEFEND_FILMS } from './lib/defend-films';

export default function App() {
  const { messages, chatState, streamingContent, sendMessage, clearConversation } = useChat();
  const [chatMode, setChatMode] = useState<'chat' | 'defend'>('chat');

  const hasMessages = messages.length > 0;
  const isStreaming = chatState === 'streaming';
  const isExhausted = chatState === 'exhausted';

  const handleSend = useCallback((content: string) => {
    sendMessage(content, chatMode);
  }, [sendMessage, chatMode]);

  const handleStarterSelect = useCallback((message: string) => {
    setChatMode('chat');
    sendMessage(message, 'chat');
  }, [sendMessage]);

  const handleDefend = useCallback(() => {
    const film = DEFEND_FILMS[Math.floor(Math.random() * DEFEND_FILMS.length)];
    setChatMode('defend');
    sendMessage(
      `I want to defend "${film.title}". I think it's actually a good film.`,
      'defend',
      film.title
    );
  }, [sendMessage]);

  const handleNewChat = useCallback(() => {
    clearConversation();
    setChatMode('chat');
  }, [clearConversation]);

  // Long conversation warning
  const showLengthWarning = messages.length >= 80 && messages.length % 20 === 0;

  return (
    <div className="flex flex-col h-dvh overflow-hidden w-full">
      <Header hasMessages={hasMessages} onNewChat={handleNewChat} />

      {isExhausted ? (
        <TheaterClosed onNewChat={handleNewChat} />
      ) : !hasMessages && !isStreaming ? (
          <ConversationStarters onSelect={handleStarterSelect} onDefend={handleDefend} />
      ) : (
        <>
          <ChatWindow
            messages={messages}
            streamingContent={streamingContent}
            isStreaming={isStreaming}
          />
          {showLengthWarning && (
            <div className="px-4 py-2 text-center text-text-secondary text-xs italic">
              We've been arguing for what feels like the runtime of Satantango. Perhaps a fresh conversation?
            </div>
          )}
        </>
      )}
      <ChatInput
        onSend={handleSend}
        disabled={isStreaming}
        placeholder={isStreaming ? "The Cinephile is typing..." : undefined}
      />
    </div>
  );
}
