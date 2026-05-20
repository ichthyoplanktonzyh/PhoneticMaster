# IPA Spelling Master — 美式音标拼写训练

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/react-19-61DAFB.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/typescript-5.8-3178C6.svg)](https://www.typescriptlang.org)

一款面向美式英语学习者的国际音标（IPA）拼写训练工具。通过听取浏览器原生语音合成的单词发音，在交互式 IPA 键盘的辅助下完成音标转写，即时获得正确性反馈。

## 功能特性

- **听音辨音**：利用浏览器 Web Speech API 朗读单词，建立语音与 IPA 符号的映射
- **IPA 交互键盘**：内置完整的美式音标输入键盘（元音 / 辅音 / 重音标记），无需记忆符号或安装第三方输入法
- **三级难度**：基础 / 进阶 / 挑战，基于 COCA 词频分级
- **智能语音选择**：自动优选高质量英语语音（Samantha、Google US English 等），支持手动切换
- **即时反馈**：提交答案后立即显示对错，错误时展示正确答案和实际单词
- **纯前端零依赖**：不依赖任何外部 API 或后端服务，无需 API Key

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 词库

基于 [COCA（Corpus of Contemporary American English）](https://www.english-corpora.org/coca/) 前 5000 词频表，共收录 **4,648** 个单词，每个单词包含英式（RP）和美式（General American）两种 IPA 音标。

| 难度 | 词频范围 | 词数 | 示例 |
|------|---------|------|------|
| 基础 | 1–1200 | 952 | say /seɪ/, time /taɪm/ |
| 进阶 | 1201–3000 | 1,746 | method /ˈmeθəd/, surface /ˈsɜ:fɪs/ |
| 挑战 | 3001–5000 | 1,950 | composition /ˌkɒmpəˈzɪʃn/ |

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

## 许可证

[Apache License 2.0](LICENSE)
