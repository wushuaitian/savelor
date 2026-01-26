<template>
    <div class="home">
        <!-- 介绍 -->
        <div class="introduc introduc-one">
            <div class="introduc-one-container">
                <!-- 左侧内容 -->
                <div class="left-content">
                    <h1 class="main-title text-bold-600">
                        核查5大核心风险维度<br />
                        提供决策事实依据
                    </h1>
                    <p class="sub-title text-bold-600">
                        基于官方数据源，快速识别美国公司的制裁、诉讼及合规状态<br />
                        为您的商业决策提供事实依据。
                    </p>
                    <div class="action-button" @click="generateReport('ReviewSpace')">
                        生成报告
                        <svg class="arrow-icon" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                </div>

                <!-- 右侧轮播卡片 -->
                <div class="right-carousel">
                    <div class="carousel-track"
                        :style="{ transform: `translateX(-${currentCardIndex * (100 / visibleCards)}%)` }">
                        <div v-for="(card, index) in dataCards" :key="index" class="data-card">
                            <div class="card-title text-bold-600">{{ card.title }}</div>
                            <div class="card-image">
                                <img :src="card.image" :alt="card.title" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class=" introduc-two">
            <div class="introduc-two-container">
                <div class="two-header">
                    <div class="small-title">为什么使用FoodEvident?</div>
                    <h2 class="large-title text-bold-600">
                        我们服务的不只是"查供应商"的企<br />
                        业，而是所有需要与食品安全、合<br />
                        规与风险打交道的组织。
                    </h2>
                </div>
            </div>
        </div>

        <div class="introduc-three">
            <div class="introduc-three-container">
                <div class="features-grid">
                    <div v-for="(feature, index) in features" :key="index" class="feature-card-item"
                        :class="{ active: selectedFeature === index }" @click="selectedFeature = index">
                        <h3 class="feature-card-title">{{ feature.title }}</h3>
                        <p class="feature-card-desc">{{ feature.description }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="introduc introduc-four">
            <div class="introduc-four-container">
                <div class="left-image-container">
                    <div class="image-wrapper">
                        <img src="/img/dataImg.png" alt="食品安全" />
                    </div>
                </div>

                <div class="right-content">
                    <h2 class="four-main-title text-bold-600">合规不是成本，是底线。</h2>
                    <p class="four-sub-text">在关乎产品安全与品牌声誉的决策上，获得更清晰的事实依据与更充足的信心。</p>
                    <div class="four-action-button" @click="generateReport('ReviewSpace')">
                        生成报告
                        <svg class="button-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 10H16M16 10L10 4M16 10L10 16" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>

            <!-- 底部导航栏 -->
            <!-- <div class="footer-nav">
                <a href="#" class="nav-link">首页 |</a>
                <a @click="generateReport('ReviewSpace')">生成报告 |</a>
                <a class="nav-link" @click="generateReport('mySpace')">我的报告 |</a>
                <a class="nav-link" @click="generateReport('problem')">帮助中心 |</a>
                <a class="nav-link">隐私政策 |</a>
                <a class="nav-link">服务条款 |</a>
                <span class="copyright">© 2026 SAVELOR PTE. LTD.</span>
            </div> -->
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus'


const emit = defineEmits(['spaceCreated']);
const currentTab = ref('ip');
const selectedFeature = ref(2); // 默认选中"专业输出"（索引2）

// 功能特性数据
const features = ref([
    {
        title: '官方数据源',
        description: '直接对接OFAC、BIS、SEC及各州政府等权威数据库，确保信息准确可追溯。'
    },
    {
        title: '分钟级报告',
        description: '将传统耗时数日的尽调压缩至5-10分钟，自动化生成结构化报告。'
    },
    {
        title: '专业输出',
        description: '报告格式清晰规范，可直接用于尽调文件、内部决策或合规备案。'
    },
    {
        title: '成本可控',
        description: '按需使用，定价透明。'
    }
]);

// 官方数据源轮播卡片数据
const dataCards = ref([
    { title: '官方数据源', image: '/img/dataImg.png' },
    { title: '官方数据源', image: '/img/dataImg.png' },
    { title: '官方数据源', image: '/img/dataImg.png' },
    { title: '官方数据源', image: '/img/dataImg.png' }
]);

const currentCardIndex = ref(0);
const visibleCards = 3; // 可见卡片数量
const cardAutoPlayTimer = ref(null);

// 自动轮播卡片
const autoPlayCards = () => {
    cardAutoPlayTimer.value = setInterval(() => {
        currentCardIndex.value = (currentCardIndex.value + 1) % (dataCards.value.length - visibleCards + 1);
    }, 3000);
};

const stopCardAutoPlay = () => {
    if (cardAutoPlayTimer.value) {
        clearInterval(cardAutoPlayTimer.value);
        cardAutoPlayTimer.value = null;
    }
};

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

const generateReport = (name) => {
    emit('spaceCreated', '', name);
};
const downloadReport = () => {
    ElMessage.warning('目前没有完整样本报告,请敬请期待！');
};

onMounted(() => {
    // 确保组件完全挂载后再执行任何可能影响 DOM 的操作
    console.log('Home page mounted');
    // 启动自动轮播
    startAutoPlay();
    // 启动卡片轮播
    autoPlayCards();
});

onUnmounted(() => {
    // 组件卸载时清除定时器
    stopAutoPlay();
    stopCardAutoPlay();
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
    background-image: url('/img/homeBimg.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.15);
        pointer-events: none;
    }

    .introduc-one-container {
        width: 100%;
        max-width: 1400px;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 60px;
        position: relative;
        z-index: 1;
    }

    .left-content {
        flex: 1;
        color: #FFFFFF;
        padding-top: 0;
        margin-top: -80px;

        .main-title {
            font-size: 56px;
            line-height: 1.3;
            margin-bottom: 30px;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .sub-title {
            font-size: 18px;
            line-height: 1.8;
            margin-bottom: 50px;
            opacity: 0.95;
            font-weight: 500;
        }

        .action-button {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            padding: 16px 40px;
            background: rgba(255, 255, 255, 0.2);
            color: #1D2129;
            border-radius: 50px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);

            &:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
            }

            .arrow-icon {
                width: 24px;
                height: 24px;
                transition: transform 0.3s ease;
            }

            &:hover .arrow-icon {
                transform: translateX(4px);
            }
        }
    }

    .right-carousel {
        flex: 1;
        overflow: hidden;
        padding: 20px 0;
        margin-top: 100px;

        .carousel-track {
            display: flex;
            gap: 20px;
            transition: transform 0.6s ease-in-out;
        }

        .data-card {
            min-width: calc(33.333% - 14px);
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 24px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;

            &:hover {
                transform: translateY(-8px);
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
            }

            .card-title {
                font-size: 20px;
                color: #1D2129;
                margin-bottom: 16px;
                text-align: center;
            }

            .card-image {
                width: 100%;
                height: 180px;
                border-radius: 12px;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #F5F6FA;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
        }
    }
}

.introduc-two {
    background-color: #FFFFFF;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 100px 300px;
    // min-height: calc(100vh - 100px);
    height: auto;

    .introduc-two-container {
        width: 100%;
        max-width: 1400px;
    }

    .two-header {
        .small-title {
            font-size: 18px;
            color: rgba(5, 104, 50, 1);
            margin-bottom: 40px;
            font-weight: 500;
        }

        .large-title {
            font-size: 56px;
            color: #1D2129;
            line-height: 1.4;
            letter-spacing: -0.5px;
        }
    }
}

.introduc-three {
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    height: calc(100vh - 6.25rem);

    .introduc-three-container {
        width: 100%;
        max-width: 1400px;
    }

    .features-grid {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        background: rgba(247, 248, 250, 1);
        border-radius: 60px;
        gap: 20px;
        height: auto;
        padding: 40px 0px;
    }

    .feature-card-item {
        border-radius: 24px;
        padding: 30px 20px;
        transition: all 0.4s ease;
        cursor: pointer;
        width: 35%;
        min-height: 200px;

        &.active {
            background: rgba(11, 34, 38, 1);
            box-shadow: 0 8px 32px rgba(29, 33, 41, 0.3);

            .feature-card-title {
                color: #FFFFFF;
            }

            .feature-card-desc {
                color: rgba(255, 255, 255, 0.85);
            }

            &:hover {
                box-shadow: 0 12px 40px rgba(29, 33, 41, 0.4);
            }
        }
    }

    .feature-card-title {
        font-size: 24px;
        color: #1D2129;
        margin-bottom: 30px;
        transition: color 0.3s ease;
    }

    .feature-card-desc {
        font-size: 18px;
        color: #4E5969;
        line-height: 1.8;
        margin: 0;
        transition: color 0.3s ease;
    }
}

.introduc-four {
    background: #fff;
    position: relative;
    min-height: calc(100vh - 100px);

    .introduc-four-container {
        width: 80%;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 100px;
        flex: 1;
        background-color: rgba(247, 248, 250, 1);
        padding: 100px 80px;
        border-radius: 70px;
    }

    .left-image-container {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;

        .image-wrapper {
            // width: 100%;
            max-width: 100%;
            aspect-ratio: 16/7;
            background: rgba(237, 238, 243, 1);
            border-radius: 100px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 60px;
            }
        }
    }

    .right-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 30px;

        .four-main-title {
            font-size: 48px;
            color: #1D2129;
            line-height: 1.3;
            margin: 0;
        }

        .four-sub-text {
            font-size: 16px;
            color: rgba(5, 104, 50, 1);
            line-height: 1.8;
            margin: 0;
        }

        .four-action-button {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            padding: 16px 40px;
            background: rgba(11, 34, 38, 1);
            color: #FFFFFF;
            border-radius: 50px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 16px rgba(29, 33, 41, 0.2);
            width: fit-content;

            &:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 24px rgba(29, 33, 41, 0.3);
            }

            .button-arrow {
                width: 20px;
                height: 20px;
                transition: transform 0.3s ease;
            }

            &:hover .button-arrow {
                transform: translateX(4px);
            }
        }
    }

    .footer-nav {
        width: 100%;
        margin-top: 60px;
        padding: 30px 0;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: center;
        font-size: 14px;
        color: #6B7684;
        border-top: 1px solid #E5E6EB;

        .nav-link {
            color: #6B7684;
            text-decoration: none;
            transition: color 0.3s ease;
            cursor: pointer;

            &:hover {
                color: #1D2129;
            }
        }

        .copyright {
            color: #999;
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