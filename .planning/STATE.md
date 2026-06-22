---
gsd_state_version: 1.0
milestone: M1
milestone_name: 多语言架构 + 汉语 + L1 推荐
status: completed
last_updated: "2026-06-22T12:00:00.000Z"
progress:
  total_phases: 5
  completed_phases: 5
  in_progress_phases: 0
---

# PhoneticMaster — 项目活记忆

> 最后更新：2026-06-22
> 更新原因：M1 全部完成，建立文档体系

## 当前位置

| 维度 | 值 |
|------|------|
| 里程碑 | M1 — 多语言架构 + 汉语 + L1 推荐 |
| 阶段 | Phase 1 全部完成 |
| 分支 | `main` (ipa-spelling) |
| 版本 | v1.0 |

## Phase 状态

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

1. **2026-06-22** — Profile 架构：每个语言声明为 LanguageProfile 对象，UI 不含语言特定逻辑
2. **2026-06-22** — 拼音输入形式：拼写模式接受数字声调 (ni3)，训练模式显示声调符号 (nǐ)
3. **2026-06-22** — L1 数据结构：使用 PhonemeDifficulty (level 1-5) + FeatureDifficulty，不使用连续分数
4. **2026-06-22** — WordData 兼容：保留旧类型 + 转换函数，渐进式迁移
5. **2026-06-22** — IPAKeypad 旧组件：移除 require() 别名，App.tsx 直接使用 PhoneticKeypad

## 当前阻塞项

无。

## 下一步工作

见 `ROADMAP.md` M2 阶段规划，主要方向：
- 训练模式增强（nearMatch 反馈、最小对立体练习）
- 词库扩充（汉语 HSK 4+、英语进阶词汇）
- 训练历史追踪（localStorage）
- 移动端响应式适配

## 指标

| 指标 | 当前值 |
|------|--------|
| 支持语言数 | 2 (en, zh) |
| L1×L2 映射数 | 2 (zh→en, en→zh) |
| 英语词库条目 | ~100 (原始 wordBank) |
| 汉语词库条目 | ~250 (HSK 1-3) |
| TypeScript 编译错误 | 0 |
| 构建产物大小 | ~668 KB (gzip ~193 KB) |
