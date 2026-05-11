# 用户发送消息到收到 AI 回复的完整链路

## 一、初始状态与页面加载

1. **页面初始化**
   - 用户进入聊天页面，加载 `chat/main.ts`
   - 从 `localStorage` 读取历史消息记录
   - 若无历史消息，显示 AI 欢迎消息；若有，则逐条渲染所有历史消息
   - 渲染完成后自动滚动到底部

## 二、用户输入阶段

### 2.1 输入框交互
- 用户在输入框（`textarea`）中输入文字
- 输入框自动调整高度（根据内容自动扩容）
- 发送按钮状态实时更新：有内容时启用，无内容时禁用

### 2.2 触发发送
- 用户点击发送按钮，或按 Enter 键（Shift+Enter 换行）
- 输入框获取 trimmed 后的文本内容
- 调用父组件传入的 `handleSend` 回调函数

## 三、消息流转与存储（用户消息）

### 3.1 状态检查
- 检查 `isLoading` 标志，防止重复发送
- 如果正在加载中，直接返回，不处理

### 3.2 存储用户消息
- 调用 `HistoryManager.addMessage('user', text)`
  - 生成唯一消息 ID（`crypto.randomUUID()`）
  - 记录消息角色（user）、内容、时间戳
  - 从 `localStorage` 读取现有消息数组
  - 将新消息追加到数组末尾
  - 序列化后写回 `localStorage`
  - 返回完整的消息对象

### 3.3 渲染用户消息
- 调用 `renderMessage(userMsg)`
  - 创建 `ChatBubble` 组件（右侧蓝色气泡）
  - 显示消息内容和时间戳
  - 将气泡追加到消息列表容器
  - 自动平滑滚动到底部

## 四、加载状态与 AI 请求

### 4.1 显示加载状态
- 设置 `isLoading = true`
- 创建 `LoadingIndicator` 组件（旋转动画 + "AI 正在思考..."）
- 将加载指示器追加到消息列表
- 滚动到底部

### 4.2 调用 AI 服务
- 调用 `AIService.sendMessage(text)`
  - 模拟 1.5 秒网络延迟
  - 根据关键词匹配返回不同的模拟回复
  - 匹配失败返回默认回复

## 五、消息流转与存储（AI 回复）

### 5.1 成功响应处理
- 移除加载指示器
- 调用 `HistoryManager.addMessage('ai', responseText)` 存储 AI 消息
- 调用 `renderMessage(aiMsg)` 渲染 AI 消息（左侧白色气泡）
- 自动滚动到底部
- 设置 `isLoading = false`

### 5.2 错误处理
- 移除加载指示器
- 创建 `ErrorAlert` 组件（顶部红色提示条）
- 3 秒后自动消失
- 设置 `isLoading = false`

## 六、数据流向总结

```
用户输入
    ↓
InputArea 组件
    ↓
handleSend 回调
    ├─→ HistoryManager.addMessage() → localStorage
    ├─→ renderMessage() → DOM 渲染
    └─→ AIService.sendMessage()
          ↓
加载状态显示
          ↓
AI 响应（模拟）
          ↓
成功/失败分支
    ├─ 成功：HistoryManager 存储 → renderMessage 渲染
    └─ 失败：ErrorAlert 显示
```

## 七、状态变化说明

| 阶段 | isLoading | 用户操作 | UI 状态 |
|------|-----------|----------|---------|
| 空闲 | false | 可输入、可发送 | 正常输入框 |
| 发送中 | true | 输入框禁用、发送按钮禁用 | 显示加载指示器 |
| 完成 | false | 恢复可操作 | 显示完整对话 |

## 八、数据存储结构

**localStorage 键名**: `ai_chat_history`

**消息对象结构**:
```typescript
{
  id: string,        // UUID
  role: 'user' | 'ai',
  content: string,
  timestamp: number  // 毫秒时间戳
}
```
