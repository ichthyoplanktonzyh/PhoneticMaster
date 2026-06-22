---
gsd_state_version: 1.0
milestone: M2
milestone_name: 纯前端独立训练器 MVP
status: planned
last_updated: "2026-06-22T13:58:16+08:00"
progress:
  total_phases: 3
  completed_phases: 0
  in_progress_phases: 0
---

# PhoneticMaster — 项目活记忆

> 最后更新：2026-06-22
> 更新原因：产品阶段重排，明确先做不依赖诊断的纯前端独立训练器

## 当前位置

| 维度 | 值 |
|------|------|
| 里程碑 | M2 — 纯前端独立训练器 MVP |
| 阶段 | Phase 2.1 待开始 |
| 分支 | `main` (ipa-spelling) |
| 版本 | v1.1 planning |

## Phase 状态

### Phase 2.1: Standalone Training Core 🧭

- **目标**：用户无需 L1 诊断、无需账号、无需后端即可开始并完成训练
- **状态**：计划已建立，待实施
- **计划文件**：`.planning/phases/2.1-standalone-training-core/2.1-PLAN.md`

### Phase 2.2: Feedback & Session Results 🧭

- **目标**：补齐 nearMatch/diff 反馈、会话结果页和本地最近训练记录
- **状态**：计划已建立，待 Phase 2.1 后实施
- **计划文件**：`.planning/phases/2.2-feedback-session-results/2.2-PLAN.md`

### Phase 3.1: Targeted Minimal Pairs 🧭

- **目标**：在独立训练器成立后，提供最小对立体专项听辨
- **状态**：计划已建立，等待 M2 完成
- **计划文件**：`.planning/phases/3.1-targeted-minimal-pairs/3.1-PLAN.md`

### Phase 4.1: Local Personalization 🧭

- **目标**：用本地训练历史和 L1-aware 难点生成下一步推荐
- **状态**：计划已建立，等待 M3 专项训练完成
- **计划文件**：`.planning/phases/4.1-local-personalization/4.1-PLAN.md`

## 已完成历史

### Phase 1.1: 类型系统 + Profile 架构 ✅

- **目标**：定义 LanguageProfile、TrainingItem、JudgeResult 等核心类型
- **完成日期**：2026-06-22
- **交付物**：
  - `src/types.ts` — 完整类型定义 + WordData 向后兼容
  - `src/utils/judge.ts` — phonemeJudge + stringJudge
  - `src/profiles/index.ts` — Profile 注册表 + SUPPORTED_L1

### Phase 1.2: 汉语 Profile + 词库 ✅

- **目标**：创建汉语拼音训练所需的全部数据
- **完成日期**：2026-06-22
- **交付物**：
  - `src/profiles/zh.ts` — 21 声母 + 35 韵母 + 5 声调 + 拼音判定
  - `src/utils/pinyinParser.ts` — 声调符号→数字转换 + 音节解析
  - `src/data/zhWordBank.ts` — HSK 1-3 词库（~250 条目）
  - `src/profiles/en.ts` — 英语 Profile（从散落逻辑整合）

### Phase 1.3: L1-Aware 推荐 ✅

- **目标**：基于 PAM/SLM 理论的 L1→L2 难度映射与查询 API
- **完成日期**：2026-06-22
- **交付物**：
  - `src/l1/zh_en.ts` — 中文母语者学英语的 11 个难点音素 + 6 个难点特征
  - `src/l1/en_zh.ts` — 英语母语者学中文的 12 个难点音素 + 4 个难点特征
  - `src/l1/difficultyMap.ts` — 注册表 + 查询 API（getTopHardPhonemes 等）

### Phase 1.4: UI 重构 ✅

- **目标**：将硬编码英语 UI 改为 profile-driven + 新增 Onboarding + SmartRecommend
- **完成日期**：2026-06-22
- **交付物**：
  - `src/components/PhoneticKeypad.tsx` — Profile-driven 键盘
  - `src/components/TrainingView.tsx` — 适配 TrainingItem + LanguageProfile
  - `src/components/SmartRecommend.tsx` — L1-aware 推荐面板
  - `src/components/OnboardingView.tsx` — 首次使用引导
  - `src/App.tsx` — 完整重写（L1/L2 管理 + 双栏布局）
  - `src/utils/voice.ts` — 多语言 TTS
  - `src/utils/phonemeGroups.ts` — Profile-driven 音素分组

### Phase 1.5: 编译验证 + 修复 ✅

- **目标**：零错误编译 + 生产构建通过
- **完成日期**：2026-06-22
- **交付物**：
  - `types.ts` 添加 `definition?: string` 修复 zhWordBank 类型错误
  - `npx tsc --noEmit` 零错误
  - `npm run build` 成功

## 最近重要决策

1. **2026-06-22** — 产品阶段重排：训练器本身必须完整；L1-aware 推荐是智能教练层，不作为开始训练的前置门槛
2. **2026-06-22** — MVP 架构决策：M2-M4 坚持纯前端，本地存储训练状态；后端进入 M6 可选增强
3. **2026-06-22** — 路线重排：M2 独立训练器，M3 专项训练/最小对立体，M4 本地个性化，M5 新语言，M6 云端增强
4. **2026-06-22** — Profile 架构：每个语言声明为 LanguageProfile 对象，UI 不含语言特定逻辑
5. **2026-06-22** — 拼音输入形式：拼写模式接受数字声调 (ni3)，训练模式显示声调符号 (nǐ)
6. **2026-06-22** — L1 数据结构：使用 PhonemeDifficulty (level 1-5) + FeatureDifficulty，不使用连续分数
7. **2026-06-22** — WordData 兼容：保留旧类型 + 转换函数，渐进式迁移
8. **2026-06-22** — IPAKeypad 旧组件：移除 require() 别名，App.tsx 直接使用 PhoneticKeypad

## 当前阻塞项

无。

## 下一步工作

见 `ROADMAP.md` M2 阶段规划，当前优先级：
- Phase 2.1：独立训练入口，允许用户无 L1 诊断开始训练
- Phase 2.2：nearMatch/diff 反馈、会话结果页、本地最近训练记录
- Phase 2.3：公网静态发布准备，统一 README/PRD 对外叙事

## 指标

| 指标 | 当前值 |
|------|--------|
| 支持语言数 | 2 (en, zh) |
| L1×L2 映射数 | 2 (zh→en, en→zh) |
| 英语词库条目 | ~100 (原始 wordBank) |
| 汉语词库条目 | ~250 (HSK 1-3) |
| TypeScript 编译错误 | 0 |
| 构建产物大小 | ~668 KB (gzip ~193 KB) |
