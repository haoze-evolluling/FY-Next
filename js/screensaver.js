/**
 * 屏保时钟模块
 */
const Screensaver = (function() {
    // 配置参数
    const IDLE_TIME = 10000; // 10秒无操作触发
    const PARTICLES_COUNT = 30; // 粒子数量
    
    // 变量
    let idleTimer = null; // 修改为模块内部变量，而不是全局变量
    let screensaverElem;
    let clockElem;
    let dateElem;
    let particlesContainer;
    let clockContainer;
    let isScreensaverActive = false;
    let timeUpdateInterval; // 添加时间更新定时器变量
    let contentContainer; // 主内容容器
    
    // 初始化
    const initialize = () => {
        // 创建屏保DOM元素
        createScreensaver();
        
        // 获取主内容容器
        contentContainer = document.querySelector('.container');
        
        // 设置事件监听
        setupEventListeners();
        
        // 启动空闲检测
        resetIdleTimer();
    };
    
    // 创建屏保DOM元素
    const createScreensaver = () => {
        // 创建主容器
        screensaverElem = document.createElement('div');
        screensaverElem.className = 'screensaver';
        
        // 创建时钟容器
        clockContainer = document.createElement('div');
        clockContainer.className = 'clock-container';
        
        // 创建时钟元素
        clockElem = document.createElement('div');
        clockElem.className = 'clock';
        
        // 创建日期元素
        dateElem = document.createElement('div');
        dateElem.className = 'date';
        
        // 创建粒子容器
        particlesContainer = document.createElement('div');
        particlesContainer.className = 'clock-particles';
        
        // 添加粒子效果
        createParticles();
        
        // 组合DOM结构
        clockContainer.appendChild(clockElem);
        clockContainer.appendChild(dateElem);
        clockContainer.appendChild(particlesContainer);
        screensaverElem.appendChild(clockContainer);
        
        // 添加到文档
        document.body.appendChild(screensaverElem);
        
        // 添加点击屏保时钟时也退出屏保的功能
        clockContainer.addEventListener('click', hideScreensaver);
    };
    
    // 创建粒子效果
    const createParticles = () => {
        for (let i = 0; i < PARTICLES_COUNT; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // 随机位置
            particle.style.top = `${Math.random() * 200 - 100}px`;
            particle.style.left = `${Math.random() * 200 - 100}px`;
            
            // 随机大小
            const size = Math.random() * 4 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // 随机动画延迟
            particle.style.animationDelay = `${Math.random() * 5}s`;
            
            // 随机动画持续时间
            particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
            
            particlesContainer.appendChild(particle);
        }
    };
    
    // 设置事件监听
    const setupEventListeners = () => {
        // 鼠标移动 - 单独处理鼠标移动事件
        document.addEventListener('mousemove', handleMouseMove);
        
        // 点击 - 点击事件需要特殊处理，避免点击时钟区域时触发
        document.addEventListener('click', handleClickActivity);
        
        // 触摸
        document.addEventListener('touchstart', handleUserActivity);
        
        // 键盘
        document.addEventListener('keydown', handleUserActivity);
        
        // 窗口失焦时也显示屏保
        window.addEventListener('blur', () => {
            // 检查是否有确认对话框或警告框打开
            // 如果有对话框打开，则不触发屏保
            if (document.hasFocus() === false && !document.querySelector('dialog[open]')) {
                // 使用setTimeout延迟检测，因为confirm对话框会暂时导致失焦
                setTimeout(() => {
                    // 再次检查，如果仍然失焦，则显示屏保
                    if (document.hasFocus() === false) {
                        showScreensaver();
                    }
                }, 500);
            }
        });
        
        // 窗口尺寸变化时调整粒子位置
        window.addEventListener('resize', () => {
            if (isScreensaverActive) {
                updateParticlesPosition();
            }
        });
        
        // 监听主题变化事件
        document.addEventListener('themeChange', (e) => {
            if (isScreensaverActive) {
                // 更新时钟的主题样式
                updateClockTheme(e.detail.theme);
            }
        });
    };
    
    // 更新时钟主题样式
    const updateClockTheme = (theme) => {
        if (clockContainer) {
            if (theme === 'dark') {
                clockContainer.classList.add('dark-theme');
                clockContainer.classList.remove('light-theme');
            } else {
                clockContainer.classList.add('light-theme');
                clockContainer.classList.remove('dark-theme');
            }
        }
    };
    
    // 更新粒子位置
    const updateParticlesPosition = () => {
        const particles = particlesContainer.querySelectorAll('.particle');
        particles.forEach(particle => {
            particle.style.top = `${Math.random() * 200 - 100}px`;
            particle.style.left = `${Math.random() * 200 - 100}px`;
        });
    };
    
    // 处理鼠标移动事件 - 始终允许鼠标移动退出屏保
    const handleMouseMove = (e) => {
        if (isScreensaverActive) {
            hideScreensaver();
        }
        resetIdleTimer();
    };
    
    // 处理点击事件 - 只有在点击屏保以外的区域才触发退出
    const handleClickActivity = (e) => {
        // 如果事件来自屏保元素本身，则不触发退出
        if (e && e.target && screensaverElem.contains(e.target)) {
            return;
        }
        
        if (isScreensaverActive) {
            hideScreensaver();
        }
        resetIdleTimer();
    };
    
    // 处理用户活动（通用处理函数，用于触摸和键盘事件）
    const handleUserActivity = (e) => {
        if (isScreensaverActive) {
            hideScreensaver();
        }
        resetIdleTimer();
    };
    
    // 重置空闲计时器
    const resetIdleTimer = () => {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(showScreensaver, IDLE_TIME);
    };
    
    // 显示屏保
    const showScreensaver = () => {
        if (isScreensaverActive) return;
        
        // 更新时间
        updateTime();
        
        // 设置定时更新时间，并确保清除之前的定时器
        clearInterval(timeUpdateInterval);
        timeUpdateInterval = setInterval(updateTime, 1000);
        
        // 隐藏主内容
        if (contentContainer) {
            contentContainer.classList.add('content-hidden');
        }
        
        // 为时钟容器添加入场动画
        clockContainer.style.opacity = '0';
        
        // 显示屏保元素
        screensaverElem.style.display = 'flex';
        
        // 触发重排后添加活动类
        setTimeout(() => {
            screensaverElem.classList.add('active');
            clockContainer.style.opacity = '1';
        }, 10);
        
        isScreensaverActive = true;
        
        // 设置正确的主题
        if (typeof ThemeManager !== 'undefined') {
            updateClockTheme(ThemeManager.getCurrentTheme());
        }
    };
    
    // 隐藏屏保
    const hideScreensaver = () => {
        if (!isScreensaverActive) return;
        
        // 停止时间更新
        clearInterval(timeUpdateInterval);
        
        // 移除活动类
        screensaverElem.classList.remove('active');
        
        // 恢复主内容显示
        if (contentContainer) {
            contentContainer.classList.remove('content-hidden');
        }
        
        // 等待过渡效果完成后隐藏元素
        setTimeout(() => {
            screensaverElem.style.display = 'none';
        }, 500);
        
        isScreensaverActive = false;
        
        // 重置空闲计时器
        resetIdleTimer();
    };
    
    // 更新时间
    const updateTime = () => {
        const now = new Date();
        
        // 更新时钟
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        clockElem.textContent = `${hours}:${minutes}:${seconds}`;
        
        // 更新日期
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElem.textContent = now.toLocaleDateString('zh-CN', options);
    };
    
    // 公开API
    return {
        initialize,
        showScreensaver,
        hideScreensaver
    };
})(); 