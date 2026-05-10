import '../../styles/main.css';
import { Navbar } from '../../components/ui/navbar';
import { ChatBubble } from '../../components/ui/bubble';
import { HistoryManager } from '../../lib/storage';

const app = document.getElementById('app')!;

// 1. Navbar (Reuse)
app.appendChild(Navbar('历史记录', true));

// 2. Clear Button
const clearContainer = document.createElement('div');
clearContainer.className = 'p-4 bg-white border-b border-gray-100 sticky top-[60px] z-40';
const clearBtn = document.createElement('button');
clearBtn.className = 'w-full py-2 px-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors';
clearBtn.textContent = '清除所有历史';
clearBtn.onclick = () => {
  if (confirm('确定要删除所有历史记录吗？')) {
    HistoryManager.clearHistory();
    window.location.reload();
  }
};
clearContainer.appendChild(clearBtn);
app.appendChild(clearContainer);

// 3. Message List
const messageList = document.createElement('div');
messageList.className = 'flex-1 p-4 pb-12 space-y-4';
app.appendChild(messageList);

// 4. Load & Render
const history = HistoryManager.getMessages().reverse(); // Show newest first for history view maybe? Or oldest? Usually history is chronological.
// Let's keep chronological but maybe group by date?
// For simplicity, just list them.

if (history.length === 0) {
  const empty = document.createElement('div');
  empty.className = 'text-center text-gray-400 mt-20';
  empty.textContent = '暂无历史记录。';
  messageList.appendChild(empty);
} else {
  history.forEach(msg => {
    // Reuse ChatBubble component
    messageList.appendChild(ChatBubble(msg.content, msg.role, new Date(msg.timestamp)));
  });
}
