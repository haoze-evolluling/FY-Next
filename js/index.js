/**
 * 云际导航 JS 文件加载索引
 * 确保脚本按正确的依赖顺序加载
 */

// 1. 首先加载基础工具模块
// 存储模块 - 其他模块的基础
document.write('<script src="js/storage.js"></script>');

// 2. 加载UI相关核心模块
// 主题管理器 - 控制深色/浅色模式
document.write('<script src="js/themeManager.js"></script>');
// 动画效果 - 提供界面动画
document.write('<script src="js/animations.js"></script>');
// 搜索功能
document.write('<script src="js/search.js"></script>');
// UI核心功能
document.write('<script src="js/ui.js"></script>');
// 波纹效果
document.write('<script src="js/ripple-effect.js"></script>');

// 3. 加载扩展功能模块
// 个性化设置
document.write('<script src="js/preferences.js"></script>');
// 屏保时钟
document.write('<script src="js/screensaver.js"></script>');

// 4. 最后加载应用程序入口
document.write('<script src="js/app.js"></script>');

/**
 * 注意：原有的单独文件仍然存在，但已被功能迁移至合并模块
 * - lightmode.js 和 darkmode.js 已合并到 themeManager.js
 */ 