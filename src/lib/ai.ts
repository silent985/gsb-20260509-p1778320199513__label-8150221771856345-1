export const AIService = {
  async sendMessage(text: string): Promise<string> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simple mock responses based on keywords
    const lowerText = text.toLowerCase();
    if (lowerText.includes('你好') || lowerText.includes('hello')) {
      return "你好！有什么我可以帮你的吗？";
    }
    if (lowerText.includes('时间') || lowerText.includes('time')) {
      return `现在时间是 ${new Date().toLocaleTimeString()}。`;
    }
    if (lowerText.includes('天气') || lowerText.includes('weather')) {
      return "我无法查看实时天气，但数字世界看起来阳光明媚！";
    }
    if (lowerText.includes('笑话') || lowerText.includes('joke')) {
      return "为什么程序员总是分不清万圣节和圣诞节？因为 Oct 31 == Dec 25。";
    }
    
    return `我收到了你的消息："${text}"。这是一个模拟回复。`;
  }
};
