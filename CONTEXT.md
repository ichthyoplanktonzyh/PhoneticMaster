# PhoneticMaster Domain Language

PhoneticMaster 是一个以自由训练为独立核心、同时提供可选课程组织和智能教练的多语言语音感知训练平台。

## Training

**Training Core**:
可脱离课程和教练独立运行的训练能力，负责创建训练会话、接受作答、判定并产生结果。
_Avoid_: Course runtime, lesson engine

**Training Activity**:
一次可启动的训练形式，例如听音拼写、最小对立体或看词听音；既可自由启动，也可被课程或教练引用。
_Avoid_: Lesson, course exercise copy

**Training Evidence**:
由训练结果产生、可用于掌握度或课程达标判断的学习证据。
_Avoid_: Course score, completion flag

## Curriculum

**Curriculum**:
围绕学习目标组织课程、内容、活动与评价标准的教学结构；它不限制自由训练，也不拥有训练逻辑。
_Avoid_: Mandatory journey, feature gate

**Course**:
面向特定目标语言和学习结果的一组有组织的模块。
_Avoid_: Training mode, content library

**Module**:
课程中围绕一个阶段性主题组织的一组课时。
_Avoid_: Topic filter, difficulty tier

**Lesson**:
围绕一组可观察学习目标组织的最小教学单元，可引用多个学习内容和训练活动。
_Avoid_: Phoneme detail, training session

**Learning Objective**:
学习者完成课程、模块或课时后应表现出的可观察能力。
_Avoid_: Feature description, content title

**Learning Content**:
为达成学习目标而提供的解释、示范、例词、对比材料及其他学习材料。
_Avoid_: Training result, UI copy

**Assessment Criterion**:
根据训练证据判断某个学习目标是否达到的明确标准。
_Avoid_: Hard prerequisite, access rule

**Learning Path**:
课程内容在用户界面中的可选引导顺序；学习者可以跳过、回看或直接进入任意可用训练。
_Avoid_: Mandatory progression, locked path

**Course Progress**:
学习者选择使用课程后形成的本地进度视图，来源于内容浏览和训练证据，但不控制训练权限。
_Avoid_: Feature entitlement, global mastery

## Supporting Concepts

**Phoneme Detail**:
单个声音单位的查询和解释视图，可被课时引用，但本身不是课程或课时。
_Avoid_: Lesson

**Coaching**:
基于 L1 难点和历史表现提供下一步建议的可选能力，可推荐课程内容或直接训练。
_Avoid_: Curriculum, prerequisite system

