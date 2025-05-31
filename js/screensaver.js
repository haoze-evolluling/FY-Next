/**
 * 屏保时钟模块
 */
const Screensaver = (function() {
    // 配置参数
    const IDLE_TIME = 10000; // 10秒无操作触发
    const PARTICLES_COUNT = 30; // 粒子数量
    
    // 变量
    let idleTimer;
    let screensaverElem;
    let clockElem;
    let dateElem;
    let particlesContainer;
    let isScreensaverActive = false;
    let timeUpdateInterval; // 添加时间更新定时器变量
    
    // 初始化
    const initialize = () => {
        // 创建屏保DOM元素
        createScreensaver();
        
        // 设置事件监听
        setupEventListeners();
        
        // 打开网页时立即显示屏保
        showScreensaver();
        
        // 启动空闲检测
        resetIdleTimer();
    };
    
    // 创建屏保DOM元素
    const createScreensaver = () => {
        // 创建主容器
        screensaverElem = document.createElement('div');
        screensaverElem.className = 'screensaver';
        
        // 创建时钟容器
        const clockContainer = document.createElement('div');
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
        // 鼠标移动
        document.addEventListener('mousemove', handleUserActivity);
        
        // 点击
        document.addEventListener('click', handleUserActivity);
        
        // 触摸
        document.addEventListener('touchstart', handleUserActivity);
        
        // 键盘
        document.addEventListener('keydown', handleUserActivity);
    };
    
    // 处理用户活动
    const handleUserActivity = () => {
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
        
        // 显示屏保
        screensaverElem.classList.add('active');
        isScreensaverActive = true;
    };
    
    // 隐藏屏保
    const hideScreensaver = () => {
        screensaverElem.classList.remove('active');
        isScreensaverActive = false;
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
        initialize
    };
})(); 