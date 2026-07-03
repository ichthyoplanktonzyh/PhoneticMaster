# PhoneticMaster — 测试体系

> 最后更新：2026-07-03

## 1. 测试层次

```
          ┌─────────────────────┐
          │   E2E Tests (M5+)   │   ← Playwright / 手动 QA
          ├─────────────────────┤
          │  Integration Tests  │   ← 组件 + profile 集成
          ├─────────────────────┤
          │    Unit Tests       │   ← Vitest: parser/judge smoke + storage/recommendation ✅ 部分已有
          ├─────────────────────┤
          │ Data Validation     │   ← profile / wordBank / L1 map / minimal pairs ✅ 已有
          ├─────────────────────┤
          │   Type Checking     │   ← tsc --noEmit ✅ 已有
          ├─────────────────────┤
          │    Build Check      │   ← vite build ✅ 已有
          └─────────────────────┘
```

## 2. 当前测试能力

### 2.1 静态检查（已有）

| 检查 | 命令 | 状态 |
|------|------|------|
| TypeScript 类型检查 | `npx tsc --noEmit` | ✅ 零错误 |
| Vitest 单元测试 | `npm run test` | ✅ 覆盖 Phase 4.1 storage / recommendation + judge/parser smoke |
| 生产构建 | `npm run build` | ✅ 通过 |
| 数据一致性校验 | `npm run validate:data` | ✅ 覆盖 profile / 词库 / L1 映射 / minimal pairs |
| Phase 2.3 手动 QA | `.planning/phases/2.3-feedback-session-results/2.3-QA.md` | ✅ 覆盖结果页、diff、本地历史清除冒烟 |
| Phase 3.3 手动 QA | `.planning/phases/3.3-phoneme-detail-panel/3.3-QA.md` | ✅ 覆盖详情入口、降级、专项训练跳转 |

### 2.2 数据校验（已有）

Phase 2.2 新增 `scripts/validateData.ts`，作为本地可重复运行的数据质量入口。

| 检查范围 | 覆盖内容 |
|----------|----------|
| Profile | code 唯一、音素/特征不重复、keypad 引用已声明音素 |
| Word bank | 字段完整、identity 去重、difficulty tier 一致 |
| Notation | `pronunciation` 可解析且 token 全部存在于 profile phonemes |
| Chinese Pinyin | `pronunciation` 为 tone-number form；`pronunciationAlt` 不含数字 |
| L1/L2 maps | code 已注册、level 1-5、hardPhonemes/hardFeatures 引用目标 profile |
| Minimal pairs | l2 已注册、target/contrast 引用目标 profile、候选 pronunciation 可解析、候选覆盖 target/contrast、audioUrl 非空 |

当前限制：该脚本验证结构和引用一致性，不验证每条 IPA/拼音标注的语言学正确性。

### 2.3 单元测试（Vitest 已建立）

当前项目使用 Vitest，测试文件放在 `src/utils/__tests__/`。现有覆盖：

| 优先级 | 模块 | 关键测试点 |
|--------|------|------------|
| P0 | `utils/storage.ts` | ✅ localStorage 读写失败静默降级 / malformed JSON / clear / history limit / mastery load-save-clear |
| P1 | `utils/recommendation.ts` | ✅ 普通拼写 mastery 聚合、nearMatch/incorrect 音素归因、minimal pair 更新、L1/history/fallback 推荐排序、training mode 不写入 mastery |
| P0 | `utils/ipaParser.ts` | ✅ tokenizeIpa 双字符音素 smoke；❌ 变体标准化矩阵待补 |
| P0 | `utils/judge.ts` | ✅ phonemeJudge nearMatch smoke；❌ correct/incorrect/长度差异矩阵待补 |
| P0 | `utils/pinyinParser.ts` | diacriticsToNumbers / parseSyllable / 边界音节 |
| P1 | `l1/difficultyMap.ts` | getTopHardPhonemes 排序 / 无映射降级 |
| P1 | `profiles/en.ts` | englishProfile.judge 端到端 |
| P1 | `profiles/zh.ts` | chineseProfile.judge 端到端 / 声调容错 |
| P2 | `utils/phonemeGroups.ts` | getItemsByPhoneme 筛选 / 缓存行为 |
| P2 | `utils/voice.ts` | scoreVoice 优先级 / lang 筛选 |
| P2 | `utils/minimalPairs.ts` | pair filtering / question generation / result summary |
| P2 | `utils/phonemeDetails.ts` | 无 L1 降级 / L1 难点合并 / examples fallback / minimal pair 聚合 |

### 2.4 组件测试（尚未建立）

| 优先级 | 组件 | 关键测试点 |
|--------|------|------------|
| P1 | `PhoneticKeypad` | 渲染 profile.keypadLayout 所有分区 / 点击回调 |
| P1 | `OnboardingView` | L1/L2 选择 / L1===L2 阻断 / onComplete 回调 |
| P2 | `SmartRecommend` | 无映射降级 / 音素点击 / 空状态 |
| P2 | `PhonemeDetailPanel` | L1 说明展示 / 例词空状态 / minimal pair 入口禁用 / action 回调 |
| P2 | `TrainingView` | TrainingItem 渲染 / IPA vs Pinyin 显示逻辑 |
| P2 | `MinimalPairView` | 候选项选择 / 正误反馈 / 完成结果 |

## 3. 推荐测试框架

| 选项 | 优势 | 劣势 |
|------|------|------|
| Vitest | 与 Vite 原生集成，零配置 | — |
| Jest | 社区最大 | 需要额外配置 ESM + Vite |

**推荐**：Vitest，与现有 Vite 构建管道无缝集成。

## 4. 关键测试命令

```bash
# 类型检查
npx tsc --noEmit

# 生产构建
npm run build

# 数据校验
npm run validate:data

# 单元测试
npm run test

# Phase 2.3 手动 QA
# 见 .planning/phases/2.3-feedback-session-results/2.3-QA.md

# 单元测试 watch 模式
# npx vitest

# 覆盖率（需要另装 Vitest coverage provider 后启用）
# npx vitest run --coverage
```

## 5. 测试缺口

| 优先级 | 缺口 | 风险 | 建议措施 |
|--------|------|------|----------|
| P0 | validateData 无单元测试 | 校验器自身规则回归时只靠真实数据发现 | 添加 fixture-based validator tests |
| P0 | pinyinParser 无 fixture 单元测试 | 拼音解析边界错误（ü, er, 独立韵母） | 添加 tone-number / diacritic / zero-initial fixtures |
| P0 | judge 仅有 smoke 测试 | 长度差异、incorrect diff 和 parser adapter 组合仍可能回归 | 补 phonemeJudge 判定矩阵 |
| P0 | ipaParser 仅有 smoke 测试 | 变体标准化和未知字符跳过逻辑仍可能回归 | 补 tokenizeIpa fixture matrix |
| P1 | 无 profile 集成测试 | judge 端到端错误 | 添加 profile.judge 快照测试 |
| P2 | 无组件测试 | UI 行为回归 | 视需要添加 |
| P2 | 无 E2E 测试 | 用户流程断链 | M5 考虑 Playwright |
