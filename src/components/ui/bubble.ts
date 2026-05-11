export type MessageType = 'user' | 'ai';

export function ChatBubble(content: string, type: MessageType, timestamp?: Date): HTMLElement {
  const container = document.createElement('div');
  container.className = `flex w-full mb-4 ${type === 'user' ? 'justify-end' : 'justify-start'}`;

  const bubble = document.createElement('div');
  const baseClasses = "max-w-[80%] px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed break-words";
  const typeClasses = type === 'user' 
    ? "bg-blue-600 text-white rounded-br-none" 
    : "bg-white border border-gray-100 text-gray-800 rounded-bl-none";
  
  bubble.className = `${baseClasses} ${typeClasses}`;
  
  const text = document.createElement('p');
  text.textContent = content;
  bubble.appendChild(text);

  if (timestamp) {
    const time = document.createElement('span');
    time.className = `text-[10px] block mt-1 opacity-70 ${type === 'user' ? 'text-blue-100' : 'text-gray-400'}`;
    time.textContent = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    bubble.appendChild(time);
  }

  container.appendChild(bubble);
  return container;
}
