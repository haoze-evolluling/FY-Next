/**
 * 黑暗模式切换功能
 */
(function() {
    // DOM元素
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    
    // 检查本地存储中的偏好设置
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // 初始化
    if (isDarkMode) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
    
    // 切换事件监听器
    darkModeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });
    
    // 启用黑暗模式
    function enableDarkMode() {
        body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
        localStorage.setItem('darkMode', 'true');
    }
    
    // 禁用黑暗模式
    function disableDarkMode() {
        body.classList.remove('dark-mode');
        darkModeToggle.innerHTML = '<i class="bi bi-moon-fill"></i>';
        localStorage.setItem('darkMode', 'false');
    }
    
    // 监听系统偏好变化
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    prefersDarkScheme.addEventListener('change', (e) => {
        if (e.matches) {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    });
})(); 