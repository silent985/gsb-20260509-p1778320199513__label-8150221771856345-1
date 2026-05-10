import '../../styles/main.css';
import { Navbar } from '../../components/ui/navbar';
import { ChatBubble } from '../../components/ui/bubble';
import { InputArea } from '../../components/ui/input';
import { LoadingIndicator } from '../../components/ui/loading';
import { ErrorAlert } from '../../components/ui/error';
import { HistoryManager, Message } from '../../lib/storage';
import { AIService } from '../../lib/ai';

const app = document.getElementById('app')!;
const messageList = document.createElement('div');
messageList.className = 'flex-1 overflow-y-auto p-4 pb-24'; // Removed scroll-smooth class

// 1. Navbar
app.appendChild(Navbar('AI 助手', true));

// 2. Message List
app.appendChild(messageList);

// 3. Scroll helper
const scrollToBottom = (smooth = true) => {
  // Wait for DOM update
  setTimeout(() => {
    messageList.scrollTo({
      top: messageList.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }, 100);
};

// 4. Render Messages
const renderMessage = (msg: Message, shouldScroll = true, smooth = true) => {
  const bubble = ChatBubble(msg.content, msg.role, new Date(msg.timestamp));
  messageList.appendChild(bubble);
  if (shouldScroll) {
    scrollToBottom(smooth);
  }
};

// Load History
const history = HistoryManager.getMessages();
if (history.length === 0) {
    // Welcome message if empty
    renderMessage({
        id: 'init', 
        role: 'ai', 
        content: '你好！我是你的 AI 助手。有什么我可以帮你的吗？', 
        timestamp: Date.now()
    }, true, false);
} else {
    // Render all history without scrolling for each
    history.forEach(msg => renderMessage(msg, false));
    // Scroll once at the end (instant)
    scrollToBottom(false);
}

// Ensure scroll on window resize (e.g. mobile keyboard)
window.addEventListener('resize', () => scrollToBottom(false));

// 5. Input Handling
let isLoading = false;

const handleSend = async (text: string) => {
  if (isLoading) return;

  // Add User Message
  const userMsg = HistoryManager.addMessage('user', text);
  renderMessage(userMsg);

  // Show Loading
  isLoading = true;
  const loader = LoadingIndicator();
  messageList.appendChild(loader);
  scrollToBottom();

  try {
    // Get AI Response
    const responseText = await AIService.sendMessage(text);
    
    // Remove loader
    loader.remove();
    
    // Add AI Message
    const aiMsg = HistoryManager.addMessage('ai', responseText);
    renderMessage(aiMsg);
  } catch (error) {
    loader.remove();
    document.body.appendChild(ErrorAlert("获取响应失败，请重试。"));
  } finally {
    isLoading = false;
  }
};

app.appendChild(InputArea(handleSend));
