<template>
  <div class="my-space-page">
    <!-- 列表视图 -->
    <div v-if="component === 'list'">
      <!-- 搜索模块 -->
    <div class="search-module">
      <div class="form-item">
        <div class="form-label">选择时间</div>
        <el-select v-model="formData.time" class="form-control" placeholder="请选择时间">
          <el-option label="全部时间" value="all" />
          <el-option label="最近7天" value="7days" />
          <el-option label="最近30天" value="30days" />
          <el-option label="最近60天" value="60days" />
        </el-select>
      </div>
      <div class="form-item">
        <div class="form-label">选择类型</div>
        <el-select v-model="formData.type" class="form-control" placeholder="请选择类型">
          <el-option label="全部类型" value="all" />
          <el-option label="通用报告" value="general" />
          <el-option label="专项报告" value="special" />
        </el-select>
      </div>
      <div class="form-item">
        <div class="form-label">核查主体</div>
        <el-input 
          v-model="formData.subject" 
          class="form-control" 
          placeholder="请输入核查主体" 
          clearable 
          @keyup.enter="handleSearch"
        />
      </div>
      <el-button type="primary" class="search-button" @click="handleSearch">搜索</el-button>
    </div>

    <!-- 卡片模块 -->
    <div v-loading="loading" class="card-module" element-loading-text="加载中...">
      <!-- 空数据状态 -->
      <el-empty v-if="!loading && cardList.length === 0" description="暂无报告数据" :image-size="120" />
      
      <!-- 卡片列表 -->
      <div v-else class="card-grid">
        <div 
          v-for="(card, index) in cardList" 
          :key="index" 
          class="card-item"
          @mouseenter="hoverCardId = index"
          @mouseleave="hoverCardId = null"
        >
          <!-- 第一行：标题 -->
          <div class="card-title">{{ card.companyName }}</div>
          
          <!-- 第二行：类型、时间、编号、金额 -->
          <div class="card-meta">
            <span>{{ card.reportType === 'general' ? '通用报告' : '专项报告' }}</span>
            <span class="divider">|</span>
            <span>{{ formatDate(card.generatedAt) }}</span>
            <span class="divider">|</span>
            <span>编号: {{ card.dunsNumber }}</span>
            <span class="divider">|</span>
            <span>{{ card.priceUsd }}</span>
          </div>
          
          <!-- 第三行：类型标签 -->
          <div class="card-tags">
            <div 
              v-for="(tag, tagIndex) in parseDimensions(card.selectedDimensions)" 
              :key="tagIndex"
              class="tag-item"
            >
              {{ tag }}
            </div>
          </div>
          
          <!-- 第四行：分割线 -->
          <div class="divider-line"></div>
          
          <!-- 第五行：操作按钮 -->
          <div class="card-actions">
            <div
              class="action-button view-btn"
              :class="{ 'hover-view': hoverCardId === index && hoveredButton === 'view' }"
              @mouseenter="hoveredButton = 'view'"
              @mouseleave="hoveredButton = null"
              @click="viewReport(card.reportId)"
            >
              <img :src="hoverCardId === index && hoveredButton === 'view' ? '/img/viewH.png' : '/img/view.png'" alt="查看" />
              <span>查看</span>
            </div>
            <div 
              class="action-button download-btn"
              :class="{ 'hover-download': hoverCardId === index && hoveredButton === 'download' }"
              @mouseenter="hoveredButton = 'download'"
              @mouseleave="hoveredButton = null"
              @click="downloadReport(card.reportId)"
            >
              <img :src="hoverCardId === index && hoveredButton === 'download' ? '/img/downloadH.png' : '/img/download.png'" alt="下载" />
              <span>下载</span>
            </div>
            <div
              class="action-button delete-btn"
              :class="{ 'hover-delete': hoverCardId === index && hoveredButton === 'delete' }"
              @mouseenter="hoveredButton = 'delete'"
              @mouseleave="hoveredButton = null"
              @click="showDeleteDialog(card.reportId)"
            >
              <img :src="hoverCardId === index && hoveredButton === 'delete' ? '/img/deleteH.png' : '/img/delete.png'" alt="删除" />
              <span>删除</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 分页 -->
      <div v-if="total > 0" class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[9, 18, 27, 36]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <div v-if="showDeleteModal" class="delete-modal-overlay" @click.self="hideDeleteDialog">
      <div class="delete-modal">
        <div class="modal-header">
          <span class="modal-title">提示</span>
          <span class="modal-close" @click="hideDeleteDialog">×</span>
        </div>
        <div class="modal-content">
          <p>确认删除此报告的全部内容吗？</p>
        </div>
        <div class="modal-footer">
          <button class="cancel-button" @click="hideDeleteDialog">取消</button>
          <button class="confirm-button" @click="confirmDelete">确定</button>
        </div>
      </div>
    </div>
    </div>

    <!-- 预览视图 -->
    <MyReportPreview
      v-else-if="component === 'preview'"
      :report-id="currentReportId"
      @back="component = 'list'"
    />
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref, reactive, onMounted, shallowRef } from 'vue'
import { reportsMy, reportsDelete } from '../../composables/msg'
import MyReportPreview from './my-report-preview.vue'
// 接口
import {
     // 下载报告数据
    savelorReportsDownload,
} from "../../composables/login.ts";

// 组件切换
const component = shallowRef('list')
const currentReportId = ref('')

// 表单数据
const formData = reactive({
  time: 'all',
  type: 'all',
  subject: ''
})

// 分页参数
const currentPage = ref(1)
const pageSize = ref(9)
const total = ref(0)

// 卡片数据
const cardList = reactive([])
const loading = ref(false)
const hoverCardId = ref(null)
const hoveredButton = ref(null)

// 删除弹窗相关数据
const showDeleteModal = ref(false)
const deleteTargetId = ref(null)

// 维度映射
const dimensionMap = {
  'DIM1_IDENTITY': '企业身份与存续状态',
  'DIM2_SANCTIONS': '制裁与贸易管制',
  'DIM3_REGULATORY': '金融与证券监管',
  'DIM4_LITIGATION': '司法与诉讼记录',
  'DIM5_BUSINESS': '商业行为与监管'
}

// 解析维度字段
const parseDimensions = (dimensionsStr) => {
  if (!dimensionsStr) return []
  try {
    const dimensions = JSON.parse(dimensionsStr)
    return dimensions.map(dim => dimensionMap[dim] || dim)
  } catch (error) {
    console.error('解析维度失败:', error)
    return []
  }
}

// 格式化时间
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 映射时间参数
const timeRangeMap = {
  'all': 'ALL',
  '7days': 'LAST_7',
  '30days': 'LAST_30',
  '60days': 'LAST_60'
}

// 获取报告列表
const fetchReports = async () => {
  loading.value = true
  try {
    const res = await reportsMy({
      page: currentPage.value,
      size: pageSize.value,
      timeRange: timeRangeMap[formData.time] || 'ALL',
      type: formData.type === 'all' ? '' : formData.type,
      keyword: formData.subject
    })

    if (res.code === 200) {
      cardList.length = 0
      const list = res.data.list || []
      list.forEach(item => cardList.push(item))
      total.value = res.data.total || 0
    } else {
      ElMessage.error(res.message || '获取报告列表失败')
    }
    console.log(cardList)
  } catch (error) {
    console.error('获取报告列表失败:', error)
    const errorMsg = error?.response?.data?.message || error?.message || '获取报告列表失败，请稍后重试'
    ElMessage.error(errorMsg)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchReports()
}

// 分页改变
const handlePageChange = (page) => {
  currentPage.value = page
  fetchReports()
}

// 每页数量改变
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  fetchReports()
}

// 显示删除确认弹窗
const showDeleteDialog = (reportId) => {
  deleteTargetId.value = reportId
  showDeleteModal.value = true
}

// 隐藏删除确认弹窗
const hideDeleteDialog = () => {
  showDeleteModal.value = false
  deleteTargetId.value = null
}

// 确认删除报告
const confirmDelete = async () => {
  if (deleteTargetId.value) {
    try {
      const res = await reportsDelete({ reportId: deleteTargetId.value })
      if (res.code === 200) {
        // 删除成功,重新获取列表
        ElMessage.success('报告删除成功')
        fetchReports()
        hideDeleteDialog()
      }
    } catch (error) {
      console.error('删除报告失败:', error)
      ElMessage.error('报告删除失败，请重试')
    }
  }
}

// 查看报告
const viewReport = (reportId) => {
  currentReportId.value = reportId
  component.value = 'preview'
}
// 下载完整报告
const downloadReport = (reportId) => {
    ElMessage.success('正在下载完整报告...')
    savelorReportsDownload({
        reportId: reportId,
        fileType: 'pdf'
    }).then(res => {
        let blob = new Blob([res], {
            type: "application/vnd.ms-excel;charset=UTF-8",
        });
        let objUrl = URL.createObjectURL(blob);
        let fileLink = document.createElement("a");
        let fileName = `report_${reportId}.pdf`;
        let format = "pdf";
        fileLink.href = objUrl;
        fileLink.download = `${fileName}.${format}`;
        fileLink.click();
        window.URL.revokeObjectURL(blob);
    }).catch(err => {
        console.error(err);
        // 显示错误提示
        const errorMsg = err.response;
        ElMessage.error(errorMsg);
    })
}
// 初始化加载数据
onMounted(() => {
  fetchReports()
})
</script>

<style scoped lang="scss">
.my-space-page {
  padding: 0 40px;
  min-height: 100vh;
  background: #ffffff;
}

// 搜索模块
.search-module {
  position: sticky;
  top: 0;
  padding: 42px 0;
  background: #ffffff;
  z-index: 10;
  display: flex;
  justify-content: flex-start;
  gap: 16px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.search-button {
  width: 74px;
  height: 44px;
  background: #2134DE;
  color: white;
  border: none;
  border-radius: 8px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #1a2bc5;
    transform: translateY(-1px);
  }
}

.form-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.form-label {
  width: 80px;
  height: 22px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 16px;
  color: #1D2129;
  line-height: 22px;
  text-align: left;
  font-style: normal;
  flex-shrink: 0;
}

.form-control {
  width: 350px;
  height: 44px;
  
  :deep(.el-input__wrapper) {
    background: #F2F3F5;
    border-radius: 8px;
    box-shadow: none;
    padding: 0 16px;
    
    &.is-focus {
      box-shadow: 0 0 0 1px #2134DE inset;
    }
  }
  
  :deep(.el-input__inner) {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #4E5969;
    line-height: 20px;
    text-align: left;
    font-style: normal;
  }
  
  :deep(.el-select__wrapper) {
    background: #F2F3F5;
    border-radius: 8px;
    box-shadow: none;
    padding: 0 16px;
    min-height: 44px;
    
    &.is-focused {
      box-shadow: 0 0 0 1px #2134DE inset;
    }
  }
  
  :deep(.el-select__placeholder) {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #85909C;
  }
  
  :deep(.el-select__selected-item) {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #4E5969;
    line-height: 20px;
  }
}

// 卡片模块
.card-module {
  padding-bottom: 30px;
  max-height: calc(100vh - 104px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  min-height: 200px;
  position: relative;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #E4E5EA;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  :deep(.el-loading-mask) {
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 8px;
  }

  :deep(.el-loading-spinner) {
    .circular {
      stroke: #2134DE;
    }
  }

  :deep(.el-loading-text) {
    color: #2134DE;
    font-size: 14px;
  }
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.card-item {
  width: 100%;
  height: 268px;
  background: #F7F8FA;
  border-radius: 16px;
  border: 1px solid #E4E5EA;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  
  &:hover {
    background: #eeeff7;
    border: 1px solid #2134DE;
  }
}

// 卡片标题
.card-title {
  width: 500px;
  height: 22px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  font-size: 16px;
  color: #1D2129;
  line-height: 22px;
  text-align: left;
  font-style: normal;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 10px;
}

// 卡片元信息
.card-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 15px 0px 17px 0px;
  
  > span {
    height: 20px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #4E5969;
    line-height: 20px;
    text-align: left;
    font-style: normal;
  }
  
  .divider {
    color: #E4E5EA;
    font-size: 10px;
  }
}

// 卡片标签
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: auto;
}

.tag-item {
  height: 36px;
  background: #FFFFFF;
  border-radius: 8px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #4E5969;
  text-align: left;
  font-style: normal;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
}

// 分割线
.divider-line {
  width: 100%;
  border: 1px solid;
  opacity: 0.45;
  border-image: linear-gradient(135deg, rgba(225, 225, 225, 1), rgba(126, 126, 126, 1), rgba(225, 225, 225, 1)) 1 1;
  margin-bottom: 14px;
}

// 操作按钮
.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
}

.action-button {
  width: 74px;
  height: 36px;
  background: #E4E5EA;
  border-radius: 8px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #4E5969;
  text-align: left;
  font-style: normal;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  img {
    width: 30px;
    height: 30px;
  }

  span {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &.hover-delete {
    background: rgba(255, 20, 20, 0.1);
    color: #FF5959;
  }

  &.hover-download,
  &.hover-view {
    background: #c3c8f6;
    color: #2134DE;
  }
}

// 分页
.pagination-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  padding: 24px 0;
  background-color: transparent;
}

// 删除弹窗样式
.delete-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.delete-modal {
  width: 643px;
  height: 314px;
  background: #FFFFFF;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 30px 0;
  border-bottom: none;
  
  .modal-title {
    font-family: 'PingFangSC PingFang SC';
    font-weight: 500;
    font-size: 20px;
    color: #1D2129;
    line-height: 28px;
    text-align: left;
    font-style: normal;
  }
  
  .modal-close {
    font-size: 24px;
    color: #85909C;
    cursor: pointer;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    
    &:hover {
      color: #4E5969;
    }
  }
}

.modal-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  
  p {
    font-family: 'PingFangSC PingFang SC';
    font-weight: 400;
    font-size: 16px;
    color: #4E5969;
    line-height: 22px;
    text-align: center;
    margin: 0;
  }
}

.modal-footer {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 0 0 21px;
  
  .cancel-button {
    width: 100px;
    height: 42px;
    background: #F2F3F5;
    border-radius: 6px;
    border: none;
    font-family: 'PingFangSC PingFang SC';
    font-weight: 500;
    font-size: 16px;
    color: #4E5969;
    line-height: 22px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    
    &:hover {
      background: #E4E5EA;
    }
  }
  
  .confirm-button {
    width: 100px;
    height: 42px;
    background: #2134DE;
    border-radius: 6px;
    border: none;
    font-family: 'PingFangSC PingFang SC';
    font-weight: 500;
    font-size: 16px;
    color: #FFFFFF;
    line-height: 22px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    
    &:hover {
      background: #1a2bc5;
      transform: translateY(-1px);
    }
  }
}
</style>
