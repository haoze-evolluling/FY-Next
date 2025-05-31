/**
 * 用户界面模块
 */
const UI = (function() {
    // DOM元素
    const bookmarksContainer = document.getElementById('bookmarks-container');
    const addCategoryModal = document.getElementById('add-category-modal');
    const addBookmarkModal = document.getElementById('add-bookmark-modal');
    const categoryNameInput = document.getElementById('category-name');
    const saveCategoryBtn = document.getElementById('save-category');
    const bookmarkNameInput = document.getElementById('bookmark-name');
    const bookmarkUrlInput = document.getElementById('bookmark-url');
    const bookmarkIconInput = document.getElementById('bookmark-icon');
    const bookmarkCategorySelect = document.getElementById('bookmark-category');
    const saveBookmarkBtn = document.getElementById('save-bookmark');
    const settingsBtn = document.getElementById('settings-btn');
    const closeModalBtns = document.querySelectorAll('.close-modal');

    // 当前正在编辑的项
    let currentEditingId = null;
    let currentCategoryForBookmark = null;
    
    // 初始化UI
    const initialize = () => {
        renderBookmarks();
        setupEventListeners();
    };
    
    // 设置事件监听器
    const setupEventListeners = () => {
        // 设置按钮 - 添加新分类功能
        settingsBtn.addEventListener('click', () => {
            currentEditingId = null; // 重置状态为新增
            openModal(addCategoryModal);
            categoryNameInput.value = '';
            categoryNameInput.focus();
        });
        
        // 保存分类按钮
        saveCategoryBtn.addEventListener('click', saveCategory);
        
        // 保存书签按钮
        saveBookmarkBtn.addEventListener('click', saveBookmark);
        
        // 关闭模态框按钮
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                closeModal(btn.closest('.modal'));
            });
        });
        
        // 阻止模态框内部点击事件冒泡
        document.querySelectorAll('.modal-content').forEach(content => {
            content.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
        
        // 点击模态框背景关闭
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', () => {
                closeModal(modal);
            });
        });
    };
    
    // 渲染所有书签和分类
    const renderBookmarks = () => {
        // 清空容器
        bookmarksContainer.innerHTML = '';
        
        // 获取数据
        const categories = Storage.getCategories();
        const bookmarks = Storage.getBookmarks();
        
        // 更新分类选择下拉框
        updateCategorySelect(categories);
        
        // 如果没有分类，显示一个欢迎信息
        if (categories.length === 0) {
            bookmarksContainer.innerHTML = `
                <div class="empty-state">
                    <h2>欢迎使用云际导航</h2>
                    <p>点击顶部设置图标添加您的第一个分类</p>
                </div>
            `;
            return;
        }
        
        // 渲染每个分类及其书签
        categories.forEach(category => {
            // 创建分类元素
            const categoryElem = createCategoryElement(category);
            bookmarksContainer.appendChild(categoryElem);
            
            // 过滤出属于该分类的书签
            const categoryBookmarks = bookmarks.filter(bookmark => bookmark.categoryId === category.id);
            
            // 如果该分类没有书签，显示空状态
            if (categoryBookmarks.length === 0) {
                categoryElem.querySelector('.bookmarks-list').innerHTML = `<div class="empty-bookmarks">暂无网站，点击"+"添加</div>`;
            } else {
                // 渲染书签
                categoryBookmarks.forEach(bookmark => {
                    const bookmarkElem = createBookmarkElement(bookmark);
                    categoryElem.querySelector('.bookmarks-list').appendChild(bookmarkElem);
                });
            }
            
            // 添加事件监听器
            setupCategoryEvents(categoryElem, category);
        });
    };
    
    // 创建分类元素
    const createCategoryElement = (category) => {
        const categoryEl = document.createElement('div');
        categoryEl.className = 'category';
        categoryEl.dataset.id = category.id;

        const header = document.createElement('div');
        header.className = 'category-header';

        const title = document.createElement('h2');
        title.className = 'category-title';
        title.textContent = category.name;

        const actions = document.createElement('div');
        actions.className = 'category-actions';

        const addBtn = document.createElement('button');
        addBtn.innerHTML = '<i class="bi bi-plus-lg"></i>';
        addBtn.title = '添加网站';
        addBtn.addEventListener('click', () => showAddBookmarkModal(category.id));

        const editBtn = document.createElement('button');
        editBtn.innerHTML = '<i class="bi bi-pencil-fill"></i>';
        editBtn.title = '编辑分类';
        editBtn.className = 'edit-btn';
        editBtn.addEventListener('click', () => editCategory(category));

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="bi bi-trash-fill"></i>';
        deleteBtn.title = '删除分类';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => deleteCategory(category));

        actions.appendChild(addBtn);
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        header.appendChild(title);
        header.appendChild(actions);

        const bookmarksList = document.createElement('div');
        bookmarksList.className = 'bookmarks-list';

        categoryEl.appendChild(header);
        categoryEl.appendChild(bookmarksList);

        return categoryEl;
    };
    
    // 创建书签元素
    const createBookmarkElement = (bookmark) => {
        const bookmarkElem = document.createElement('div');
        bookmarkElem.className = 'bookmark';
        bookmarkElem.dataset.id = bookmark.id;
        
        // 处理URL格式，如果不是以http或https开头，自动添加https://
        let url = bookmark.url;
        if (url && !url.match(/^(https?:\/\/|file:\/\/)/i)) {
            url = 'https://' + url;
        }
        
        let iconHtml = '';
        if (bookmark.icon) {
            // 处理图标URL数组的情况
            if (Array.isArray(bookmark.icon)) {
                // 创建带有错误处理的图片元素
                iconHtml = `<img src="${escapeHtml(bookmark.icon[0])}" alt="${escapeHtml(bookmark.name)} 图标" 
                    onerror="
                        if (this.getAttribute('data-retry') === null) {
                            this.setAttribute('data-retry', '1');
                            this.src = '${escapeHtml(bookmark.icon[1])}';
                        } else if (this.getAttribute('data-retry') === '1') {
                            this.setAttribute('data-retry', '2');
                            this.src = '${escapeHtml(bookmark.icon[2])}';
                        } else {
                            this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22%23555%22 viewBox=%220 0 16 16%22><path d=%22M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855-.143.268-.276.56-.395.872.705.157 1.472.257 2.282.287V1.077zM4.249 3.539c.142-.384.304-.744.481-1.078a6.7 6.7 0 0 1 .597-.933A7.01 7.01 0 0 0 3.051 3.05c.362.184.763.349 1.198.49zM3.509 7.5c.036-1.07.188-2.087.436-3.008a9.124 9.124 0 0 1-1.565-.667A6.964 6.964 0 0 0 1.018 7.5h2.49zm1.4-2.741a12.344 12.344 0 0 0-.4 2.741H7.5V5.091c-.91-.03-1.783-.145-2.591-.332zM8.5 5.09V7.5h2.99a12.342 12.342 0 0 0-.399-2.741c-.808.187-1.681.301-2.591.332zM4.51 8.5c.035.987.176 1.914.399 2.741A13.612 13.612 0 0 1 7.5 10.91V8.5H4.51zm3.99 0v2.409c.91.03 1.783.145 2.591.332.223-.827.364-1.754.4-2.741H8.5zm-3.282 3.696c.12.312.252.604.395.872.552 1.035 1.218 1.65 1.887 1.855V11.91c-.81.03-1.577.13-2.282.287zm.11 2.276a6.696 6.696 0 0 1-.598-.933 8.853 8.853 0 0 1-.481-1.079 8.38 8.38 0 0 0-1.198.49 7.01 7.01 0 0 0 2.276 1.522zm-1.383-2.964A13.36 13.36 0 0 1 3.508 8.5h-2.49a6.963 6.963 0 0 0 1.362 3.675c.47-.258.995-.482 1.565-.667zm6.728 2.964a7.009 7.009 0 0 0 2.275-1.521 8.376 8.376 0 0 0-1.197-.49 8.853 8.853 0 0 1-.481 1.078 6.688 6.688 0 0 1-.597.933zM8.5 11.909v3.014c.67-.204 1.335-.82 1.887-1.855.143-.268.276-.56.395-.872A12.63 12.63 0 0 0 8.5 11.91zm3.555-.401c.57.185 1.095.409 1.565.667A6.963 6.963 0 0 0 14.982 8.5h-2.49a13.36 13.36 0 0 1-.437 3.008zM14.982 7.5a6.963 6.963 0 0 0-1.362-3.675c-.47.258-.995.482-1.565.667.248.92.4 1.938.437 3.008h2.49zM11.27 2.461c.177.334.339.694.482 1.078a8.368 8.368 0 0 0 1.196-.49 7.01 7.01 0 0 0-2.275-1.52c.218.283.418.597.597.932zm-.488 1.343a7.765 7.765 0 0 0-.395-.872C9.835 1.897 9.17 1.282 8.5 1.077V4.09c.81-.03 1.577-.13 2.282-.287z%22/></svg>'
                        }
                    ">`;
            } else {
                // 处理单个URL的情况，保留原有逻辑
                iconHtml = `<img src="${escapeHtml(bookmark.icon)}" alt="${escapeHtml(bookmark.name)} 图标" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22%23555%22 viewBox=%220 0 16 16%22><path d=%22M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855-.143.268-.276.56-.395.872.705.157 1.472.257 2.282.287V1.077zM4.249 3.539c.142-.384.304-.744.481-1.078a6.7 6.7 0 0 1 .597-.933A7.01 7.01 0 0 0 3.051 3.05c.362.184.763.349 1.198.49zM3.509 7.5c.036-1.07.188-2.087.436-3.008a9.124 9.124 0 0 1-1.565-.667A6.964 6.964 0 0 0 1.018 7.5h2.49zm1.4-2.741a12.344 12.344 0 0 0-.4 2.741H7.5V5.091c-.91-.03-1.783-.145-2.591-.332zM8.5 5.09V7.5h2.99a12.342 12.342 0 0 0-.399-2.741c-.808.187-1.681.301-2.591.332zM4.51 8.5c.035.987.176 1.914.399 2.741A13.612 13.612 0 0 1 7.5 10.91V8.5H4.51zm3.99 0v2.409c.91.03 1.783.145 2.591.332.223-.827.364-1.754.4-2.741H8.5zm-3.282 3.696c.12.312.252.604.395.872.552 1.035 1.218 1.65 1.887 1.855V11.91c-.81.03-1.577.13-2.282.287zm.11 2.276a6.696 6.696 0 0 1-.598-.933 8.853 8.853 0 0 1-.481-1.079 8.38 8.38 0 0 0-1.198.49 7.01 7.01 0 0 0 2.276 1.522zm-1.383-2.964A13.36 13.36 0 0 1 3.508 8.5h-2.49a6.963 6.963 0 0 0 1.362 3.675c.47-.258.995-.482 1.565-.667zm6.728 2.964a7.009 7.009 0 0 0 2.275-1.521 8.376 8.376 0 0 0-1.197-.49 8.853 8.853 0 0 1-.481 1.078 6.688 6.688 0 0 1-.597.933zM8.5 11.909v3.014c.67-.204 1.335-.82 1.887-1.855.143-.268.276-.56.395-.872A12.63 12.63 0 0 0 8.5 11.91zm3.555-.401c.57.185 1.095.409 1.565.667A6.963 6.963 0 0 0 14.982 8.5h-2.49a13.36 13.36 0 0 1-.437 3.008zM14.982 7.5a6.963 6.963 0 0 0-1.362-3.675c-.47.258-.995.482-1.565.667.248.92.4 1.938.437 3.008h2.49zM11.27 2.461c.177.334.339.694.482 1.078a8.368 8.368 0 0 0 1.196-.49 7.01 7.01 0 0 0-2.275-1.52c.218.283.418.597.597.932zm-.488 1.343a7.765 7.765 0 0 0-.395-.872C9.835 1.897 9.17 1.282 8.5 1.077V4.09c.81-.03 1.577-.13 2.282-.287z%22/></svg>'">`;
            }
        } else {
            iconHtml = `<i class="bi bi-globe2"></i>`;
        }
        
        // 创建书签图标部分，包装在链接中
        const bookmarkIconLink = document.createElement('a');
        bookmarkIconLink.href = url;
        bookmarkIconLink.target = "_blank";
        bookmarkIconLink.className = 'bookmark-icon-link';
        
        const bookmarkIconDiv = document.createElement('div');
        bookmarkIconDiv.className = 'bookmark-icon';
        bookmarkIconDiv.innerHTML = iconHtml;
        
        bookmarkIconLink.appendChild(bookmarkIconDiv);
        
        // 创建书签链接部分
        const bookmarkLink = document.createElement('a');
        bookmarkLink.href = url;
        bookmarkLink.target = "_blank";
        bookmarkLink.title = bookmark.name;
        bookmarkLink.className = 'bookmark-name';
        bookmarkLink.textContent = bookmark.name;
        
        // 创建操作按钮部分
        const bookmarkActions = document.createElement('div');
        bookmarkActions.className = 'bookmark-actions';
        bookmarkActions.innerHTML = `
            <button class="edit-bookmark-btn" title="编辑"><i class="bi bi-pencil-fill"></i></button>
            <button class="delete-bookmark-btn" title="删除"><i class="bi bi-trash-fill"></i></button>
        `;
        
        // 将各部分添加到书签元素中
        bookmarkElem.appendChild(bookmarkIconLink);
        bookmarkElem.appendChild(bookmarkLink);
        bookmarkElem.appendChild(bookmarkActions);
        
        // 添加事件监听器
        setupBookmarkEvents(bookmarkElem, bookmark);
        
        return bookmarkElem;
    };
    
    // 为分类添加事件监听器
    const setupCategoryEvents = (categoryElem, category) => {
        // 添加网站按钮
        const addBtn = categoryElem.querySelector('button[title="添加网站"]');
        addBtn.addEventListener('click', () => {
            showAddBookmarkModal(category.id);
        });
        
        // 编辑分类按钮
        categoryElem.querySelector('.edit-btn').addEventListener('click', () => {
            editCategory(category);
        });
        
        // 删除分类按钮
        categoryElem.querySelector('.delete-btn').addEventListener('click', () => {
            deleteCategory(category);
        });
    };
    
    // 为书签添加事件监听器
    const setupBookmarkEvents = (bookmarkElem, bookmark) => {
        // 编辑按钮
        const editBtn = bookmarkElem.querySelector('.edit-bookmark-btn');
        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                editBookmark(bookmark);
            });
        }
        
        // 删除按钮
        const deleteBtn = bookmarkElem.querySelector('.delete-bookmark-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                deleteBookmark(bookmark);
            });
        }
    };
    
    // 编辑分类
    const editCategory = (category) => {
        currentEditingId = category.id;
        categoryNameInput.value = category.name;
        openModal(addCategoryModal);
        categoryNameInput.focus();
    };
    
    // 删除分类
    const deleteCategory = (category) => {
        if (confirm(`确定要删除分类"${category.name}"吗？此操作将同时删除该分类下的所有网站。`)) {
            Storage.deleteCategory(category.id);
            renderBookmarks();
        }
    };
    
    // 编辑书签
    const editBookmark = (bookmark) => {
        currentEditingId = bookmark.id;
        bookmarkNameInput.value = bookmark.name;
        bookmarkUrlInput.value = bookmark.url;
        bookmarkIconInput.value = bookmark.icon || '';
        bookmarkCategorySelect.value = bookmark.categoryId;
        openModal(addBookmarkModal);
        bookmarkNameInput.focus();
    };
    
    // 删除书签
    const deleteBookmark = (bookmark) => {
        if (confirm(`确定要删除"${bookmark.name}"吗？`)) {
            Storage.deleteBookmark(bookmark.id);
            renderBookmarks();
        }
    };
    
    // 显示添加书签模态框
    const showAddBookmarkModal = (categoryId) => {
        currentEditingId = null; // 重置状态为新增
        currentCategoryForBookmark = categoryId;
        
        // 重置表单
        bookmarkNameInput.value = '';
        bookmarkUrlInput.value = '';
        bookmarkIconInput.value = '';
        
        // 设置默认分类
        if (bookmarkCategorySelect.options.length > 0) {
            for (let i = 0; i < bookmarkCategorySelect.options.length; i++) {
                if (bookmarkCategorySelect.options[i].value === categoryId) {
                    bookmarkCategorySelect.selectedIndex = i;
                    break;
                }
            }
        }
        
        openModal(addBookmarkModal);
        bookmarkNameInput.focus();
    };
    
    // 更新分类选择下拉框
    const updateCategorySelect = (categories) => {
        bookmarkCategorySelect.innerHTML = '';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            bookmarkCategorySelect.appendChild(option);
        });
    };
    
    // 保存分类
    const saveCategory = () => {
        const name = categoryNameInput.value.trim();
        
        if (!name) {
            alert('请输入分类名称');
            return;
        }
        
        if (currentEditingId) {
            // 编辑现有分类
            Storage.updateCategory(currentEditingId, name);
        } else {
            // 添加新分类
            Storage.addCategory(name);
        }
        
        closeModal(addCategoryModal);
        renderBookmarks();
    };
    
    // 保存书签
    const saveBookmark = () => {
        const name = bookmarkNameInput.value.trim();
        const url = bookmarkUrlInput.value.trim();
        const icon = bookmarkIconInput.value.trim();
        const categoryId = bookmarkCategorySelect.value;
        
        if (!name || !url) {
            alert('请输入网站名称和地址');
            return;
        }
        
        if (currentEditingId) {
            // 编辑现有书签
            Storage.updateBookmark(currentEditingId, { name, url, icon, categoryId });
        } else {
            // 添加新书签
            Storage.addBookmark(name, url, icon, categoryId);
        }
        
        closeModal(addBookmarkModal);
        renderBookmarks();
    };
    
    // 打开模态框
    const openModal = (modal) => {
        modal.classList.add('active');
    };
    
    // 关闭模态框
    const closeModal = (modal) => {
        modal.classList.remove('active');
    };
    
    // HTML转义
    const escapeHtml = (unsafe) => {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };
    
    // 公开API
    return {
        initialize,
        renderBookmarks
    };
})(); 