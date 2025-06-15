/**
 * 个性化设置模块
 */
const Preferences = (function() {
    // DOM元素
    const preferencesBtn = document.getElementById('preferences-btn');
    const preferencesModal = document.getElementById('preferences-modal');
    const savePreferencesBtn = document.getElementById('save-preferences');
    const resetPreferencesBtn = document.getElementById('reset-preferences');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const closeModalBtn = preferencesModal ? preferencesModal.querySelector('.close-modal') : null;
    
    // 打开模态框函数
    const openModal = (modal) => {
        if (!modal) return;
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('active');
            document.body.classList.add('modal-open');
        }, 10);
    };
    
    // 关闭模态框函数
    const closeModal = (modal) => {
        if (!modal) return;
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }, 300); // 等待过渡效果完成
    };
    
    // debounce函数 - 用于减少函数执行频率
    const debounce = (func, wait) => {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    };
    
    // 保存设置函数
    const savePreferences = () => {
        try {
            // 保存当前设置到Storage
            Storage.updatePreferences(currentPreferences);
            
            // 确保ThemeManager与保存的设置同步
            if (typeof ThemeManager !== 'undefined') {
                if (currentPreferences.theme === 'dark') {
                    ThemeManager.enableDarkMode(true);
                } else {
                    ThemeManager.enableLightMode(true);
                }
            }
            
            // 关闭模态框
            closeModal(preferencesModal);
            
            // 显示保存成功提示
            const toast = document.createElement('div');
            toast.className = 'toast toast-success';
            toast.textContent = '设置已保存';
            document.body.appendChild(toast);
            
            // 自动移除提示
            setTimeout(() => {
                toast.classList.add('toast-hide');
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }, 3000);
            
            console.log('设置已保存', currentPreferences);
        } catch (error) {
            console.error('保存设置失败:', error);
            alert('保存设置失败');
        }
    };
    
    // 重置设置函数
    const resetPreferences = () => {
        if (confirm('确定要重置所有设置吗？')) {
            try {
                // 获取默认设置
                currentPreferences = Storage.resetPreferences();
                
                // 应用设置到UI
                applyPreferencesToUI();
                
                // 应用设置到页面
                applyPreferencesToPage();
                
                // 显示重置成功提示
                const toast = document.createElement('div');
                toast.className = 'toast toast-info';
                toast.textContent = '设置已重置';
                document.body.appendChild(toast);
                
                // 自动移除提示
                setTimeout(() => {
                    toast.classList.add('toast-hide');
                    setTimeout(() => {
                        document.body.removeChild(toast);
                    }, 300);
                }, 3000);
                
                console.log('设置已重置', currentPreferences);
            } catch (error) {
                console.error('重置设置失败:', error);
                alert('重置设置失败');
            }
        }
    };
    
    // 主题选择器
    const themeOptions = document.querySelectorAll('.theme-option');
    const accentColorPicker = document.getElementById('accent-color');
    const accentColorValue = accentColorPicker ? accentColorPicker.nextElementSibling : null;
    
    // 卡片样式选择器
    const cardStyleOptions = document.querySelectorAll('.card-style-option');
    
    // 动画开关
    const animationToggle = document.getElementById('animation-toggle');
    
    // 布局选择器
    const layoutOptions = document.querySelectorAll('.layout-option');
    
    // 磁贴布局设置
    const tileLayoutOptions = document.querySelectorAll('.tile-layout-option');
    
    // 背景设置
    const bgTypeOptions = document.querySelectorAll('.bg-type-option');
    const bgOptions = document.querySelectorAll('.bg-option');
    const bgColorPicker = document.getElementById('bg-color');
    const bgColorValue = bgColorPicker ? bgColorPicker.nextElementSibling : null;
    const bgImageUrl = document.getElementById('bg-image-url');
    const bgImageUpload = document.getElementById('bg-image-upload');
    const bgImagePreview = document.querySelector('.bg-image-preview');
    const gradientColor1 = document.getElementById('gradient-color-1');
    const gradientColor1Value = gradientColor1 ? gradientColor1.nextElementSibling : null;
    const gradientColor2 = document.getElementById('gradient-color-2');
    const gradientColor2Value = gradientColor2 ? gradientColor2.nextElementSibling : null;
    const gradientDirection = document.getElementById('gradient-direction');
    const gradientPreview = document.querySelector('.gradient-preview');
    const blurRange = document.getElementById('blur-range');
    const blurValue = blurRange ? blurRange.nextElementSibling : null;
    
    // 检查是否所有必要的DOM元素都存在
    const checkDomElements = () => {
        const missingElements = [];
        
        if (!preferencesBtn) missingElements.push('preferences-btn');
        if (!preferencesModal) missingElements.push('preferences-modal');
        if (!savePreferencesBtn) missingElements.push('save-preferences');
        if (!resetPreferencesBtn) missingElements.push('reset-preferences');
        if (tabBtns.length === 0) missingElements.push('tab-btn');
        if (tabContents.length === 0) missingElements.push('tab-content');
        if (themeOptions.length === 0) missingElements.push('theme-option');
        if (!accentColorPicker) missingElements.push('accent-color');
        if (cardStyleOptions.length === 0) missingElements.push('card-style-option');
        if (!animationToggle) missingElements.push('animation-toggle');
        if (layoutOptions.length === 0) missingElements.push('layout-option');
        if (tileLayoutOptions.length === 0) missingElements.push('tile-layout-option');
        if (bgTypeOptions.length === 0) missingElements.push('bg-type-option');
        if (bgOptions.length === 0) missingElements.push('bg-option');
        if (!bgColorPicker) missingElements.push('bg-color');
        if (!bgImageUrl) missingElements.push('bg-image-url');
        if (!bgImageUpload) missingElements.push('bg-image-upload');
        if (!bgImagePreview) missingElements.push('bg-image-preview');
        if (!gradientColor1) missingElements.push('gradient-color-1');
        if (!gradientColor2) missingElements.push('gradient-color-2');
        if (!gradientDirection) missingElements.push('gradient-direction');
        if (!gradientPreview) missingElements.push('gradient-preview');
        if (!blurRange) missingElements.push('blur-range');
        
        if (missingElements.length > 0) {
            console.warn('以下元素未找到:', missingElements.join(', '));
            return false;
        }
        
        return true;
    };
    
    // 当前设置
    let currentPreferences = {};
    
    // 应用磁贴过渡效果
    const applyTileTransitions = (container) => {
        if (!container) return;
        
        // 检查是否支持动画
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // 添加容器过渡效果
        if (!prefersReducedMotion) {
            container.style.transition = 'grid-template-columns 0.5s ease-in-out';
        }
        
        // 为磁贴元素添加过渡效果
        const bookmarkItems = container.querySelectorAll('.bookmark-item');
        bookmarkItems.forEach((item, index) => {
            // 移除可能已存在的事件监听器
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            
            // 设置基本过渡效果
            if (!prefersReducedMotion) {
                newItem.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), ' +
                                         'box-shadow 0.3s ease, ' +
                                         'opacity 0.3s ease';
            }
            
            // 添加触摸反馈
            newItem.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.97)';
            }, { passive: true });
            
            newItem.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            }, { passive: true });
        });
    };
    
    // 应用磁贴布局变化动画
    const applyTileLayoutChange = (container, newLayout) => {
        if (!container) return;
        
        // 检查是否支持动画
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // 添加布局变化类
        container.classList.add('changing-layout');
        
        // 先获取当前的磁贴项
        const bookmarkItems = container.querySelectorAll('.bookmark-item');
        
        // 记录当前位置
        const itemPositions = [];
        bookmarkItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            itemPositions.push({
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height
            });
            
            // 确保元素有初始状态
            item.style.transformOrigin = 'center center';
            item.style.willChange = 'transform, opacity';
        });
        
        // 设置新布局
        if (prefersReducedMotion) {
            // 对于不喜欢动画的用户，直接设置布局而不添加过渡效果
            container.style.gridTemplateColumns = `repeat(${newLayout}, 1fr)`;
            container.classList.remove('changing-layout');
        } else {
            // 先禁用过渡
            container.style.transition = 'none';
            
            // 立即应用新布局
            container.style.gridTemplateColumns = `repeat(${newLayout}, 1fr)`;
            
            // 强制重绘
            void container.offsetWidth;
            
            // 计算新位置
            const newPositions = [];
            bookmarkItems.forEach(item => {
                const rect = item.getBoundingClientRect();
                newPositions.push({
                    left: rect.left,
                    top: rect.top,
                    width: rect.width,
                    height: rect.height
                });
            });
            
            // 重置到原始位置
            bookmarkItems.forEach((item, index) => {
                if (index >= itemPositions.length) return;
                
                const oldPos = itemPositions[index];
                const newPos = newPositions[index];
                
                // 计算需要的变换
                const deltaX = oldPos.left - newPos.left;
                const deltaY = oldPos.top - newPos.top;
                const scaleX = oldPos.width / newPos.width;
                const scaleY = oldPos.height / newPos.height;
                
                // 应用反向变换，使元素看起来还在原来的位置
                item.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`;
                item.style.transition = 'none';
                item.style.opacity = '0.9';  // 轻微降低不透明度，提高视觉效果
            });
            
            // 强制重绘
            void container.offsetWidth;
            
            // 恢复过渡并移除变换，让元素平滑移动到新位置
            container.style.transition = 'grid-template-columns 0.75s cubic-bezier(0.2, 0.8, 0.2, 1)';
            
            // 错开每个项目的动画以创建级联效果
            bookmarkItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.transition = 'transform 0.75s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.75s cubic-bezier(0.2, 0.8, 0.2, 1)';
                    item.style.transform = '';
                    item.style.opacity = '1';
                    
                    // 添加动画类
                    item.classList.add('layout-change-animation');
                    
                    // 移除动画类和清理样式
                    setTimeout(() => {
                        item.classList.remove('layout-change-animation');
                        if (index === bookmarkItems.length - 1) {
                            container.classList.remove('changing-layout');
                            
                            // 清理可能残留的内联样式
                            bookmarkItems.forEach(cleanItem => {
                                setTimeout(() => {
                                    cleanItem.style.transform = '';
                                    cleanItem.style.transition = '';
                                    cleanItem.style.opacity = '';
                                    cleanItem.style.willChange = '';
                                }, 50);
                            });
                        }
                    }, 800);
                }, index * 50); // 显著增加错开时间以创建更明显的级联效果
            });
        }
    };
    
    // 检查当前主题状态
    const checkCurrentTheme = () => {
        // 优先使用 ThemeManager 的信息
        if (typeof ThemeManager !== 'undefined') {
            const currentTheme = ThemeManager.getCurrentTheme();
            updateThemeSelection(currentTheme);
        } else {
            // 回退到旧方法
            const isDarkMode = document.body.classList.contains('dark-mode');
            updateThemeSelection(isDarkMode ? 'dark' : 'light');
        }
    };
    
    // 更新主题选择UI
    const updateThemeSelection = (theme) => {
        themeOptions.forEach(option => {
            const optionTheme = option.getAttribute('data-theme');
            if (optionTheme === theme) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
        
        // 同步更新当前首选项对象
        if (currentPreferences) {
            currentPreferences.theme = theme;
        }
    };
    
    // 提供给ThemeManager调用的方法
    const updateThemeState = (theme) => {
        // 只在偏好设置窗口打开时更新UI
        if (preferencesModal && preferencesModal.classList.contains('active')) {
            updateThemeSelection(theme);
        }
        
        // 更新当前偏好设置
        if (currentPreferences) {
            currentPreferences.theme = theme;
        }
    };
    
    // 初始化
    const initialize = () => {
        try {
            // 加载当前设置
            currentPreferences = Storage.getPreferences();
            
            // 检查DOM元素
            const allElementsExist = checkDomElements();
            
            // 如果缺少关键元素，则尝试延迟初始化
            if (!allElementsExist) {
                console.warn('部分DOM元素未找到，将在300ms后重试初始化');
                setTimeout(initialize, 300);
                return;
            }
            
            // 与ThemeManager协调
            checkCurrentTheme();
            
            // 设置事件监听器
            setupEventListeners();
            
            // 应用当前设置到界面
            applyPreferencesToUI();
            
            // 应用当前设置到页面
            applyPreferencesToPage();
            
            // 添加窗口大小变化监听器，以便在调整窗口大小时重新应用布局
            window.addEventListener('resize', debounce(() => {
                applyPreferencesToPage();
            }, 250));
            
            // 创建并添加CSS样式
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                .changing-layout {
                    pointer-events: none;
                }
                
                .tile-transition {
                    animation: tileScale 0.3s ease-in-out forwards;
                }
                
                @keyframes tileScale {
                    0% { transform: scale(0.95); opacity: 0.7; }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); opacity: 1; }
                }
                
                .bookmark-item {
                    transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
                    will-change: transform, opacity;
                    backface-visibility: hidden;
                    perspective: 1000px;
                }
                
                .layout-change-animation {
                    animation: layoutChange 0.75s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                    will-change: transform, opacity;
                }
                
                @keyframes layoutChange {
                    0% { transform: scale(0.9); opacity: 0.7; }
                    50% { transform: scale(1.05); opacity: 0.9; }
                    100% { transform: scale(1); opacity: 1; }
                }
                
                #bookmarks-container {
                    transition: grid-template-columns 0.75s cubic-bezier(0.2, 0.8, 0.2, 1);
                }
                
                .bookmark-item:hover {
                    z-index: 10;
                }
                
                /* 为不同位置的磁贴添加不同的悬停效果 */
                @media (hover: hover) {
                    .bookmark-item:nth-child(3n+1):hover {
                        transform: translateY(-5px) rotate(-1deg);
                        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                    }
                    
                    .bookmark-item:nth-child(3n+2):hover {
                        transform: translateY(-7px);
                        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                    }
                    
                    .bookmark-item:nth-child(3n+3):hover {
                        transform: translateY(-5px) rotate(1deg);
                        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                    }
                }
                
                /* 触摸设备的活动状态 */
                @media (hover: none) {
                    .bookmark-item:active {
                        transform: scale(0.95);
                        opacity: 0.9;
                    }
                }
                
                /* Toast提示样式 */
                .toast {
                    position: fixed;
                    bottom: 30px;
                    left: 50%;
                    transform: translateX(-50%);
                    padding: 12px 24px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 10000;
                    font-size: 14px;
                    opacity: 1;
                    transition: opacity 0.3s ease;
                    color: #fff;
                }
                
                .toast-success {
                    background-color: #4CAF50;
                }
                
                .toast-info {
                    background-color: var(--accent-color, #4a6cf7);
                }
                
                .toast-error {
                    background-color: #F44336;
                }
                
                .toast-hide {
                    opacity: 0;
                }
            `;
            document.head.appendChild(styleElement);
            
            console.log('偏好设置模块初始化成功');
        } catch (error) {
            console.error('偏好设置模块初始化失败:', error);
        }
    };
    
    // 设置事件监听器
    const setupEventListeners = () => {
        // 打开设置模态框
        if (preferencesBtn) {
            preferencesBtn.addEventListener('click', () => {
                openModal(preferencesModal);
            });
        }
        
        // 关闭模态框按钮
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                closeModal(preferencesModal);
            });
        }
        
        // 点击模态框外部关闭
        if (preferencesModal) {
            preferencesModal.addEventListener('click', (e) => {
                if (e.target === preferencesModal) {
                    closeModal(preferencesModal);
                }
            });
        }
        
        // 保存设置
        if (savePreferencesBtn) {
            savePreferencesBtn.addEventListener('click', savePreferences);
        }
        
        // 重置设置
        if (resetPreferencesBtn) {
            resetPreferencesBtn.addEventListener('click', resetPreferences);
        }
        
        // 标签页切换
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                
                // 更新活动标签按钮
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // 更新活动标签内容
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${tabId}-tab`) {
                        content.classList.add('active');
                    }
                });
            });
        });
        
        // 主题选择
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.getAttribute('data-theme');
                
                // 移除所有主题选项的活动状态
                themeOptions.forEach(o => o.classList.remove('active'));
                
                // 设置当前选中项
                option.classList.add('active');
                
                // 更新当前配置
                currentPreferences.theme = theme;
                
                // 与ThemeManager协调
                if (typeof ThemeManager !== 'undefined') {
                    if (theme === 'dark') {
                        ThemeManager.enableDarkMode(false); // 不保存，只预览
                    } else {
                        ThemeManager.enableLightMode(false); // 不保存，只预览
                    }
                }
                
                // 应用预览
                previewChanges();
            });
        });
        
        // 强调色选择
        if (accentColorPicker && accentColorValue) {
            accentColorPicker.addEventListener('input', () => {
                const color = accentColorPicker.value;
                accentColorValue.textContent = color;
                currentPreferences.accentColor = color;
                previewChanges();
            });
        }
        
        // 卡片样式选择
        cardStyleOptions.forEach(option => {
            option.addEventListener('click', () => {
                const style = option.dataset.style;
                cardStyleOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                currentPreferences.cardStyle = style;
                previewChanges();
            });
        });
        
        // 动画开关
        if (animationToggle) {
            animationToggle.addEventListener('change', () => {
                currentPreferences.animation = animationToggle.checked;
                previewChanges();
            });
        }
        
        // 布局选择
        layoutOptions.forEach(option => {
            option.addEventListener('click', () => {
                const layout = option.dataset.layout;
                layoutOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                currentPreferences.layout = layout;
                
                // 根据布局类型显示或隐藏磁贴布局选择器
                const tileLayoutGroup = document.getElementById('tile-layout-group');
                if (tileLayoutGroup) {
                    tileLayoutGroup.style.display = layout === 'grid' ? 'block' : 'none';
                }
                
                previewChanges();
            });
        });
        
        // 磁贴布局选择
        tileLayoutOptions.forEach(option => {
            option.addEventListener('click', () => {
                const tileLayout = option.dataset.tilelayout;
                // 如果选择的是当前布局，不做任何变化
                if (currentPreferences.tileLayout === tileLayout) {
                    return;
                }
                
                tileLayoutOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                currentPreferences.tileLayout = tileLayout;
                
                // 立即应用新的磁贴布局并添加过渡效果
                const bookmarksContainer = document.getElementById('bookmarks-container');
                if (bookmarksContainer && document.body.classList.contains('layout-grid')) {
                    let columns;
                    // 根据不同的屏幕尺寸设置不同的列数
                    if (window.innerWidth >= 1025) {
                        columns = tileLayout;
                    } else if (window.innerWidth >= 768 && window.innerWidth <= 1024) {
                        columns = Math.min(2, tileLayout);
                    } else {
                        columns = 1;
                    }
                    
                    // 先让所有磁贴有一个明显的变化
                    const bookmarkItems = bookmarksContainer.querySelectorAll('.bookmark-item');
                    bookmarkItems.forEach(item => {
                        item.style.opacity = '0.8';
                        item.style.transform = 'scale(0.95)';
                    });
                    
                    // 强制重绘
                    void bookmarksContainer.offsetWidth;
                    
                    // 应用布局变化动画
                    setTimeout(() => {
                        applyTileLayoutChange(bookmarksContainer, columns);
                    }, 50);
                }
                
                previewChanges();
            });
        });
        
        // 根据当前布局设置磁贴布局选择器显示状态
        const tileLayoutGroup = document.getElementById('tile-layout-group');
        if (tileLayoutGroup && currentPreferences.layout) {
            tileLayoutGroup.style.display = currentPreferences.layout === 'grid' ? 'block' : 'none';
        }
        
        // 背景类型选择
        bgTypeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const type = option.dataset.type;
                bgTypeOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                
                // 隐藏所有背景选项
                bgOptions.forEach(o => o.classList.remove('active'));
                
                // 显示对应的背景选项
                if (type !== 'default') {
                    const bgOption = document.getElementById(`bg-${type}-option`);
                    if (bgOption) {
                        bgOption.classList.add('active');
                    }
                }
                
                if (!currentPreferences.background) {
                    currentPreferences.background = {};
                }
                currentPreferences.background.type = type;
                previewChanges();
            });
        });
        
        // 背景颜色选择
        if (bgColorPicker && bgColorValue) {
            bgColorPicker.addEventListener('input', () => {
                const color = bgColorPicker.value;
                bgColorValue.textContent = color;
                if (!currentPreferences.background) {
                    currentPreferences.background = {};
                }
                currentPreferences.background.value = color;
                previewChanges();
            });
        }
        
        // 背景图片URL输入
        if (bgImageUrl && bgImagePreview) {
            bgImageUrl.addEventListener('input', debounce(() => {
                const url = bgImageUrl.value.trim();
                if (url) {
                    if (!currentPreferences.background) {
                        currentPreferences.background = {};
                    }
                    currentPreferences.background.value = url;
                    
                    // 先清除旧的背景图，避免加载失败时显示旧图
                    bgImagePreview.style.backgroundImage = '';
                    
                    // 预加载图片，确保URL有效
                    const img = new Image();
                    img.onload = () => {
                        bgImagePreview.style.backgroundImage = `url(${url})`;
                        previewChanges();
                    };
                    img.onerror = () => {
                        console.error('背景图片加载失败:', url);
                        bgImagePreview.style.backgroundImage = '';
                        alert('图片加载失败，请检查URL是否正确');
                    };
                    img.src = url;
                }
            }, 500));
        }
        
        // 背景图片上传
        if (bgImageUpload && bgImagePreview) {
            bgImageUpload.addEventListener('change', () => {
                const file = bgImageUpload.files[0];
                if (file) {
                    // 检查文件类型
                    if (!file.type.startsWith('image/')) {
                        alert('请上传图片文件');
                        return;
                    }
                    
                    // 检查文件大小，限制为5MB
                    if (file.size > 5 * 1024 * 1024) {
                        alert('图片大小不能超过5MB');
                        return;
                    }
                    
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const dataUrl = e.target.result;
                        if (!currentPreferences.background) {
                            currentPreferences.background = {};
                        }
                        currentPreferences.background.value = dataUrl;
                        bgImagePreview.style.backgroundImage = `url(${dataUrl})`;
                        previewChanges();
                    };
                    reader.onerror = () => {
                        alert('图片读取失败，请重试');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
        
        // 渐变颜色1选择
        if (gradientColor1) {
            gradientColor1.addEventListener('input', updateGradient);
        }
        
        // 渐变颜色2选择
        if (gradientColor2) {
            gradientColor2.addEventListener('input', updateGradient);
        }
        
        // 渐变方向选择
        if (gradientDirection) {
            gradientDirection.addEventListener('change', updateGradient);
        }
        
        // 背景模糊度调整
        if (blurRange && blurValue) {
            blurRange.addEventListener('input', () => {
                const blur = blurRange.value;
                blurValue.textContent = `${blur}px`;
                currentPreferences.blur = parseInt(blur);
                previewChanges();
            });
        }
    };
    
    // 更新渐变预览
    const updateGradient = () => {
        if (!gradientColor1 || !gradientColor2 || !gradientDirection || !gradientPreview) {
            return;
        }
        
        const color1 = gradientColor1.value;
        const color2 = gradientColor2.value;
        const direction = gradientDirection.value;
        
        if (gradientColor1Value) gradientColor1Value.textContent = color1;
        if (gradientColor2Value) gradientColor2Value.textContent = color2;
        
        let gradientStyle;
        if (direction === 'circle') {
            gradientStyle = `radial-gradient(circle, ${color1}, ${color2})`;
        } else {
            gradientStyle = `linear-gradient(${direction}, ${color1}, ${color2})`;
        }
        
        gradientPreview.style.background = gradientStyle;
        
        if (!currentPreferences.background) {
            currentPreferences.background = {};
        }
        currentPreferences.background.value = {
            color1,
            color2,
            direction
        };
        
        previewChanges();
    };
    
    // 将当前设置应用到UI
    const applyPreferencesToUI = () => {
        try {
            // 主题选择
            themeOptions.forEach(option => {
                option.classList.toggle('active', option.dataset.theme === currentPreferences.theme);
            });
            
            // 强调色
            if (accentColorPicker && accentColorValue && currentPreferences.accentColor) {
                accentColorPicker.value = currentPreferences.accentColor;
                accentColorValue.textContent = currentPreferences.accentColor;
            }
            
            // 卡片样式
            cardStyleOptions.forEach(option => {
                option.classList.toggle('active', option.dataset.style === currentPreferences.cardStyle);
            });
            
            // 动画开关
            if (animationToggle && currentPreferences.animation !== undefined) {
                animationToggle.checked = currentPreferences.animation;
            }
            
            // 布局选择
            layoutOptions.forEach(option => {
                option.classList.toggle('active', option.dataset.layout === currentPreferences.layout);
            });
            
            // 磁贴布局选择
            tileLayoutOptions.forEach(option => {
                option.classList.toggle('active', option.dataset.tilelayout === currentPreferences.tileLayout);
            });
            
            // 根据当前布局设置磁贴布局选择器显示状态
            const tileLayoutGroup = document.getElementById('tile-layout-group');
            if (tileLayoutGroup && currentPreferences.layout) {
                tileLayoutGroup.style.display = currentPreferences.layout === 'grid' ? 'block' : 'none';
            }
            
            // 背景类型
            if (currentPreferences.background && currentPreferences.background.type) {
                bgTypeOptions.forEach(option => {
                    option.classList.toggle('active', option.dataset.type === currentPreferences.background.type);
                });
                
                // 隐藏所有背景选项
                bgOptions.forEach(o => o.classList.remove('active'));
                
                // 显示对应的背景选项
                if (currentPreferences.background.type !== 'default') {
                    const bgOption = document.getElementById(`bg-${currentPreferences.background.type}-option`);
                    if (bgOption) {
                        bgOption.classList.add('active');
                    }
                }
                
                // 根据背景类型设置相应的值
                if (currentPreferences.background.value) {
                    switch (currentPreferences.background.type) {
                        case 'color':
                            if (bgColorPicker && bgColorValue) {
                                bgColorPicker.value = currentPreferences.background.value || '#f5f5f5';
                                bgColorValue.textContent = bgColorPicker.value;
                            }
                            break;
                            
                        case 'image':
                            if (bgImageUrl && bgImagePreview) {
                                // 只有当值不是data:URL时才设置输入框
                                if (typeof currentPreferences.background.value === 'string') {
                                    bgImageUrl.value = currentPreferences.background.value.startsWith('data:') ? '' : currentPreferences.background.value;
                                    bgImagePreview.style.backgroundImage = `url(${currentPreferences.background.value})`;
                                }
                            }
                            break;
                            
                        case 'gradient':
                            if (typeof currentPreferences.background.value === 'object' && 
                                gradientColor1 && gradientColor2 && gradientDirection) {
                                const { color1, color2, direction } = currentPreferences.background.value;
                                gradientColor1.value = color1 || '#4a6cf7';
                                gradientColor2.value = color2 || '#6a3093';
                                gradientDirection.value = direction || 'to right';
                                
                                if (gradientColor1Value) gradientColor1Value.textContent = gradientColor1.value;
                                if (gradientColor2Value) gradientColor2Value.textContent = gradientColor2.value;
                                
                                updateGradient();
                            }
                            break;
                    }
                }
            }
            
            // 背景模糊度
            if (blurRange && blurValue && currentPreferences.blur !== undefined) {
                blurRange.value = currentPreferences.blur || 0;
                blurValue.textContent = `${blurRange.value}px`;
            }
        } catch (error) {
            console.error('应用设置到UI时出错:', error);
        }
    };
    
    // 预览更改
    const previewChanges = () => {
        applyPreferencesToPage();
    };
    
    // 将当前设置应用到页面
    const applyPreferencesToPage = () => {
        try {
            const root = document.documentElement;
            
            // 应用强调色
            if (currentPreferences.accentColor) {
                root.style.setProperty('--accent-color', currentPreferences.accentColor);
            }
            
            // 应用卡片样式
            if (currentPreferences.cardStyle) {
                document.body.classList.remove('card-default', 'card-rounded', 'card-flat', 'card-bordered');
                document.body.classList.add(`card-${currentPreferences.cardStyle}`);
            }
            
            // 应用动画设置
            if (currentPreferences.animation !== undefined) {
                document.body.classList.toggle('no-animations', !currentPreferences.animation);
            }
            
            // 应用布局设置
            if (currentPreferences.layout) {
                document.body.classList.remove('layout-grid', 'layout-list');
                document.body.classList.add(`layout-${currentPreferences.layout}`);
            }
            
            // 应用磁贴布局设置
            if (currentPreferences.tileLayout) {
                document.documentElement.style.setProperty('--tiles-per-row', currentPreferences.tileLayout);
                
                // 更新磁贴容器的列数
                const bookmarksContainer = document.getElementById('bookmarks-container');
                if (bookmarksContainer && document.body.classList.contains('layout-grid')) {
                    // 应用过渡效果
                    applyTileTransitions(bookmarksContainer);
                    
                    let columns;
                    // 根据不同的屏幕尺寸设置不同的列数
                    if (window.innerWidth >= 1025) {
                        // 电脑端
                        columns = currentPreferences.tileLayout;
                    } else if (window.innerWidth >= 768 && window.innerWidth <= 1024) {
                        // 平板端 - 最多2列
                        columns = Math.min(2, currentPreferences.tileLayout);
                    } else {
                        // 手机端 - 固定1列
                        columns = 1;
                    }
                    
                    // 应用布局变化动画
                    applyTileLayoutChange(bookmarksContainer, columns);
                }
            }
        } catch (error) {
            console.error('应用设置到页面时出错:', error);
        }
    };
    
    return {
        initialize,
        updateThemeState,
        applyPreferencesToUI: applyPreferencesToUI,
        applyPreferencesToPage: applyPreferencesToPage,
        previewChanges: previewChanges
    };
})();