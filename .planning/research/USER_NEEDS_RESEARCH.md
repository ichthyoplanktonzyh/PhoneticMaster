# PhoneticMaster 用户需求调研

> 最后更新：2026-07-02
> 状态：调研启动稿
> 目的：暂停单纯推进 M3 phase，先验证真实用户是否需要、如何理解、愿意怎样使用 PhoneticMaster。

## 1. 当前结论

现有产品已经能完成“打开网页 → 选择目标语言 → 听音/拼写/最小对立体 → 查看结果”的训练闭环。现在最值得验证的不是继续补 Phase 3.3 音素详情，而是下面几个产品问题：

1. 用户是否把 PhoneticMaster 理解为“语音感知训练器”，而不是词典、口语陪练或背单词工具。
2. 用户是否愿意通过 IPA / Pinyin 输入来训练，还是更偏好 A/B 听辨、跟读、录音反馈。
3. Web Speech API 的音质是否足以支撑最小对立体训练的信任感。
4. L1-aware 推荐是否真的帮用户决定“下一步练什么”，还是只是一层看起来专业的说明。
5. 中文结构化输入的“声母 → 韵母 → 声调”是否符合真实学习和输入习惯。

建议把下一轮工作定义为 Research R1，而不是 Phase 3.3：

- R1.1：5-8 人可用性测试，验证首次使用和核心训练闭环。
- R1.2：6-10 人半结构访谈，验证痛点、动机和替代方案。
- R1.3：概念测试，比较“音素详情面板”“标准音频”“录音反馈”“本地个性化推荐”的优先级。

## 2. 已有产品假设

| 假设 | 来源 | 当前置信度 | 需要验证什么 |
|---|---|---:|---|
| 学习者需要先听准，再说准 | `PROJECT.md` 产品愿景、PAM/SLM 框架 | 中 | 用户是否认可“只练感知”也有价值 |
| L1 会影响 L2 难点 | `PROJECT.md`、`REQUIREMENTS.md` L1 映射 | 中 | 用户是否愿意提供 L1，是否理解推荐原因 |
| 最小对立体能提升专项听辨 | M3 Phase 3.1 | 中 | 用户是否能把 A/B 练习和自己的实际发音问题联系起来 |
| IPA/Pinyin 可作为训练输入 | M0/M1 核心功能 | 低到中 | 非语言学用户是否知道该输入什么 |
| 中文三步输入适合教学辅助 | Phase 3.2 QA | 低 | 真实学习者是否觉得它比直接输入更清楚 |

## 3. 公开资料信号

本节是 desk research，不等于真实用户访谈证据。

| 信号 | 公开资料 | 对 PhoneticMaster 的启发 |
|---|---|---|
| 竞品强调“即时、具体、声音级反馈” | ELSA 介绍其 pronunciation feedback 会分析 sounds, stress, intonation；BoldVoice 强调 sound-level mistakes 和 targeted drills；TonePerfect 强调 tones / initials / finals 的 breakdown。 | 用户期待的不只是对错，而是“错在哪里、怎么修”。Phase 3.3 如果只讲理论，价值可能不足。 |
| 人类/专家反馈仍被认为有价值 | Speechling 将 certified pronunciation coaches 作为核心，用户讨论中也提到 human feedback 更严格。 | 纯前端工具要承认边界：可以先做好感知和定位，不要假装替代真人纠音。 |
| 用户会质疑模糊反馈和算法可信度 | Reddit 上有 ELSA 用户抱怨高亮后仍不知道具体错在哪里，也怀疑算法容易被“骗”。 | 反馈解释必须可操作，且不要过度承诺自动评分准确性。 |
| 中文发音训练重视 tone pairs 和上下文 | Yoyo Chinese Tone Pairs 强调两字组合里的声调才接近真实语流；Ka Chinese Tones 强调 tones、similar syllables、quick drills；Pinyin Trainer 强调大量原声音频和多种问答方式。 | 中文训练不应只停留在单音节或输入键盘，应测试 tone pair / 双音节练习是否更有吸引力。 |
| IPA 是地图，不一定是训练本身 | LingQ 论坛用户认为 IPA 有助于知道词由哪些音构成，但学会音素还需要听辨、发音机制和模仿。 | IPA 输入适合一部分高级或教师用户；普通用户可能更需要可听、可选、可复盘的专项练习。 |

参考链接：

- ELSA pronunciation feedback FAQ: https://elsaspeak.com/en/faqs/how-does-elsas-pronunciation-feedback-work
- BoldVoice homepage: https://boldvoice.com/
- Speechling homepage: https://speechling.com/
- Yoyo Chinese Tone Pairs: https://yoyochinese.com/chinese-learning-tools/tone-pairs
- TonePerfect homepage: https://toneperfect.app/
- Ka Chinese Tones: https://chinesetones.app/
- Chinese Pinyin Trainer App Store: https://apps.apple.com/us/app/chinese-pinyin-trainer/id376797304
- Reddit ELSA feedback thread: https://www.reddit.com/r/EnglishLearning/comments/1bae9uy/ive_been_using_elsa_speak_for_a_few_days_now_but/
- Reddit Speechling usage thread: https://www.reddit.com/r/languagelearning/comments/o36z7f/speechling_users_how_are_you_using_it/
- LingQ IPA discussion: https://forum.lingq.com/t/does-somebody-uses-the-ipa-for-training-a-better-pronunciation/22505

## 4. 优先用户分群

| 分群 | 典型场景 | 可能痛点 | 需要验证的拉力 |
|---|---|---|---|
| 中文母语英语学习者 | 面试、课堂、考试、会议前练发音 | 听不出 /ɪ/ vs /i/、/v/ vs /w/，不知道错在哪 | 是否愿意用 IPA 或 minimal pairs 练专项听辨 |
| 英语母语中文学习者 | 初中级中文学习，练声调和拼音 | 声调组合、zh/ch/sh vs j/q/x、ü 等难点 | 是否更需要 tone pairs、原声音频、录音回放 |
| 语言教师 / tutor | 给学生布置专项练习 | 缺少快速生成、可复盘、可解释的材料 | 是否需要分享链接、练习集、结果导出 |
| 语音/语言学爱好者 | 自学 IPA 或比较音系 | 想要结构化数据和可控练习 | 是否愿意容忍更专业的符号和术语 |

R1 应优先招募前两类真实学习者。教师是重要但稍后的分群，因为教师需求容易把产品推向课程/管理系统。

## 5. 核心调研问题

### 5.1 价值理解

1. 用户第一次打开后，会认为这个产品是做什么的？
2. “语音感知训练”这个定位是否能被理解，还是需要换成更直接的话术？
3. 用户是否相信“先听辨，再发音”这条路径？

### 5.2 训练方式

1. 听音拼写、看词听音、最小对立体三种模式，哪一种最自然？
2. 用户是否知道 IPA / Pinyin 输入框里应该输入什么？
3. 用户是否愿意使用屏幕键盘，还是更愿意直接选择答案？
4. 中文用户是否需要自动空格、智能音节分隔、tone pair 训练？

### 5.3 反馈和信任

1. 用户看到 correct / nearMatch / incorrect 后，下一步知道该怎么改吗？
2. 音素 diff 是否足够清楚？
3. 用户是否需要“口型/舌位/中文近似音/常见错误”的说明？
4. 用户是否信任浏览器 TTS 来做最小对立体训练？

### 5.4 个性化和留存

1. 用户愿不愿意选择 L1？如果愿意，是为了什么？
2. 推荐面板是否真的帮助选择训练主题？
3. 最近记录、掌握度、下一轮建议，哪个最能让用户回来？
4. 用户是否需要账号、跨设备同步、每日提醒，还是纯前端轻量入口更重要？

## 6. 可用性测试任务

每位用户 20-30 分钟，边操作边说出想法。

1. 不解释产品，让用户打开首页，说出它看起来能做什么。
2. 选择自己的目标语言，完成一轮 5 题听音拼写。
3. 切换到最小对立体，完成一轮 A/B 听辨。
4. 查看结果页，说出自己下一步会练什么。
5. 中文学习者额外测试结构化拼音输入：输入 `ni3 hao3` 或一个随机中文词。
6. 英语学习者额外测试 IPA 输入：听一个词后尝试输入或使用键盘。
7. 让用户在“标准音频、录音反馈、音素详情、本地推荐、更多词库”里排序。

记录指标：

- 首次进入到开始训练的时间。
- 是否能独立完成第一轮。
- 卡住点和误解点。
- 对 TTS / 输入 / 反馈的信任评分，1-5 分。
- 用户主动说出的替代产品或当前解决方案。

## 7. 访谈提纲

1. 你最近一次刻意练发音是什么时候？为什么练？
2. 你现在怎么判断自己某个音有没有听准或说准？
3. 哪些音最困扰你？你怎么发现它们困扰你？
4. 你用过哪些发音、口语、听力或词典工具？留下来的原因是什么？
5. 你觉得“听辨训练”和“跟读/录音评分”哪个更有用？为什么？
6. 如果一个工具告诉你“你把 /ɪ/ 听成了 /i/”，这对你有帮助吗？
7. 如果它不能听你说话，只能训练你听和拼，你还会用吗？什么情况下会用？
8. 你愿意输入 IPA / Pinyin 吗？如果不愿意，什么形式更自然？
9. 你是否愿意告诉工具你的母语？你期望它因此做什么？
10. 什么反馈会让你觉得“我知道该怎么练了”？
11. 你能接受合成语音做练习吗？什么时候必须是真人录音？
12. 你会为了哪些功能付费、注册或安装 App？

## 8. 决策门

| 观察结果 | 产品决策 |
|---|---|
| 多数用户无法解释 IPA/Pinyin 输入方式 | 降低拼写模式优先级，把 A/B 听辨作为默认入门路径 |
| 多数用户质疑 TTS 音质 | Phase 3.3 暂缓，优先验证标准音频或高质量 TTS |
| 用户强烈要求“告诉我怎么改” | Phase 3.3 改为可操作的 mistake coaching，不只展示 PAM/SLM 原因 |
| 用户认可 L1 推荐但不会主动点 | 把推荐放到训练结束后的 next step，而不是入口前置 |
| 中文学习者更喜欢 tone pairs | 中文专项训练从单个声母/韵母扩展到 tone pair / 双音节主题 |
| 教师持续表达分享/布置需求 | 后续新增 teacher-facing 练习链接，但不进入账号系统 |

## 9. 对路线图的影响建议

短期不建议继续按原计划直接实现 Phase 3.3。可以保留 3.3 的能力方向，但把它改成调研刺激物：

1. 做 1-2 个静态或低保真“音素详情/错因解释”样例，用于访谈测试。
2. 优先收集用户对 TTS、输入方式、反馈解释的反应。
3. 等 R1 结束后再决定：
   - 继续 Phase 3.3 音素详情；
   - 改做标准音频/更高质量听辨；
   - 改做录音回放或生产侧反馈；
   - 改做 M4 训练结束后的 next-step 推荐。

## 10. 下一步执行清单

- [ ] 招募 5-8 位目标用户：中文母语英语学习者 3-4 位，英语母语中文学习者 2-3 位，教师/高阶学习者 1 位。
- [ ] 准备 20 分钟可用性测试脚本和记录表。
- [ ] 准备 2 个概念样例：音素详情解释、标准音频/录音反馈对比。
- [ ] 整理调研发现到 `.planning/research/R1-FINDINGS.md`。
- [ ] 根据发现更新 `PROJECT.md`、`REQUIREMENTS.md` 或 `ROADMAP.md`，不要在证据不足时新增 phase。
