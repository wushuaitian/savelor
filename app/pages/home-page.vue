<!-- 首页 -->
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
                    <div class="view-report b-r-40">下载完整样本报告</div>
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

        </div>
        <div class="introduc introduc-four">
            <div class="four-content flex ">
                <div class="four-title text-bold-600 text-40">停止猜测，开始核查</div>
                <div class="four-text text-bold-600 text-28">您的下一个商业决策值得更清晰的依据和更充足的信心。</div>
                <div class="four-button text-center">生成报告</div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const emit = defineEmits(['spaceCreated']);

const generateReport = () => {
    emit('spaceCreated', '', 'ReviewSpace')
}
const currentTab = ref('ip')

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
        max-width: 1200px;
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

}

.introduc-four {
    height: calc(100vh - 100px);
    background: linear-gradient(180deg, #FFFFFF 0%, #F2F3FD 100%);
    border-top: 1px solid red;

    .four-content {
        width: 100%;
        margin: 0 auto;
        /* 改为 0 auto 以居中对齐 */
        height: 100%;

        .four-title {}

        .four-text {
            color: #6B7684;
            padding: 20px 0px;
        }

        .four-button {
            padding: 10px 50px;
            color: #FFFFFF;
            background: linear-gradient(126deg, #5690FF 0%, #2B57FF 100%);
            border-radius: 50px;
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