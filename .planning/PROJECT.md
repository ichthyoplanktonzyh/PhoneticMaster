# 多语言语音训练平台 PRD

## 1. 文档信息

- **文档用途**：定义 PhoneticMaster 产品愿景、范围、核心概念与迭代方向
- **当前阶段**：v1.0 — 双语言（英语 IPA + 汉语拼音）基础训练
- **参考文档**：`ROADMAP.md`、`REQUIREMENTS.md`、`STATE.md`、`codebase/ARCHITECTURE.md`
- **更新记录**：
  - 2026-06-22：初始版本，定义从英语单语 IPA 工具扩展为多语言语音训练平台

## 2. 产品愿景

> 我为什么听不出 /ɪ/ 和 /i/ 的区别？
> 为什么老说我二声三声不分？

PhoneticMaster 是一个 **L1-aware 的多语言语音训练平台**。它帮助语言学习者通过系统性练习克服母语带来的语音感知盲区。

核心主张：**知道你的母语，才知道你最该练什么。**

## 3. 背景与现状

### 起源

项目最初名为 `ipa-spelling`，是一个纯英语美式 IPA 拼写训练工具。用户听英语单词发音，用屏幕 IPA 键盘输入音标，系统判断对错。功能完整但仅服务于"学英语"这一个场景。

### 扩展动机

1. **L2 扩展**：汉语学习者需要拼音训练，且拼音体系（声母/韵母/声调）与 IPA 键盘布局完全不同
2. **L1 感知差异**：不同母语者对同一目标语言的感知盲区不同（PAM / SLM 理论），应该提供个性化推荐
3. **架构可持续**：添加日语、西语等新语言时不应修改框架代码，只需新增 Profile + 词库

### 当前能力

| 维度 | 状态 |
|------|------|
| 英语 IPA 拼写训练 | ✅ 完整 |
| 汉语拼音拼写训练 | ✅ 基础可用 |
| 听力训练模式 | ✅ 双语言支持 |
| L1→L2 难度映射 | ✅ zh→en + en→zh |
| 智能推荐面板 | ✅ 基础版 |
| 语音合成 (TTS) | ✅ Web Speech API |
| 新语言扩展 | ✅ Profile 架构就绪 |

## 4. 产品定位

| 定位维度 | 描述 |
|----------|------|
| **目标用户** | 正在学习第二语言 (L2) 的成年学习者 |
| **核心场景** | 语音感知训练：通过听写、拼写练习克服 L1 干扰 |
| **与词典的区别** | 词典告诉你"这个词怎么读"，PhoneticMaster 告诉你"你为什么读不准" |
| **与口语 App 的区别** | 口语 App 练产出，PhoneticMaster 练感知——先听得准，才能说得对 |
| **平台** | Web SPA（桌面优先），未来可扩展移动端 |

## 5. 核心理论框架

### 5.1 PAM — 感知同化模型 (Perceptual Assimilation Model)

Best (1994) 提出的 PAM 认为：L2 语音会被听者同化到最接近的 L1 类别中。同化类型决定了感知难度：

| 同化类型 | 感知结果 | 难度 |
|----------|----------|------|
| Two Category (TC) | 两个 L2 音分别同化到两个 L1 音 | 容易区分 |
| Single Category (SC) | 两个 L2 音同化到同一个 L1 音 | 很难区分 |
| Category Goodness (CG) | 都同化到同一 L1 音，但一个更像 | 中等难度 |
| Uncategorized-Categorized (UC) | 一个可同化，另一个不可 | 较难 |
| Uncategorized-Uncategorized (UU) | 都不可同化 | 极难 |

### 5.2 SLM — 语音学习模型 (Speech Learning Model)

Flege (1995) 的 SLM 补充了产出侧：L2 语音能否被习得取决于学习者是否建立了新的语音范畴。如果 L2 音与 L1 音"太像"，学习者会将其合并到已有范畴，永远无法准确产出。

### 5.3 对产品的意义

- 不同 (L1, L2) 对的难点完全不同 → 需要 L1-aware 的难度映射
- "接近但不相同"的音最难 → 需要最小对立体 (minimal pairs) 训练
- 感知先于产出 → 先练听辨，再练拼写

## 6. 核心用户流程

```
首次访问 → Onboarding (选择母语 L1 + 目标语言 L2)
         → 智能推荐面板 (显示 L1→L2 难点音素)
         → 选择训练模式
            ├── 拼写模式：听音 → 输入音标/拼音 → 系统判定
            └── 训练模式：听音 → 跟读/记忆 → 翻页浏览
         → 查看得分 → 继续训练或切换音素
```

## 7. MVP 范围 (v1.0)

### 包含

- 英语 IPA 拼写训练（基础/进阶/挑战三个难度档）
- 汉语拼音拼写训练（HSK 1-3 词库）
- 10 种 L1 选项 + zh→en / en→zh 难度映射
- 智能推荐面板（显示难点音素 + PAM/SLM 原因）
- Web Speech API TTS
- 音素筛选 + 词汇量控制
- 进度条 + 得分

### 不包含

- 用户注册 / 登录
- 语音识别（产出训练）
- 后端服务 / 数据库
- 移动端适配
- 社交功能（排行榜、分享）
- 离线 PWA

## 8. 数据概念

### 8.1 核心类型

| 概念 | 类型 | 说明 |
|------|------|------|
| TrainingItem | `interface` | 语言无关的训练条目：display + pronunciation + pronunciationAlt + frequencyTier + definition? |
| LanguageProfile | `interface` | 语言声明：音素清单 + 键盘布局 + 解析器 + 判定器 + 词库 |
| JudgeResult | `interface` | 判定结果：correct + nearMatch + diffs[] |
| L1L2Difficulty | `interface` | L1→L2 难度映射：hardPhonemes + hardFeatures |
| PhonemeDifficulty | `interface` | 单音素难度：phoneme + level + reason + l1Equivalence + minimalPairs |
| KeypadSection | `interface` | 键盘区域：category + phonemes[] |
| Difficulty | `type` | `'basic' \| 'intermediate' \| 'advanced'` |

### 8.2 旧类型兼容

| 旧类型 | 新类型 | 映射 |
|--------|--------|------|
| WordData | TrainingItem | word→display, ipa_us→pronunciation, ipa_uk→pronunciationAlt |

## 9. 成功标准

| 指标 | 目标 |
|------|------|
| 支持的目标语言数 | ≥ 2（英语 + 汉语） |
| L1×L2 难度映射 | ≥ 2 对（zh→en + en→zh） |
| 新语言接入成本 | 仅需添加 1 个 profile 文件 + 1 个词库文件 + 0 行框架代码改动 |
| 编译零错误 | `npx tsc --noEmit` 通过 |
| 构建成功 | `npm run build` 通过 |

## 10. 风险与待决策事项

| # | 风险/决策 | 影响 | 当前状态 |
|---|-----------|------|----------|
| 1 | Web Speech API 语音质量参差不齐 | TTS 体验不可控 | 已实现优先级打分 + 手动选择 |
| 2 | 拼音输入方式：声调用数字还是符号？ | 影响拼写模式 UX | 已选：数字形式 (ni3 hao3)，同时显示声调符号 |
| 3 | 拼音 judge 对声调的容错度 | 声调错误算 nearMatch 还是 incorrect？ | 当前：声调错误算 incorrect |
| 4 | 是否需要后端存储训练历史？ | 影响离线能力与多设备同步 | 待决策，v1.0 不含 |
| 5 | 未来是否引入 ASR 做产出训练？ | 需要集成 Web Speech Recognition 或 Whisper | 待决策，v2.0+ 考虑 |
| 6 | L1×L2 映射数据由谁维护？ | 语言学专业性强 | 当前硬编码，未来考虑社区贡献 |

## 11. 里程碑状态

| 里程碑 | 内容 | 状态 |
|--------|------|------|
| M0 | 原始 ipa-spelling 英语工具 | ✅ 已完成（项目起点） |
| M1 | 多语言架构 + 汉语 + L1 推荐 | ✅ 已完成 |
| M2 | 训练体验增强 + 词库扩充 | 🧭 规划中 |
| M3 | 新语言接入（日语/西语） | 🧭 远期 |

> 详细阶段规划见 `ROADMAP.md`，当前状态见 `STATE.md`
