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
            { id: '1', name: '常用工具' },
            { id: '2', name: '社交媒体' }
        ];
        
        // 默认书签
        const defaultBookmarks = [
            { id: '1', name: '百度', url: 'https://www.baidu.com', icon: 'https://www.baidu.com/favicon.ico', categoryId: '1' },
            { id: '2', name: '谷歌', url: 'https://www.google.com', icon: 'https://www.google.com/favicon.ico', categoryId: '1' },
            { id: '3', name: '微博', url: 'https://weibo.com', icon: 'https://weibo.com/favicon.ico', categoryId: '2' },
            { id: '4', name: 'B站', url: 'https://www.bilibili.com', icon: 'https://www.bilibili.com/favicon.ico', categoryId: '2' }
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
            icon: icon || `https://s2.googleusercontent.com/s2/favicons?domain=${url}`, // 使用谷歌favicon服务
            categoryId: categoryId
        };
        
        bookmarks.push(newBookmark);
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
        return newBookmark;
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
 