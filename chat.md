# 梳理用户消息到 AI 回复链路

> **Workspace:** d:\code\trae\gsb\20260509\B-170-代码理解-1\TestM_2

---

## User
梳理用户发送消息到收到 AI 回复的完整链路，包括输入怎么流转、状态怎么变化、数据怎么存储和渲染。用文字分步说明，不用贴代码，将结果存入 result.md 中。

## Assistant
已完成梳理，结果已写入 `result.md`。整体链路概括如下：

**七个关键步骤**：

1. **页面初始化** — 从 localStorage 加载历史消息并渲染，若无历史则显示欢迎语。
2. **用户输入** — 在 `InputArea` 组件的 textarea 中输入文本，支持点击按钮或 Enter 键触发发送。
3. **消息处理主流程** — `handleSend` 防重入 → 保存用户消息到 localStorage → 渲染用户气泡 → 显示加载指示器 → 发起 AI 请求。
4. **AI 服务处理** — `AIService.sendMessage` 模拟 1500ms 延迟后按关键词匹配返回回复文本。
5. **接收回复** — 移除加载指示器 → 保存 AI 消息到 localStorage → 渲染 AI 气泡；失败则显示 3 秒自动消失的错误提示。
6. **渲染** — `ChatBubble` 根据 role 生成不同样式的气泡（user 蓝色右对齐，ai 白色左对齐），追加到消息列表并滚动到底部。
7. **数据持久化** — 所有消息以 Message 数组的 JSON 形式存储在 localStorage 的 `ai_chat_history` 键中，历史页面可查看和清除。

`isLoading` 布尔标志控制防重入，在发送时设为 true，在 finally 中重置为 false，是整个链路中唯一的状态变量。

