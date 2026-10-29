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

### 动效与三维展示

* 使用 CSS 过渡与轻量动效；Three.js 和 GLTFLoader 加载本地 GLB 模型
* 不依赖远程三维服务；修改交互时保留滚动、触屏、键盘和减少动态效果的支持

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
  /works /collections /news /about  # 内页
  /layout.tsx              # 全局布局
  /globals.css             # 全局样式

/components
  /sections
    Entrance.tsx           # 首屏叙事与滚动进度
    HeroBowl.tsx           # 三维模型与交互
    Form.tsx
    Light.tsx
    Variation.tsx
    Author.tsx
    Entry.tsx
  /site                    # 内页共用组件

/lib
  data.ts                  # 静态内容与图片引用

/public
  /images                  # 照片与模型加载占位图
  /models                  # 本地 GLB 模型
/scripts                   # 模型、纹理和占位图生成及检查脚本
/deploy                    # Docker Compose 部署说明与 Nginx 模板
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

* 可见首屏高度为 100vh；190vh 叙事区内首屏保持 sticky，滚动时模型缓慢旋转一周
* 碗居中，文本靠边（不要居中）；模型加载占位图应与模型首帧对齐，不出现跳动
* 桌面左键拖动旋转、右键上下拖动缩放；滚轮用于页面滚动
* 手机单指上下滚动、横向旋转，双指调整视角和缩放；保留键盘旋转和缩放
* 减少动态效果时停用滚动旋转；WebGL 或模型不可用时回退至第一张照片

#### 模型要求：

* 模型为三张照片的近似重建，外径 200 mm，碗身和碗足壁厚均为 0.4 mm；碗足原高度约 13.6 mm
* 对齐原照片中的山水、树木、印章和书法，照片重叠处不插入另造的场景，也不推断文字
* 内壁保持均匀暖白；避免投影和玻璃般透明材质，薄胎感由柔和受光表现
* `public/models/` 的高分辨率及紧凑 GLB、`public/images/hero-bowl-poster*.webp` 均为发布资源；更换模型、相机或灯光后同步重新生成占位图

#### 内容：

```text
egg-shell porcelain
薄胎瓷
JianDe Works
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

页面动效仅允许以下方式，首屏模型按上述交互规则随滚动旋转：

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
* 三维展示使用紧凑 GLB，确保页面滚动与触屏操作互不阻碍

---

## 9. 开发优先级（Priority）

当前项目包括首页、`Works`、`Collections`、`News`、`About` 内页和静态数据。修改时保持首页叙事与现有内页结构一致。

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

## 11. 本地检查与部署

* 安装依赖并启动：`npm ci`、`npm run dev`；生产构建：`npm run build`
* 修改模型后运行 `npm run build:hero-model` 和 `npm run check:hero-model`；修改模型、相机或灯光后按 README 重新生成加载占位图
* 按改动运行 `npx tsc --noEmit`、`git diff --check` 及必要的浏览器检查
* 部署按 `deploy/DEPLOY.md`；Compose 挂载整个 `public/`，代码、两个 GLB 和三张占位图必须来自同一版本
* `.env`、`.next/`、`node_modules/`、`.DS_Store` 等本机文件不要提交；生成的 GLB 和占位图需要随相关源码提交

---

## 12. 最重要原则（Final Rule）

> 首页不是作品列表，而是“如何观看这些作品”的引导。

任何实现如果违背：

* 器物优先
* 光感表达
* 极简节奏

必须重写。
