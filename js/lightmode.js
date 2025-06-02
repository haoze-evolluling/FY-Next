/**
 * 白天模式切换功能
 * 白天模式主题颜色为白色和蓝色
 */
(function() {
    // DOM元素
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    
    // 标记切换状态
    let isDarkMode = true; // 默认为暗黑模式
    
    // 监听切换按钮点击事件
    darkModeToggle.addEventListener('click', () => {
        if (isDarkMode) {
            enableLightMode();
        } else {
            enableDarkMode();
        }
        isDarkMode = !isDarkMode;
        
        // 添加一个小动画效果
        darkModeToggle.classList.add('icon-spin');
        setTimeout(() => {
            darkModeToggle.classList.remove('icon-spin');
        }, 500);
    });
    
    // 启用暗黑模式
    function enableDarkMode() {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        darkModeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
        localStorage.setItem('theme', 'dark');
    }
    
    // 启用白天模式
    function enableLightMode() {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        darkModeToggle.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
        localStorage.setItem('theme', 'light');
    }
    
    // 检查本地存储中的主题设置
    function checkThemePreference() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            enableLightMode();
            isDarkMode = false;
        } else {
            enableDarkMode();
            isDarkMode = true;
        }
    }
    
    // 页面加载时检查主题
    checkThemePreference();
})(); 