<!-- 报告预览页面 -->
<template>
    <div class="report-preview-container">
        <!-- 顶部操作栏 -->
        <div class="preview-header">
            <div class="header-left">
                <button class="back-btn" @click="goBack">
                    <span>返回</span>
                </button>
            </div>

            <div class="header-hint">
                <span class="hint-icon">ℹ</span>
                <span class="hint-text">本页面为报告内容预览。如需完整法律文件格式(含免责声明等),请下载完整报告。</span>
            </div>
        </div>

        <div class="report-loading-overlay" v-if="isLoadingReport">
            <div class="loading-spinner">
                <div class="spinner-circle"></div>
                <p class="loading-text">报告加载中...</p>
            </div>
        </div>
        <div v-else>
            <!-- 报告标题区域 -->
            <div class="report-title-section">
                <div class="report-dimension-title">
                    {{ reportPreviewData.reportType }}
                </div>
                <div class="report-subject">
                    核查主体: {{ reportPreviewData.companyName || companyName || '企业名称' }}
                </div>
            </div>

            <!-- 报告内容区域 -->
            <div class="report-content">
                <div v-for="(dimension, index) in reportPreviewData.dimensionDetails" :key="index"
                    class="dimension-section">
                    <div class="dimension-title">{{ dimension.dimensionName }}</div>
                    <div class="verification-facts">
                        <div class="facts-title">核查事实:</div>
                        <div v-if="dimension.checkpointFacts && dimension.checkpointFacts.length > 0" class="facts-list">
                            <div v-for="(fact, factIndex) in dimension.checkpointFacts" :key="factIndex" class="fact-item">
                                <div class="fact-title">{{ fact.checkpointName }}</div>
                                <div class="fact-content">
                                    <div class="fact-detail">事实: {{ fact.factDescription }}</div>
                                    <div v-if="fact.checkDate" class="fact-meta">
                                        <span>核查时间: {{ fact.checkDate }}</span>
                                    </div>
                                    <div v-if="fact.dataSource" class="fact-meta">数据源: {{ fact.dataSource }}</div>
                                    <div v-if="fact.referenceId" class="fact-meta">参考标识: {{ fact.referenceId }}</div>
                                    <div v-if="fact.listPublishDate" class="fact-meta">名单发布日期: {{ fact.listPublishDate }}</div>
                                    <div v-if="fact.restrictedItems" class="fact-meta">受限物项记录: {{ fact.restrictedItems }}</div>
                                    <div v-if="fact.court" class="fact-meta">受理法院: {{ fact.court }} </div>
                                    <div v-if="fact.penaltyReason" class="fact-meta">案件类型: {{ fact.penaltyReason }} </div>
                                    <div v-if="fact.penaltyDate" class="fact-meta">处罚日期: {{ fact.penaltyDate }}</div>
                                    <div v-if="fact.penaltyResult" class="fact-meta">处罚结果: {{ fact.penaltyResult }}</div>
                                    <div v-if="fact.filingDate" class="fact-meta">立案日期: {{ fact.filingDate }}</div>
                                    <div v-if="fact.caseStatus" class="fact-meta">当前状态: {{ fact.caseStatus }}</div>
                                    <div v-if="fact.timeWindowEnd" class="fact-meta">时间窗口: {{ fact.timeWindowStart }} - {{ fact.timeWindowEnd }}</div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="no-facts">暂无核查事实</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 底部操作按钮 -->
        <div class="preview-footer">
            <button class="download-btn" @click="downloadReport">下载完整报告</button>
        </div>
    </div>
</template>

<script setup>
import { ElMessage, ElLoading } from 'element-plus'
import { ref, watch, onUnmounted } from 'vue'

// 接口
import {
    savelorReportsDetailed
} from "../../composables/login.ts";

// Props
const props = defineProps({
    reportId: {
        type: String,
        default: ''
    }
})

// Emits
const emit = defineEmits(['back'])

// 报告预览数据
const reportPreviewData = ref({
    companyName: '公司名称',
    dimensionDetails: []
})

// 企业名称
const companyName = ref('企业名称')

// loading 状态
const isLoadingReport = ref(true)

// loading 实例
let loadingInstance = null

// 获取维度名称列表（用于标题显示）
const getDimensionNames = () => {
    if (!reportPreviewData.value.dimensionDetails || reportPreviewData.value.dimensionDetails.length === 0) {
        return ''
    }
    return reportPreviewData.value.dimensionDetails.map(d => d.dimensionName).join('; ')
}

// 返回
const goBack = () => {
    emit('back')
}

// 下载完整报告
const downloadReport = () => {
    ElMessage.success('正在下载完整报告...')
    // TODO: 实现下载逻辑
}

// 获取报告预览数据
const getReportPreview = () => {
    // 清除之前的 loading
    if (loadingInstance) {
        loadingInstance.close()
    }

    if (!props.reportId) {
        ElMessage.error('缺少报告ID')
        isLoadingReport.value = false
        return
    }

    isLoadingReport.value = true

    const pollRequest = () => {
        savelorReportsDetailed({
            reportId: props.reportId
        }).then(res => {
            if (res.code == 200) {
                isLoadingReport.value = false
                if (loadingInstance) {
                    loadingInstance.close();
                    loadingInstance = null;
                }
                reportPreviewData.value = res.data;
                console.log('报告数据获取成功', res);
            } else {
                console.log('等待报告生成...', res);
                setTimeout(pollRequest, 3000);
            }
        }).catch(err => {
            console.error('请求失败:', err);
            isLoadingReport.value = false
            if (loadingInstance) {
                loadingInstance.close();
                loadingInstance = null;
            }
            setTimeout(pollRequest, 3000);
        });
    };

    pollRequest();
}

// 监听 reportId 变化，从父组件传递的 ID 触发数据加载
watch(() => props.reportId, (newVal) => {
    if (newVal) {
        getReportPreview()
    }
}, { immediate: true })

// 组件卸载时清除 loading
onUnmounted(() => {
    if (loadingInstance) {
        loadingInstance.close()
    }
})
</script>

<style scoped lang="scss">
/* 报告预览样式 */
.report-preview-container {
    width: 100%;
    min-height: calc(100vh - 15vh);
    padding: 40px 60px 80px;
    background: #fff;
    position: relative;
}

.preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    padding-bottom: 20px;
}

.header-left {
    display: flex;
    gap: 12px;
}

.back-btn {
    background: transparent;
    border: none;
    font-size: 16px;
    color: #1D2129;
    cursor: pointer;
    padding: 6px 16px;
    border-radius: 8px;
    transition: all 0.3s ease;
    background-color: rgba(0, 0, 0, 0.05);

    &:hover {
        color: #2134DE;
        background-color: #E9EBFC;
    }
}

.header-hint {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #6C7C93;
    margin: auto;
}

.hint-icon {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #03A9F4;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    flex-shrink: 0;
}

.hint-text {
    line-height: 1.5;
}

.report-title-section {
    margin-bottom: 40px;
}

.report-dimension-title {
    font-size: 20px;
    font-weight: 600;
    color: #1D2129;
    margin-bottom: 16px;
}

.report-subject {
    font-size: 16px;
    color: #6C7C93;
}

/* 报告内容区域 */
.report-content {
    margin-bottom: 40px;
    margin-left: auto;
    margin-right: auto;
}

.dimension-section {
    background: #F5F7FA;
    border-radius: 8px;
    padding: 24px 28px;
    margin-bottom: 24px;
    position: relative;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.dimension-title {
    font-size: 18px;
    font-weight: 600;
    color: #1D2129;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.verification-facts {
    margin-top: 4px;
}

.facts-title {
    font-size: 16px;
    font-weight: 600;
    color: #1D2129;
    margin-bottom: 16px;
}

.facts-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.fact-item {
    background: #fff;
    border-radius: 6px;
    padding: 18px 20px;
    border-left: 3px solid #2134DE;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.fact-title {
    font-size: 15px;
    font-weight: 600;
    color: #1D2129;
    margin-bottom: 12px;
}

.fact-content {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.fact-detail {
    font-size: 14px;
    color: #1D2129;
    line-height: 1.6;
    margin-bottom: 4px;
}

.fact-meta {
    font-size: 13px;
    color: #6C7C93;
    line-height: 1.6;
    word-break: break-word;
}

.no-facts {
    font-size: 14px;
    color: #9CA3AF;
    text-align: center;
    padding: 20px;
    background: #fff;
    border-radius: 6px;
    border: 1px dashed #E5E7EB;
}

.preview-footer {
    display: flex;
    justify-content: center;
    gap: 24px;
    padding-top: 40px;
}

.download-btn {
    min-width: 200px;
    height: 48px;
    background: #2134DE;
    border: none;
    border-radius: 8px;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: #01579B;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(2, 119, 189, 0.3);
    }

    &:active {
        transform: translateY(0);
    }
}

// Loading 覆盖层样式
.report-loading-overlay {
    width: 100%;
    min-height: calc(100vh - 200px);
    background-color: rgba(247, 248, 250, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;

    .loading-spinner {
        text-align: center;

        .spinner-circle {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(33, 52, 222, 0.2);
            border-top: 4px solid #2134DE;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
        }

        .loading-text {
            color: #2134DE;
            font-size: 16px;
            font-weight: 500;
            margin: 0;
        }
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
