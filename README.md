# FY-Next 导航

## 简介

FY-Next 导航是一个现代化的网页导航工具，旨在为用户提供便捷的网站访问和管理体验。它具有动态生成的分类和书签功能，支持多种搜索引擎，并提供主题模式切换和屏幕保护等功能。

## 功能特性

- **动态书签管理**：用户可以添加、编辑和删除分类和书签，个性化定制导航页面。
- **多搜索引擎支持**：支持百度、Google、必应和神马等多种搜索引擎，方便用户快速搜索。
- **主题模式切换**：提供明亮和暗黑两种主题模式，适应不同的使用环境。
- **屏幕保护功能**：内置屏幕保护程序，增强用户体验。
- **点击动画效果**：为用户交互添加视觉反馈，提升操作体验。

## 技术栈

- **HTML**：用于页面结构搭建。
- **CSS**：包括 `style.css`、`darkmode.css`、`lightmode.css`、`screensaver.css` 和 `click-animation.css`，用于样式和动画效果。
- **JavaScript**：包括 `storage.js`、`ui.js`、`lightmode.js`、`darkmode.js`、`screensaver.js`、`ripple-effect.js`、`app.js` 和 `search.js`，用于功能实现和交互逻辑。
- **外部资源**：使用Bootstrap Icons和Google Fonts来增强UI设计。

## 文件结构

```
FY-Next/
│
├── css/                    # 样式文件目录
│   ├── style.css           # 主样式文件
│   ├── darkmode.css        # 暗黑模式样式
│   ├── lightmode.css       # 明亮模式样式
│   ├── screensaver.css     # 屏幕保护样式
│   └── click-animation.css # 点击动画样式
│
├── js/                     # 脚本文件目录
│   ├── storage.js          # 存储管理
│   ├── ui.js               # 用户界面逻辑
│   ├── lightmode.js        # 明亮模式逻辑
│   ├── darkmode.js         # 暗黑模式逻辑
│   ├── screensaver.js      # 屏幕保护逻辑
│   ├── ripple-effect.js    # 波纹效果
│   ├── app.js              # 主应用逻辑
│   └── search.js           # 搜索功能
│
├── images/                 # 图片资源目录
│
├── pic/                    # 图标资源目录
│   ├── baidu.png           # 百度图标
│   ├── sky01.png           # 背景图片
│   ├── internet.png        # 网络图标
│   └── icon.png            # 网站图标
│
└── index.html              # 主页面文件
```

## 使用方法

1. 打开 `index.html` 文件即可在浏览器中查看和使用FY-Next导航。
2. 使用顶部的搜索栏选择搜索引擎并输入关键词进行搜索。
3. 点击右上角的主题切换按钮可以在明亮和暗黑模式之间切换。
4. 通过设置按钮添加新的分类和书签，管理您的导航内容。

## 贡献

欢迎对FY-Next导航项目提出建议或贡献代码。请通过GitHub提交issue或pull request。

## 许可证

本项目遵循MIT许可证。详情请见LICENSE文件。
