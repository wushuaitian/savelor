<template>
  <div class="my-space-page">
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
    <div class="card-module">
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
          <div class="card-title">{{ card.title }}</div>
          
          <!-- 第二行：类型、时间、编号、金额 -->
          <div class="card-meta">
            <span>{{ card.type }}</span>
            <span class="divider">|</span>
            <span>{{ card.time }}</span>
            <span class="divider">|</span>
            <span>编号: {{ card.number }}</span>
            <span class="divider">|</span>
            <span>{{ card.amount }}</span>
          </div>
          
          <!-- 第三行：类型标签 -->
          <div class="card-tags">
            <div 
              v-for="(tag, tagIndex) in card.tags.slice(0, 3)" 
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
            >
              <img :src="hoverCardId === index && hoveredButton === 'view' ? '/img/viewH.png' : '/img/view.png'" alt="查看" />
              <span>查看</span>
            </div>
            <div 
              class="action-button download-btn"
              :class="{ 'hover-download': hoverCardId === index && hoveredButton === 'download' }"
              @mouseenter="hoveredButton = 'download'"
              @mouseleave="hoveredButton = null"
            >
              <img :src="hoverCardId === index && hoveredButton === 'download' ? '/img/downloadH.png' : '/img/download.png'" alt="下载" />
              <span>下载</span>
            </div>
            <div 
              class="action-button delete-btn"
              :class="{ 'hover-delete': hoverCardId === index && hoveredButton === 'delete' }"
              @mouseenter="hoveredButton = 'delete'"
              @mouseleave="hoveredButton = null"
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { reportsMy } from '../../composables/msg'

// 表单数据
const formData = reactive({
  time: 'all',
  type: 'general',
  subject: ''
})

// 分页参数
const currentPage = ref(1)
const pageSize = ref(9)
const total = ref(0)

// 卡片数据
const cardList = ref([])
const loading = ref(false)
const hoverCardId = ref(null)
const hoveredButton = ref(null)

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
      type: formData.type,
      keyword: formData.subject
    })
    
    if (res.code === 200) {
      cardList.value = res.data.records || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取报告列表失败:', error)
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

// 初始化加载数据
onMounted(() => {
  fetchReports(false)
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
  width: 420px;
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
  width: 120px;
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
  height: 1px;
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
    background: #E9EBFC;
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
</style>
