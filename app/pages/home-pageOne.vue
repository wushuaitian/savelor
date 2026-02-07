<template>
    <div class="home">
        <!-- 介绍 -->
        <div class="introduc introduc-one flex align-center justify-center">
            <div class="introduc-one-container justify-between flex align-center">
                <!-- 左侧内容 -->
                <div class="left-content">
                    <h1 class="main-title text-18 text-bold-600">
                        核查5大核心风险维度提供决策事实依据
                    </h1>
                    <p class="sub-title text-18 text-bold-500">
                        基于官方数据源，快速识别美国公司的制裁、诉讼及合规状态<br />
                        为您的商业决策提供事实依据。
                    </p>
                    <div class="action-button b-r-48 text-26 text-bold-600 align-center"
                        @click="generateReport('ReviewSpace')">
                        生成报告
                        <img src="/img/arrowImg.png" alt="" class="arrow-img">
                    </div>
                </div>

                <!-- 右侧轮播卡片 -->
                <div class="right-carousel">
                    <img src="/img/pageImg.png" alt="" class="page-img">
                </div>
            </div>
        </div>
        <div class="introduc-two flex flex-column">
            <div class="small-title text-bold-400 text-32">为什么使用FoodEvident?</div>
            <h2 class="large-title text-bold-600">
                我们服务的不只是"查供应商"的企业，而是所有需要与食品安全、合规与风险打交道的组织。
            </h2>
        </div>

        <div class="introduc-three">
            <div class="introduc-three-container b-r-56 flex flex-wrap justify-center">
                <div v-for="(feature, index) in features" :key="index"
                    class="feature-card-item justify-center flex flex-column b-r-24"
                    :class="{ active: selectedFeature === index }" @click="selectedFeature = index">
                    <h3 class="feature-card-title  text-bold-400">{{ feature.title }}</h3>
                    <p class="feature-card-desc text-28 text-bold-400">{{ feature.description }}</p>
                </div>
            </div>
        </div>
        <div class="introduc-five flex justify-around align-center">
            <div class="five-item b-r-40" v-for="(item, index) in stepData" :key="index">
                <img :src="item.imgDisplay" alt="" class="five-img">
                <div class="five-item-title  text-bold-600 text-24">{{ item.title }}</div>
            </div>
        </div>
        <div class="introduc-four flex flex-column justify-center m-auto">
            <div class="introduc-four-container">
                <div class="left-image-container">
                    <div class="image-wrapper">
                        <img src="/img/pageFour.png" alt="食品安全" />
                    </div>
                </div>

                <div class="right-content">
                    <h2 class="four-main-title text-bold-600">合规不是成本，是底线。</h2>
                    <p class="four-sub-text">在关乎产品安全与品牌声誉的决策上，获得更清晰的事实依据与更充足的信心。</p>
                    <div class="four-action-button" @click="generateReport('ReviewSpace')">
                        生成报告
                        <img src="/img/arrowImg.png" alt="" class="arrow-img">
                    </div>
                </div>
            </div>

             <!-- 底部导航栏 -->
            <div class="footer-nav">
                <a href="#" class="nav-link">首页 |</a>
                <a @click="generateReport('ReviewSpace')">生成报告 |</a>
                <a class="nav-link" @click="generateReport('mySpace')">我的报告 |</a>
                <a class="nav-link" @click="generateReport('problem')">帮助中心 |</a>
                <a class="nav-link">隐私政策 |</a>
                <a class="nav-link">服务条款 |</a>
                <span class="copyright">© 2026 SAVELOR PTE. LTD.</span>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus'


const emit = defineEmits(['spaceCreated']);
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


// 提前导入图片资源
import infoImg from '/img/infoImg.png';
import typeImg from '/img/typeImg.png';
import reportImg from '/img/reportImg.png';

const stepData = ref([
    {
        title: '输入公司信息',
        imgDisplay: infoImg,
    },
    {
        title: '选择报告类型',
        imgDisplay: typeImg,
    },
    {
        title: '生成选定报告',
        imgDisplay: reportImg,
    }
]);
const generateReport = (name) => {
    emit('spaceCreated', '', name);
};
const downloadReport = () => {
    ElMessage.warning('目前没有完整样本报告,请敬请期待！');
};

onMounted(() => {
    // 确保组件完全挂载后再执行任何可能影响 DOM 的操作
    console.log('Home page mounted');
});

onUnmounted(() => {
    // 组件卸载时清除定时器
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
    background-color: #fff;

    .introduc-one-container {
        width: 80%;
    }

    .left-content {
        flex: 1;
        color: #FFFFFF;

        .arrow-img {
            width: 30px;
            height: 30px;
        }

        .main-title {
            font-size: 72px;
            margin-bottom: 30px;
            color: #223A77;
        }

        .sub-title {
            margin-bottom: 50px;
            opacity: 0.95;
            color: #223A77;
        }

        .action-button {
            display: inline-flex;
            gap: 12px;
            padding: 16px 40px;
            background: #FFDF3A;
            color: #223A77;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);

            &:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
            }

        }
    }

    .right-carousel {
        flex: 0.7;
        overflow: hidden;
        margin-top: 5%;

        .page-img {
            width: 100%;
        }
    }
}

.arrow-img {
    width: 30px;
    height: 30px;
}

.introduc-two {
    color: #223A77;
    background-color: #FFFFFF;
    width: 80%;
    margin: 10% auto 2% auto;

    .large-title {
        font-size: 66px;
        margin-right: 2%;
    }
}

.introduc-three {
    background: #fff;
    width: 100%;
    // height: calc(100vh - 6.25rem);

    .introduc-three-container {
        width: 90%;
        margin: auto;
        background: #F7F8FA;
        border-radius: 60px;
        gap: 55px;
        height: auto;
        padding: 40px 0px;
    }

    .feature-card-item {
        padding: 30px 20px;
        transition: all 0.4s ease;
        cursor: pointer;
        width: 40%;
        height: 30vh;
        color: #223A77;

        .feature-card-title {
            font-size: 20px;
            margin-bottom: 30px;
            transition: color 0.3s ease;
        }

        .feature-card-desc {
            color: #000;
            transition: color 0.3s ease;
        }

        &.active {
            background: #223A77;
            box-shadow: 0 8px 32px rgba(29, 33, 41, 0.3);

            .feature-card-title {
                color: #fff;
            }

            .feature-card-desc {
                color: rgba(255, 255, 255, 0.85);
            }

            &:hover {
                box-shadow: 0 12px 40px rgba(29, 33, 41, 0.4);
            }
        }
    }


}

.introduc-four {
    background: #fff;
    position: relative;
    // height: calc(100vh - 100px);
    width: 80%;

    .introduc-four-container {
        height: 300px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 100px;
        // flex: 1;
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
            // aspect-ratio: 16/7;
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
        color: #223A77;

        .four-main-title {
            font-size: 48px;
            line-height: 1.3;
            margin: 0;
        }

        .four-sub-text {
            font-size: 16px;
            line-height: 1.8;
            margin: 0;
        }

        .four-action-button {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            padding: 16px 40px;
            background: #FFDF3A;
            // color: #223A77;
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

.introduc-five {
    background-color: #fff;
    gap: 30px;
    margin: 8% 0;

    .five-item {
        width: 20%;
        // height: 20vh;
        background-color: #F2F3F5;
        padding: 30px;
        .five-item-title{
            color: #223A77;
            margin: 5% 0;

        }

        .five-img{
            width: 100%;
            height: 200px;
        }
    }
}
</style>