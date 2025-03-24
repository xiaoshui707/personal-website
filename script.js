// 获取页面容器
const pageWrapper = document.querySelector('.page-wrapper');
// 获取主界面内容
const mainContent = document.querySelector('.main-content');
// 获取主界面遮罩层
const overlay = document.querySelector('.overlay');

// 添加平滑滚动
let isTransitioning = false;
let isInMainSection = false; // 添加一个标记来记录当前所在部分

// 添加一个变量来跟踪弹窗状态
let isModalOpen = false;

// 使用wheel事件替代scroll事件
window.addEventListener('wheel', (e) => {
    // 如果弹窗打开，直接返回，不处理任何滚轮事件
    if (isModalOpen) {
        e.preventDefault();
        return;
    }

    if (isTransitioning) return;
    
    const mainSection = document.querySelector('.main-section');
    const simpleVersionBtn = document.querySelector('.simple-version-btn');
    
    // 在welcome部分时，只响应向下滚动
    if (!isInMainSection && e.deltaY < 0) return;
    
    // 在主体部分时，只响应向上滚动
    if (isInMainSection && e.deltaY > 0) return;
    
    isTransitioning = true;
    
    if (e.deltaY > 0 && !isInMainSection) { // 向下滚动到主体部分
        mainSection.style.transform = 'translateY(-100vh)';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        mainContent.style.opacity = '1';
        // 延迟显示简洁版按钮
        setTimeout(() => {
            simpleVersionBtn.style.opacity = '1';
            simpleVersionBtn.style.pointerEvents = 'auto';
        }, 1000); // 这里的800ms可以调整，表示滚动完成后多久显示按钮
        isInMainSection = true;
        
        // 确保info面板可见
        const infoContent = document.getElementById('info');
        if (infoContent) {
            infoContent.style.display = 'block';
            infoContent.style.opacity = '1';
            infoContent.classList.add('active');
        }
        
    } else if (e.deltaY < 0 && isInMainSection) { // 向上滚动到welcome部分
        mainSection.style.transform = 'translateY(0)';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        mainContent.style.opacity = '0';
        simpleVersionBtn.style.opacity = '0';
        simpleVersionBtn.style.pointerEvents = 'none';
        isInMainSection = false;
        
        // 重置所有内容面板的状态
        setTimeout(() => {
            const contents = document.querySelectorAll('.content');
            contents.forEach(content => {
                content.style.display = 'none';
                content.style.opacity = '0';
                content.classList.remove('active');
            });
            
            // 重置为默认显示个人信息
            const infoContent = document.getElementById('info');
            if (infoContent) {
                infoContent.classList.add('active');
            }
            
            // 重置按钮状态
            const buttons = document.querySelectorAll('.button');
            buttons.forEach(btn => btn.classList.remove('active'));
            const infoButton = document.querySelector('.button[data-target="info"]');
            if (infoButton) {
                infoButton.classList.add('active');
            }
        }, 300);
    }
    
    setTimeout(() => {
        isTransitioning = false;
    }, 800);
});

// 添加触摸支持
let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});

window.addEventListener('touchmove', (e) => {
    if (isTransitioning) return;
    
    const touchCurrentY = e.touches[0].clientY;
    const deltaY = touchStartY - touchCurrentY;
    
    // 添加相同的方向限制逻辑
    if (!isInMainSection && deltaY < 0) return;
    if (isInMainSection && deltaY > 0) return;
    
    if (Math.abs(deltaY) > 50) {
        isTransitioning = true;
        const mainSection = document.querySelector('.main-section');
        
        if (deltaY > 0) {
            mainSection.style.transform = 'translateY(-100vh)';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            mainContent.style.opacity = '1';
            scrollHint.classList.add('hidden');
        } else {
            mainSection.style.transform = 'translateY(0)';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
            mainContent.style.opacity = '0';
            scrollHint.classList.remove('hidden');
        }
        
        setTimeout(() => {
            isTransitioning = false;
        }, 800);
    }
});

// 获取所有按钮
const buttons = document.querySelectorAll('.button');
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const target = button.dataset.target;
        
        // 移除所有活动状态
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // 获取当前显示的内容和目标内容
        const currentContent = document.querySelector('.content.active');
        const targetContent = document.getElementById(target);
        
        if (currentContent === targetContent) return;

        // 设置过渡效果
        targetContent.style.display = 'block';
        targetContent.style.opacity = '0';
        
        // 强制重排
        targetContent.offsetHeight;
        
        // 淡出当前内容
        if (currentContent) {
            currentContent.style.opacity = '0';
            setTimeout(() => {
                currentContent.style.display = 'none';
                currentContent.classList.remove('active');
            }, 300);
        }
        
        // 淡入新内容
        setTimeout(() => {
            targetContent.style.opacity = '1';
            targetContent.classList.add('active');
        }, 50);
    });
});

// 打字机效果的文本内容
const text = `奋进与拼搏，坚持与突破，
日夜兼程，梦想之途。
勤勤恳恳者出彩，兢兢业业者登峰。
汗水之中，闪耀着希望的曙光，
欢迎来到D市——打工人。
我是D市的蒋蕊`;

// 打字机效果实现
function typeWriter(element, text, speed = 100) {
    let lines = text.split('\n');
    let lineIndex = 0;
    let charIndex = 0;
    
    function type() {
        if (lineIndex < lines.length) {
            if (charIndex < lines[lineIndex].length) {
                element.textContent += lines[lineIndex][charIndex];
                charIndex++;
                setTimeout(type, speed);
            } else {
                element.textContent += '\n';
                lineIndex++;
                charIndex = 0;
                setTimeout(type, speed * 2); // 换行时稍微停顿长一点
            }
        }
    }
    
    type();
}

// 页面加载后开始打字效果
document.addEventListener('DOMContentLoaded', () => {
    const typewriterElement = document.querySelector('.typewriter');
    typeWriter(typewriterElement, text, 100);

    // 确保info面板初始可见
    const infoContent = document.getElementById('info');
    if (infoContent) {
        infoContent.style.display = 'block';
        infoContent.style.opacity = '1';
    }
});

// 控制箭头显示隐藏
const scrollHint = document.querySelector('.scroll-hint');

// 作品集数据
const workData = {
    1: {
        title: "Move To Heaven",
        content: `
            <p>作为"游戏引导对玩家体验影响"的载体，自主研发冒险解谜类游戏Demo（体量：30分钟核心体验流程），通过实验验证引导系统对用户体验的量化影响。项目完整涵盖游戏设计文撰写、技术原型开发（基于Unity）、美术资源（动画、建模等）制作及用户测试全流程。</p>
            <div class="video-container">
                <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/LtqN0A9VAwU"
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>
        `
    },
    2: {
        title: "Story of Waste Recycling",
        content: `
            <p>一款经营游戏demo。在这款游戏中，玩家将扮演一位垃圾处理厂的老板来经营一个垃圾场。玩家的任务是让垃圾场获利并在其中达成不同的成就。在游戏设计时，增添了许多小游戏，增加游戏可玩性和用户粘性。</p>
            <div class="video-container">
                <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/J6nrvsAxXEE"
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>
        `
    },
    3: {
        title: "Chaotic Wedding Party",
        content: `
            <p>这是一个类三国杀的桌游项目，旨在让玩家在游戏过程中体验"婚闹"的社会现象。通过机制叙事耦合设计，构建社会观察实验场域，模拟传统婚俗场景中的群体行为博弈。</p>
            <div class="video-container">
                <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/CdztTmTwB04"
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>
        `
    },
    4: {
        title: "夜间陪伴地毯",
        content: `
            <p>这是一个专为"有夜起、早醒烦恼"老人设计的智能地毯+APP项目。在考虑到不侵犯老人的尊严的情况下，记录老年人夜间的睡眠状态，辅助老年人睡眠，同时通过app的连接，增加老年人和子女之间的情感纽带。</p>
            <div class="image-container">
                <img src="asset/image1.png" alt="作品4图片1" class="gallery-image">
                <div class="image-count">6</div>
            </div>
        `,
        images: [
            'asset/image1.png',
            'asset/image2.png',
            'asset/image3.png',
            'asset/image4.png',
            'assetimage5.png',
            'asset/image6.png'
        ]
    },
    5: {
        title: "城市屋顶菜园",
        content: `
            <p>这是一个以"带给城市更多绿色"为目的展开的APP设计与产品设计项目。通过设计一款集易用性和可玩性于一体的app，加上app附带的产品奖励机制，让用户愿意参与到"城市屋顶菜园"活动中来。</p>
            <div class="image-container">
                <img src="asset/image7.png" alt="作品5图片1" class="gallery-image">
                <div class="image-count">5</div>
            </div>
        `,
        images: [
            'asset/image7.png',
            'asset/image8.png',
            'asset/image9.png',
            'asset/image10.png',
            'asset/image11.png'
        ]
    },
    6: {
        title: "预制菜背后",
        content: `
            <p>在这个项目中，我设计并建模了一个互动装置模型，以此来讽刺"预制菜泛滥"的现象，我希望通过数字化的互动，让人们更直观地意识到这一现象，从而关注这一现象背后的食品安全乃至社会形态问题。</p>
            <div class="image-container">
                <img src="asset/image12.png" alt="作品6图片1" class="gallery-image">
                <div class="image-count">4</div>
            </div>
        `,
        images: [
            'asset/image12.png',
            'asset/image13.png',
            'asset/image14.png',
            'asset/image15.png'
           
        ]
    }
};

// 禁用滚轮函数
function disableScroll() {
    document.body.style.overflow = 'hidden';  // 禁用body的滚动
    document.documentElement.style.overflow = 'hidden';  // 禁用html的滚动
}

// 恢复滚轮函数
function enableScroll() {
    document.body.style.overflow = 'auto';  // 恢复body的滚动
    document.documentElement.style.overflow = 'auto';  // 恢复html的滚动
}

// 创建图片查看器
function createImageViewer() {
    const viewer = document.createElement('div');
    viewer.className = 'image-viewer';
    viewer.innerHTML = `
        <button class="close-button">&times;</button>
        <button class="nav-button prev-button">&lt;</button>
        <button class="nav-button next-button">&gt;</button>
        <div class="image-counter"></div>
        <img src="" alt="查看图片">
    `;
    document.body.appendChild(viewer);
    return viewer;
}

// 修改弹窗处理部分
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('workModal');
    const modalContent = modal.querySelector('.modal-content');
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');
    const closeBtn = modal.querySelector('.close-modal');
    
    // 创建图片查看器
    const imageViewer = createImageViewer();
    const viewerImg = imageViewer.querySelector('img');
    const prevButton = imageViewer.querySelector('.prev-button');
    const nextButton = imageViewer.querySelector('.next-button');
    const closeButton = imageViewer.querySelector('.close-button');
    const imageCounter = imageViewer.querySelector('.image-counter');
    
    let currentImageIndex = 0;
    let currentImages = [];

    // 打开图片查看器
    function openImageViewer(images, startIndex = 0) {
        currentImages = images;
        currentImageIndex = startIndex;
        updateImageViewer();
        imageViewer.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // 更新图片查看器
    function updateImageViewer() {
        viewerImg.src = currentImages[currentImageIndex];
        imageCounter.textContent = `${currentImageIndex + 1} / ${currentImages.length}`;
    }

    // 上一张图片
    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
        updateImageViewer();
    }

    // 下一张图片
    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % currentImages.length;
        updateImageViewer();
    }

    // 关闭图片查看器
    function closeImageViewer() {
        imageViewer.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // 添加事件监听器
    prevButton.addEventListener('click', (e) => {
        e.stopPropagation();
        prevImage();
    });

    nextButton.addEventListener('click', (e) => {
        e.stopPropagation();
        nextImage();
    });

    closeButton.addEventListener('click', closeImageViewer);
    imageViewer.addEventListener('click', closeImageViewer);

    // 添加键盘控制
    document.addEventListener('keydown', (e) => {
        if (imageViewer.style.display === 'block') {
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'Escape') closeImageViewer();
        }
    });

    // 打开弹窗
    function openModal(workId) {
        const work = workData[workId];
        modalTitle.textContent = work.title;
        modalBody.innerHTML = work.content;
        modal.style.display = 'block';
        
        // 设置弹窗状态为打开
        isModalOpen = true;
        
        // 禁用所有按钮点击
        document.querySelector('.button-container').style.pointerEvents = 'none';
        // 同时禁用简洁版按钮点击
        const simpleVersionBtn = document.querySelector('.simple-version-btn');
        if (simpleVersionBtn) {
            simpleVersionBtn.style.pointerEvents = 'none';
        }
        
        // 禁用滚轮
        disableScroll();

        // 为图片容器添加点击事件
        const imageContainer = modalBody.querySelector('.image-container');
        if (imageContainer && work.images) {
            imageContainer.addEventListener('click', function() {
                openImageViewer(work.images);
            });
        }
    }

    // 关闭弹窗
    function closeModal() {
        modal.style.display = 'none';
        
        // 设置弹窗状态为关闭
        isModalOpen = false;
        
        // 恢复所有按钮点击
        document.querySelector('.button-container').style.pointerEvents = 'auto';
        // 同时恢复简洁版按钮点击
        const simpleVersionBtn = document.querySelector('.simple-version-btn');
        if (simpleVersionBtn && isInMainSection) { // 只在主体部分时恢复点击
            simpleVersionBtn.style.pointerEvents = 'auto';
        }
        
        // 恢复滚轮
        enableScroll();
    }

    // 点击作品打开弹窗
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            const workId = this.dataset.workId;
            openModal(workId);
        });
    });

    // 关闭按钮点击事件
    closeBtn.addEventListener('click', closeModal);

    // 点击弹窗外部关闭
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // 阻止点击弹窗内容时关闭
    modalContent.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});    