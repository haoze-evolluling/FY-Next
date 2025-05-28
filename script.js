// Default categories and links
const defaultCategories = [
    {
        name: '常用网站',
        links: [
            { name: '百度', url: 'https://www.baidu.com', icon: '' },
            { name: '腾讯', url: 'https://www.tencent.com', icon: '' },
            { name: '阿里巴巴', url: 'https://www.alibaba.com', icon: '' }
        ]
    },
    {
        name: '新闻资讯',
        links: [
            { name: '新浪新闻', url: 'https://news.sina.com.cn', icon: '' },
            { name: '网易新闻', url: 'https://news.163.com', icon: '' }
        ]
    },
    {
        name: '购物平台',
        links: [
            { name: '淘宝', url: 'https://www.taobao.com', icon: '' },
            { name: '京东', url: 'https://www.jd.com', icon: '' },
            { name: '拼多多', url: 'https://www.pinduoduo.com', icon: '' }
        ]
    }
];

// Load categories from localStorage or use default if none exist
let categories = JSON.parse(localStorage.getItem('categories')) || defaultCategories;

// Save categories to localStorage
function saveCategories() {
    localStorage.setItem('categories', JSON.stringify(categories));
}

// Render categories to the page
function renderCategories() {
    const container = document.getElementById('categories-container');
    container.innerHTML = '';
    
    categories.forEach((category, catIndex) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.dataset.categoryIndex = catIndex;
        categoryDiv.style.setProperty('--delay', catIndex * 0.1); // Fixed delay for staggered animation
        
        categoryDiv.innerHTML = `
            <div class="category-header">
                <h2>${category.name}</h2>
                <div class="category-actions">
                    <button class="icon-btn" onclick="showEditCategoryModal(${catIndex})" title="编辑类别">
                        <span class="material-icons-outlined">edit</span>
                    </button>
                    <button class="icon-btn" onclick="deleteCategory(${catIndex})" title="删除类别">
                        <span class="material-icons-outlined">delete</span>
                    </button>
                    <button class="icon-btn" onclick="showAddWebsiteModal(${catIndex})" title="添加网站">
                        <span class="material-icons-outlined">add_circle</span>
                    </button>
                </div>
            </div>
            <div class="links">
                ${category.links.map((link, linkIndex) => `
                    <a href="${link.url}" target="_blank" class="link-item">
                        ${link.icon ? `<img src="${link.icon}" alt="${link.name}" onerror="this.src='https://www.google.com/s2/favicons?domain=${link.url}';">` : 
                        `<span class="material-icons-outlined" style="font-size: 16px; margin-right: 8px;">public</span>`}
                        <span>${link.name}</span>
                    </a>
                `).join('')}
            </div>
        `;
        container.appendChild(categoryDiv);
    });
}

// Search functionality
function performSearch() {
    const engine = document.getElementById('search-engine').value;
    const query = document.getElementById('search-input').value.trim();
    if (!query) return;
    
    const engines = {
        baidu: 'https://www.baidu.com/s?wd=',
        google: 'https://www.google.com/search?q=',
        bing: 'https://www.bing.com/search?q=',
        sogou: 'https://www.sogou.com/web?query='
    };
    
    window.open(engines[engine] + encodeURIComponent(query), '_blank');
    document.getElementById('search-input').value = '';
}

// Modal functions
function showAddCategoryModal() {
    document.getElementById('add-category-modal').style.display = 'block';
}

function hideAddCategoryModal() {
    document.getElementById('add-category-modal').style.display = 'none';
    document.getElementById('new-category-input').value = '';
}

function showAddWebsiteModal(catIndex) {
    document.getElementById('add-website-modal').style.display = 'block';
    document.getElementById('current-category-index').value = catIndex;
}

function hideAddWebsiteModal() {
    document.getElementById('add-website-modal').style.display = 'none';
    document.getElementById('new-website-name').value = '';
    document.getElementById('new-website-url').value = '';
    document.getElementById('new-website-icon').value = '';
    document.getElementById('current-category-index').value = '';
}

function showEditCategoryModal(catIndex) {
    document.getElementById('edit-category-modal').style.display = 'block';
    document.getElementById('edit-category-index').value = catIndex;
    document.getElementById('edit-category-input').value = categories[catIndex].name;
}

function hideEditCategoryModal() {
    document.getElementById('edit-category-modal').style.display = 'none';
    document.getElementById('edit-category-index').value = '';
    document.getElementById('edit-category-input').value = '';
}

// Add a new category
function addCategory() {
    const input = document.getElementById('new-category-input');
    const name = input.value.trim();
    if (name) {
        categories.push({ name, links: [] });
        saveCategories();
        renderCategories();
        hideAddCategoryModal();
    }
}

// Delete a category
function deleteCategory(catIndex) {
    if (confirm('确定要删除这个类别吗？所有链接将被删除。')) {
        categories.splice(catIndex, 1);
        saveCategories();
        renderCategories();
    }
}

// Edit a category
function saveEditedCategory() {
    const index = parseInt(document.getElementById('edit-category-index').value);
    const newName = document.getElementById('edit-category-input').value.trim();
    if (newName && !isNaN(index)) {
        categories[index].name = newName;
        saveCategories();
        renderCategories();
        hideEditCategoryModal();
    }
}

// Add a new website to a category
function addWebsite() {
    const catIndex = parseInt(document.getElementById('current-category-index').value);
    const name = document.getElementById('new-website-name').value.trim();
    const url = document.getElementById('new-website-url').value.trim();
    const icon = document.getElementById('new-website-icon').value.trim();
    
    if (name && url && !isNaN(catIndex)) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            alert('网址必须以 http:// 或 https:// 开头');
            return;
        }
        categories[catIndex].links.push({ name, url, icon });
        saveCategories();
        renderCategories();
        hideAddWebsiteModal();
    }
}

// Initialize the page
window.onload = function() {
    renderCategories();
    // Add event listener for Enter key on search input
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    // Add event listener for Enter key on category input in modal
    document.getElementById('new-category-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addCategory();
        }
    });
    // Add event listener for Enter key on website input in modal
    document.getElementById('new-website-url').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addWebsite();
        }
    });
    // Add event listener for Enter key on edit category input in modal
    document.getElementById('edit-category-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveEditedCategory();
        }
    });
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.className === 'modal') {
            hideAddCategoryModal();
            hideAddWebsiteModal();
            hideEditCategoryModal();
        }
    });
}; 