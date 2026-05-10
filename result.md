# 用户发送消息到收到 AI 回复的完整链路

## 项目概览

这是一个基于 Vite + TypeScript + Tailwind CSS 的纯前端 AI 聊天应用，无后端依赖。AI 回复由 `src/lib/ai.ts` 中的模拟服务生成，聊天记录持久化于浏览器 localStorage。

---

## 第一步：页面初始化与历史加载

1. 浏览器加载 `src/pages/chat/index.html`，页面包含一个全屏 flex 容器 `<div id="app">`。
2. `src/pages/chat/main.ts` 作为入口脚本执行，完成以下初始化：
   - 创建 Navbar 组件（标题"AI 助手"，含返回按钮和历史记录入口链接）。
   - 创建消息列表容器 `messageList`（一个可滚动的 div）。
   - 从 localStorage 读取历史消息：调用 `HistoryManager.getMessages()`，该函数从 localStorage 的 `ai_chat_history` 键中反序列化出 Message 数组。
   - 如果历史为空，渲染一条欢迎消息（角色为 ai，内容为"你好！我是你的 AI 助手。有什么我可以帮你的吗？"），此消息**不会**写入 localStorage。
   - 如果历史不为空，遍历所有历史消息逐一调用 `renderMessage` 渲染气泡，最后一次性滚动到底部。
   - 创建 InputArea 组件并挂载到 app 末尾，将 `handleSend` 回调传入。

---

## 第二步：用户输入与触发发送

1. `InputArea` 组件（`src/components/ui/input.ts`）包含一个 textarea 和一个发送按钮。
2. textarea 监听 `input` 事件，实现两项功能：
   - 自动调整高度以适应多行文本。
   - 根据输入内容是否为空控制发送按钮的 disabled 状态。
3. 发送触发方式有两种：
   - **点击发送按钮**：触发 `sendBtn.onclick`。
   - **键盘 Enter 键**（非 Shift+Enter）：在 textarea 的 `keydown` 事件中拦截。
4. 两种方式均调用内部 `handleSend` 函数，该函数：
   - 获取 textarea 内容并 trim。
   - 如果内容非空，调用外部传入的 `onSend(text)` 回调（即 `main.ts` 中的 `handleSend`）。
   - 清空 textarea，重置其高度，禁用发送按钮。

---

## 第三步：消息处理主流程（handleSend）

`handleSend` 是整个链路的核心协调函数，位于 `src/pages/chat/main.ts`。流程如下：

1. **防重入检查**：检查 `isLoading` 标志，如果为 true 则直接返回，避免并发请求。
2. **保存并渲染用户消息**：
   - 调用 `HistoryManager.addMessage('user', text)`，生成一个包含 `id`（crypto.randomUUID）、`role`（'user'）、`content`（用户输入文本）、`timestamp`（Date.now()）的 Message 对象，追加到 localStorage 中的消息数组并写入。
   - 调用 `renderMessage(userMsg)` 渲染用户气泡。
3. **显示加载状态**：
   - 设置 `isLoading = true`。
   - 创建 `LoadingIndicator` 组件（旋转动画 + "AI 正在思考..."文字），追加到消息列表。
   - 滚动到底部。
4. **发起 AI 请求**：
   - 调用 `AIService.sendMessage(text)`，进入异步等待。

---

## 第四步：AI 服务处理

`AIService.sendMessage`（`src/lib/ai.ts`）是一个模拟的 AI 服务：

1. 使用 `setTimeout` 模拟 1500ms 网络延迟。
2. 延迟结束后，根据用户输入文本中的关键词进行简单匹配：
   - 包含"你好"或"hello" → 返回问候语。
   - 包含"时间"或"time" → 返回当前时间。
   - 包含"天气"或"weather" → 返回固定天气回复。
   - 包含"笑话"或"joke" → 返回固定笑话。
   - 其他情况 → 返回"我收到了你的消息："加上原文。
3. 返回值为 Promise\<string\>，resolve 的内容即为 AI 回复文本。

---

## 第五步：接收回复与状态更新

回到 `handleSend` 的 try/catch/finally 结构：

1. **成功路径**：
   - `await AIService.sendMessage(text)` 返回回复文本。
   - 移除加载指示器（`loader.remove()`）。
   - 调用 `HistoryManager.addMessage('ai', responseText)`，将 AI 回复以 Message 对象（role 为 'ai'）写入 localStorage。
   - 调用 `renderMessage(aiMsg)` 渲染 AI 气泡。
2. **失败路径**（catch）：
   - 移除加载指示器。
   - 创建 `ErrorAlert` 组件（红色提示条，显示"获取响应失败，请重试。"），追加到 document.body。该组件会在 3 秒后自动移除。
3. **最终路径**（finally）：
   - 将 `isLoading` 重置为 false，解锁输入。

---

## 第六步：消息渲染

`renderMessage` 函数负责将一条 Message 渲染到消息列表：

1. 调用 `ChatBubble` 组件（`src/components/ui/bubble.ts`），传入消息内容、角色和时间戳。
2. `ChatBubble` 根据角色类型生成不同样式的气泡 DOM：
   - **user 气泡**：蓝色背景、白色文字、右对齐、右下角无圆角。
   - **ai 气泡**：白色背景、灰色边框、左对齐、左下角无圆角。
   - 两种气泡均显示文本内容和格式化时间（小时:分钟）。
3. 气泡追加到 `messageList` 容器。
4. 默认触发 `scrollToBottom`，平滑滚动到消息列表底部。

---

## 第七步：数据持久化

`HistoryManager`（`src/lib/storage.ts`）管理所有消息的持久化：

- **存储位置**：浏览器 localStorage，键名为 `ai_chat_history`。
- **数据结构**：Message 数组的 JSON 序列化字符串。每条 Message 包含 id（UUID）、role（'user' | 'ai'）、content（文本）、timestamp（毫秒时间戳）。
- **读取**：`getMessages()` 从 localStorage 反序列化，失败时返回空数组。
- **写入**：`addMessage()` 读取现有数组 → 追加新消息 → 整体写回 localStorage → 返回新消息对象。
- **清除**：`clearHistory()` 删除 localStorage 中的对应键。

历史记录页面（`src/pages/history/`）复用 `HistoryManager.getMessages()` 和 `ChatBubble` 组件展示所有历史消息，并提供"清除所有历史"按钮。

---

## 状态变化总结

| 时机 | isLoading | localStorage | 消息列表 DOM |
|------|-----------|-------------|-------------|
| 初始化 | false | 读取历史 | 渲染历史消息或欢迎语 |
| 用户发送消息 | false → true | 追加 user 消息 | 追加用户气泡 + 加载指示器 |
| AI 回复成功 | true → false | 追加 ai 消息 | 移除加载指示器，追加 AI 气泡 |
| AI 回复失败 | true → false | 不变 | 移除加载指示器，显示错误提示 |

---

## 完整链路一图流

```
用户输入文本 → 点击发送/按 Enter
  → InputArea.handleSend() 清空输入框
    → main.ts handleSend(text)
      → 防重入检查 (isLoading)
      → HistoryManager.addMessage('user', text) 写入 localStorage
      → renderMessage(userMsg) 渲染用户气泡
      → isLoading = true，显示 LoadingIndicator
      → AIService.sendMessage(text)
        → 模拟 1500ms 延迟
        → 关键词匹配生成回复文本
      ← 返回回复文本
      → 移除 LoadingIndicator
      → HistoryManager.addMessage('ai', response) 写入 localStorage
      → renderMessage(aiMsg) 渲染 AI 气泡
      → isLoading = false
```
