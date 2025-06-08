/**
 * 云际导航主应用程序
 */
(function() {
    // 当DOM加载完成后初始化应用
    document.addEventListener('DOMContentLoaded', () => {
        // 初始化UI
        UI.initialize();

        // 初始化屏保
        if (typeof Screensaver !== 'undefined') {
            try {
                Screensaver.initialize();
            } catch (error) {
                console.error('初始化屏保失败:', error);
            }
        }
        
        // 初始化个性化设置
        if (typeof Preferences !== 'undefined') {
            try {
                Preferences.initialize();
                console.log('个性化设置初始化成功');
            } catch (error) {
                console.error('初始化个性化设置失败:', error);
            }
        } else {
            console.error('找不到Preferences模块');
        }

        // 设置键盘快捷键
        setupKeyboardShortcuts();
        
        // 初始化图标处理
        setTimeout(() => {
            if (typeof IconHandler !== 'undefined') {
                IconHandler.refreshAllIcons();
            }
        }, 300); // 延迟一点时间确保书签已加载
        
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
            
            // Alt + P: 打开个性化设置
            if (e.altKey && e.key === 'p') {
                const preferencesBtn = document.getElementById('preferences-btn');
                if (preferencesBtn) {
                    preferencesBtn.click();
                }
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