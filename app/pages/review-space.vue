<!-- 首页 -->
<template>
    <div class="home">
        <!-- 第一步：项目信息输入 -->
        <div v-if="currentStep === 1" class="introduc introduc-one bg-img">
            <div class="introduc-title text-bold-600">Savelor企业合规档案</div>
            <div class="introduc-text-one p-t-50 text-16 text-bold-600 text-center">让伪装成本趋零的时代，合作始于真实</div>

            <!-- 输入框和按钮区域 -->
            <div class="input-container flex align-center justify-center p-t-30">
                <div class="input-wrapper flex align-center">
                    <input type="text" class="space-input" placeholder="请输入项目名称" v-model="spaceName" @focus="inputFocus"
                        @blur="inputBlur" />
                </div>
            </div>

            <!-- 州选择和DUNS编号输入框区域 -->
            <div class="input-row-container flex align-center justify-center p-t-20">
                <div class="input-row-wrapper flex align-center">
                    <!-- 州选择下拉框 -->
                    <el-select v-model="selectedState" placeholder="弗罗里达州 (必选)" class="state-select"
                        popper-class="region-select-dropdown">
                        <el-option v-for="state in UsStateList" :key="state.code" :label="state.nameZh"
                            :value="state.code" />
                    </el-select>

                    <!-- DUNS编号输入框 -->
                    <div class="input-wrapper flex-1 flex align-center">
                        <input type="text" class="space-input" placeholder="已输入9位DUNS编号 (选填)" v-model="dunsNumber"
                            maxlength="9" @focus="inputFocus" @blur="inputBlur" />
                    </div>
                </div>
            </div>

            <!-- 下一步按钮区域 -->
            <div class="next-step-container flex align-center justify-center p-t-20">
                <button class="next-step-btn " :class="{ 'next-step-btn-active': canCreate }" :disabled="!canCreate"
                    @click="goToStep2">
                    下一步
                </button>
            </div>
        </div>

        <!-- 第二步：报告类型选择 -->
        <div v-if="currentStep === 2" class="report-selection-container">
            <!-- 返回按钮 -->
            <button class="back-btn" @click="goBackToStep1">
                <span>返回</span>
            </button>

            <!-- 标题 -->
            <div class="report-selection-title">选择报告类型</div>

            <!-- 报告类型卡片容器 -->
            <div class="report-cards-container">
                <!-- 通用报告卡片 -->
                <div class="report-card general-report-card" :class="{ 'selected': selectedReportType === 'general' }"
                    @click="selectReportType('general')">
                    <div class="card-title">通用报告</div>
                    <div class="card-description">覆盖所有合规维度,提供企业风险全景视图</div>

                    <div class="card-section">
                        <div class="section-title">包含维度</div>
                        <ul class="dimension-list">
                            <li v-for="dimension in generalDimensions" :key="dimension">{{ dimension }}</li>
                        </ul>
                    </div>

                    <div class="card-section">
                        <div class="section-title">适用场景</div>
                        <div class="scenario-text">首次背调、全面风险评估、标准尽职调查流程</div>
                    </div>

                    <div class="card-footer">
                        <div class="price">$79/次</div>
                        <div class="time">(生成时间:3~6分钟)</div>
                    </div>
                </div>

                <!-- 专项报告卡片 -->
                <div class="report-card special-report-card" :class="{ 'selected': selectedReportType === 'special' }"
                    @click="selectReportType('special')">
                    <div class="card-title">专项报告</div>
                    <div class="card-description">按需查验,精准聚焦。自由选择您最关心的1个或者多个合规维度进行核查</div>

                    <div class="card-section">
                        <div class="section-title">请选择报告维度</div>
                        <div class="dimension-checkboxes">
                            <label v-for="dimension in allDimensions" :key="dimension.value" class="dimension-checkbox"
                                :class="{
                                    'disabled': selectedReportType !== 'special'
                                }">
                                <input type="checkbox" :value="dimension.value" v-model="selectedDimensions"
                                    :disabled="selectedReportType !== 'special'" @change="handleDimensionChange" />
                                <span>{{ dimension.label }}</span>
                            </label>
                        </div>
                    </div>

                    <div class="card-section">
                        <div class="section-title">适用场景</div>
                        <div class="scenario-text">已有初步判断,只需核查特定风险(如仅关注制裁状态);预算有限,优先核查核心风险点。</div>
                    </div>

                    <div class="card-footer">
                        <div class="price">$39/次</div>
                        <div class="time">(生成时间:3~6分钟)</div>
                    </div>
                </div>
            </div>

            <!-- 生成报告按钮 -->
            <div class="generate-btn-container">
                <button class="generate-btn" :class="{ 'active': canGenerate }" :disabled="!canGenerate"
                    @click="generateReport">
                    生成选定报告
                </button>
            </div>
        </div>

        <!-- 第三步：报告预览 -->
        <div v-if="currentStep === 3" class="report-preview-container">
            <!-- 顶部操作栏 -->
            <div class="preview-header">
                <div class="header-left">
                    <button class="back-btn" @click="goBackToStep2">
                        <span>重新选择</span>
                    </button>
                </div>

                <div class="header-hint">
                    <span class="hint-icon">ℹ</span>
                    <span class="hint-text">本页面为报告内容预览。如需完整法律文件格式(含免责声明等),请下载完整报告。</span>
                </div>
            </div>

            <!-- 报告标题区域 -->
            <div class="report-title-section">
                <div class="report-dimension-title">
                    专项报告维度: {{ reportDimensionsText }}
                </div>
                <div class="report-subject">
                    核查主体: {{ companyName || '企业名称' }}
                </div>
            </div>

            <!-- 报告内容区域 -->
            <div class="report-content">

            </div>

            <!-- 底部操作按钮 -->
            <div class="preview-footer">
                <button class="download-btn" @click="downloadReport">下载完整报告</button>
                <button class="verify-new-btn" @click="verifyNewCompany">核查新公司</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'

import { ref, computed, onMounted } from 'vue';

// 接口
import {
    // 获取所有州列表
    savelorMetaUsStates,
    // 第一步 下一步
    savelorReportsDraft,
    // 第二步 生成报告
    savelorReportsGenerate,
} from "../../composables/login.ts";

// 步骤管理
const currentStep = ref(1)

// 空间名称输入框
const spaceName = ref('')
// 州选择
const selectedState = ref('')
// DUNS编号
const dunsNumber = ref('')
const emit = defineEmits(['spaceCreated']);

// 报告类型选择
const selectedReportType = ref('') // 'general' 或 'special'
const selectedDimensions = ref([]) // 专项报告选中的维度
const currentDraftId = ref('') // 当前报告id

// 通用报告包含的维度
const generalDimensions = [
    '企业身份与存续状态',
    '制裁与贸易管制',
    '金融与证券监管',
    '司法与诉讼记录',
    '商业行为与监管'
]

// 所有可选的维度
const allDimensions = [
    { label: '企业身份与存续状态', value: 'identity' },
    { label: '制裁与贸易管制', value: 'sanctions' },
    { label: '金融与证券监管', value: 'financial' },
    { label: '司法与诉讼记录', value: 'judicial' },
    { label: '商业行为与监管', value: 'business' }
]

// 州列表选项
const UsStateList = ref([])

// 判断是否可以创建项目
const canCreate = computed(() => {
    if (!spaceName.value.trim()) {
        return false
    }
    if (!selectedState.value) {
        return false
    }
    return true
})

// 输入框聚焦事件
const inputFocus = () => {
    // 可以添加聚焦时的样式变化
}

// 输入框失焦事件
const inputBlur = () => {
    // 可以添加失焦时的样式变化
}

// 进入第二步
const goToStep2 = () => {
    if (!canCreate.value) {
        if (!spaceName.value.trim()) {
            ElMessage.warning('请输入项目名称')
            return
        }
        if (!selectedState.value) {
            ElMessage.warning('请选择州')
            return
        }
        // if (!dunsNumber.value) {
        //     ElMessage.warning('请输入DUNS编号')
        //     return
        // }
        return
    }
    // 先创建空间
    savelorReportsDraft({
        companyName: spaceName.value,
        stateCode: selectedState.value,
        dunsNumber: dunsNumber.value
    }).then(res => {
        if (res.code === 200) {
            // 通过事件通知父组件切换组件并传递id
            // emit('spaceCreated', res.data.id)
            // localStorage.setItem('workspaceId', res.data.id);
            currentDraftId.value = res.data.draftId;
            // 进入第二步
            currentStep.value = 2
            ElMessage.success(res.message);

        }
    }).catch(err => {
        console.error(err);
        // 显示错误提示
        const errorMsg = err.response.data.message;
        ElMessage.error(errorMsg);
    })
    // localStorage.setItem('workspaceId', res.data.id);
    // 进入第二步
    currentStep.value = 2
}

// 返回第一步
const goBackToStep1 = () => {
    currentStep.value = 1
    selectedReportType.value = ''
    selectedDimensions.value = []
}

// 选择报告类型
const selectReportType = (type) => {
    selectedReportType.value = type
    if (type === 'general') {
        // 选择通用报告时，清空专项报告的维度选择
        selectedDimensions.value = []
    } else if (type === 'special') {
        // 选择专项报告时，默认选中前三个维度（根据图片显示）
        if (selectedDimensions.value.length === 0) {
            selectedDimensions.value = []
        }
    }
}


// 处理维度选择变化
const handleDimensionChange = () => {
    // 确保至少选择一个维度
    if (selectedReportType.value === 'special' && selectedDimensions.value.length === 0) {
        ElMessage.warning('请至少选择一个报告维度')
        // 恢复至少一个选择
        selectedDimensions.value = ['identity']
    }
}

// 判断是否可以生成报告
const canGenerate = computed(() => {
    if (selectedReportType.value === 'general') {
        return true
    } else if (selectedReportType.value === 'special') {
        return selectedDimensions.value.length > 0
    }
    return false
})

// 生成报告
const generateReport = () => {
    if (!canGenerate.value) {
        if (!selectedReportType.value) {
            ElMessage.warning('请选择报告类型')
            return
        }
        if (selectedReportType.value === 'special' && selectedDimensions.value.length === 0) {
            ElMessage.warning('请至少选择一个报告维度')
            return
        }
        return
    }

    // 这里添加生成报告的逻辑
    const reportData = {
        type: selectedReportType.value,
        dimensions: selectedReportType.value === 'general' ? generalDimensions : selectedDimensions.value
    }

    console.log('生成报告:', reportData)
    // TODO: 调用生成报告的API
    savelorReportsGenerate({
        dimensionCodes: selectedDimensions.value,
        draftId: currentDraftId.value,
        reportType: selectedReportType.value
    }).then(res => {
        // 显示返回的提示语
        if (res.code == 200) {
            UsStateList.value = res.data;
            console.log(UsStateList.value, 'UsStateListUsStateList');
        }
    }).catch(err => {
        console.error(err);
        // 显示错误提示
        const errorMsg = err.response;
        ElMessage.error(errorMsg);
    })

    // 跳转到第三步预览
    currentStep.value = 3
}

// 企业名称（可以从第一步获取或从API获取）
const companyName = ref('企业名称')

// 计算报告维度文本
const reportDimensionsText = computed(() => {
    if (selectedReportType.value === 'general') {
        return '企业身份与存续状态; 制裁与贸易管制; 金融与证券监管; 司法与诉讼记录; 商业行为与监管'
    } else {
        const dimensionLabels = selectedDimensions.value.map(val => {
            const dimension = allDimensions.find(d => d.value === val)
            return dimension ? dimension.label : ''
        }).filter(Boolean)
        return dimensionLabels.join('; ')
    }
})

// 判断是否包含制裁维度
const hasSanctionsDimension = computed(() => {
    if (selectedReportType.value === 'general') return true
    return selectedDimensions.value.includes('sanctions')
})

// 判断是否包含司法维度
const hasJudicialDimension = computed(() => {
    if (selectedReportType.value === 'general') return true
    return selectedDimensions.value.includes('judicial')
})

// 返回第二步
const goBackToStep2 = () => {
    currentStep.value = 2
}

// 下载完整报告
const downloadReport = () => {
    ElMessage.success('正在下载完整报告...')
    // TODO: 实现下载逻辑
}

// 核查新公司
const verifyNewCompany = () => {
    // 重置到第一步
    currentStep.value = 1
    spaceName.value = ''
    selectedState.value = ''
    dunsNumber.value = ''
    selectedReportType.value = ''
    selectedDimensions.value = []
}

// 获取美国州列表
const getUsStateList = () => {
    savelorMetaUsStates({}).then(res => {
        // 显示返回的提示语
        if (res.code == 200) {
            UsStateList.value = res.data;
            console.log(UsStateList.value, 'UsStateListUsStateList');
        }
    }).catch(err => {
        console.error(err);
        // 显示错误提示
        const errorMsg = err.response;
        ElMessage.error(errorMsg);
    })
}

onMounted(() => {
    // 获取美国州列表
    getUsStateList();
})
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
    height: calc(100vh - 15vh);
    color: #1D2129;
}

.introduc-one {
    padding-top: 140px;
    background-image: url('/img/introduc-one.png');

    .introduc-title {
        margin: auto;
        width: 700px;
        text-align: center;
        font-size: 64px;
    }

    .enter {
        color: #fff;
        padding: 10px 30px;
        background-color: #1d2129;
    }

    .view-report {
        padding: 10px 30px;
        border: 2px solid #1D2129;
    }
}


/* 类型选择按钮样式 */
.type-container {
    width: 100%;
    max-width: 600px;
    margin: auto;
    gap: 16px;
}

.type-btn {
    flex: 1;
    height: 48px;
    background-color: rgba(107, 114, 128, 0.2);
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 500;
    color: #6C7C93;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background-color: rgba(107, 114, 128, 0.3);
    }
}

.type-btn-active {
    background-color: #fff;
    color: #1D2129;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 地区选择容器 */
.region-container {
    width: 100%;
    max-width: 600px;
    margin: auto;
}


/* 新增样式 */
.input-container {
    width: 100%;
    max-width: 600px;
    margin: auto;
}

.input-wrapper {
    width: 100%;
    height: 60px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 30px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    display: flex;
    align-items: center;
    transition: all 0.3s ease;

    &:hover {
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }
}

.space-input {
    flex: 1;
    padding: 0 20px;
    border: none;
    outline: none;
    background: transparent;
    font-size: 16px;
    color: #333;
    transition: all 0.3s ease;

    &::placeholder {
        color: #999;
    }

    &:focus {
        color: #1D2129;
    }
}

.enter-btn {
    width: 100px;
    height: 40px;
    background-color: #2134DE;
    border: none;
    border-radius: 20px;
    color: white;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-right: 10px;

    &:hover:not(:disabled) {
        background-color: #1a2bb8;
        transform: scale(1.05);
    }

    &:active:not(:disabled) {
        transform: scale(0.95);
    }

    &:disabled {
        background-color: #9CA3AF;
        cursor: not-allowed;
        opacity: 0.6;
    }
}

.btn-text {
    display: block;
    line-height: 1;
}

/* 下一步按钮样式 */
.next-step-container {
    width: 100%;
    max-width: 600px;
    margin: auto;
    flex-direction: column;
    gap: 12px;
}

.next-step-btn {
    width: 200px;
    height: 48px;
    background-color: rgba(156, 163, 175, 0.6);
    border: none;
    border-radius: 24px;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    cursor: not-allowed;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:disabled {
        background-color: rgba(156, 163, 175, 0.6);
        opacity: 0.8;
    }
}

.next-step-btn-active {
    background-color: #2134DE;
    cursor: pointer;
    opacity: 1;

    &:hover {
        background-color: #1a2bb8;
        transform: scale(1.02);
    }

    &:active {
        transform: scale(0.98);
    }
}

/* 州选择和DUNS编号输入框容器 */
.input-row-container {
    width: 100%;
    max-width: 600px;
    margin: auto;
}

.input-row-wrapper {
    width: 100%;
    gap: 16px;
}

/* 州选择下拉框样式 */
.state-select {
    flex: 1;
    height: 60px;

    :deep(.el-input__wrapper) {
        height: 60px;
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 30px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        padding: 0 20px;
        border: 2px solid transparent;
        transition: all 0.3s ease;

        &:hover {
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
            background-color: rgba(255, 255, 255, 0.9);
        }

        &.is-focus {
            box-shadow: 0 8px 24px rgba(33, 52, 222, 0.15);
            background-color: rgba(255, 255, 255, 1);
            border-color: rgba(33, 52, 222, 0.3);
        }
    }

    :deep(.el-input__inner) {
        font-size: 16px;
        color: #333;
        height: 60px;
        line-height: 60px;
        font-weight: 500;

        &::placeholder {
            color: #999;
            font-weight: 400;
        }
    }

    :deep(.el-select__caret) {
        color: #6C7C93;
        font-size: 18px;
        transition: transform 0.3s ease;

        &:hover {
            color: #2134DE;
        }
    }

    :deep(.el-select__caret.is-reverse) {
        transform: rotate(180deg);
    }
}


/* 第二步：报告类型选择样式 */
.report-selection-container {
    width: 100%;
    min-height: calc(100vh - 15vh);
    padding: 40px 20px 60px;
    background: #fff;
    position: relative;
    background-image: url('/img/introduc-one.png');
    background-size: contain;
}

.back-btn {
    position: absolute;
    top: 40px;
    left: 40px;
    background: transparent;
    border: none;
    font-size: 16px;
    color: #1D2129;
    cursor: pointer;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 0.3s ease;
    background-color: rgba(0, 0, 0, 0.05);

    &:hover {
        color: #2134DE;
        background-color: #E9EBFC;
    }
}

.report-selection-title {
    text-align: center;
    font-size: 32px;
    font-weight: 600;
    color: #1D2129;
    margin: 60px 0 40px;
}

.report-cards-container {
    display: flex;
    gap: 32px;
    max-width: 1200px;
    margin: 0 auto 40px;
    justify-content: center;
    flex-wrap: wrap;
}

.report-card {
    flex: 1;
    min-width: 480px;
    max-width: 560px;
    background: #fff;
    border-radius: 16px;
    padding: 32px;
    border: 2px solid transparent;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0.1;
        z-index: 0;
        pointer-events: none;
    }

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
    }

    &.selected {
        border-color: #2134DE;
        box-shadow: 0 8px 24px rgba(33, 52, 222, 0.2);
    }
}

.general-report-card {
    &::before {
        background: linear-gradient(135deg, #FFE5B4 0%, #FFC0CB 100%);
    }
}

.special-report-card {
    &::before {
        background: linear-gradient(135deg, #B4E5FF 0%, #D4B4FF 100%);
    }
}

.card-title {
    font-size: 24px;
    font-weight: 600;
    color: #1D2129;
    margin-bottom: 12px;
    position: relative;
    z-index: 1;
}

.card-description {
    font-size: 14px;
    color: #6C7C93;
    line-height: 1.6;
    margin-bottom: 24px;
    position: relative;
    z-index: 1;
}

.card-section {
    margin-bottom: 24px;
    position: relative;
    z-index: 1;
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    color: #1D2129;
    margin-bottom: 12px;
}

.dimension-list {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
        font-size: 14px;
        color: #6C7C93;
        line-height: 2;
        padding-left: 20px;
        position: relative;

        &::before {
            content: counter(item);
            counter-increment: item;
            position: absolute;
            left: 0;
            color: #2134DE;
            font-weight: 600;
        }
    }

    counter-reset: item;
}

.scenario-text {
    font-size: 14px;
    color: #6C7C93;
    line-height: 1.6;
}

.dimension-checkboxes {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.dimension-checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #1D2129;
    cursor: pointer;
    transition: all 0.3s ease;

    input[type="checkbox"] {
        width: 18px;
        height: 18px;
        cursor: pointer;
        accent-color: #2134DE;
    }

    &.disabled {
        opacity: 0.4;
        cursor: not-allowed;
        color: #9CA3AF;

        input[type="checkbox"] {
            cursor: not-allowed;
            opacity: 0.5;
        }

        span {
            color: #9CA3AF;
        }
    }

    &:not(.disabled):hover {
        color: #2134DE;
    }
}

.card-footer {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 1;
}

.price {
    font-size: 24px;
    font-weight: 600;
    color: #2134DE;
}

.time {
    font-size: 12px;
    color: #9CA3AF;
}

.generate-btn-container {
    display: flex;
    justify-content: center;
    margin-top: 40px;
}

.generate-btn {
    min-width: 240px;
    height: 48px;
    background: linear-gradient(135deg, #B4E5FF 0%, #D4B4FF 100%);
    border: none;
    border-radius: 24px;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    cursor: not-allowed;
    transition: all 0.3s ease;
    opacity: 0.6;

    &.active {
        background: linear-gradient(135deg, #4A90E2 0%, #7B68EE 100%);
        cursor: pointer;
        opacity: 1;
        box-shadow: 0 4px 16px rgba(74, 144, 226, 0.3);

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4);
        }

        &:active {
            transform: translateY(0);
        }
    }
}

/* 第三步：报告预览样式 */
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

.reselect-btn {
    padding: 8px 20px;
    background: #B3E5FC;
    border: none;
    border-radius: 6px;
    color: #0277BD;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: #81D4FA;
        color: #01579B;
    }
}

.header-hint {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #6C7C93;
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



.preview-footer {
    display: flex;
    justify-content: center;
    gap: 24px;
    padding-top: 40px;
}

.download-btn {
    min-width: 200px;
    height: 48px;
    background: #0277BD;
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

.verify-new-btn {
    min-width: 200px;
    height: 48px;
    background: #B3E5FC;
    border: none;
    border-radius: 8px;
    color: #0277BD;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: #81D4FA;
        color: #01579B;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(2, 119, 189, 0.2);
    }

    &:active {
        transform: translateY(0);
    }
}
</style>

<!-- 下拉菜单全局样式 -->
<style lang="scss" scoped>
::v-deep {
    .el-select__wrapper {
        height: 60px !important;
        width: 100% !important;
        border-radius: 30px;

    }

    .el-select__placeholder.is-transparent {
        color: #9CA3AF;
    }
}

.region-select-dropdown {
    background-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
    border: 1px solid rgba(0, 0, 0, 0.06) !important;
    padding: 8px 0 !important;
    margin-top: 8px !important;
    background-color: rgba(255, 255, 255, 0.98) !important;
    backdrop-filter: blur(10px) !important;
    overflow: hidden !important;

    .el-select-dropdown__item {
        height: 48px !important;
        line-height: 48px !important;
        padding: 0 24px !important;
        font-size: 16px !important;
        color: #1D2129 !important;
        transition: all 0.2s ease !important;
        margin: 2px 8px !important;
        border-radius: 12px !important;

        &:hover {
            background-color: rgba(33, 52, 222, 0.08) !important;
            color: #2134DE !important;
            font-weight: 500 !important;
        }

        &.selected {
            background-color: rgba(33, 52, 222, 0.12) !important;
            color: #2134DE !important;
            font-weight: 600 !important;

            &::after {
                content: '✓';
                float: right;
                color: #2134DE;
                font-weight: bold;
            }
        }

        &.hover {
            background-color: rgba(33, 52, 222, 0.08) !important;
        }
    }

    .el-scrollbar__bar {
        &.is-vertical {
            .el-scrollbar__thumb {
                background-color: rgba(33, 52, 222, 0.2) !important;
                border-radius: 4px !important;

                &:hover {
                    background-color: rgba(33, 52, 222, 0.3) !important;
                }
            }
        }
    }
}
</style>