/**
 * 黑暗模式切换功能（已修改为仅暗黑模式）
 */
(function() {
    // DOM元素
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    
    // 在页面加载时强制启用暗黑模式
    enableDarkMode();
    
    // 切换按钮仅改变图标
    let isIconToggled = false;
    
    // 切换事件监听器
    darkModeToggle.addEventListener('click', () => {
        if (isIconToggled) {
            darkModeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
        } else {
            darkModeToggle.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
        }
        isIconToggled = !isIconToggled;
        
        // 添加一个小动画效果
        darkModeToggle.classList.add('icon-spin');
        setTimeout(() => {
            darkModeToggle.classList.remove('icon-spin');
        }, 500);
    });
    
    // 启用黑暗模式
    function enableDarkMode() {
        body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
        localStorage.setItem('darkMode', 'true');
    }
    
    // 不再需要禁用暗黑模式的函数，但为了代码结构保留它
    function disableDarkMode() {
        // 这个函数不再被调用
        // 保留作为占位符
    }
    
    // 系统偏好监听（移除响应系统切换的行为）
})(); 