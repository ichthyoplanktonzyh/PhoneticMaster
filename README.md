# IPA Spelling Master — 美式音标拼写训练

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/react-19-61DAFB.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/typescript-5.8-3178C6.svg)](https://www.typescriptlang.org)

[English](README_EN.md)

一款面向美式英语学习者的国际音标（IPA）拼写训练工具。通过听取浏览器原生语音合成的单词发音，在交互式 IPA 键盘的辅助下完成音标转写，即时获得正确性反馈。

## 功能特性

- **听音辨音**：利用浏览器 Web Speech API 朗读单词，建立语音与 IPA 符号的映射
- **IPA 交互键盘**：内置完整的美式音标输入键盘（元音 / 辅音 / 重音标记），无需记忆符号或安装第三方输入法
- **三级难度**：基础 / 进阶 / 挑战，基于 COCA 词频分级
- **智能语音选择**：自动优选高质量英语语音（Samantha、Google US English 等），支持手动切换
- **即时反馈**：提交答案后立即显示对错，错误时展示正确答案和实际单词
- **纯前端零依赖**：不依赖任何外部 API 或后端服务，无需 API Key

## 环境要求

- **Node.js** >= 18
- **浏览器**：Chrome / Edge / Safari / Firefox 最新版（需要支持 Web Speech API）

## 安装与运行

### 本地开发

```bash
# 1. 克隆仓库
git clone https://github.com/<你的用户名>/ipa-spelling-master.git
cd ipa-spelling-master

# 2. 安装依赖
npm install

# 3. 启动开发服务器（默认 http://localhost:3000）
npm run dev
```

### 生产构建

```bash
# 构建到 dist/ 目录
npm run build

# 本地预览生产版本
npm run preview
```

构建产物为纯静态文件（`dist/` 目录），可直接部署到任意静态托管服务。

### 部署到 GitHub Pages / Vercel / Netlify

将 `dist/` 目录部署即可，无需任何环境变量或后端服务。详见下方「部署指南」。

## 使用指南

### 基本流程

1. **选择难度**：点击顶部 Header 区域的「基础 / 进阶 / 挑战」切换难度。每次切换会重新随机出题。
2. **听发音**：点击中央圆形扬声器按钮 🔊，浏览器会朗读当前单词的美式发音（可重复点击）。
3. **输入音标**：使用下方的 IPA 键盘，点击符号按钮拼接出你听到的 IPA 转写。也可以在输入框中直接用键盘输入。
4. **提交判定**：点击「Check Answer」按钮，系统会对比你的输入与标准美式 IPA，给出 ✓ 正确或 ✗ 错误的反馈。
5. **查看结果**：无论对错都会显示当前单词。答错时会展示标准美式 IPA 供对照学习。
6. **下一题**：点击「Next Challenge」进入下一题，直至完成本轮 10 题。
7. **换一批**：点击底部「New Word Set」重新随机抽取 10 题。

### 选择发音人

Header 右侧的 Voice 下拉菜单，可以切换不同的英语语音。系统默认自动选择质量最高的语音（macOS 上优先使用 Samantha，Chrome 上优先使用 Google US English）。你的选择会自动保存在浏览器中。

### IPA 键盘

键盘默认展开，分为三个区域：

| 分区 | 内容 |
|------|------|
| Vowels（元音） | i ɪ eɪ ɛ æ ɑ ɔ oʊ ʊ u ʌ ɚ ə aɪ aʊ ɔɪ |
| Consonants（辅音） | p b t d k ɡ f v θ ð s z ʃ ʒ h m n ŋ l r j w tʃ dʒ |
| Marks（标记） | ˈ（主重音） ˌ（次重音） .（音节分隔） ␣（空格） |

点击「Hide Keypad」可折叠键盘，腾出更多屏幕空间。

## 词库

基于 [COCA（Corpus of Contemporary American English）](https://www.english-corpora.org/coca/) 前 5000 词频表，共收录 **4,648** 个单词，每个单词包含英式（RP）和美式（General American）两种 IPA 音标。

| 难度 | 词频范围 | 词数 | 示例（美式 IPA） |
|------|---------|------|------|
| 基础 | 1–1200 | 952 | say /se/, time /taɪm/ |
| 进阶 | 1201–3000 | 1,746 | method /ˈmɛθəd/, surface /ˈsɜ:rfɪs/ |
| 挑战 | 3001–5000 | 1,950 | composition /ˌkɑ:mpəˈzɪʃn/ |

词库数据源自 [llt22/coca-vocabulary-20000](https://github.com/llt22/coca-vocabulary-20000)，解析脚本位于 `.coca_raw/parse.py`。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 19 |
| 语言 | TypeScript 5.8 |
| 构建 | Vite 6 |
| 样式 | Tailwind CSS 4 |
| 动画 | Motion (Framer Motion) |
| 图标 | Lucide React |
| 语音 | Web Speech API (SpeechSynthesis) |
| 字体 | Noto Sans (Google Fonts) |

## 项目结构

```
src/
├── main.tsx                 # 入口
├── App.tsx                  # 主应用组件
├── index.css                # 全局样式 + IPA 字体定义
├── types.ts                 # 类型定义
├── components/
│   └── IPAKeypad.tsx        # IPA 交互键盘组件
├── data/
│   └── wordBank.ts          # 本地词库（4,648 词）
└── utils/
    └── voice.ts             # 语音管理（智能选择 + localStorage 持久化）
```

## 部署指南

项目构建产物为纯静态文件，无需服务端，可部署到任意静态托管平台。

### GitHub Pages

```bash
# 1. 在 GitHub 创建仓库，推送代码
# 2. Settings → Pages → Source: GitHub Actions
# 3. 创建 .github/workflows/deploy.yml（略）
# 或手动：npm run build → 将 dist/ 推送到 gh-pages 分支
```

### Vercel / Netlify

1. 关联 GitHub 仓库
2. 构建命令：`npm run build`
3. 输出目录：`dist`
4. 无需设置环境变量

### 本地文件直接打开

构建后的 `dist/index.html` 可以直接在浏览器中打开使用（Web Speech API 在 `file://` 协议下也可正常工作）。

## 常见问题

**Q: 点击播放按钮没有声音？**
A: 检查浏览器是否支持 Web Speech API（Chrome/Edge/Safari 均支持）。macOS 用户请确保系统声音未静音。

**Q: IPA 符号显示为方框？**
A: 项目已通过 Google Fonts 加载 Noto Sans 字体，需要网络连接。离线使用时可预先下载字体文件。

**Q: 语音太难听 / 不是美式发音？**
A: 使用 Header 右侧的 Voice 下拉菜单切换发音人。Samantha（macOS）和 Google US English（Chrome）质量最佳。

## 许可证

[Apache License 2.0](LICENSE)
