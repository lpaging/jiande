# AGENTS.md

## 1. 项目定位（Project Definition）

本项目为一位陶瓷艺术家的个人网站，核心展示对象为：

* 薄胎瓷（thin-body porcelain）
* 以碗为主（bowl-focused forms）
* 器形与材料为核心表达（form-driven）
* 表面绘画为可变层（collaborative surface）

### 核心原则（必须遵守）

1. 器物本体优先（Form > Surface）
2. 薄胎与光为视觉核心（Light reveals thickness）
3. 页面节奏缓慢（Slow visual rhythm）
4. 极简设计（Minimalism）
5. 作者不作为视觉中心（Artist is not hero）

---

## 2. 技术栈（Tech Stack）

### 前端框架

* Next.js 14（App Router）
* React 18+

### 样式系统

* Tailwind CSS
* 使用 utility-first，不使用额外 UI 框架（如 antd）

### 动效

* Framer Motion（仅用于轻量动效）

### 图片处理

* Next/Image（必须使用）
* 优先支持高分辨率 + 懒加载

### 语言

* 中文 + 英文混合（默认中文，英文为补充）

---

## 3. 项目结构（Project Structure）

```bash
/app
  /page.tsx                # 首页
  /layout.tsx              # 全局布局
  /globals.css             # 全局样式

/components
  /sections
    Entrance.tsx
    Form.tsx
    Light.tsx
    Variation.tsx
    Author.tsx
    Entry.tsx

/lib
  data.ts                  # 临时数据（后期接CMS）

/public
  /images
```

---

## 4. 首页结构（Homepage Structure）

首页为**单页叙事结构（scroll narrative）**：

```text
[Entrance]
[Form]
[Light]      ← 核心段
[Variation]
[Author]
[Entry]
```

---

## 5. 视觉系统（Design System）

### 色彩（必须使用）

```css
--bg-main: #f2f2f0;
--bg-soft: #e9e7e3;

--text-main: #222;
--text-subtle: #777;
```

❗禁止使用高饱和色作为UI主色

---

### 字体

* 英文：serif（如 system serif）
* 中文：系统默认（简洁）

---

### 间距

```css
section padding: 120px 0
max-width: 1100px
```

---

## 6. 各模块实现规则（CRITICAL）

---

### 6.1 Entrance（首屏）

**目标：建立气质，不解释内容**

#### 实现要求：

* 高度：100vh
* 图片居中
* 文本靠边（不要居中）

#### 内容：

```text
Artist Name
Ceramic Works
```

#### 禁止：

* 不允许按钮
* 不允许复杂动画
* 不允许多图轮播

---

### 6.2 Form（器形）

**目标：强调“这是器物”**

#### 布局：

* 2列 grid
* 左右为器形图

#### 文本：

```text
Form defines the work.
器形构成作品的核心
```

---

### 6.3 Light（核心段，必须重点实现）

**目标：体现薄胎瓷的“光学特性”**

#### 布局：

* 1张大图（透光）
* 2张小图（口沿 + 细节）

#### 文本：

```text
The work exists between form and light.
```

#### 技术要求：

* 使用 next/image
* 图片必须高清
* 支持 brightness 过渡（轻微）

---

### 6.4 Variation（表面变化）

**目标：说明“表面不是核心”**

#### 布局：

* 3列 grid
* 不分类、不标注

#### 文本：

```text
Surface varies. Form remains.
```

#### 禁止：

* 不允许分类标签（如 青花/粉彩）
* 不允许标题

---

### 6.5 Author（作者）

**目标：说明方法，而不是展示人物**

#### 布局：

* 左图右文

#### 图片要求：

优先：

* 手部
* 工作状态

不推荐：

* 正面肖像

#### 文本：

```text
XXX is a ceramic artist working with egg-shell porcelain.

His practice focuses on form, material, and precision.

Surface decoration is often developed in collaboration.
```

---

### 6.6 Entry（进入作品）

#### 内容：

```text
View Works →
```

#### 行为：

* hover：轻微右移

---

## 7. 动效规则（Animation Rules）

仅允许以下：

1. fade-in（opacity）
2. translateY（轻微）
3. scale（hover）

禁止：

* parallax
* 复杂时间轴动画
* 夸张动效

---

## 8. 响应式（Responsive）

### 移动端规则：

* 所有 grid → 单列
* 图片优先
* 文字后置

---

## 9. 开发优先级（Priority）

当前阶段只实现：

* 首页（page.tsx）
* 所有 section 组件
* 静态数据

❗暂不实现：

* CMS
* 后台
* 多语言切换逻辑（先写死）

---

## 10. 代码风格要求

* 使用函数组件
* 使用 TypeScript
* 禁止 any
* 组件拆分清晰（每个 section 独立）

---

## 11. 最重要原则（Final Rule）

> 首页不是作品列表，而是“如何观看这些作品”的引导。

任何实现如果违背：

* 器物优先
* 光感表达
* 极简节奏

必须重写。
