# IPA Spelling Master — 结构化系统分析文档

> 分析方法：数据流图 (Data Flow Diagram, DFD)  
> 建模工具：Yourdon/DeMarco 符号体系

---

## 1. 系统概述

### 1.1 系统目标
IPA Spelling Master 是一个基于 Web 的美式英语 IPA 音标拼写训练系统。核心业务流程为：系统从 AI 服务获取训练词库并生成发音音频 → 用户听取发音 → 用户通过 IPA 键盘输入音标 → 系统判定答案并反馈结果 → 进入下一题直至完成全部训练。

### 1.2 分析范围
本分析覆盖系统的全部功能：词库生成、TTS 音频合成、用户交互输入、答案判定、进度追踪。不包含未来规划的扩展功能（如用户账户系统、学习记录持久化等）。

### 1.3 分析方法说明
采用结构化分析方法，以 DFD 为核心建模工具，自顶向下逐层分解：
- **上下文图 (Context Diagram)**：系统与外部实体的数据交互全景
- **第 0 层 DFD (Level 0)**：系统顶层数据流，识别主要处理过程
- **第 1 层 DFD (Level 1)**：对 Level 0 的核心加工进行分解细化
- **数据字典**：定义所有数据流的组成
- **加工说明**：描述每个加工的输入、输出与处理逻辑

---

## 2. 上下文图 (Context Diagram)

```
                            ┌─────────────────────────┐
                            │    Gemini AI Service     │
                            │   (Google Cloud API)     │
                            └──────────┬──────────────┘
                                       │
                    ┌─ 单词/音标JSON ──┼── 音频Base64 ─┐
                    │                  │                │
                    ▼                  │                ▼
┌───────────┐  发音文本      ┌────────┴────────┐   音频数据      ┌───────────┐
│           │ ──────────────→│                 │←────────────── │           │
│   用户     │               │  IPA Spelling   │               │  Web 浏览器 │
│  (学习者)  │←──────────────│     Master      │──────────────→│  (音频输出) │
│           │  视觉反馈      │                 │   IPA输入信号  │           │
└───────────┘  (UI界面)     └─────────────────┘               └───────────┘
```

**外部实体说明**：

| 实体 | 类型 | 描述 |
|------|------|------|
| 用户（学习者） | 人 | 系统的主要交互者，听取发音并输入 IPA 转写 |
| Gemini AI Service | 外部系统 | Google 提供的 AI 服务，包括文本生成（词库）和语音合成（TTS） |
| Web 浏览器 | 外部系统 | 提供音频解码与播放能力的宿主环境（Web Audio API） |

**顶层数据流摘要**：

| 数据流 | 方向 | 内容 |
|--------|------|------|
| 词库请求 | 系统 → Gemini | Prompt 指令：生成 10 个单词及 IPA |
| 单词/音标 JSON | Gemini → 系统 | 结构化 JSON 数组 `[{word, ipa}, ...]` |
| TTS 请求 | 系统 → Gemini | 单词文本 + 语音配置参数 |
| 音频 Base64 | Gemini → 系统 | PCM 音频的 Base64 编码 |
| 发音文本 | 系统 → 用户 | 当前单词的美式发音（音频播放） |
| 用户 IPA 输入 | 用户 → 系统 | 通过键盘或界面键盘输入的 IPA 符号序列 |
| 判定结果与进度 | 系统 → 用户 | 正确/错误反馈、标准答案、得分、进度条 |

---

## 3. 第 0 层 DFD (Level 0) — 系统顶层数据流

```
                                    ┌──────────────────────┐
                   ┌────────────────┤   Gemini AI Service  │
                   │                └──────────────────────┘
                   │                          │
              ┌────┴────┐                     │
              │词库请求  │                     │TTS请求
              │Prompt   │                     │(word)
              ▼         │                     ▼
   ┌──────────────────┐ │     ┌──────────────────────────┐
   │                  │ │     │                          │
   │   1. 词库管理    │ │     │    3. 音频合成服务       │
   │   (Word Gen)    │ │     │    (TTS Service)         │
   │                  │ │     │                          │
   └────────┬─────────┘ │     └────────────┬─────────────┘
            │           │                  │
            │ 单词+IPA  │                  │  Base64音频
            │ JSON      │                  │
            ▼           │                  ▼
   ┌──────────────────────────────────────────────────┐
   │                                                  │
   │              2. 训练会话管理                      │
   │            (Training Session Manager)            │
   │                                                  │
   │  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
   │  │ 进度状态  │  │ 得分统计  │  │  当前题目索引  │  │
   │  │ progress │  │  score   │  │  currentIdx   │  │
   │  └──────────┘  └──────────┘  └───────────────┘  │
   │                                                  │
   └──────┬───────────────┬───────────────┬───────────┘
          │               │               │
          │当前单词+IPA   │用户IPA输入    │判定结果+进度
          │(播放音频)     │               │
          ▼               ▼               ▼
   ┌────────────────────────────────────────────────┐
   │                                                │
   │                4. 用户交互界面                  │
   │               (User Interface)                 │
   │                                                │
   │  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │
   │  │ IPA键盘  │  │ 音频播放  │  │ 反馈显示器   │  │
   │  │ Keypad   │  │ Player   │  │ Feedback     │  │
   │  └──────────┘  └──────────┘  └─────────────┘  │
   │                                                │
   └────────────────────┬───────────────────────────┘
                        │
                        ▼
                   ┌─────────┐
                   │  用户    │
                   └─────────┘
```

**Level 0 加工列表**：

| 编号 | 加工名称 | 功能简述 |
|------|---------|---------|
| P1 | 词库管理 (Word Generation) | 向 Gemini API 请求生成训练词库，解析返回的 JSON |
| P2 | 训练会话管理 (Training Session Manager) | 管理训练流程状态：当前题目、得分、进度、答案判定逻辑 |
| P3 | 音频合成服务 (TTS Service) | 调用 Gemini TTS API 将单词文本转为音频数据 |
| P4 | 用户交互界面 (User Interface) | 渲染 UI、处理用户交互事件、播放音频、展示反馈 |

**Level 0 数据存储**：

| 编号 | 存储名称 | 内容 |
|------|---------|------|
| DS1 | 进度状态 | currentIndex, score, feedback 等会话运行时状态 |
| DS2 | 得分统计 | 累计正确数及准确率 |
| DS3 | 当前题目索引 | 指向词库数组的当前题目指针 |

---

## 4. 第 1 层 DFD (Level 1) — 详细分解

### 4.1 P1 词库管理 (Word Generation) 分解

```
                              ┌──────────────────────┐
                              │   Gemini AI Service   │
                              └──────────┬───────────┘
                                         │
                     词库生成Prompt ─────┤
                      (Gemini Flash)     │
                                         ▼
          ┌──────────────────────────────────────────────┐
          │             P1.1 构建词库请求                  │
          │          (Build Word Request)                 │
          │                                              │
          │  Prompt Template:                            │
          │  "Generate 10 random American English        │
          │   words for IPA spelling practice..."        │
          │  + responseSchema (word, ipa)                │
          └──────────────────┬───────────────────────────┘
                             │
                             │ 结构化请求体
                             ▼
          ┌──────────────────────────────────────────────┐
          │             P1.2 调用 Gemini API             │
          │           (Call Gemini Flash)                │
          │                                              │
          │  Model: gemini-flash-latest                  │
          │  responseMimeType: application/json          │
          └──────────────────┬───────────────────────────┘
                             │
                             │ 原始 JSON 文本
                             ▼
          ┌──────────────────────────────────────────────┐
          │             P1.3 解析与校验                   │
          │          (Parse & Validate)                  │
          │                                              │
          │  · JSON.parse() 解析                         │
          │  · 校验是否为数组                             │
          │  · 校验每项含 word, ipa 字段                  │
          │  · 失败时返回 [] 并记录错误                    │
          └──────────────────┬───────────────────────────┘
                             │
                             │ WordData[] (合法词库数组)
                             ▼
                    去往 P2 训练会话管理
```

### 4.2 P2 训练会话管理 (Training Session Manager) 分解

```
       来自 P1 的               来自 P3 的              来自 P4 的
      WordData[]               音频数据                用户交互事件
          │                       │                       │
          ▼                       │                       ▼
┌─────────────────┐               │          ┌─────────────────────────┐
│  P2.1 初始化会话 │               │          │    P2.4 答案判定          │
│ (Init Session) │               │          │   (Answer Evaluation)    │
│                 │               │          │                         │
│ · setWords()    │               │          │ · 标准化输入(去斜线去空格)│
│ · resetScore()  │               │          │ · 严格字符串比较          │
│ · setIndex(0)   │               │          │ · 正确→score+1          │
└────────┬────────┘               │          │ · 错误→记录正确答案       │
         │                        │          └──────────┬──────────────┘
         ▼                        │                     │
┌─────────────────┐               │                     │ 判定结果
│  P2.2 题目导航   │               │                     │ (correct/
│ (Word Navigator)│               │                     │ incorrect)
│                 │               │                     ▼
│ · currentWord() │               │          ┌─────────────────────────┐
│ · nextWord()    │               │          │    P2.5 进度统计          │
│ · hasNext()     │───────────────┼─────────→│   (Progress Tracker)    │
│ · isQuizEnd()   │  获取当前单词  │          │                         │
└────────┬────────┘               │          │ · currentIndex 更新      │
         │                        │          │ · score 更新             │
         │ 当前单词文本             │          │ · accuracy 计算          │
         ▼                        │          │ · 检测是否完成全部题目    │
┌─────────────────┐               │          └──────────┬──────────────┘
│  P2.3 音频协调   │←──────────────┘                     │
│ (Audio          │                                      │
│  Coordinator)   │  触发 P3 进行 TTS 请求                │
│                 │  接收音频数据并传至 P4                │
└────────┬────────┘                                      │
         │                                               │
         │ 音频数据                                       │ 状态更新
         ▼                                               ▼
       去往 P4 用户交互界面                       去往 P4 用户交互界面
```

### 4.3 P3 音频合成服务 (TTS Service) 分解

```
       来自 P2.3 的
       单词文本
           │
           ▼
┌──────────────────────────────┐
│      P3.1 构建 TTS 请求       │
│    (Build TTS Request)       │
│                              │
│  · Prompt: "Say clearly:     │
│             {word}"          │
│  · Model: gemini-3.1-flash-  │
│           tts-preview        │
│  · Voice: Kore               │
│  · Modality: AUDIO           │
└──────────────┬───────────────┘
               │
               │ 结构化 TTS 请求
               ▼
┌──────────────────────────────┐
│     P3.2 调用 Gemini TTS     │
│    (Call Gemini TTS API)     │
│                              │
│  GoogleGenAI SDK             │
│  models.generateContent()    │
└──────────────┬───────────────┘
               │
               │ 原始响应 (含 inlineData)
               ▼
┌──────────────────────────────┐
│    P3.3 提取音频 Base64      │
│  (Extract Base64 Audio)     │
│                              │
│  · 从 candidates[0]         │
│    .content.parts[0]        │
│    .inlineData.data 提取    │
│  · 失败时返回 500 错误       │
└──────────────┬───────────────┘
               │
               │ Base64 编码音频字符串
               ▼
        去往 P2.3 音频协调
```

### 4.4 P4 用户交互界面 (User Interface) 分解

```
     来自 P2 的        来自 P2 的        来自 P2 的        来自 P2 的状态
     当前单词+IPA      音频数据          判定结果           更新数据
         │                │                │                   │
         ▼                ▼                ▼                   ▼
┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────────────┐
│ P4.1 音频   │  │ P4.2 波形  │  │ P4.3 反馈  │  │  P4.6 进度展示      │
│ 播放控制    │  │ 动画渲染   │  │ 横幅显示    │  │ (Progress Display) │
│(Audio      │  │(Waveform   │  │(Feedback   │  │                    │
│ Playback)  │  │ Animation) │  │ Banner)    │  │ · 进度条(dot)      │
│            │  │            │  │            │  │ · 得分数字          │
│· Web Audio │  │· 音柱跳动画 │  │· 正确:绿色  │  │ · 准确率百分比      │
│  API 解码  │  │· 播放中禁用│  │  +CheckIcon │  │ · 题目序号 n/N      │
│· 24kHz采样 │  │  点击      │  │· 错误:红色  │  │                    │
│· 播放完成  │  │            │  │  +正确IPA   │  └────────────────────┘
│  回调      │  │            │  │· 答案单词   │
└─────┬──────┘  └─────┬──────┘  └─────┬──────┘
      │               │               │
      │  播放状态      │               │
      ▼               ▼               ▼
┌─────────────────────────────────────────────────────────┐
│                    P4.4 IPA 输入处理                     │
│                  (IPA Input Handler)                    │
│                                                        │
│  · 直接键盘输入 (onChange)                               │
│  · IPA 键盘点击插入 (handleCharInsert)                   │
│  · 删除/清空 (handleDelete)                             │
│  · 仅 feedback=neutral 时接受输入                       │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ 用户 IPA 输入
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    P4.5 操作调度                         │
│                 (Action Dispatcher)                     │
│                                                        │
│  · [Check Answer] → 触发 P2.4 答案判定                  │
│  · [Next Challenge] → 触发 P2.2 题目导航                 │
│  · [Play Audio] → 触发 P2.3 音频协调                     │
│  · [Reset Word Set] → 触发 P1 重新获取词库               │
│  · [Hide/Show Keypad] → 切换键盘显示状态                 │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ 用户操作事件
                         ▼
                    ┌─────────┐
                    │  用户    │
                    └─────────┘
```

---

## 5. 数据字典 (Data Dictionary)

### 5.1 数据流条目

| 编号 | 数据流名称 | 组成 | 来源 | 去向 | 流量 |
|------|-----------|------|------|------|------|
| DF01 | 词库生成请求 | `{ model, contents, config: { responseMimeType, responseSchema } }` | P1.1 | Gemini | 1次/会话或重置 |
| DF02 | 词库响应 JSON | `WordData[] = [{ word: string, ipa: string }]` (长度=10) | Gemini | P1.3 | 1次/请求 |
| DF03 | 训练词库 | `WordData[]` (同 DF02，已解析) | P1 | P2 | 1次/请求 |
| DF04 | 当前单词文本 | `string` (如 "express") | P2.2 | P2.3 → P3 | 1次/题 |
| DF05 | TTS 请求 | `{ model, contents: [{ parts: [{ text }] }], config: { responseModalities, speechConfig } }` | P3.1 | Gemini | 1次/题 |
| DF06 | TTS 响应音频 | `{ audio: string }` (Base64 编码 PCM, 24kHz) | Gemini | P3.3 | 1次/题 |
| DF07 | 播放音频 | `AudioBuffer` (解码后的 PCM 数据) | P2.3 | P4.1 | 1次/题 |
| DF08 | 用户 IPA 输入 | `string` (IPA 符号序列，可能含 `/`, 空格) | 用户 | P4.4 → P2.4 | 1次/题 |
| DF09 | 判定结果 | `enum { 'correct', 'incorrect' }` | P2.4 | P4.3, P4.6 | 1次/题 |
| DF10 | 正确答案展示 | `{ ipa: string, word: string }` | P2.4 | P4.3 | 仅错误时 |
| DF11 | 进度数据 | `{ currentIndex: number, score: number, total: number }` | P2.5 | P4.6 | 每次状态变更 |
| DF12 | 用户操作事件 | `enum { playAudio, checkAnswer, nextWord, reset, toggleKeypad, insertChar, deleteChar }` | P4.5 | P2 各子加工 | 用户触发 |

### 5.2 数据存储条目

| 编号 | 存储名称 | 组成 | 存储介质 | 读写加工 |
|------|---------|------|---------|---------|
| DS1 | 训练词库 | `WordData[]` | 前端内存 (useState) | 写: P2.1, 读: P2.2 |
| DS2 | 会话状态 | `{ currentIndex, userInput, feedback, score, isPlaying, showKeypad }` | 前端内存 (useState) | 读写: P2 所有子加工, P4 |
| DS3 | 音频上下文 | `AudioContext` (Web Audio API) | 浏览器运行时 (useRef) | 写: P4.1, 读: P4.1 |

### 5.3 外部实体条目

| 编号 | 实体名称 | 输入数据流 | 输出数据流 |
|------|---------|-----------|-----------|
| E1 | 用户（学习者） | DF08 (IPA 输入), DF12 (操作事件) | DF07 (音频), DF09 (判定), DF10 (正确答案), DF11 (进度) |
| E2 | Gemini AI Service | DF01 (词库请求), DF05 (TTS 请求) | DF02 (词库 JSON), DF06 (音频 Base64) |
| E3 | Web 浏览器 | DF07 (音频 Buffer) | — (提供运行时环境) |

---

## 6. 加工说明 (Process Specification)

### P1.1 构建词库请求
```
输入：无（由 P2.1 或 P4.5 触发）
输出：结构化 API 请求体
处理逻辑：
  1. 构造 Prompt: "Generate 10 random American English words..."
  2. 设置 responseSchema: { type: ARRAY, items: { word: STRING, ipa: STRING } }
  3. 设置 responseMimeType: "application/json"
  4. 传递至 P1.2
```

### P2.4 答案判定
```
输入：userInput (string), currentWord.ipa (string)
输出：判定结果 (correct/incorrect)
处理逻辑：
  1. IF feedback != 'neutral' THEN 直接返回（防止重复判定）
  2. normalizedInput = userInput.trim().replace(/^\/|\/$/g, '')
  3. normalizedTarget = currentWord.ipa.trim().replace(/^\/|\/$/g, '')
  4. IF normalizedInput === normalizedTarget THEN
       feedback = 'correct', score += 1
     ELSE
       feedback = 'incorrect'
  5. 传递结果至 P2.5 和 P4.3
```

### P3.3 提取音频 Base64
```
输入：Gemini TTS API 原始响应
输出：{ audio: string } 或错误
处理逻辑：
  1. 读取 response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data
  2. IF 值存在 THEN 返回 { audio: base64Data }
  3. ELSE 返回 HTTP 500: 'Failed to generate audio'
```

### P4.1 音频播放控制
```
输入：Base64 音频字符串
输出：音频通过扬声器播放
处理逻辑：
  1. IF isPlaying == true THEN 忽略
  2. 设置 isPlaying = true
  3. 创建或复用 AudioContext (sampleRate: 24000)
  4. Base64 → Uint8Array → ArrayBuffer → decodeAudioData()
  5. 创建 BufferSource → connect(destination) → start()
  6. onended 回调: 设置 isPlaying = false
  7. 异常捕获: 记录错误, 设置 isPlaying = false
```

---

## 7. 系统状态转换图

```
                    ┌──────────┐
                    │ 初始加载  │
                    └────┬─────┘
                         │ 词库加载完成
                         ▼
               ┌─────────────────┐
               │  Neutral        │←──────────────────┐
               │  (等待用户操作)   │                    │
               └───┬──────┬──────┘                    │
                   │      │                           │
         点击播放   │      │ 点击 Check Answer         │
         音频       │      │                           │
                   ▼      ▼                           │
          ┌──────────┐  ┌──────────────┐              │
          │ Playing  │  │  判定执行     │              │
          │ (播放中)  │  └──┬──────┬────┘              │
          └──────────┘     │      │                   │
               │      正确 │      │ 错误               │
               │           ▼      ▼                   │
               │    ┌────────┐ ┌──────────┐           │
               └───→│Correct │ │Incorrect │           │
                    │(显示✅)│ │(显示❌+答案)│         │
                    └───┬────┘ └─────┬─────┘          │
                        │            │                │
                        └─────┬──────┘                │
                              │ Next Challenge 或      │
                              │ 自动进入下一题          │
                              ▼                       │
                     ┌─────────────────┐              │
                     │  检查是否最后一题 │─────────────┘
                     └────────┬────────┘   (还有题目→Neutral)
                              │
                              │ 全部完成
                              ▼
                     ┌─────────────────┐
                     │  Quiz Finished  │
                     │  (弹窗+重置)     │
                     └────────┬────────┘
                              │
                              └──→ 回到「初始加载」
```

---

## 8. 关键技术约束与假设

### 8.1 约束条件
1. Gemini API Key 必须通过服务端环境变量注入，前端不可直接访问
2. TTS 音频格式固定为 PCM 24kHz，前端 AudioContext 必须匹配该采样率
3. 词库每次固定生成 10 个单词
4. IPA 判定采用严格字符串匹配（大小写、符号完全一致）

### 8.2 系统假设
1. 用户设备具备稳定的网络连接以访问 Gemini API
2. 用户使用支持 Web Audio API 的现代浏览器
3. Gemini API 服务可用且响应时间在可接受范围内（< 10s）
4. 用户具备基本的 IPA 知识（至少能识别元音和辅音符号）

---

## 9. 数据流汇总表

```
┌──────────┬────────────────────────────────────┬─────────────────────┐
│   层级    │  数据流路径                         │    涉及加工          │
├──────────┼────────────────────────────────────┼─────────────────────┤
│ 上下文层  │ 用户 → 系统 → Gemini → 系统 → 用户  │ 全系统               │
├──────────┼────────────────────────────────────┼─────────────────────┤
│ Level 0  │ 词库请求 → P1 → 词库数据 → P2       │ P1 → P2             │
│          │ 单词 → P3 → 音频 → P2 → P4 → 用户   │ P2 → P3 → P2 → P4   │
│          │ 用户输入 → P4 → P2 → 判定 → P4 → 用户│ P4 → P2 → P4        │
├──────────┼────────────────────────────────────┼─────────────────────┤
│ Level 1  │ P1.1→P1.2→P1.3→词库               │ 词库管理全链路        │
│          │ P2.1→P2.2→P2.3↔P3                  │ 会话初始化+音频协调   │
│          │ P2.4→P2.5→P4.6                     │ 判定+统计+展示        │
│          │ P4.4→P4.5→P2.4                     │ 用户输入→判定         │
└──────────┴────────────────────────────────────┴─────────────────────┘
```
