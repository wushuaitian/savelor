<template>
    <div class="home">
        <!-- 介绍 -->
        <div class="introduc introduc-one bg-img">
            <div>
                <div class="introduc-title text-bold-600">核查5大核心风险维度，提供决策事实依据</div>
                <div class="introduc-text-one p-t-50 text-18 text-bold-600 text-center w-p-40 m-auto">
                    基于官方数据源，快速识别美国公司的制裁、诉讼及合规状态
                    为您的商业决策提供事实依据。</div>
                <div class="flex m-auto align-center justify-center p-t-50">
                    <div class="enter b-r-40 m-r-30" @click="generateReport">生成报告</div>
                    <div class="view-report b-r-40" @click="downloadReport">下载完整样本报告</div>
                </div>
            </div>
        </div>
        <div class="introduc introduc-two bg-img">
            <div class="introduc-two-container">
                <h2 class="introduc-two-title text-bold-600">为什么使用SAVEIOR?</h2>
                <div class="feature-grid">
                    <div class="feature-card">
                        <h3 class="feature-title text-bold-600">官方数据源</h3>
                        <p class="feature-desc">直接对接OFAC、BIS、SEC及各州政府等权威数据库，确保信息准确可追溯。</p>
                    </div>
                    <div class="feature-card">
                        <h3 class="feature-title text-bold-600">分钟级报告</h3>
                        <p class="feature-desc">将传统耗时数日的尽调压缩至5-10分钟，自动化生成结构化报告。</p>
                    </div>
                    <div class="feature-card">
                        <h3 class="feature-title text-bold-600">专业输出</h3>
                        <p class="feature-desc">报告格式清晰规范，可直接用于尽调文件、内部决策或规合规备案。</p>
                    </div>
                    <div class="feature-card">
                        <h3 class="feature-title text-bold-600">成本可控</h3>
                        <p class="feature-desc">按需使用，定价透明。</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="introduc introduc-three">
            <div class="carousel-container">
                <!-- 左侧展示图片 -->
                <div class="carousel-image">
                    <img :src="currentDisplayImage" alt="展示图片" />
                </div>

                <!-- 中间轮播点 -->
                <div class="carousel-dots">
                    <div v-for="(item, index) in carouselItems" :key="index" class="carousel-dot"
                        :class="{ active: currentSlide === index }" @click="goToSlide(index)"></div>
                </div>

                <!-- 右侧步骤说明 -->
                <div class="carousel-steps">
                    <div v-for="(item, index) in carouselItems" :key="index" class="step-item"
                        @click="goToSlide(index)">
                        <div class="step-icon">
                            <img :src="currentSlide === index ? item.selectedIcon : item.icon" :alt="item.title" />
                        </div>
                        <div class="step-text" :class="{ selected: currentSlide === index }">
                            {{ item.title }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="introduc introduc-four">
            <div class="four-content">
                <div class="four-title text-bold-600 text-40">停止猜测，开始核查</div>
                <div class="four-text text-bold-600 text-28">您的下一个商业决策值得更清晰的依据和更充足的信心。</div>
                <div class="four-button" @click="generateReport">生成报告</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus'


const emit = defineEmits(['spaceCreated']);
const currentTab = ref('ip');

// 轮播图数据
const carouselItems = [
    {
        displayImage: '/img/one-display.png',
        icon: '/img/one.png',
        selectedIcon: '/img/one-selected.png',
        title: '输入公司信息'
    },
    {
        displayImage: '/img/two-display.png',
        icon: '/img/two.png',
        selectedIcon: '/img/two-selected.png',
        title: '选择报告类型'
    },
    {
        displayImage: '/img/three-display.png',
        icon: '/img/three.png',
        selectedIcon: '/img/three-selected.png',
        title: '生成选定报告'
    }
];

// 当前幻灯片索引
const currentSlide = ref(0);
// 轮播定时器
const carouselTimer = ref(null);

// 当前展示的图片
const currentDisplayImage = computed(() => {
    return carouselItems[currentSlide.value].displayImage;
});

// 切换到指定幻灯片
const goToSlide = (index) => {
    currentSlide.value = index;
};

// 下一张幻灯片
const nextSlide = () => {
    currentSlide.value = (currentSlide.value + 1) % carouselItems.length;
};

// 启动自动轮播
const startAutoPlay = () => {
    carouselTimer.value = window.setInterval(() => {
        nextSlide();
    }, 4000); // 每4秒切换一次
};

// 停止自动轮播
const stopAutoPlay = () => {
    if (carouselTimer.value) {
        clearInterval(carouselTimer.value);
        carouselTimer.value = null;
    }
};

const generateReport = () => {
    emit('spaceCreated', '', 'ReviewSpace');
};
const downloadReport = () => {
    ElMessage.warning('目前没有完整样本报告,请敬请期待！');
};

onMounted(() => {
    // 确保组件完全挂载后再执行任何可能影响 DOM 的操作
    console.log('Home page mounted');
    // 启动自动轮播
    startAutoPlay();
});

onUnmounted(() => {
    // 组件卸载时清除定时器
    stopAutoPlay();
});
</script>

<style scoped lang="scss">
.home {
    height: auto;
    font-size: 20px;
    color: #333;
    font-family: PingFangSC, PingFang SC;
}

.introduc {
    width: 100%;
    height: calc(100vh - 100px);
    color: #1D2129;
}

.introduc-one {
    background-image: url('/img/introduc-one.png');
    display: flex;
    align-items: center;
    justify-content: center;

    >div {
        width: 100%;
        max-width: 1200px;
    }

    .introduc-title {
        margin: auto;
        width: 70%;
        text-align: center;
        font-size: 60px;
    }

    .enter {
        color: #fff;
        padding: 10px 30px;
        background-color: #1D2129;
    }

    .view-report {
        padding: 10px 30px;
        border: 2px solid #1D2129;
    }
}

.introduc-two {
    background-image: url('/img/introduc-two.png');
    background-color: #F5F6FA;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;

    .introduc-two-container {
        width: 100%;
        max-width: 80%;
    }

    .introduc-two-title {
        font-size: 48px;
        color: #1D2129;
        text-align: center;
        margin-bottom: 80px;
    }

    .feature-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 40px 60px;
    }

    .feature-card {
        border-radius: 16px;
        padding: 20px;
        height: 20vh;
        background: rgba(255, 255, 255, 0.62);
        transition: transform 0.3s ease, box-shadow 0.3s ease;

        &:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }
    }

    .feature-title {
        font-size: 24px;
        color: #1D2129;
        margin-bottom: 20px;
    }

    .feature-desc {
        font-size: 16px;
        color: #4E5969;
        line-height: 1.6;
        margin: 0;
    }
}

.introduc-three {
    height: calc(100vh - 100px);
    background: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .carousel-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 100px;

        // 左侧展示图片
        .carousel-image {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
                width: 100%;
                height: 843px;
                object-fit: contain;
            }
        }

        // 中间轮播点
        .carousel-dots {
            display: flex;
            flex-direction: column;
            gap: 16px;

            .carousel-dot {
                width: 14px;
                height: 14px;
                border-radius: 7px;
                background: #E9EBFC;
                cursor: pointer;
                transition: all 0.3s ease;

                &.active {
                    width: 14px;
                    height: 34px;
                    background: #2134DE;
                    border-radius: 7px;
                }

                &:hover:not(.active) {
                    background: #C8CBF0;
                }
            }
        }

        // 右侧步骤说明
        .carousel-steps {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 40px;

            .step-item {
                display: flex;
                align-items: center;
                gap: 20px;
                cursor: pointer;
                transition: transform 0.2s ease;

                &:hover {
                    transform: translateX(5px);
                }

                .step-icon {
                    width: 48px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                    }
                }

                .step-text {
                    width: 240px;
                    height: 56px;
                    font-family: PingFangSC, PingFang SC;
                    font-weight: 600;
                    font-size: 30px;
                    color: #6B7684;
                    line-height: 56px;
                    text-align: left;
                    font-style: normal;
                    transition: color 0.3s ease;

                    &.selected {
                        color: #1D2129;
                    }
                }
            }
        }
    }
}

.introduc-four {
    height: calc(100vh - 100px);
    background: linear-gradient(180deg, #FFFFFF 0%, #F2F3FD 100%);

    .four-content {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;

        .four-title {
            margin-bottom: 20px;
        }

        .four-text {
            color: #6B7684;
            margin-bottom: 30px;
            max-width: 800px;
        }

        .four-button {
            padding: 15px 50px;
            color: #FFFFFF;
            background: linear-gradient(126deg, #5690FF 0%, #2B57FF 100%);
            border-radius: 50px;
            font-size: 15px;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(43, 87, 255, 0.3);
            }
        }
    }
}

.audience {
    padding-top: 100px;

    .audience-tab {
        width: 50%;
        margin: auto;
        height: 50px;
        background: #F8F8FF;
        border-radius: 40px;

        .tab-text {
            padding: 5px 20px;
            border-radius: 27px;
            color: #1D2129;
        }
    }

    .active-tab {
        color: #2134DE !important;
        background-color: #E3E3FF;
    }

    .audience-content {}
}
</style>