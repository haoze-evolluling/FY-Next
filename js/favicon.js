/**
 * 网站图标处理模块
 */
const Favicon = (function() {
    // 默认图标路径
    const DEFAULT_ICON = 'internet.png';
    
    /**
     * 从URL中提取域名
     * @param {string} url - 网站URL
     * @returns {string} - 域名
     */
    const extractDomain = (url) => {
        try {
            // 如果URL不包含协议，添加https://
            if (!url.match(/^(https?:\/\/|file:\/\/)/i)) {
                url = 'https://' + url;
            }
            
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch (e) {
            console.error('无法解析URL:', url, e);
            return '';
        }
    };
    
    /**
     * 获取网站图标URL
     * @param {string} url - 网站URL
     * @returns {string} - 图标URL
     */
    const getFaviconUrl = (url) => {
        const domain = extractDomain(url);
        if (!domain) return DEFAULT_ICON;
        
        // 尝试从百度获取图标
        const baiduFaviconUrl = `https://www.baidu.com/favicon.ico?domain=${domain}`;
        
        // 尝试从必应获取图标
        const bingFaviconUrl = `https://www.bing.com/favicon.ico?domain=${domain}`;
        
        // 尝试从网站本身获取图标
        const siteFaviconUrl = `https://${domain}/favicon.ico`;
        
        // 返回一个对象，包含多个可能的图标URL
        return {
            baidu: baiduFaviconUrl,
            bing: bingFaviconUrl,
            site: siteFaviconUrl,
            default: DEFAULT_ICON
        };
    };
    
    /**
     * 创建图标元素
     * @param {string} url - 网站URL
     * @returns {HTMLElement} - 图标元素
     */
    const createFaviconElement = (url) => {
        const iconUrls = getFaviconUrl(url);
        
        const iconImg = document.createElement('img');
        iconImg.className = 'bookmark-icon';
        iconImg.width = 16;
        iconImg.height = 16;
        
        // 首先尝试加载网站自己的图标
        iconImg.src = iconUrls.site;
        
        // 如果加载失败，尝试百度的图标
        iconImg.onerror = () => {
            iconImg.src = iconUrls.baidu;
            
            // 如果百度的也失败，尝试必应的图标
            iconImg.onerror = () => {
                iconImg.src = iconUrls.bing;
                
                // 如果必应的也失败，使用默认图标
                iconImg.onerror = () => {
                    iconImg.src = iconUrls.default;
                };
            };
        };
        
        return iconImg;
    };
    
    // 公开API
    return {
        createFaviconElement
    };
})(); 