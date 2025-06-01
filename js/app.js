/**
 * 云际导航主应用程序
 */
(function() {
    // 当DOM加载完成后初始化应用
    document.addEventListener('DOMContentLoaded', () => {
        // 初始化UI
        UI.initialize();

        // 初始化屏保
        Screensaver.initialize();

        // 设置键盘快捷键
        setupKeyboardShortcuts();
        
        // 设置拖放功能（如果需要后期实现）
        // setupDragAndDrop();
        
        // 自动聚焦到搜索框
        setTimeout(() => {
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.focus();
                // 可选：选中搜索框中的所有文本（如果有的话）
                searchInput.select();
            }
        }, 100); // 短暂延迟确保页面已完全加载
    });
    
    // 设置键盘快捷键
    const setupKeyboardShortcuts = () => {
        document.addEventListener('keydown', (e) => {
            // Alt + S: 使用设置按钮添加新分类
            if (e.altKey && e.key === 's') {
                document.getElementById('settings-btn').click();
            }
            
            // Esc: 关闭当前打开的模态框
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(modal => {
                    modal.classList.remove('active');
                });
            }
            
            // Alt + /: 聚焦到搜索框
            if (e.altKey && e.key === '/') {
                document.getElementById('search-input').focus();
            }
            
            // Alt + D: 切换深色模式
            if (e.altKey && e.key === 'd') {
                document.getElementById('dark-mode-toggle').click();
            }
        });
    };
})(); 