const CHAT_HISTORY_KEY = 'gemini-chat-history';

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export const getChatHistory = (): Message[] => {
  if (typeof window === 'undefined') return [];
  const history = localStorage.getItem(CHAT_HISTORY_KEY);
  return history ? JSON.parse(history) : [];
};

export const saveChatHistory = (messages: Message[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
};

export const clearChatHistory = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CHAT_HISTORY_KEY);
};