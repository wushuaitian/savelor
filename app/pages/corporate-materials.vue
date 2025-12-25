<!-- 企业材料 -->
<template>
   <div class="material-page">
      <div class="container">
         <div class="left-column flex flex-column">
            <div class="left-top flex justify-between flex-column">
               <div class="not-yet-upload">
                  <div :class="fileList.length === 0 ? '' : 'upload-wrapper'">
                     <el-upload class="upload-demo" :drag="fileList.length === 0"
                        :list-type="fileList.length > 0 ? 'picture-card' : undefined" :on-remove="handleRemove"
                        v-model:file-list="fileList" multiple :limit="5" :before-upload="beforeUpload"
                        :accept="acceptTypes" :on-exceed="handleExceed" :auto-upload="false">
                        <template #file="{ file }">
                           <div class="custom-file-item">
                              <div class="file-icon-wrapper">
                                 <el-icon class="file-icon">
                                    <Document />
                                 </el-icon>
                              </div>
                              <div class="file-name">{{ file.name }}</div>
                              <span class="el-upload-list__item-delete" @click="handleRemove(file, fileList)">
                                 <el-icon>
                                    <Delete />
                                 </el-icon>
                              </span>
                           </div>
                        </template>
                        <div class="el-upload__text flex flex-column" v-if="fileList.length === 0">
                           <img src="/img/upload-img.png" alt="" class="upload-img">
                           <div class="flex flex-column m-l-10">
                              <div class="text-12 text-bold-400">
                                 点击或拖拽上传您的商业文件
                              </div>
                              <div class="text-12 text-bold-400 m-t-5">
                                 支持PDF、DOC、DOCX、TXT格式
                              </div>
                           </div>
                        </div>
                        <div v-else class="el-upload__text flex justify-center">
                           <div class="upload-add-item" @click="triggerUpload">
                              <el-icon class="upload-icon">
                                 <Plus />
                              </el-icon>
                           </div>
                        </div>
                     </el-upload>
                  </div>
               </div>
               <div :class="fileList.length == 0 ? 'analyze-button-disable' : 'analyze-button'">开始分析</div>
            </div>
            <div class="left-bottom">
               <div class="certification-title">认证记录</div>
               <el-tree ref="treeRef" class="certification-tree" :data="certificationTreeData" node-key="id"
                  :props="treeProps" :default-expanded-keys="defaultExpandedKeys" @node-click="handleNodeClick">
                  <template #default="{ node, data }">
                     <div class="tree-node-wrapper" :class="{
                        'is-selected': data.type === 'folder' ? selectedFolderId === data.id : selectedFileId === data.id
                     }">
                        <div class="tree-node-content">
                           <!-- 文件夹节点 -->
                           <template v-if="data.type === 'folder'">
                              <el-icon class="folder-icon">
                                 <Folder />
                              </el-icon>
                              <span class="node-label">{{ data.label }}</span>
                              <span class="download-all-text" @click.stop="downloadAll(data)">全部下载</span>
                              <el-icon class="expand-icon" @click.stop="toggleExpand(node, data)">
                                 <ArrowUp v-if="node.expanded" />
                                 <ArrowDown v-else />
                              </el-icon>
                           </template>
                           <!-- 文件节点 -->
                           <template v-else>
                              <el-icon class="file-icon-pdf">
                                 <Document />
                              </el-icon>
                              <span class="node-label">{{ data.label }}</span>
                              <el-icon class="download-icon" @click.stop="downloadFile(data)">
                                 <Download />
                              </el-icon>
                           </template>
                        </div>
                     </div>
                  </template>
               </el-tree>
            </div>
         </div>
         <div class="center-column flex flex-column">
            <div class="text-18 text-bold-500 m-b-20">
               关键宣称预览
            </div>
            <div class="text-center" v-html="aaa"></div>
         </div>
         <div class="right-column flex flex-column">
            <div class="right-top p-20 b-r-8">
               <div class="right-top-title text-18 text-bold-500 m-b-20">
                  基础信息
               </div>
               <el-form :model="informationData" class="demo-form-inline" label-position="top">
                  <el-form-item label="企业名称">
                     <el-input v-model="informationData.name" placeholder="智联感激科技有限公司" />
                  </el-form-item>
                  <el-form-item label="注册地-法律主体">
                     <el-input v-model="informationData.address" placeholder="浙江省-杭州市 智联感激科技有限公司" />
                  </el-form-item>
               </el-form>
            </div>
            <div class="right-bottom">
               <div class="text-18 text-bold-500 m-b-20">
                  提取的关键宣称
               </div>
               <!-- 验证切换 -->
               <div class="tap-list flex align-center m-b-20">
                  <div class=" text-bold-500 m-r-30" v-for="(item, index) in declareTap" :key="index"
                     @click="rightTapClick(item)"
                     :class="item.value == declareTapCurrent ? 'tap-item-active' : 'tap-item'">
                     {{ item.label }}
                     <span v-show="item.value != 'all'">({{ item.number }})</span>
                  </div>
               </div>
               <!-- 宣称列表 -->
               <div class="claim-list">
                  <div class="claim-item" v-for="(item, index) in filteredClaimList" :key="item.id">
                     <div class="claim-content">
                        <div class="claim-number">{{ index + 1 }}.</div>
                        <div class="claim-info">
                           <div class="claim-title">{{ item.title }}</div>
                           <div class="claim-source">来源: {{ item.source }}</div>
                        </div>
                        <div class="claim-status" :class="item.status === 'verified' ? 'status-verified' : 'status-unverified'">
                           {{ item.status === 'verified' ? '已验证' : '未验证' }}
                        </div>
                     </div>
                  </div>
               </div>
               <!-- 下载验证报告按钮 -->
               <div class="download-report-btn" @click="downloadReport">
                  下载验证报告
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, Delete, Plus, Folder, Download, ArrowDown, ArrowUp } from '@element-plus/icons-vue'

// 文件列表
const fileList = ref([])

// 接受的文件类型
const acceptTypes = '.pdf,.doc,.docx,.txt'
const aaa = '投标文件<br/>项目名称：2026年北京市智慧交通管理系统升级项目<br/>投标单位：北京华信科创科技有限公司<br/>提交日期：2025年12月20日<br/>一、公司简介<br/>北京华信科创科技有限公司（以下简称“华信科技”）成立于2005年，注册资本1亿元人民币，总部位于北京市昌平区科技园区。<mark class=\"claim-hl unverified\" data-claim-id=\"2003668748426383366\" data-claim-no=\"2\">公司专注于智能交通、城市大脑、大数据平台研发与实施，是国家高新技术企业、中关村瞪羚企业</mark>。<br/>公司法定代表人：张伟。<br/>统一社会信用代码：91110108778654321X（示例）。<br/>二、企业资质与认证<br/>拥有电子与智能化工程专业承包一级资质（证书编号：D211012345）；<br/>通过ISO 9001:2015 质量管理体系认证、ISO 27001 信息安全管理体系认证；<br/>获得CMMI 5级软件成熟度认证（2022年颁发，有效期至2027年）；<br/>是2008年北京奥运会官方技术服务商之一，为奥运交通调度系统提供核心支持。<br/>三、典型项目业绩<br/>项目名称\t客户单位\t合同金额\t实施时间\t角色<br/>北京市公交智能调度平台\t北京市交通委员会\t￥8,600万元\t2015–2017年\t总集成商<br/>雄安新区城市大脑一期\t雄安新区管委会\t￥2.3亿元\t2020–2022年\t软件开发商<br/>上海市地铁AI客流预测系统\t上海申通地铁集团\t￥4,200万元\t2023年\t技术提供商<br/>成都市智慧停车平台\t成都市住建局\t￥3,100万元\t2024年\t运维服务商<br/><br/><br/>注：以上项目均已验收并投入稳定运行。<br/>四、所获荣誉与奖项<br/>2010年荣获“国家级绿色工厂”称号（由工信部颁发）；<br/>2018年入选“中国智慧城市十大创新企业”（由中国信息协会评选）；<br/><mark class=\"claim-hl unverified\" data-claim-id=\"2003668748493492226\" data-claim-no=\"3\">2021年“城市交通大脑V3.0”获中国专利优秀奖</mark>；<br/>2023年被评为“北京市诚信示范企业”。<br/>五、项目团队<br/><mark class=\"claim-hl unverified\" data-claim-id=\"2003668748426383363\" data-claim-no=\"1\">本项目拟派项目经理李明，拥有PMP认证及15年智能交通项目经验，曾主导2008年奥运会交通信息系统建设</mark>。<br/><br/>六、承诺声明<br/>我公司郑重承诺：<br/>所提供资料真实、准确、完整；<br/>无重大违法记录；<br/>近三年未发生重大安全事故。<br/>华信科技有限公司<br/>（公章）<br/><br/>2025年12月20日<br/>'


// 触发上传的方法
const triggerUpload = () => {
   // 通过点击事件触发上传，Element Plus 会自动处理
   document.querySelector('.el-upload__input')?.click()
}
// 删除文件
const handleRemove = (uploadFile, uploadFiles) => {
   // 如果文件有预览 URL，释放它
   if (uploadFile.url && uploadFile.url.startsWith('blob:')) {
      URL.revokeObjectURL(uploadFile.url)
   }
   console.log(uploadFile, uploadFiles)
}


// 上传前验证
const beforeUpload = (rawFile) => {
   // 检查文件类型
   const allowedTypes = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain']

   if (!allowedTypes.includes(rawFile.type)) {
      ElMessage.error('不支持的文件格式，请上传 PDF、DOC、DOCX、TXT 文件')
      return false
   }

   // 检查文件大小（10MB）
   if (rawFile.size > 10 * 1024 * 1024) {
      ElMessage.error('文件大小不能超过 10MB')
      return false
   }

   return true
}

// 超出限制时的处理
const handleExceed = (files, uploadFiles) => {
   ElMessage.warning(`最多只能上传 ${5} 个文件`)
}

// 认证记录树形数据
const certificationTreeData = ref([
   {
      id: '1',
      label: '2025-09-30',
      type: 'folder',
      children: [
         { id: '1-1', label: '投标文件.pdf', type: 'file' },
         { id: '1-2', label: '投标文件.pdf', type: 'file' },
         { id: '1-3', label: '投标文件.pdf', type: 'file' },
         { id: '1-4', label: '投标文件.pdf', type: 'file' },
         { id: '1-5', label: '投标文件.pdf', type: 'file' }
      ]
   },
   {
      id: '2',
      label: '2025-09-30',
      type: 'folder',
      children: [
         { id: '2-1', label: '投标文件.pdf', type: 'file' },
         { id: '2-2', label: '投标文件.pdf', type: 'file' }
      ]
   },
   {
      id: '3',
      label: '2025-09-30',
      type: 'folder',
      children: [
         { id: '3-1', label: '投标文件.pdf', type: 'file' }
      ]
   },
   {
      id: '4',
      label: '2025-09-30',
      type: 'folder',
      children: [
         { id: '4-1', label: '投标文件.pdf', type: 'file' },
         { id: '4-2', label: '投标文件.pdf', type: 'file' }
      ]
   },
   {
      id: '5',
      label: '2025-09-30',
      type: 'folder',
      children: [
         { id: '5-1', label: '投标文件.pdf', type: 'file' }
      ]
   }
])

// 树形控件配置
const treeProps = {
   children: 'children',
   label: 'label'
}

// 树形控件引用
const treeRef = ref(null)

// 选中的文件夹ID
const selectedFolderId = ref(null)

// 选中的文件ID
const selectedFileId = ref(null)

// 默认展开的节点keys（第一个文件夹）
const defaultExpandedKeys = ref(['1'])

// 节点点击事件
const handleNodeClick = (data) => {
   // 文件夹和文件的选中状态是独立的
   if (data.type === 'folder') {
      selectedFolderId.value = data.id
   } else {
      selectedFileId.value = data.id
   }
}

// 切换展开/折叠
const toggleExpand = (node, data) => {
   if (treeRef.value) {
      node.expanded = !node.expanded
      const expandedKeys = treeRef.value.getExpandedKeys()
      const index = expandedKeys.indexOf(data.id)
      if (index > -1) {
         expandedKeys.splice(index, 1)
      } else {
         expandedKeys.push(data.id)
      }
      treeRef.value.setExpandedKeys(expandedKeys)
   }
}

// 下载单个文件
const downloadFile = (data) => {
   console.log('下载文件:', data)
   ElMessage.success(`正在下载 ${data.label}`)
}

// 下载文件夹所有文件
const downloadAll = (data) => {
   console.log('下载文件夹所有文件:', data)
   ElMessage.success(`正在下载 ${data.label} 文件夹中的所有文件`)
}


// 基础信息
// 基础信息表单
const informationData = ref({
   name: '',
   address: '',
})

// 宣称列表数据
const claimList = ref([
   {
      id: 1,
      title: '宣智慧城市物联网感知平台 (2022-2023合同额...',
      source: '公司官网, 第三方网站',
      status: 'verified'
   },
   {
      id: 2,
      title: '宣智慧城市物联网感知平台 (2022-2023合同额...',
      source: '公司官网, 第三方网站',
      status: 'verified'
   },
   {
      id: 3,
      title: '宣智慧城市物联网感知平台 (2022-2023合同额...',
      source: '公司官网, 第三方网站',
      status: 'unverified'
   },
   {
      id: 4,
      title: '宣智慧城市物联网感知平台 (2022-2023合同额...',
      source: '公司官网, 第三方网站',
      status: 'verified'
   },
   {
      id: 5,
      title: '宣智慧城市物联网感知平台 (2022-2023合同额...',
      source: '公司官网, 第三方网站',
      status: 'unverified'
   },
   {
      id: 6,
      title: '宣智慧城市物联网感知平台 (2022-2023合同额...',
      source: '公司官网, 第三方网站',
      status: 'verified'
   },
   {
      id: 7,
      title: '宣智慧城市物联网感知平台 (2022-2023合同额...',
      source: '公司官网, 第三方网站',
      status: 'verified'
   },
   {
      id: 8,
      title: '宣智慧城市物联网感知平台 (2022-2023合同额...',
      source: '公司官网, 第三方网站',
      status: 'unverified'
   },
   {
      id: 9,
      title: '宣智慧城市物联网感知平台 (2022-2023合同额...',
      source: '公司官网, 第三方网站',
      status: 'verified'
   },
   {
      id: 10,
      title: '宣智慧城市物联网感知平台 (2022-2023合同额...',
      source: '公司官网, 第三方网站',
      status: 'unverified'
   }
])

// 提取的关键宣称 - 使用计算属性动态更新数量
const declareTap = computed(() => {
   const verifiedCount = claimList.value.filter(item => item.status === 'verified').length
   const unverifiedCount = claimList.value.filter(item => item.status === 'unverified').length
   
   return [
      {
         label: '全部',
         value: 'all',
         number: 0,
      },
      {
         label: '已验证',
         value: 'already',
         number: verifiedCount,
      },
      {
         label: '未验证',
         value: 'notYet',
         number: unverifiedCount,
      },
   ]
})

// 宣称tap当前选择
const declareTapCurrent = ref('all')

// 过滤后的宣称列表
const filteredClaimList = computed(() => {
   if (declareTapCurrent.value === 'all') {
      return claimList.value
   } else if (declareTapCurrent.value === 'already') {
      return claimList.value.filter(item => item.status === 'verified')
   } else if (declareTapCurrent.value === 'notYet') {
      return claimList.value.filter(item => item.status === 'unverified')
   }
   return claimList.value
})

// 宣称tap切换
const rightTapClick = (val) => {
   console.log(val)
   declareTapCurrent.value = val.value
}

// 下载验证报告
const downloadReport = () => {
   ElMessage.success('正在下载验证报告...')
   // TODO: 实现下载逻辑
}
</script>


<style lang="scss" scoped>
.material-page {
   min-height: 100vh;
   width: 100%;
   padding: 20px;
   font-weight: 400;

   .container {
      display: flex;
      gap: 20px;
      height: 100vh;
   }
}

.left-column {
   width: 400px;
   gap: 20px;
   overflow-y: auto;
   background-color: azure;

   .left-top {
      flex: 0.3;

      .not-yet-upload {
         .upload-wrapper {
            border: 1px dashed #2134DE;
            border-radius: 8px;
            padding: 16px;
            background-color: #FFFFFF;
            height: 180px !important;
            box-sizing: border-box;
         }

         :deep(.el-upload-dragger) {
            display: flex;
            justify-content: space-evenly;
            height: 180px !important;
            background-color: #F7F8FA;
            border: 1px dashed #E4E5EA;
         }

         :deep(.el-upload-dragger:hover) {
            background-color: #E9EBFC !important;
            border: 1px dashed #2134DE !important;
         }

         :deep(.el-upload__text) {
            font-size: 12px;
            color: #88939E;
            display: flex;
            align-items: center;
            justify-content: center;
         }

         .upload-img {
            width: 93px;
            height: 67px;
         }

         // 照片墙样式
         :deep(.el-upload-list--picture-card) {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin: 0;

            .el-upload-list__item {
               width: 70px;
               height: 70px;
               border-radius: 8px;
               margin: 0;
               position: relative;
               overflow: visible;

               &:hover {
                  border: 1px dashed #999999;
               }
            }
         }

         // 自定义文件项样式
         .custom-file-item {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            padding: 8px;
            box-sizing: border-box;

            .file-icon-wrapper {
               width: 40px;
               height: 40px;
               display: flex;
               align-items: center;
               justify-content: center;
               background-color: #F7F8FA;
               border-radius: 6px;
               margin-bottom: 4px;

               .file-icon {
                  font-size: 24px;
                  color: #2134DE;
               }
            }

            .file-name {
               font-size: 10px;
               color: #88939E;
               text-align: center;
               overflow: hidden;
               text-overflow: ellipsis;
               white-space: nowrap;
               width: 100%;
               max-width: 100%;
            }

            .el-upload-list__item-delete {
               position: absolute;
               top: -8px;
               right: -8px;
               width: 20px;
               height: 20px;
               background-color: rgba(0, 0, 0, 0.7);
               border-radius: 50%;
               display: flex;
               align-items: center;
               justify-content: center;
               cursor: pointer;
               z-index: 10;
               transition: all 0.3s;

               &:hover {
                  background-color: rgba(0, 0, 0, 0.9);
               }

               .el-icon {
                  color: #fff;
                  font-size: 12px;
               }
            }
         }

         :deep(.el-upload--picture-card) {
            width: 70px !important;
            height: 70px !important;
            border-radius: 8px;
            background-color: #FFFFFF;

            &:hover {
               border-color: #C8A2E8;
            }

            .el-icon {
               color: #2134DE;
               font-size: 24px;
            }
         }
      }

      .analyze-button-disable {
         width: 100%;
         text-align: center;
         background-color: #E4E5EA;
         color: #85909C;
         padding: 10px 0px;
         border-radius: 11px;
      }

      .analyze-button {
         width: 100%;
         text-align: center;
         background-color: #2134DE;
         color: #FFFFFF;
         padding: 10px 0px;
         border-radius: 11px;
         cursor: pointer;
      }


   }

   .left-bottom {
      flex: 0.7;
      padding: 16px;
      background-color: #FFFFFF;
      border-radius: 8px;
      overflow-y: auto;

      .certification-title {
         font-size: 16px;
         font-weight: 500;
         color: #333333;
         margin-bottom: 16px;
      }

      :deep(.el-tree-node__content) {
         padding-left: 0 !important;
      }

      :deep(.certification-tree) {
         .el-tree-node {
            margin-bottom: 0;
         }


         .el-tree-node__content {
            height: auto;
            min-height: 48px;
            padding: 0;
            border-radius: 8px;
            margin-bottom: 8px;
            background-color: transparent;
            border: none;
            transition: all 0.3s;

            &:hover {
               background-color: transparent;
            }
         }

         .el-tree-node__expand-icon {
            display: none;
         }

         .el-tree-node__children {
            padding-left: 0;
            margin-top: 1px;
         }

         .tree-node-wrapper {
            width: 100%;
            padding: 12px 16px;
            border-radius: 8px;
            position: relative;
            transition: all 0.3s;
            background-color: #F7F8FA;
            margin-bottom: 8px;

            &:hover {
               background-color: #E9EBFC;
            }

            &.is-selected {
               background-color: #E9EBFC;

               &::before {
                  content: '';
                  position: absolute;
                  left: 0;
                  top: 0;
                  bottom: 0;
                  width: 4px;
                  background-color: #2134DE;
                  border-radius: 8px 0 0 8px;
               }
            }

            .tree-node-content {
               display: flex;
               align-items: center;
               gap: 12px;
               width: 100%;

               .folder-icon {
                  font-size: 20px;
                  color: #FFA500;
                  flex-shrink: 0;
               }

               .file-icon-pdf {
                  font-size: 20px;
                  color: #DC143C;
                  flex-shrink: 0;
               }

               .node-label {
                  flex: 1;
                  font-size: 14px;
                  color: #333333;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
               }

               .download-all-text {
                  font-size: 12px;
                  color: #2134DE;
                  cursor: pointer;
                  flex-shrink: 0;
                  margin-left: auto;
                  padding-right: 8px;
                  user-select: none;

                  &:hover {
                     color: #1a2bb8;
                  }
               }

               .expand-icon {
                  font-size: 14px;
                  color: #666666;
                  cursor: pointer;
                  flex-shrink: 0;
                  transition: all 0.3s;
                  user-select: none;

                  &:hover {
                     color: #2134DE;
                  }
               }

               .download-icon {
                  font-size: 18px;
                  color: #2134DE;
                  cursor: pointer;
                  flex-shrink: 0;
                  transition: all 0.3s;
                  user-select: none;

                  &:hover {
                     color: #1a2bb8;
                     transform: scale(1.1);
                  }
               }
            }
         }
      }
   }
}

.center-column {
   flex: 1;
   gap: 20px;
   overflow-y: auto;
}

.right-column {
   width: 320px;
   gap: 20px;
   overflow-y: auto;
   padding-right: 10px;

   .right-top {
      flex: 0.3;
      background-color: #F7F8FA;

      :deep(.el-form-item__label) {
         color: #85909C;
      }

      :deep(.el-input__wrapper) {
         box-shadow: none !important;
         border-radius: 8px;
         height: 40px;
      }
   }

   .right-bottom {
      flex: 0.7;
      display: flex;
      flex-direction: column;

      .tap-list {
         margin-bottom: 20px;

         .tap-item {
            color: #85909C;
            font-size: 14px;
            cursor: pointer;
         }

         .tap-item-active {
            font-size: 16px;
            color: #2134DE;
            position: relative;

            &::after {
               content: '';
               position: absolute;
               bottom: -10px;
               left: 50%;
               transform: translateX(-50%);
               width: 50%; // 下划线长度，可以自定义修改
               height: 5px;
               background-color: #2134DE;
               border-radius: 16px; // 下划线圆角，可以自定义修改
            }
         }
      }

      .claim-list {
         height: 500px;
         overflow-y: auto;
         margin-bottom: 20px;

         .claim-item {
            margin-bottom: 16px;
            padding: 12px;
            background-color: #FFFFFF;
            border-radius: 8px;
            transition: all 0.3s;

            &:hover {
               background-color: #F7F8FA;
            }

            .claim-content {
               display: flex;
               align-items: flex-start;
               gap: 12px;

               .claim-number {
                  font-size: 14px;
                  color: #333333;
                  font-weight: 500;
                  flex-shrink: 0;
                  line-height: 1.5;
               }

               .claim-info {
                  flex: 1;
                  min-width: 0;

                  .claim-title {
                     font-size: 14px;
                     color: #333333;
                     font-weight: 500;
                     margin-bottom: 8px;
                     line-height: 1.5;
                     overflow: hidden;
                     text-overflow: ellipsis;
                     white-space: nowrap;
                  }

                  .claim-source {
                     font-size: 12px;
                     color: #85909C;
                     line-height: 1.5;
                  }
               }

               .claim-status {
                  flex-shrink: 0;
                  font-size: 14px;
                  font-weight: 500;
                  padding: 4px 8px;
                  border-radius: 4px;

                  &.status-verified {
                     color: #52C41A;
                  }

                  &.status-unverified {
                     color: #FF9800;
                  }
               }
            }
         }
      }

      .download-report-btn {
         width: 100%;
         text-align: center;
         background-color: #E9EBFC;
         color: #2134DE;
         padding: 12px 0;
         border-radius: 8px;
         font-size: 14px;
         font-weight: 500;
         cursor: pointer;
         transition: all 0.3s;
         flex-shrink: 0;

         &:hover {
            background-color: #D6DAF8;
         }
      }
   }
}
</style>