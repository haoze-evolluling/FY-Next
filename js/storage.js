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
            { id: '6', name: '微信读书', url: 'https://weread.qq.com/', categoryId: '1' },
            { id: '7', name: 'QQ邮箱', url: 'https://mail.qq.com/', categoryId: '1' },
            { id: '8', name: '知乎', url: 'https://www.zhihu.com', categoryId: '1' },
            { id: '21', name: '新浪微博', url: 'https://weibo.com', categoryId: '1' },
            { id: '22', name: '百度贴吧', url: 'https://tieba.baidu.com/', categoryId: '1' },
            
            // 网课教育
            { id: '28', name: '中国大学MOOC', url: 'https://www.icourse163.org', categoryId: '2' },
            { id: '29', name: '学堂在线', url: 'https://www.xuetangx.com', categoryId: '2' },
            { id: '30', name: '智慧树', url: 'https://www.zhihuishu.com', categoryId: '2' },
            { id: '31', name: '超星学习通', url: 'https://www.chaoxing.com', categoryId: '2' },
            { id: '32', name: '网易云课堂', url: 'https://study.163.com', categoryId: '2' },
            
            // 视频娱乐
            { id: '28', name: '哔哩哔哩', url: 'https://www.bilibili.com', categoryId: '3' },
            { id: '29', name: '起点中文网', url: 'https://www.qidian.com', categoryId: '3' },
            { id: '30', name: '腾讯视频', url: 'https://v.qq.com', categoryId: '3' },
            { id: '31', name: '优酷', url: 'https://www.youku.com', categoryId: '3' },
            { id: '32', name: '抖音', url: 'https://www.douyin.com', categoryId: '3' },
            
            // 工具助手
            { id: '33', name: '百度', url: 'https://www.baidu.com', categoryId: '4' },
            { id: '34', name: '高德地图', url: 'https://www.amap.com', categoryId: '4' },
            { id: '35', name: 'WPS', url: 'https://www.wps.cn', categoryId: '4' },
            { id: '36', name: '豆包', url: 'https://www.doubao.com', categoryId: '4' },
            { id: '37', name: '12306', url: 'https://www.12306.cn', categoryId: '4' },
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
            icon: icon || getFaviconUrl(url).primary, // 使用新的图标获取函数的primary图标
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
            const urlObj = new URL(url);
            const domain = urlObj.hostname;
            
            // 直接使用网站的favicon.ico
            const directFaviconUrl = `https://${domain}/favicon.ico`;
            
            // 只返回网站自身图标，不提供备选方案
            return {
                primary: directFaviconUrl,
                fallback1: null,
                fallback2: null,
                default: "images/default-icon.png"
            };
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
        importData,
        getFaviconUrl
    };
})();
 