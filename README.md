# PhoneticMaster

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/react-19-61DAFB.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/typescript-5.8-3178C6.svg)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/vite-6-646CFF.svg)](https://vite.dev)

[English](README_EN.md)

PhoneticMaster 是一个基于浏览器的多语言发音与音标训练应用。它把目标语言抽象成 `LanguageProfile`，目前支持英语 IPA 和中文拼音训练，并能根据学习者母语给出更有针对性的训练单位推荐。

项目不依赖外部 API。词库保存在本地，发音播放使用浏览器 Web Speech API。

## 在线体验

当前已有公网版本可直接访问：

[https://ichthyoplanktonzyh.github.io/PhoneticMaster/](https://ichthyoplanktonzyh.github.io/PhoneticMaster/)

欢迎大家试用并提出使用意见，尤其是不同浏览器、手机型号和语音播放体验方面的问题。

## 当前能力

- **多目标语言**：支持 English / IPA 与 中文 / Pinyin，后续可通过新增 profile 扩展更多语言。
- **母语可选**：首次进入时只需选择目标语言；选择母语后会启用 L1 → L2 智能推荐。
- **两种训练模式**：
  - 拼写模式：听发音，输入 IPA 或拼音，提交后即时判定。
  - 训练模式：查看词语和标准标注，反复听音，适合熟悉训练单位和拼读规则。
- **最小对立体听辨**：按当前主题生成 A/B 选择题，播放目标音后选择听到的词，并在本轮结束后查看正确率和错题。
- **中文结构化输入提示**：中文拼写模式保留声母/韵母/声调分区键盘，并在输入框提示按“声母→韵母→声调”输入。
- **智能推荐**：根据 L1/L2 难度映射展示最容易混淆的训练单位和声音特征。
- **音素详情**：从主题、推荐、错题或最小对立体复盘打开详情，查看 L1 难点原因、例词和专项入口。
- **主题筛选**：按英语音素或中文拼音单元筛选题库，集中练习薄弱点。
- **可调题量**：每轮训练题数支持 1 到 50。
- **通用发音键盘**：键盘由语言 profile 驱动，英语显示元音/辅音/重音标记，中文显示声母/韵母/声调。
- **浏览器语音选择**：自动筛选当前目标语言的可用语音，也支持手动切换。
- **本地优先**：无需账号、无需 API Key，训练数据和偏好设置都保存在本地环境或浏览器中。

## 技术栈

| 类型 | 技术 |
| --- | --- |
| 前端 | React 19, TypeScript 5.8 |
| 构建 | Vite 6 |
| 样式 | Tailwind CSS 4 |
| 动画 | Motion |
| 图标 | Lucide React |
| 服务 | Express |
| 语音 | Web Speech API |

## 环境要求

- Node.js 18 或更高版本
- npm
- 支持 Web Speech API 的现代浏览器，例如 Chrome、Edge、Safari 或 Firefox

## 快速开始

```bash
git clone https://github.com/ichthyoplanktonzyh/PhoneticMaster.git
cd PhoneticMaster
npm install
npm run dev
```

开发服务器默认运行在：

```text
http://localhost:3000
```

## 常用命令

```bash
# 启动开发服务器
npm run dev

# 类型检查
npm run lint

# 数据校验
npm run validate:data

# 构建生产产物
npm run build

# 启动生产版本
npm run start

# 预览生产版本
npm run preview

# 清理构建产物
npm run clean
```

`npm run build` 会同时生成 Vite 前端产物和 Express 生产入口：

- `dist/index.html` 等静态资源
- `dist/server.cjs`

生产运行使用：

```bash
npm run build
npm run start
```

## 使用方式

1. 首次进入应用后，选择想学习的目标语言。
2. 可选选择母语，用于开启个性化训练重点推荐。
3. 在顶部切换「拼写」或「训练」模式。
4. 选择难度、训练主题和每轮题数。
5. 点击播放按钮听发音；训练模式下也可以按 `Space` 重播。
6. 拼写模式下输入答案并提交，系统会按训练单位序列判定结果。
7. 训练模式下使用左右箭头或页面按钮切换词条。

## 支持语言与词库

| 目标语言 | 标注系统 | 训练单位数 | 基础 | 进阶 | 挑战 | 总量 |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| English | IPA | 44 | 881 | 1,527 | 1,680 | 4,088 |
| 中文 | Pinyin | 61 | 131 | 99 | 20 | 250 |

英语词库基于 COCA 高频词数据整理，包含美式 IPA 作为主要训练标注，并保留英式 IPA 作为备用标注；当前数据已按 `display + pronunciation` 去重。中文词库基于 HSK 学习词表整理，使用带声调数字的拼音作为判定标准，并提供带调号拼音展示。

这里的“训练单位”指 profile 用于输入、筛选和判定的 token：英语为 IPA 音素与重音标记，中文为拼音单元（声母 21 + 韵母 35 + 声调 5）。它不是严格语言学意义上的音素总数。

当前还内置 15 组结构化最小对立体材料（英语 8 组、中文 7 组）。它们使用 Web Speech API 播放，并已在数据结构中预留 `audioUrl` 供未来接入标准音频。

## 架构概览

应用核心是 `LanguageProfile`。每个目标语言 profile 负责声明：

- 语言代码与展示名称
- 标注系统名称，例如 IPA 或 Pinyin
- 训练单位清单
- 屏幕键盘布局
- TTS 语言代码
- 标注解析函数
- 答案判定函数
- 难度分层词库
- 与 L1 推荐相关的声音特征

这种结构让 UI 和训练流程尽量保持语言无关。新增目标语言时，主要工作是补充 profile、词库、解析器和必要的判定逻辑。

## 项目结构

```text
.
├── server.ts                    # Express + Vite 开发/生产入口
├── src/
│   ├── App.tsx                  # 主应用状态与页面骨架
│   ├── main.tsx                 # React 入口
│   ├── types.ts                 # 训练、声音单位、语言 profile 类型
│   ├── components/
│   │   ├── OnboardingView.tsx   # 首次语言选择
│   │   ├── SmartRecommend.tsx   # L1/L2 智能推荐面板
│   │   ├── TrainingView.tsx     # 浏览/听音训练模式
│   │   ├── MinimalPairView.tsx  # 最小对立体听辨模式
│   │   ├── PhonemeDetailPanel.tsx # 音素/拼音单元详情面板
│   │   └── PhoneticKeypad.tsx   # profile 驱动的通用音标键盘
│   ├── data/
│   │   ├── wordBank.ts          # 英语 IPA 词库
│   │   ├── zhWordBank.ts        # 中文拼音词库
│   │   └── minimalPairBank.ts   # 结构化最小对立体材料
│   ├── profiles/
│   │   ├── en.ts                # 英语 IPA profile
│   │   ├── zh.ts                # 中文 Pinyin profile
│   │   └── index.ts             # profile 注册表
│   ├── l1/
│   │   ├── difficultyMap.ts     # L1/L2 难度映射入口
│   │   ├── en_zh.ts             # 英语母语者学中文
│   │   └── zh_en.ts             # 中文母语者学英语
│   └── utils/
│       ├── ipaParser.ts         # IPA tokenization
│       ├── pinyinParser.ts      # 拼音解析与规范化
│       ├── judge.ts             # 训练单位级答案判定
│       ├── phonemeGroups.ts     # 按训练单位统计和筛选词库
│       ├── phonemeDetails.ts    # 训练单位详情读模型
│       ├── trainingSession.ts   # 训练 session 生成
│       ├── minimalPairs.ts      # 最小对立体题目和结果生成
│       └── voice.ts             # 浏览器语音选择与偏好保存
├── PRD.md                       # 产品需求文档
├── 系统分析-DFD.md              # 数据流分析
├── CHANGELOG.md                 # 变更记录
└── AGENT.md                     # 维护说明
```

## 部署

MVP 推荐作为纯静态 SPA 部署。GitHub Pages 构建需要启用仓库路径 base：

```bash
GITHUB_PAGES=true npm run build
```

构建后 `dist/index.html` 中的资源路径应以 `/PhoneticMaster/assets/` 开头。当前仓库已配置 GitHub Actions 自动部署到：

[https://ichthyoplanktonzyh.github.io/PhoneticMaster/](https://ichthyoplanktonzyh.github.io/PhoneticMaster/)

Vercel、Netlify、Cloudflare Pages 等平台可直接使用：

```bash
npm run build
```

并发布 `dist/` 目录。项目不需要环境变量。

`server.ts` / Express 仍可用于本地生产预览或自托管：

```bash
npm install
npm run build
npm run start
```

服务监听 `0.0.0.0:3000`。它不是公网 MVP 的必需后端。

## 常见问题

**没有声音怎么办？**

确认浏览器支持 Web Speech API，系统音量未静音，并尝试在 Voice 下拉菜单中切换语音。

**为什么某些母语组合没有推荐？**

智能推荐依赖 `src/l1/` 下的 L1/L2 难度映射。当前重点覆盖中文母语者学英语、英语母语者学中文，其他组合会退回普通训练。

**拼音中的 `v` 是什么？**

中文 profile 使用 `v` 表示键盘输入中的 `ü`，例如 `nv3`、`lv4` 这类常见输入法写法。

**为什么中文键盘按声母、韵母、声调分组？**

这是中文教学中常见的拼音拆解方式，适合作为学习辅助。熟悉拼音输入的用户仍可直接在输入框键入完整 tone-number 拼音。

**为什么中文 Pinyin 是 61 个训练单位？**

这里统计的是应用内部用于输入、筛选和判定的拼音单元，不是严格语言学意义上的音素。当前中文 profile 包含 21 个声母、35 个韵母和 5 个声调，共 61 个训练单位。

**需要配置环境变量吗？**

不需要。`.env.example` 仅说明项目不依赖 API Key 或外部服务。

## 许可证

本项目基于 [Apache License 2.0](LICENSE) 开源。
