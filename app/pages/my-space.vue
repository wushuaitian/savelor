<!-- 我的空间 -->
<template>
  <div class="my-space-page">
    <!-- Loading 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <div class="loading-text">正在加载空间数据...</div>
    </div>
    <!-- 内容区域 -->
    <template v-else>
      <!-- 搜索模块 -->
      <div class="search-module">
        <input 
          v-model="searchKeyword" 
          type="text" 
          class="search-input" 
          placeholder="请输入空间名称搜索..."
          @keyup.enter="handleSearch"
        />
        <button class="search-button" @click="handleSearch">搜索</button>
      </div>
      
      <!-- 空间网格 -->
      <div v-if="allSpaces.length > 0" class="space-grid">
        <!-- 空间卡片 -->
        <div v-for="(space, index) in allSpaces" :key="index" class="space-card">
          <div class="space-image-wrapper" @click="spacesDetailsClick(space)">
            <img src="/img/introduc-one.png" alt="空间封面" class="space-image">
          </div>
          <div class="space-name">{{ space.name }}</div>
        </div>
      </div>
      
      <!-- 空数据提示 -->
      <div v-else class="empty-container">
        <el-empty 
          description="暂无匹配的空间数据" 
          :image-size="120"
        >
          <template #description>
            <p class="empty-text">{{ searchKeyword.trim() ? `未找到包含"${searchKeyword}"的空间` : '暂无空间数据' }}</p>
          </template>
          <template #extra>
            <el-button type="primary" @click="clearSearch" v-if="searchKeyword.trim()">
              清空搜索
            </el-button>
          </template>
        </el-empty>
      </div>
      
      <!-- 分页组件 -->
      <div v-if="total > 0" class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[8, 16, 24, 32]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref,reactive, onMounted, computed, watch } from 'vue';
import { spaces } from "../../composables/msg";

const emit = defineEmits(['spaceCreated']); 

// 定义空间数据
const allSpaces = ref([])
// Loading 状态
const loading = ref(true)
// 搜索关键词
const searchKeyword = ref('')
// 分页相关数据
const currentPage = ref(1)
const pageSize = ref(16)
const total = ref(0)

// 获取所有空间数据
const getAllSpaces = async () => {
  loading.value = true
  try {
    const res = await spaces({
      keyword: searchKeyword.value,
      page: currentPage.value,
      size: pageSize.value
    })
    if (res.code === 200) {
      allSpaces.value = res.data.records;
      total.value = res.data.total;
    }
  } finally {
    loading.value = false
  }
}

// 搜索处理函数
const handleSearch = () => {
  currentPage.value = 1
  getAllSpaces()
}

// 清空搜索
const clearSearch = () => {
  searchKeyword.value = ''
  currentPage.value = 1
  getAllSpaces()
}

// 处理每页显示数量变化
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1
  getAllSpaces()
}

// 处理页码变化
const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  getAllSpaces()
}


const spacesDetailsClick = (space) => {
  emit('spaceCreated', space.id)
   localStorage.setItem('workspaceId', space.id);
}


onMounted(() => {
  getAllSpaces()
})
</script>

<style scoped lang="scss">
// 颜色变量
$bg-white: #ffffff;
$bg-gray-light: #F7F8FA;
$bg-gray-lighter: #F1F3F5;
$color-text: #1D2129;
$color-text-light: #85909C;

.my-space-page {
  padding: 20px;
  background-color: $bg-white;
  position: relative;
  font-family: 'PingFangSC PingFang SC';
}

// 搜索模块样式
.search-module {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 350px;
  height: 60px;
  background: white;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.search-input {
  flex: 1;
  height: 40px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: $color-text;
  padding: 0 10px;
  
  &::placeholder {
    color: $color-text-light;
  }
}

.search-button {
  width: 70px;
  height: 40px;
  background: #2134DE;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  margin-left: 10px;
  
  &:hover {
    background: #1a2bc5;
    transform: translateY(-1px);
  }
}

.space-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
  margin-top: 80px; // 为顶部搜索模块留出空间
}

.space-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
}

.space-image-wrapper {
  width: 100%;
  height: 120px;
  position: relative;
  overflow: hidden;
}

.space-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.space-card:hover .space-image {
  transform: scale(1.05);
}

.space-name {
  padding: 12px 16px;
  font-size: 14px;
  color: $color-text;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: $bg-gray-light;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  padding: 24px 0;
  background-color: transparent;
}

// 空数据容器样式
.empty-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  width: 100%;
  margin-top: 0;
  
  .empty-text {
    font-size: 14px;
    color: $color-text-light;
    margin: 0;
    line-height: 1.5;
    text-align: center;
  }
}

// Loading 样式
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 60px 20px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid $bg-gray-lighter;
  border-top-color: #2134DE;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 20px;
}

.loading-text {
  font-size: 14px;
  color: $color-text-light;
  font-weight: 400;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>