<template>
  <div class="my-space-page">
    <!-- 列表视图 -->
    <div v-if="component === 'list'">
      <!-- 卡片模块 -->
      <div v-loading="loading" class="card-module" element-loading-text="加载中...">
        <!-- 空数据状态 -->
        <el-empty v-if="!loading && cardList.length === 0" description="暂无报告数据" :image-size="120" />

        <!-- 卡片列表 -->
        <div v-else class="card-grid">
          <div v-for="(card, index) in cardList" :key="index" class="card-item" @mouseenter="hoverCardId = index"
            @mouseleave="hoverCardId = null">
            <!-- 第一行：标题 -->
            <div class="card-title">{{ card.displayName }}</div>

            <!-- 第二行： -->
            <div class="card-meta">
              <span>{{ formatDate(card.uploadTime) }}</span>
            </div>


            <!-- 第四行：分割线 -->
            <div class="divider-line"></div>

            <!-- 第五行：操作按钮 -->
            <div class="card-actions">
              <div class="action-button view-btn"
                :class="{ 'hover-view': hoverCardId === index && hoveredButton === 'view' }"
                @mouseenter="hoveredButton = 'view'" @mouseleave="hoveredButton = null" @click="viewReport(card)">
                <img :src="hoverCardId === index && hoveredButton === 'view' ? '/img/viewH.png' : '/img/view.png'"
                  alt="查看" />
                <span>查看</span>
              </div>
              <div class="action-button download-btn"
                :class="{ 'hover-download': hoverCardId === index && hoveredButton === 'download' }"
                @mouseenter="hoveredButton = 'download'" @mouseleave="hoveredButton = null"
                @click="downloadReport(card)">
                <img
                  :src="hoverCardId === index && hoveredButton === 'download' ? '/img/downloadH.png' : '/img/download.png'"
                  alt="下载" />
                <span>下载</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="total > 0" class="pagination-wrapper">
          <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[9, 18, 27, 36]"
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
import { whitepapers } from '../../composables/msg'
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

// 分页参数
const currentPage = ref(1)
const pageSize = ref(9)
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

// 获取报告列表
const fetchReports = async () => {
  loading.value = true
  try {
    const res = await whitepapers()

    if (res.code === 200) {
      cardList.length = 0
      const list = res.data || []
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
  console.log(card, 'cardcardcardcardcardcardcardcardcardcardcardcard');

  savelorWhitepapersDownload({
    filename: card.fileName,
    action: 'preview'
  }).then(res => {
    console.log(res, 'resresresresres');

    let blob = new Blob([res], {
      type: "application/vnd.ms-excel;charset=UTF-8",
    });
    let objUrl = URL.createObjectURL(blob);
    let fileLink = document.createElement("a");
    let fileName = `report_${card.fileName}.pdf`;
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
  height: 168px;
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

  >span {
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
</style>
