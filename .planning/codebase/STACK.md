# PhoneticMaster — 技术栈

> 最后更新：2026-06-22

## 1. 总览

| 层 | 技术 | 版本 |
|----|------|------|
| UI 框架 | React | 19.0.1 |
| 语言 | TypeScript | ~5.8.2 |
| 构建 | Vite | 6.2.3 |
| 样式 | Tailwind CSS | 4.1.14 |
| 动画 | motion (Framer Motion) | 12.23.24 |
| 图标 | lucide-react | 0.546.0 |
| 服务器 | Express | 4.21.2 |
| 包管理 | npm | — |
| 模块系统 | ESM (`"type": "module"`) | — |

## 2. 前端依赖

### 生产依赖

| 包 | 用途 |
|----|------|
| react / react-dom | UI 渲染 |
| motion | 动画（卡片切换、反馈弹出、播放按钮脉动） |
| lucide-react | 图标（Volume2, CheckCircle2, ArrowRight 等） |
| express | 开发/生产服务器 |
| vite / @vitejs/plugin-react | 构建工具 + React Fast Refresh |
| @tailwindcss/vite | Tailwind Vite 插件 |
| tailwindcss | 原子化 CSS |

### 开发依赖

| 包 | 用途 |
|----|------|
| typescript | 类型检查 |
| tsx | TypeScript 执行器（开发服务器） |
| esbuild | server.ts 打包 |
| @types/express | Express 类型声明 |
| @types/node | Node.js 类型声明 |
| autoprefixer | CSS 前缀 |

## 3. Web API 依赖

| API | 用途 | 可用性 |
|-----|------|--------|
| SpeechSynthesis | TTS 语音合成 | Chrome / Safari / Firefox |
| localStorage | L1/L2/语音偏好持久化 | 所有现代浏览器 |
| CSS Grid/Flexbox | 键盘布局 | 所有现代浏览器 |

## 4. 构建与测试

| 命令 | 用途 |
|------|------|
| `npm run dev` | 启动开发服务器 (tsx server.ts, 端口 3000) |
| `npm run build` | Vite 构建 + esbuild 打包 server.ts |
| `npm run start` | 运行生产构建 (node dist/server.cjs) |
| `npm run preview` | 同 start |
| `npm run lint` | TypeScript 类型检查 (tsc --noEmit) |
| `npm run clean` | 清理 dist/ |
