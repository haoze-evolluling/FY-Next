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
            
            // 设置事件监听器
            setupEventListeners();
            
            // 应用当前设置到界面
            applyPreferencesToUI();
            
            // 应用当前设置到页面
            applyPreferencesToPage();
            
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
                const theme = option.dataset.theme;
                themeOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                currentPreferences.theme = theme;
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
                previewChanges();
            });
        });
        
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
            
            // 应用背景设置
            const container = document.querySelector('.container');
            if (container && currentPreferences.blur !== undefined) {
                container.style.backdropFilter = `blur(${currentPreferences.blur}px)`;
                container.style.webkitBackdropFilter = `blur(${currentPreferences.blur}px)`; // Safari 支持
            }
            
            if (currentPreferences.background && currentPreferences.background.type) {
                switch (currentPreferences.background.type) {
                    case 'default':
                        document.body.style.background = '';
                        document.body.style.backgroundImage = '';
                        document.body.style.backgroundColor = '';
                        break;
                        
                    case 'color':
                        if (currentPreferences.background.value) {
                            document.body.style.background = '';
                            document.body.style.backgroundImage = '';
                            document.body.style.backgroundColor = currentPreferences.background.value;
                        }
                        break;
                        
                    case 'image':
                        if (currentPreferences.background.value) {
                            document.body.style.background = '';
                            document.body.style.backgroundColor = '';
                            document.body.style.backgroundImage = `url(${currentPreferences.background.value})`;
                            document.body.style.backgroundSize = 'cover';
                            document.body.style.backgroundPosition = 'center';
                            document.body.style.backgroundAttachment = 'fixed';
                            document.body.style.backgroundRepeat = 'no-repeat';
                        }
                        break;
                        
                    case 'gradient':
                        if (typeof currentPreferences.background.value === 'object') {
                            const { color1, color2, direction } = currentPreferences.background.value;
                            if (color1 && color2 && direction) {
                                document.body.style.backgroundColor = '';
                                document.body.style.backgroundImage = '';
                                
                                if (direction === 'circle') {
                                    document.body.style.background = `radial-gradient(circle, ${color1}, ${color2})`;
                                } else {
                                    document.body.style.background = `linear-gradient(${direction}, ${color1}, ${color2})`;
                                }
                            }
                        }
                        break;
                }
            }
            
            // 应用主题设置
            applyTheme(currentPreferences.theme);
        } catch (error) {
            console.error('应用设置到页面时出错:', error);
        }
    };
    
    // 应用主题设置
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else if (theme === 'light') {
            document.body.classList.remove('dark-mode');
        } else {
            // 自动模式，根据系统偏好设置
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.body.classList.toggle('dark-mode', prefersDarkMode);
            
            // 监听系统主题变化
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                document.body.classList.toggle('dark-mode', e.matches);
            });
        }
    };
    
    // 保存设置
    const savePreferences = () => {
        try {
            Storage.updatePreferences(currentPreferences);
            closeModal(preferencesModal);
            
            // 应用主题设置
            applyTheme(currentPreferences.theme);
            
            // 显示保存成功提示
            showToast('设置已保存');
        } catch (error) {
            console.error('保存设置时出错:', error);
            showToast('保存设置失败', 'error');
        }
    };
    
    // 重置设置
    const resetPreferences = () => {
        if (confirm('确定要重置所有个性化设置吗？这将恢复默认设置。')) {
            try {
                currentPreferences = Storage.resetPreferences();
                applyPreferencesToUI();
                applyPreferencesToPage();
                showToast('已恢复默认设置');
            } catch (error) {
                console.error('重置设置时出错:', error);
                showToast('重置设置失败', 'error');
            }
        }
    };
    
    // 打开模态框
    const openModal = (modal) => {
        if (modal) {
            modal.classList.add('active');
            // 重新应用设置到UI，确保显示最新设置
            applyPreferencesToUI();
        }
    };
    
    // 关闭模态框
    const closeModal = (modal) => {
        if (modal) {
            modal.classList.remove('active');
        }
    };
    
    // 显示提示消息
    const showToast = (message, type = 'success') => {
        // 检查是否已有toast元素
        let toast = document.getElementById('preferences-toast');
        
        // 如果没有则创建
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'preferences-toast';
            document.body.appendChild(toast);
        }
        
        // 设置消息和类型
        toast.textContent = message;
        toast.className = `toast ${type}`;
        
        // 显示toast
        toast.classList.add('show');
        
        // 3秒后隐藏
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };
    
    // 防抖函数
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };
    
    // 公开API
    return {
        initialize
    };
})(); 