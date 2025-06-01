/**
 * 图标处理模块
 */
const IconHandler = (function() {
    // 加载图标并在失败时尝试备用方案
    const loadIcon = (imgElement, bookmarkUrl) => {
        if (!imgElement) return;
        
        // 获取图标URL
        const iconOptions = Storage.getFaviconUrl(bookmarkUrl);
        
        // 为图标设置错误处理逻辑
        imgElement.onerror = function() {
            // 如果网站自身图标加载失败，直接使用默认图标
            console.log(`Icon failed for ${bookmarkUrl}, using default`);
            this.src = iconOptions.default;
        };
        
        // 直接尝试网站自身图标
        imgElement.src = iconOptions.primary;
    };
    
    // 刷新所有书签的图标
    const refreshAllIcons = () => {
        const bookmarkIcons = document.querySelectorAll('.bookmark-icon');
        bookmarkIcons.forEach(icon => {
            const bookmarkUrl = icon.closest('.bookmark-item').dataset.url;
            if (bookmarkUrl) {
                loadIcon(icon, bookmarkUrl);
            }
        });
    };
    
    // 公开API
    return {
        loadIcon,
        refreshAllIcons
    };
})(); 