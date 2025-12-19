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
      
      <div class="space-grid">
        <!-- 空间卡片 -->
        <div v-for="(space, index) in paginatedSpaces" :key="index" class="space-card">
          <div class="space-image-wrapper" @click="spacesDetailsClick(space)">
            <img src="/img/introduc-one.png" alt="空间封面" class="space-image">
          </div>
          <div class="space-name">{{ space.name }}</div>
        </div>
      </div>
      <!-- 分页组件 -->
      <div class="pagination-wrapper">
        <t-page :page-option="pageOption" @search="handlePageChange" />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { loonoolWorkspacesMyAll } from "../../composables/login";
import { pageModelFn } from '../components/utils/modelManage'

const emit = defineEmits(['spaceCreated']); 

// 定义空间数据
const allSpaces = ref([])
const originalSpaces = ref([]) // 原始数据备份
// Loading 状态
const loading = ref(true)
// 搜索关键词
const searchKeyword = ref('')

// 获取所有空间数据
const getAllSpaces = async () => {
  loading.value = true
  try {
    const res = await loonoolWorkspacesMyAll({})
    if (res.code === 200) {
      allSpaces.value = res.data
      originalSpaces.value = [...res.data] // 保存原始数据
    }
  } finally {
    loading.value = false
  }
}

// 搜索处理函数
const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    // 如果搜索框为空，恢复原始数据
    allSpaces.value = [...originalSpaces.value]
  } else {
    // 过滤匹配的数据
    const filtered = originalSpaces.value.filter(space => 
      space.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
    allSpaces.value = filtered
  }
  // 重置到第一页
  pageOption.value.pageNum = 1
}


const spacesDetailsClick = (space) => {
  emit('spaceCreated', space.id)
   localStorage.setItem('workspaceId', space.id);
}
// 初始化分页配置（每页显示16个，4x4网格）
const pageOption = ref(pageModelFn({
  total: allSpaces.value.length,
  pageSize: 16,
  pageNum: 1,
  layout: "total, sizes, prev, pager, next, jumper",
  pageSizes: [8, 16, 24, 32]
}))

// 计算当前页显示的空间数据
const paginatedSpaces = computed(() => {
  const start = (pageOption.value.pageNum - 1) * pageOption.value.pageSize
  const end = start + pageOption.value.pageSize
  return allSpaces.value.slice(start, end)
})

// 监听数据变化，更新分页总数
watch(() => allSpaces.value.length, (newLength) => {
  pageOption.value.total = newLength
  // 如果当前页没有数据了，跳转到第一页
  const maxPage = Math.ceil(newLength / pageOption.value.pageSize) || 1
  if (pageOption.value.pageNum > maxPage) {
    pageOption.value.pageNum = 1
  }
})

// 处理分页变化
const handlePageChange = (option) => {
  pageOption.value = { ...option }
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
  margin-top: 20px; // 为顶部搜索模块留出空间
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