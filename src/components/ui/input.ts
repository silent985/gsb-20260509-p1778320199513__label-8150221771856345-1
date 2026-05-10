export function InputArea(onSend: (text: string) => void): HTMLElement {
  const container = document.createElement('div');
  container.className = 'sticky bottom-0 left-0 w-full bg-white border-t border-gray-200 px-4 py-3 pb-safe';

  const wrapper = document.createElement('div');
  wrapper.className = 'flex items-end gap-2 max-w-screen-md mx-auto';

  const input = document.createElement('textarea');
  input.className = 'flex-1 bg-gray-100 border-0 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none max-h-32 min-h-[48px] text-sm';
  input.placeholder = '请输入消息...';
  input.rows = 1;
  
  // Auto-resize
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = input.scrollHeight + 'px';
  });

  const sendBtn = document.createElement('button');
  sendBtn.className = 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed';
  sendBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  `;
  sendBtn.disabled = true;

  input.addEventListener('input', () => {
    sendBtn.disabled = !input.value.trim();
  });

  const handleSend = () => {
    const text = input.value.trim();
    if (text) {
      onSend(text);
      input.value = '';
      input.style.height = 'auto';
      sendBtn.disabled = true;
    }
  };

  sendBtn.onclick = handleSend;
  input.onkeydown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  wrapper.appendChild(input);
  wrapper.appendChild(sendBtn);
  container.appendChild(wrapper);

  return container;
}
