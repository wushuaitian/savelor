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
        <!-- 新增空间卡片 -->
        <div class="space-card add-card" @click="addNewSpace">
          <div class="add-content">
            <img src="/img/spaceAdd.png" alt="新增空间" class="add-icon">
          </div>
        </div>
        <!-- 空间卡片 -->
        <div v-for="(space, index) in allSpaces" :key="index" class="space-card">
          <div class="space-image-wrapper" @click="spacesDetailsClick(space)">
            <img src="/img/introduc-one.png" alt="空间封面" class="space-image">
          </div>
          <div class="space-name">
            <div v-if="editingSpaceId !== space.id" class="name-text">{{ space.name }}</div>
            <input 
              v-else
              v-model="editingSpaceName"
              class="name-input"
              @blur="saveSpaceName(space)"
              @keyup.enter="saveSpaceName(space)"
              @keyup.esc="cancelEdit"
            />
            <el-popover
              placement="bottom"
              :show-arrow="false"
              :width="120"
              trigger="manual"
              :visible="visibleMenuId === space.id"
              popper-class="space-actions-popover"
            >
              <template #reference>
                <div class="menu-button" @click.stop="toggleMenu(space)">
                  <span>···</span>
                </div>
              </template>
              <div class="popover-content">
                <div class="menu-item" @click.stop="editSpace(space)">
                  修改空间名称
                </div>
                <div class="menu-item" @click.stop="showDeleteDialog(space)">
                  删除
                </div>
              </div>
            </el-popover>
          </div>
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
    
    <!-- 删除确认弹窗 -->
    <div v-if="showDeleteModal" class="delete-modal-overlay" @click.self="hideDeleteDialog">
      <div class="delete-modal">
        <div class="modal-header">
          <span class="modal-title">提示</span>
          <span class="modal-close" @click="hideDeleteDialog">×</span>
        </div>
        <div class="modal-content">
          <p>确认删除此空间全部内容吗？</p>
        </div>
        <div class="modal-footer">
          <button class="cancel-button" @click="hideDeleteDialog">取消</button>
          <button class="confirm-button" @click="confirmDelete">确认</button>
        </div>
      </div>
    </div>

    <!-- 新建空间弹窗 -->
    <div v-if="showCreateModal" class="delete-modal-overlay" @click.self="hideCreateDialog">
      <div class="delete-modal">
        <div class="modal-header">
          <span class="modal-title">新建空间名称</span>
          <span class="modal-close" @click="hideCreateDialog">×</span>
        </div>
        <div class="create-modal-content">
          <div class="create-label">空间名称</div>
          <div class="create-input-wrapper">
            <input 
              v-model="newSpaceName"
              class="create-input"
              placeholder="请输入空间名称"
              @keyup.enter="confirmCreate"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-button" @click="hideCreateDialog">取消</button>
          <button class="confirm-button" @click="confirmCreate">完成</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref,reactive, onMounted, computed, watch, nextTick } from 'vue';
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
// 编辑相关数据
const editingSpaceId = ref('')
const editingSpaceName = ref('')
const visibleMenuId = ref('')
// 删除弹窗相关数据
const showDeleteModal = ref(false)
const deleteTargetSpace = ref(null)
// 新建弹窗相关数据
const showCreateModal = ref(false)
const newSpaceName = ref('')

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

// 切换菜单状态
const toggleMenu = (space) => {
  visibleMenuId.value = visibleMenuId.value === space.id ? '' : space.id
}

// 关闭所有菜单
const closeAllMenus = () => {
  visibleMenuId.value = ''
}

// 修改空间名称
const editSpace = (space) => {
  visibleMenuId.value = ''
  editingSpaceId.value = space.id
  editingSpaceName.value = space.name
  // 下一帧聚焦输入框
  nextTick(() => {
    const input = document.querySelector('.name-input')
    if (input) {
      input.focus()
      input.select()
    }
  })
}

// 保存空间名称
const saveSpaceName = (space) => {
  if (editingSpaceName.value.trim() && editingSpaceName.value !== space.name) {
    console.log('保存新名称:', editingSpaceName.value)
    // TODO: 调用API更新空间名称
    space.name = editingSpaceName.value
  }
  editingSpaceId.value = ''
  editingSpaceName.value = ''
}

// 取消编辑
const cancelEdit = () => {
  editingSpaceId.value = ''
  editingSpaceName.value = ''
}

// 显示删除确认弹窗
const showDeleteDialog = (space) => {
  visibleMenuId.value = ''
  deleteTargetSpace.value = space
  showDeleteModal.value = true
}

// 隐藏删除确认弹窗
const hideDeleteDialog = () => {
  showDeleteModal.value = false
  deleteTargetSpace.value = null
}

// 确认删除空间
const confirmDelete = () => {
  if (deleteTargetSpace.value) {
    console.log('删除空间:', deleteTargetSpace.value.name)
    // TODO: 实现删除空间的逻辑
    // 这里应该调用API删除空间
    hideDeleteDialog()
  }
}

// 显示新建空间弹窗
const showCreateDialog = () => {
  newSpaceName.value = ''
  showCreateModal.value = true
}

// 隐藏新建空间弹窗
const hideCreateDialog = () => {
  showCreateModal.value = false
  newSpaceName.value = ''
}

// 确认新建空间
const confirmCreate = () => {
  if (newSpaceName.value.trim()) {
    console.log('新建空间:', newSpaceName.value)
    // TODO: 实现新建空间的逻辑
    // 这里应该调用API创建空间
    hideCreateDialog()
  }
}

// 新增空间
const addNewSpace = () => {
  showCreateDialog()
}


const spacesDetailsClick = (space) => {
  emit('spaceCreated', space.id)
   localStorage.setItem('workspaceId', space.id);
}


onMounted(() => {
  getAllSpaces()
  
  // 点击页面其他地方关闭菜单
  document.addEventListener('click', closeAllMenus)
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
  width: 407px;
  height: 42px;
  background: #F7F8FA;
  border-radius: 25px;
  border: 1px solid #E4E5EA;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  z-index: 10;
}

.search-input {
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  text-align: left;
  font-style: normal;
  padding: 0 10px;
  
  &::placeholder {
    color: #C8CCD5;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
  }
}

.search-button {
  width: 71px;
  height: 34px;
  background: #2134DE;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  font-size: 16px;
  color: #FFFFFF;
  line-height: 22px;
  text-align: left;
  font-style: normal;
  
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
  width: 440px;
  height: 220px;
  background: #F7F8FA;
  border-radius: 21px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;

  &.add-card {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.space-image-wrapper {
  width: 440px;
  height: 157px;
  position: relative;
  overflow: hidden;
}

.space-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.add-content {
  display: flex;
  align-items: center;
  justify-content: center;
  
  .add-icon {
    width: 56px;
    height: 56px;
  }
}

.space-card:hover .space-image {
  transform: scale(1.05);
}

.space-name {
  width: 100%;
  height: 63px;
  padding: 12px 24px;
  font-size: 14px;
  color: $color-text;
  background-color: $bg-gray-light;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  
  .name-text {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 20px;
    color: #4E5969;
    line-height: 28px;
    text-align: left;
    font-style: normal;
  }
  
  .name-input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 20px;
    color: #2134DE;
    line-height: 28px;
    text-align: left;
    font-style: normal;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .menu-button {
    width: 26px;
    height: 26px;
    background-color: transparent;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-left: 12px;
    
    span {
      font-size: 14px;
      color: $color-text-light;
      font-weight: 600;
      letter-spacing: -0.9px;
      line-height: 0.8;
    }
    
    &:hover {
      background-color: #E3F2FD;
      
      span {
        color: #1976D2;
      }
    }
  }
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


.menu-item {
      padding: 10px 0;
      cursor: pointer;
      transition: background-color 0.3s ease;
      font-family: 'PingFangSC PingFang SC';
      border-bottom: 1px solid #E4E7ED;
      text-align: center;
border-radius: 1px;


font-weight: 400;
font-size: 14px;
color: #4E5969;
line-height: 20px;
font-style: normal;
      
      &:hover{
background: #E9EBFC;
border-radius: 7px;

font-weight: 500;
font-size: 14px;
color: #2134DE;
line-height: 20px;
font-style: normal;
      }
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

// 新建弹窗内容样式
.create-modal-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 32px 30px 0;
  gap: 16px;
  
  .create-label {
    width: 64px;
    height: 22px;
    font-family: 'PingFangSC PingFang SC';
    font-weight: 500;
    font-size: 16px;
    color: #4E5969;
    line-height: 22px;
    text-align: left;
    font-style: normal;
  }
  
  .create-input-wrapper {
    height: 50px;
    background: #F2F3F5;
    border-radius: 8px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    
    .create-input {
      width: 100%;
      height: 22px;
      border: none;
      outline: none;
      background: transparent;
      font-family: 'PingFangSC PingFang SC';
      font-weight: 400;
      font-size: 16px;
      color: #85909C;
      line-height: 22px;
      text-align: left;
      font-style: normal;
      
      &::placeholder {
        color: #85909C;
      }
      
      &:focus {
        color: #1D2129;
      }
    }
  }
}
</style>