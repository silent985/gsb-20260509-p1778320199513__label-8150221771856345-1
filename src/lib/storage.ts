export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
}

const STORAGE_KEY = 'ai_chat_history';

export const HistoryManager = {
  getMessages(): Message[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  addMessage(role: 'user' | 'ai', content: string): Message {
    const messages = this.getMessages();
    const newMessage: Message = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: Date.now()
    };
    messages.push(newMessage);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    return newMessage;
  },

  clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
  }
};
