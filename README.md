# AI 聊天移动端原型 (AI Chat Mobile Prototype)

这是一个基于 HTML5、TypeScript 和 Tailwind CSS 构建的模块化 AI 聊天移动端原型。项目采用 Multi-Page Application (MPA) 架构，利用 Vite 进行构建，旨在提供轻量、高性能且易于扩展的移动端对话界面体验。

## 核心特性

*   **模块化架构**: 各功能模块（聊天、历史记录）作为独立 HTML 页面存在，便于解耦和独立部署。
*   **统一组件库**: 提供一套共享的 UI 组件（导航栏、气泡、输入框等）和功能库（AI 服务、历史管理），确保风格一致。
*   **移动端优先**: 针对移动设备优化的交互设计，包括自动键盘适配、平滑滚动和触摸友好的界面元素。
*   **现代化技术栈**: 使用 Vite 极速构建，Tailwind CSS 4.0 进行原子化样式开发，TypeScript 保证代码健壮性。
*   **Docker 支持**: 内置 Docker 配置，支持一键容器化部署。

## 目录结构

```
project/
├── dist/                   # 构建产物 (自动生成)
├── src/
│   ├── components/         # 共享 UI 组件库
│   │   └── ui/
│   │       ├── bubble.ts   # 聊天气泡
│   │       ├── input.ts    # 输入框
│   │       ├── navbar.ts   # 导航栏
│   │       ├── loading.ts  # 加载指示器
│   │       └── error.ts    # 错误提示
│   ├── lib/                # 共享逻辑库
│   │   ├── ai.ts           # AI 服务模拟 (Mock)
│   │   └── storage.ts      # 本地存储管理
│   ├── pages/              # 功能模块页面
│   │   ├── chat/           # 聊天模块
│   │   └── history/        # 历史记录模块
│   └── styles/             # 全局样式
├── index.html              # 项目入口/着陆页
├── nginx.conf              # Nginx 部署配置
├── Dockerfile              # Docker 构建文件
├── docker-compose.yml      # Docker Compose 编排文件
├── vite.config.ts          # Vite 配置文件
└── package.json            # 项目依赖配置
```

## 项目部署

### 本地开发

1.  **安装依赖**:
    ```bash
    pnpm install
    ```

2.  **启动开发服务器**:
    ```bash
    pnpm dev
    ```
    访问 `http://localhost:5173`。

### Docker 部署 (推荐)

项目已配置 Docker 环境，支持一键启动。

1.  **构建并启动容器**:
    ```bash
    docker compose up --build -d
    ```

2.  **访问项目**:
    打开浏览器访问 `http://localhost:3000`。

3.  **停止服务**:
    ```bash
    docker compose down
    ```

### 手动构建部署

如果您不使用 Docker，也可以手动构建静态文件部署到任何静态服务器（如 Nginx, Apache, Vercel）。

1.  **构建生产版本**:
    ```bash
    pnpm build
    ```

2.  **部署**:
    将 `dist/` 目录下的所有文件上传至您的 Web 服务器根目录即可。
