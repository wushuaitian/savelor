<template>
  <div class="problem-page">
    <div class="title">Savelor 帮助中心</div>

    <div class="question-list">
      <div
        v-for="(item, index) in qaList"
        :key="index"
        class="question-item-wrapper"
      >
        <div class="question-item" @click="toggleAnswer(index)">
          <div class="question-content">
            <span class="question-title">{{ item.title }}</span>
            <img :src="expandedIndex === index ? upArrow : downArrow" class="arrow-icon" alt="arrow" />
          </div>
        </div>
        <div v-show="expandedIndex === index" class="answer-module">
          <div class="answer-text">
            <p class="question-text">{{ item.question }}</p>
            <p
              v-for="(line, lineIndex) in item.answerLines"
              :key="lineIndex"
              class="answer-text-content"
            >
              {{ line }}
            </p>
            <div v-if="item.hasTable" class="comparison-table">
              <div class="table-header">
                <div class="table-cell">对比项</div>
                <div class="table-cell">通用报告</div>
                <div class="table-cell">专项报告</div>
              </div>
              <div class="table-body">
                <div class="table-cell left-cell">核心价值</div>
                <div class="table-cell middle-cell">全面安心：一次获取所有维度的完整事实，避免遗漏。</div>
                <div class="table-cell right-cell">灵活聚焦：只为需要核验的维度付费，成本可控。</div>
              </div>
              <div class="table-body">
                <div class="table-cell left-cell">覆盖维度</div>
                <div class="table-cell middle-cell">5个维度全覆盖（企业身份、制裁、金融监管、司法记录、商业行为）</div>
                <div class="table-cell right-cell">自由选择单个或多个维度</div>
              </div>
              <div class="table-body">
                <div class="table-cell left-cell">内容深度</div>
                <div class="table-cell middle-cell">在5个维度内，提供基于官方数据源的结构化事实记录</div>
                <div class="table-cell right-cell">在您选择的维度内，提供与通用报告完全同质的结构化事实记录。</div>
              </div>
              <div class="table-body">
                <div class="table-cell left-cell">适用场景</div>
                <div class="table-cell middle-cell">首次背调、全面风险评估、标准尽调流程、追求全面性。</div>
                <div class="table-cell right-cell">针对性复查、预算有限、仅需验证特定假设（如“是否被制裁”）。</div>
              </div>
              <div class="table-body">
                <div class="table-cell left-cell">生成时间</div>
                <div class="table-cell middle-cell">5-10分钟</div>
                <div class="table-cell right-cell">所选维度越多，时间越长，通常在2-8分钟。</div>
              </div>
              <div class="table-body">
                <div class="table-cell left-cell">价格</div>
                <div class="table-cell middle-cell">打包优惠价：80元</div>
                <div class="table-cell right-cell">按维计价：20元/维度</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const expandedIndex = ref(-1);
const downArrow = 'img/downArrow.png';
const upArrow = 'img/upArrow.png';

const qaList = ref([
  {
    title: '一、 产品核心价值',
    question: 'Q：Savelor 是什么？能解决什么问题？',
    answerLines: [
      'A：Savelor 是一款为企业提供即时、结构化、可信赖的合规风险核查工具。它帮助您在合作、投资、供应链管理前，快速识别目标企业是否存在合规隐患（如是否被制裁、是否涉诉、是否合法存续等），降低合作风险，真正做到"合作始于真实"。'
    ]
  },{
    title: '二、 使用流程指南',
    question: 'Q：如何使用 Savelor 生成一份报告？',
    answerLines: [
      'A：只需三步：',
      '(1)输入信息：在"生成报告"页面，填写目标公司的法定全称和注册州（DUNS编号选填）。',
      '(2)选择报告类型：',
      '通用报告：全面覆盖5大合规维度，适合首次背调或全面风险评估。',
      '专项报告：自由选择专项维度进行分析，适合针对性核查。'
    ]
  },{
    title: '三、 报告类型与定价',
    question: 'Q：通用报告和专项报告具体有什么区别？',
    answerLines: [
      'A：两者的核心区别在于 "维度覆盖范围"。在您选择的任何一个维度内，两者提供的事实核查深度、数据来源和格式是基本相同的。'
    ],
    hasTable: true,
    tableData: {
      left: '对比项',
      middle: '通用报告',
      right: '专项报告'
    }
  },{
    title: '四、 数据与可靠性',
    question: 'Q：你们的数据来源是什么？是否可靠？',
    answerLines: [
      'A：所有数据均来自官方或权威第三方数据库，包括但不限于：',
      '美国财政部 OFAC SDN 名单',
      '美国商务部 BIS 实体清单',
      '各州政府企业注册机构（如特拉华州州务卿办公室）',
      '邓白氏 DUNS 数据库',
      '美国 SEC EDGAR 系统',
      '公开司法记录数据库',
      '每项事实均标注核查时间、数据源，确保可追溯、可验证。',
    ]
  },{
    title: '五、 账户与报告管理',
    question: 'Q：生成的报告会保存多久？',
    answerLines: [
      'A：所有报告将永久保存在您的"我的报告" 列表中，支持按时间、类型、公司名称筛选。您可随时查看、下载或删除。',
      'Q：如何修改个人信息或密码？',
      'A：点击页面右上角您的头像，进入个人中心弹窗，可修改头像、用户名和密码。',
    ]
  },{
    title: '六、 合规与法律',
    question: 'Q：报告中的"风险提示"是否代表法律意见？',
    answerLines: [
      'A：不代表。Savelor 提供的所有内容均为基于公开信息的事实核查，不构成法律、投资或商业建议。在做出重大决策前，请咨询专业律师或合规顾问。',
      'Q：如果我发现报告信息有误怎么办？',
      'A：请通过邮箱（support@savelor.com）联系我们，并提供报告编号与疑似错误项。我们将第一时间核查数据源并予以回复。',
    ]
  },{
    title: '七、 技术支持与联系',
    question: 'Q：报告生成过程中断或失败怎么办？',
    answerLines: [
      'A：页面会立即显示提示，并提供一个 "重新生成" 按钮。大多数情况下，点击重试即可成功。',
      '联系邮箱：support@savelor.com',
      '服务时间：工作日 9:00-18:00（EST）',
      '如果您有更多疑问，欢迎通过邮箱联系我们。',
    ]
  }
]);

const toggleAnswer = (index) => {
  if (expandedIndex.value === index) {
    expandedIndex.value = -1;
  } else {
    expandedIndex.value = index;
  }
};
</script>

<style scoped>
.problem-page {
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  width: 260px;
  height: 46px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  font-size: 32px;
  color: #100F12;
  line-height: 46px;
  text-align: left;
  font-style: normal;
}

.question-list {
  width: 1100px;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.question-item-wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
}

.question-item {
  width: 1100px;
  height: 60px;
  background: #FFFFFF;
  box-shadow: 0px 0px 5px 4px rgba(235,235,235,0.5);
  border-radius: 20px;
  cursor: pointer;
}

.question-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 25px;
}

.question-title {
  height: 24px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  font-size: 18px;
  color: #100F12;
  line-height: 24px;
  text-align: left;
  font-style: normal;
}

.arrow-icon {
  width: 28px;
  height: 28px;
  transition: transform 0.3s ease;
}

.answer-module {
  width: 1100px;
  background: #F6F6F6;
  border-radius: 20px;
  margin-top: 15px;
  padding: 15px 25px;
  box-sizing: border-box;
}

.answer-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
  letter-spacing: 1px;
}

.question-text {
  margin: 0;
  height: 22px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  font-size: 16px;
  color: #85909C;
  line-height: 22px;
  text-align: left;
  font-style: normal;
}

.answer-text-content {
  margin: 0;
  min-height: 22px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  font-size: 16px;
  color: #85909C;
  line-height: 22px;
  text-align: left;
  font-style: normal;
}

.comparison-table {
  width: 950px;
  margin-top: 10px;
  align-self: center;
}

.table-header {
  width: 950px;
  height: 45px;
  background: #E4E5EA;
  border-radius: 8px 8px 0px 0px;
  border: 1px solid #C8CCD5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-header .table-cell:first-child {
  text-align: center;
}

.table-header .table-cell:nth-child(2) {
  text-align: center;
  margin: 0 120px;
}

.table-header .table-cell:last-child {
  text-align: center;
}

.table-body {
  display: flex;
}

.table-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  font-size: 14px;
  color: #85909C;
  line-height: 20px;
  text-align: center;
  font-style: normal;
}

.left-cell {
  width: 230px;
  height: 180px;
  border: 1px solid #C8CCD5;
  border-top: none;
}

.middle-cell {
  width: 180px;
  height: 180px;
  border: 1px solid #C8CCD5;
  border-top: none;
  border-left: none;
  padding: 0px 25px;
}

.right-cell {
  width: 500px;
  height: 180px;
  border: 1px solid #C8CCD5;
  border-top: none;
  border-left: none;
}

</style>