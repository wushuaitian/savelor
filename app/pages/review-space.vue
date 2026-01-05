<!-- 首页 -->
<template>
    <div class="home">
        <!-- 介绍 -->
        <div class="introduc introduc-one bg-img">
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
                        <el-option v-for="state in states" :key="state.value" :label="state.label"
                            :value="state.value" />
                    </el-select>

                    <!-- DUNS编号输入框 -->
                    <div class="duns-input-wrapper flex align-center">
                        <input type="text" class="duns-input" placeholder="已输入9位DUNS编号 (选填)" v-model="dunsNumber"
                            maxlength="9" @focus="inputFocus" @blur="inputBlur" />
                    </div>
                </div>
            </div>

            <!-- 下一步按钮区域 -->
            <div class="next-step-container flex align-center justify-center p-t-20">
                <button class="next-step-btn " :class="{ 'next-step-btn-active': canCreate }" :disabled="!canCreate"
                    @click="enterSpace">
                    下一步
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { loonoolWorkspaces, savelorSpaces } from "../../composables/login";
import { ElMessage } from 'element-plus'

import { ref, computed, onMounted } from 'vue';

// 空间名称输入框
const spaceName = ref('')
// 州选择
const selectedState = ref('')
// DUNS编号
const dunsNumber = ref('')
const emit = defineEmits(['spaceCreated']);

// 州列表选项
const states = [
    { label: '弗罗里达州', value: 'FL' },
    { label: '加利福尼亚州', value: 'CA' },
    { label: '纽约州', value: 'NY' },
    { label: '德克萨斯州', value: 'TX' },
    { label: '伊利诺伊州', value: 'IL' },
    { label: '宾夕法尼亚州', value: 'PA' },
    { label: '俄亥俄州', value: 'OH' },
    { label: '佐治亚州', value: 'GA' },
    { label: '北卡罗来纳州', value: 'NC' },
    { label: '密歇根州', value: 'MI' },
]

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

// 进入空间按钮点击事件
const enterSpace = () => {
    if (!canCreate.value) {
        if (!spaceName.value.trim()) {
            ElMessage.warning('请输入项目名称')
            return
        }
        if (!selectedState.value) {
            ElMessage.warning('请选择州')
            return
        }
        return
    }
    savelorSpaces({
        name: spaceName.value,
        description: ''
    }).then(res => {
        ElMessage.success(res.message);
        if (res.code === 200 && res.data?.id) {
            // 通过事件通知父组件切换组件并传递id
            emit('spaceCreated', res.data.id)
            localStorage.setItem('workspaceId', res.data.id);
        }
    }).catch(err => {
        console.error(err);
        // 显示错误提示
        const errorMsg = err?.response?.data?.message || err?.message || '创建失败，请稍后重试';
        // ElMessage.error(errorMsg);
    })

    console.log('进入空间:', spaceName.value)
    // 这里可以添加进入空间的逻辑
}

onMounted(() => {
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
        background-color: #1D2129;
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

.region-select {
    width: 100%;
    height: 60px;

    :deep(.el-input__wrapper) {
        height: 60px;
        background-color: rgba(255, 255, 255, 0.9);
        border-radius: 30px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        padding: 0 24px;
        border: 2px solid transparent;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
            background-color: rgba(255, 255, 255, 1);
            border-color: rgba(33, 52, 222, 0.2);
        }

        &.is-focus {
            box-shadow: 0 8px 24px rgba(33, 52, 222, 0.15);
            background-color: rgba(255, 255, 255, 1);
            border-color: rgba(33, 52, 222, 0.3);
        }
    }

    :deep(.el-input__inner) {
        font-size: 16px;
        color: #1D2129;
        height: 60px;
        line-height: 60px;
        font-weight: 500;

        &::placeholder {
            color: #9CA3AF;
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

/* DUNS编号输入框样式 */
.duns-input-wrapper {
    flex: 1;
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
        background-color: rgba(255, 255, 255, 0.9);
    }

    &:focus-within {
        box-shadow: 0 8px 24px rgba(33, 52, 222, 0.15);
        background-color: rgba(255, 255, 255, 1);
        border: 2px solid rgba(33, 52, 222, 0.3);
    }
}

.duns-input {
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