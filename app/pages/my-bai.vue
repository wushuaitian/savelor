<template>
  <div class="my-space-page">
    <!-- 列表视图 -->
    <div v-if="component === 'list'">
      <!-- 搜索模块 -->
      <div class="searchView">
        <div class="search-module">
          <input
            v-model="searchKeyword"
            class="search-input"
            placeholder="搜索政策主题、产品或地区，如过敏原、食用油、加州"
            clearable
            @keyup.enter="handleSearch"
          />
          <button class="search-button" @click="handleSearch">搜索</button>
        </div>
        <div class="filter-buttons">
            <el-dropdown trigger="click" @visible-change="handleSourceVisibleChange">
                <button class="filter-button">
                    {{ selectedSource || '全部来源' }}
                    <span class="dropdown-icon">▼</span>
                </button>
                <template #dropdown>
                    <el-dropdown-menu class="custom-dropdown-menu">
                        <el-dropdown-item
                            v-for="item in sourceList"
                            :key="item.code"
                            @click="selectSource(item)"
                            :class="{ 'is-active': selectedSourceCode === item.code }"
                        >
                            {{ item.name }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <el-dropdown trigger="click" @visible-change="handleYearVisibleChange">
                <button class="filter-button year-button">
                    {{ selectedYear || '生效年份' }}
                    <span class="dropdown-icon">▼</span>
                </button>
                <template #dropdown>
                    <el-dropdown-menu class="custom-dropdown-menu">
                        <el-dropdown-item
                            v-for="item in yearList"
                            :key="item.count"
                            @click="selectYear(item)"
                            :class="{ 'is-active': selectedYearCount === item.year }"
                        >
                            {{ item.year }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
      </div>

      <!-- 卡片模块 -->
      <div v-loading="loading" class="card-module" element-loading-text="加载中...">
        <!-- 空数据状态 -->
        <el-empty v-if="!loading && cardList.length === 0" description="暂无报告数据" :image-size="120" />

        <!-- 卡片列表 -->
        <div v-else class="card-grid">
          <div v-for="(card, index) in cardList" :key="index" class="card-item" @mouseenter="hoverCardId = index"
            @mouseleave="hoverCardId = null">
            <!-- 上半部分：标题和时间 -->
            <div class="card-top">
              <!-- 第一行：标题 -->
              <div class="card-title">{{ card.title }}</div>

              <!-- 第二行：时间 -->
              <div class="card-meta">
                <span>{{ formatDate(card.publishedAt) }}</span>
                <span>{{ card.source }}</span>
              </div>
            </div>

            <!-- 下半部分：描述和操作按钮 -->
            <div class="card-bottom">
              <!-- 描述文字 -->
              <div class="card-description">{{ card.summary }}</div>

              <!-- 操作按钮 -->
              <div class="card-actions">
                <!-- <div class="action-button view-btn"
                  :class="{ 'hover-view': hoverCardId === index && hoveredButton === 'view' }"
                  @mouseenter="hoveredButton = 'view'" @mouseleave="hoveredButton = null" @click="viewReport(card)">
                  <img :src="hoverCardId === index && hoveredButton === 'view' ? '/img/viewH.png' : '/img/view.png'"
                    alt="查看" />
                  <span>查看</span>
                </div> -->
                <div class="action-button download-btn"
                  :class="{ 'hover-download': hoverCardId === index && hoveredButton === 'download' }"
                  @mouseenter="hoveredButton = 'download'" @mouseleave="hoveredButton = null"
                  @click="downloadReport(card)">
                  <img
                    :src="hoverCardId === index && hoveredButton === 'download' ? '/img/downloadH.png' : '/img/download.png'"
                    alt="下载完整报告" />
                  <span>下载完整报告</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="total > 0" class="pagination-wrapper">
          <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
            :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
            @current-change="handlePageChange" />
        </div>
      </div>
    </div>

    <!-- 预览视图 -->
    <MyReportPreview v-else-if="component === 'preview'" :report-id="currentReportId" @back="component = 'list'" />
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref, reactive, onMounted, shallowRef } from 'vue'
import { whitepapers, sources, years } from '../../composables/msg'
import MyReportPreview from './my-report-preview.vue'
// 接口
import {
  // 下载报告数据
  savelorReportsDownload,
  savelorWhitepapersDownload
} from "../../composables/login";

// 组件切换
const component = shallowRef('list')
const currentReportId = ref('')

// 搜索关键词
const searchKeyword = ref('')

// 筛选条件
const selectedSource = ref('')
const selectedSourceCode = ref('')
const selectedYear = ref('')
const selectedYearCount = ref('')
const sourceList = ref([])
const yearList = ref([])

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 卡片数据
const cardList = reactive([])
const loading = ref(false)
const hoverCardId = ref(null)
const hoveredButton = ref(null)

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

// 获取来源列表
const fetchSources = async () => {
  try {
    const res = await sources()
    if (res.code === 200) {
      // 在列表第一项添加"全部"选项
      sourceList.value = [
        { name: '全部', code: '' },
        ...(res.data || [])
      ]
    }
  } catch (error) {
    console.error('获取来源列表失败:', error)
  }
}

// 获取年份列表
const fetchYears = async () => {
  try {
    const res = await years()
    if (res.code === 200) {
      // 在列表第一项添加"全部"选项
      yearList.value = [
        { year: '全部', count: '' },
        ...(res.data || [])
      ]
    }
  } catch (error) {
    console.error('获取年份列表失败:', error)
  }
}

// 获取报告列表
const fetchReports = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value
    }

    // 添加搜索关键词
    if (searchKeyword.value.trim()) {
      params.keyword = searchKeyword.value.trim()
    }

    // 添加来源筛选
    if (selectedSourceCode.value) {
      params.source = selectedSourceCode.value
    }

    // 添加年份筛选
    if (selectedYearCount.value) {
      params.year = selectedYearCount.value
    }

    const res = await whitepapers(params)

    if (res.code === 200) {
      cardList.length = 0
      const list = res.data.list || []
      list.forEach(item => cardList.push(item))
      total.value = res.total || list.length || 0
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

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchReports()
}

// 来源下拉框显示/隐藏事件
const handleSourceVisibleChange = (visible) => {
  // 不再需要在这里加载数据，已在初始化时加载
}

// 年份下拉框显示/隐藏事件
const handleYearVisibleChange = (visible) => {
  // 不再需要在这里加载数据，已在初始化时加载
}

// 选择来源
const selectSource = (source) => {
  selectedSource.value = source.name
  selectedSourceCode.value = source.code === '' ? '' : source.code
  currentPage.value = 1
  fetchReports()
}

// 选择年份
const selectYear = (year) => {
  selectedYear.value = year.year
  selectedYearCount.value = year.count === '' ? '' : year.year
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

// 查看报告
const viewReport = (card) => {
  ElMessage.success('正在加载中.....')
  // currentReportId.value = reportId
  savelorWhitepapersDownload({
    filename: card.fileName,
    action: 'preview'
  }).then(res => {
    console.log(res, 'resresresresres');

    const blob = new Blob([res], {
      type: 'application/pdf' // 根据实际文件类型调整 MIME 类型
    });

    // 创建对象 URL
    const url = URL.createObjectURL(blob);

    // 新标签页打开预览
    const newWindow = window.open(url, '_blank');

    // 如果新窗口被阻止弹出，则提示用户手动点击链接
    if (!newWindow) {
      ElMessage.warning('弹窗被阻止，请允许弹窗以预览报告');
    }

    // 清理资源
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000); // 延迟清理，确保新窗口已加载完成

  }).catch(err => {
    console.error(err);
    // 显示错误提示
    const errorMsg = err.response;
    ElMessage.error(errorMsg);
  })
}
// 下载完整报告
const downloadReport = (card) => {
  ElMessage.success('正在下载完整报告...')

  savelorWhitepapersDownload({
    filename: `${card.title}.pdf`,
    action: 'preview'
  }).then(res => {
    console.log(res, 'resresresresres');

    let blob = new Blob([res], {
      type: "application/vnd.ms-excel;charset=UTF-8",
    });
    let objUrl = URL.createObjectURL(blob);
    let fileLink = document.createElement("a");
    let fileName = `report_${card.title}.pdf`;
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
  fetchSources()
  fetchYears()
})
</script>

<style scoped lang="scss">
.my-space-page {
  padding: 0 40px;
  min-height: 100vh;
  background: #ffffff;
}

.searchView {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  padding: 20px 0;
}

// 搜索模块
.search-module {
  width: 40%;
  height: 68px;
  background: #FFFFFF;
  box-shadow: 0px 0px 7px 6px rgba(45, 47, 201, 0.06);
  border-radius: 39px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-sizing: border-box;
  gap: 12px;
}

.search-input {
  flex: 1;
  height: 48px;
  border: none;
  outline: none;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #1D2129;
  background: transparent;
  padding: 0 10px;
}

.search-input::placeholder {
  color: #85909C;
}

.search-button {
  width: 92px;
  height: 48px;
  background: #223A77;
  border-radius: 24px;
  border: none;
  color: #FFFFFF;
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #1a2bc5;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

.filter-buttons {
  display: flex;
  gap: 14px;
}

.filter-button {
  width: 105px;
  height: 48px;
  background: #223A77;
  border-radius: 12px;
  border: none;
  color: #FFFFFF;
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  .dropdown-icon {
    font-size: 10px;
  }

  &:hover {
    background: #FFDF3A;
    color: #223A77;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &.year-button {
    background: rgba(34, 58, 119, 0.2);
    border: 1px solid #223A77;
    color: #223A77;

    &:hover {
      background: #223A77;
      color: #FFFFFF;
    }
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
  margin-top: 20px;
}

.card-item {
  width: 100%;
  height: 298px;
  background: #F7F8FA;
  border-radius: 16px;
  border: 1px solid #E4E5EA;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    background: #eeeff7;
  }
}

.card-top {
  width: 100%;
  height: 126px;
  background: #223A77;
  border-radius: 16px 16px 0px 0px;
  border: 1px solid #E4E5EA;
  flex-shrink: 0;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-bottom {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-description {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 16px;
  color: #4E5969;
  line-height: 22px;
  text-align: left;
  font-style: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  padding: 38px 30px 0px 30px;
}

// 卡片标题
.card-title {
  width: 100%;
  height: 28px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  font-size: 20px;
  color: #FFFFFF;
  line-height: 28px;
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
  justify-content: space-between;
  margin: 15px 0px 17px 0px;

  >span {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #FFFFFF;
    line-height: 22px;
    text-align: left;
    font-style: normal;
  }

  >span:first-child {
    height: 22px;
  }

  >span:last-child {
    height: 22px;
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
  padding: 16px 16px;
}

.action-button {
  width: 120px;
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

  &.hover-download,
  &.hover-view {
    background: #FFDF3A;
    color: #223A77;
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

// 下拉菜单统一样式
:deep(.custom-dropdown-menu) {
  width: 105px;
  border-radius: 12px;
  padding: 4px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  .el-dropdown-menu__item {
    padding: 10px 16px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #4E5969;
    line-height: 22px;
    text-align: left;
    transition: all 0.3s ease;

    &:hover {
      background: #F2F3F5;
      color: #223A77;
    }

    &.is-active {
      background: #223A77;
      color: #FFFFFF;
    }
  }
}


</style>
