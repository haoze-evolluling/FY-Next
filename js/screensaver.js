/**
 * 屏保时钟模块
 */
const Screensaver = (function() {
    // 配置参数
    const IDLE_TIME = 10000; // 10秒无操作触发
    const PARTICLES_COUNT = 30; // 粒子数量
    
    // 变量
    // 将 idleTimer 设置为全局变量
    window.idleTimer = null;
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
        
        // 移除首次自动显示屏保的功能
        // showScreensaver();
        
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
        clearTimeout(window.idleTimer);
        window.idleTimer = setTimeout(showScreensaver, IDLE_TIME);
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
        clockContainer.style.transform = 'scale(0.9)';
        
        // 显示屏保
        screensaverElem.classList.add('active');
        
        // 延迟一下再显示时钟容器，产生平滑过渡效果
        setTimeout(() => {
            clockContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            clockContainer.style.opacity = '1';
            clockContainer.style.transform = 'scale(1)';
        }, 300);
        
        isScreensaverActive = true;
    };
    
    // 隐藏屏保
    const hideScreensaver = () => {
        // 如果屏保未激活，则直接返回
        if (!isScreensaverActive) return;
        
        // 为时钟容器添加退场动画
        clockContainer.style.opacity = '0';
        clockContainer.style.transform = 'scale(0.9)';
        
        // 延迟一下再隐藏屏保，让动画有时间完成
        setTimeout(() => {
            screensaverElem.classList.remove('active');
            
            // 显示主内容
            if (contentContainer) {
                contentContainer.classList.remove('content-hidden');
            }
            
            isScreensaverActive = false;
        }, 300);
    };
    
    // 更新时间显示
    const updateTime = () => {
        const now = new Date();
        
        // 时间格式化
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        
        // 日期格式化
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const weekDay = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][now.getDay()];
        
        // 更新DOM
        clockElem.textContent = `${hours}:${minutes}:${seconds}`;
        dateElem.textContent = `${year}年${month}月${day}日 ${weekDay}`;
    };
    
    // 公开API
    return {
        initialize,
        resetIdleTimer  // 暴露重置计时器函数
    };
})(); 