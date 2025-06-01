/**
 * 数据存储模块
 */
const Storage = (function() {
    // 存储键名
    const BOOKMARKS_KEY = 'yunji_bookmarks';
    const CATEGORIES_KEY = 'yunji_categories';
    
    // 初始化默认分类和书签
    const initializeDefaults = () => {
        // 默认分类
        const defaultCategories = [
            { id: '1', name: '资讯社交' },
            { id: '2', name: '网课教育' },
            { id: '3', name: '视频娱乐' },
            { id: '4', name: '工具助手' },
        ];
        
        // 默认书签
        const defaultBookmarks = [
            
            // 资讯社交
            { id: '6', name: '微信读书', url: 'https://weread.qq.com/', icon: 'https://weread.qq.com/favicon.ico', categoryId: '1' },
            { id: '7', name: 'QQ邮箱', url: 'https://mail.qq.com/', icon: 'https://mail.qq.com/favicon.ico', categoryId: '1' },
            { id: '8', name: '知乎', url: 'https://www.zhihu.com', icon: 'https://www.zhihu.com/favicon.ico', categoryId: '1' },
            { id: '21', name: '新浪微博', url: 'https://weibo.com', icon: 'https://weibo.com/favicon.ico', categoryId: '1' },
            { id: '22', name: '百度贴吧', url: 'https://tieba.baidu.com/', icon: 'https://tieba.baidu.com/favicon.ico', categoryId: '1' },
            
            // 网课教育
            { id: '28', name: '中国大学MOOC', url: 'https://www.icourse163.org', icon: 'https://www.icourse163.org/favicon.ico', categoryId: '2' },
            { id: '29', name: '学堂在线', url: 'https://www.xuetangx.com', icon: 'https://www.xuetangx.com/favicon.ico', categoryId: '2' },
            { id: '30', name: '智慧树', url: 'https://www.zhihuishu.com', icon: 'https://www.zhihuishu.com/favicon.ico', categoryId: '2' },
            { id: '31', name: '超星学习通', url: 'https://www.chaoxing.com', icon: 'https://www.chaoxing.com/favicon.ico', categoryId: '2' },
            { id: '32', name: '网易云课堂', url: 'https://study.163.com', icon: 'https://study.163.com/favicon.ico', categoryId: '2' },
            // 视频娱乐
            { id: '28', name: '哔哩哔哩', url: 'https://www.bilibili.com', icon: 'https://www.bilibili.com/favicon.ico', categoryId: '3' },
            { id: '29', name: '起点中文网', url: 'https://www.qidian.com', icon: 'https://www.qidian.com/favicon.ico', categoryId: '3' },
            { id: '30', name: '腾讯视频', url: 'https://v.qq.com', icon: 'https://v.qq.com/favicon.ico', categoryId: '3' },
            { id: '31', name: '优酷', url: 'https://www.youku.com', icon: 'https://www.youku.com/favicon.ico', categoryId: '3' },
            { id: '32', name: '抖音', url: 'https://www.douyin.com', icon: 'https://www.douyin.com/favicon.ico', categoryId: '3' },
            
            // 工具助手
            { id: '33', name: '百度', url: 'https://www.baidu.com', icon: 'https://www.baidu.com/favicon.ico', categoryId: '4' },
            { id: '34', name: '高德地图', url: 'https://www.amap.com', icon: 'https://www.amap.com/favicon.ico', categoryId: '4' },
            { id: '35', name: 'WPS', url: 'https://www.wps.cn', icon: 'https://www.wps.cn/favicon.ico', categoryId: '4' },
            { id: '36', name: '豆包', url: 'https://www.doubao.com', icon: 'https://www.doubao.com/favicon.ico', categoryId: '4' },
            { id: '37', name: '12306', url: 'https://www.12306.cn', icon: 'https://www.12306.cn/favicon.ico', categoryId: '4' },
        ];
        
        // 存入本地存储
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories));
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(defaultBookmarks));
        
        return {
            categories: defaultCategories,
            bookmarks: defaultBookmarks
        };
    };
    
    // 获取所有分类
    const getCategories = () => {
        const categoriesJSON = localStorage.getItem(CATEGORIES_KEY);
        if (!categoriesJSON) {
            const defaults = initializeDefaults();
            return defaults.categories;
        }
        return JSON.parse(categoriesJSON);
    };
    
    // 获取所有书签
    const getBookmarks = () => {
        const bookmarksJSON = localStorage.getItem(BOOKMARKS_KEY);
        if (!bookmarksJSON) {
            const defaults = initializeDefaults();
            return defaults.bookmarks;
        }
        return JSON.parse(bookmarksJSON);
    };
    
    // 添加新分类
    const addCategory = (name) => {
        const categories = getCategories();
        const newCategory = {
            id: Date.now().toString(),
            name: name
        };
        
        categories.push(newCategory);
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
        return newCategory;
    };
    
    // 更新分类
    const updateCategory = (id, name) => {
        const categories = getCategories();
        const index = categories.findIndex(cat => cat.id === id);
        
        if (index !== -1) {
            categories[index].name = name;
            localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
            return categories[index];
        }
        
        return null;
    };
    
    // 删除分类
    const deleteCategory = (id) => {
        const categories = getCategories();
        const filteredCategories = categories.filter(cat => cat.id !== id);
        
        // 同时删除该分类下的所有书签
        const bookmarks = getBookmarks();
        const filteredBookmarks = bookmarks.filter(bookmark => bookmark.categoryId !== id);
        
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(filteredCategories));
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filteredBookmarks));
        
        return {
            removedCategoryId: id,
            remainingCategories: filteredCategories,
            remainingBookmarks: filteredBookmarks
        };
    };
    
    // 添加新书签
    const addBookmark = (name, url, icon, categoryId) => {
        const bookmarks = getBookmarks();
        const newBookmark = {
            id: Date.now().toString(),
            name: name,
            url: url,
            icon: icon || getFaviconUrl(url), // 使用新的图标获取函数
            categoryId: categoryId
        };
        
        bookmarks.push(newBookmark);
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
        return newBookmark;
    };
    
    // 获取网站图标的函数
    const getFaviconUrl = (url) => {
        try {
            // 提取域名
            let domain = url;
            // 移除协议部分
            if (domain.startsWith('http://')) domain = domain.substring(7);
            if (domain.startsWith('https://')) domain = domain.substring(8);
            // 移除路径部分
            domain = domain.split('/')[0];
            // 移除www前缀
            if (domain.startsWith('www.')) domain = domain.substring(4);
            
            // 1. 首先尝试从Bing获取图标
            const bingFaviconUrl = `https://www.bing.com/favicon/search?url=${domain}`;
            
            // 2. 如果Bing失败，尝试从百度获取图标
            const baiduFaviconUrl = `https://statics.dnspod.cn/proxy_favicon/_/favicon?domain=${domain}`;
            
            // 3. 如果都失败，直接使用网站的favicon.ico
            const directFaviconUrl = `https://${domain}/favicon.ico`;
            
            // 返回备选图标URL数组，按优先级排序
            return [bingFaviconUrl, baiduFaviconUrl, directFaviconUrl];
        } catch (error) {
            // 如果URL解析失败，返回默认图标
            console.error("图标获取失败:", error);
            return "images/default-icon.png";
        }
    };
    
    // 更新书签
    const updateBookmark = (id, data) => {
        const bookmarks = getBookmarks();
        const index = bookmarks.findIndex(bookmark => bookmark.id === id);
        
        if (index !== -1) {
            bookmarks[index] = {
                ...bookmarks[index],
                ...data
            };
            localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
            return bookmarks[index];
        }
        
        return null;
    };
    
    // 删除书签
    const deleteBookmark = (id) => {
        const bookmarks = getBookmarks();
        const filteredBookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
        
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filteredBookmarks));
        
        return {
            removedBookmarkId: id,
            remainingBookmarks: filteredBookmarks
        };
    };
    
    // 导出所有数据
    const exportData = () => {
        const data = {
            categories: getCategories(),
            bookmarks: getBookmarks(),
            exportDate: new Date().toISOString()
        };
        
        return JSON.stringify(data);
    };
    
    // 导入数据
    const importData = (jsonData) => {
        try {
            const data = JSON.parse(jsonData);
            
            if (!data.categories || !data.bookmarks) {
                throw new Error('数据格式无效');
            }
            
            localStorage.setItem(CATEGORIES_KEY, JSON.stringify(data.categories));
            localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(data.bookmarks));
            
            return {
                success: true,
                categories: data.categories,
                bookmarks: data.bookmarks
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    };
    
    // 公开API
    return {
        getCategories,
        getBookmarks,
        addCategory,
        updateCategory,
        deleteCategory,
        addBookmark,
        updateBookmark,
        deleteBookmark,
        exportData,
        importData
    };
})();
 