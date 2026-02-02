<template>
    <div id="app">
        <!-- 导航栏 -->
        <div class="navigation flex align-center justify-between">
            <div class="logo flex align-center" style="width: 210px;">
                <img src="/img/logo.png" alt="" class="logo-img">
                <div class="logo-text">SAVELOR</div>
            </div>

            <div class="flex align-center">
                <!-- 导航栏菜单 -->
                <div class="naviga-menu flex align-center">
                    <div @click="navigaJump('home')" class="menu-text" :class="{ 'menu-active': activeMenu == 'home' }">
                        首页
                    </div>
                    <div @click="navigaJump('myBai')" class="menu-text"
                        :class="{ 'menu-active': activeMenu == 'myBai' }">
                        白皮书
                    </div>
                    <div @click="navigaJump('ReviewSpace')" class="menu-text"
                        :class="{ 'menu-active': activeMenu == 'ReviewSpace' }">
                        生成报告
                    </div>
                    <!-- <div @click="navigaJump('auditSpace')" class="menu-text"
                        :class="{ 'menu-active': activeMenu == 'auditSpace' }">
                        决策空间
                    </div> -->
                    <!-- <div @click="navigaJump('companyMaterial')" class="menu-text"
                        :class="{ 'menu-active': activeMenu == 'companyMaterial' }">
                        企业材料
                    </div> -->
                    <div @click="navigaJump('mySpace')" class="menu-text"
                        :class="{ 'menu-active': activeMenu == 'mySpace' }">
                        我的报告
                    </div>
                    <!-- <div @click="navigaJump('AiTool')" class="menu-text"
                        :class="{ 'menu-active': activeMenu === 'AiTool' }">
                        检测查重
                    </div> -->
                    <div @click="navigaJump('problem')" class="menu-text"
                        :class="{ 'menu-active': activeMenu == 'problem' }">
                        帮助中心
                    </div>
                </div>


                <!-- 登录按钮/用户头像 -->
                <div class="naviga-button flex align-center"  style="justify-content: flex-end;">
                    <div v-if="!isLoggedIn" class="flex align-center">
                        <div class="loin m-r-10 text-bold-500" @click="loginOpen('login')">登录</div>
                        <div class="sign text-bold-500" @click="loginOpen('register')">注册</div>
                    </div>
                    <div v-else class="user-avatar-container" @click="toggleUserMenu">
                        <!-- <img :src="userInfo.avatar || '/img/default-avatar.png'" :alt="userInfo.email || '用户'" class="user-avatar"> -->
                        <img :src="userInfo.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
                            class="h-40 w-40">

                        <div v-if="userMenuOpen" class="user-menu" @click.stop>
                            <div class="user-menu-header">
                                <img :src="userInfo.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
                                    class="user-menu-avatar" alt="用户头像">
                            </div>
                            <div class="user-info-section">
                                <div class="info-title">姓名</div>
                                <div class="info-input username-input">
                                    <span>{{ userInfo.username || '' }}</span>
                                    <span class="edit-text" @click.stop="openEditUsernameDialog">修改</span>
                                </div>
                                <div class="info-title" style="margin-top: 18px;">电子邮箱</div>
                                <div class="info-input email-input">{{ userInfo.email || '' }}</div>
                                <div class="info-title" style="margin-top: 18px;">密码</div>
                                <div class="info-input password-input">
                                    <span>••••••••</span>
                                    <span class="edit-text" @click.stop="openEditPasswordDialog">修改</span>
                                </div>
                            </div>
                            <div class="logout-button" @click.stop="handleLogout">退出登录</div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 手机端汉堡菜单按钮 -->
            <div class="mobile-menu-btn" @click="toggleMobileMenu">
                <span class="hamburger-line" :class="{ 'active': mobileMenuOpen }"></span>
                <span class="hamburger-line" :class="{ 'active': mobileMenuOpen }"></span>
                <span class="hamburger-line" :class="{ 'active': mobileMenuOpen }"></span>
            </div>
        </div>
        <!-- 手机端侧边栏菜单 -->
        <div class="mobile-menu-overlay" :class="{ 'active': mobileMenuOpen }" @click="toggleMobileMenu"></div>
        <div class="mobile-menu" :class="{ 'active': mobileMenuOpen }">
            <div class="mobile-menu-header">
                <div class="logo flex align-center">
                    <img src="/img/logo.png" alt="" class="logo-img">
                    <div class="logo-text">LOONOOL</div>
                </div>
                <div class="close-btn" @click="toggleMobileMenu">×</div>
            </div>
            <div class="mobile-menu-content">
                <div @click="handleMobileMenuClick('home')" class="mobile-menu-item"
                    :class="{ 'menu-active': activeMenu == 'home' }">
                    首页
                </div>
                <div @click="handleMobileMenuClick('ReviewSpace')" class="mobile-menu-item"
                    :class="{ 'menu-active': activeMenu == 'ReviewSpace' }">
                    生成报告
                </div>
                <!-- <div @click="handleMobileMenuClick('auditSpace')" class="mobile-menu-item"
                    :class="{ 'menu-active': activeMenu == 'auditSpace' }">
                    决策空间
                </div> -->
                <!-- <div @click="handleMobileMenuClick('AiTool')" class="mobile-menu-item"
                    :class="{ 'menu-active': activeMenu === 'AiTool' }">
                    检测查重
                </div> -->
                <div @click="handleMobileMenuClick('mySpace')" class="mobile-menu-item"
                    :class="{ 'menu-active': activeMenu == 'mySpace' }">
                    我的空间
                </div>
                <div @click="handleMobileMenuClick('problem')" class="mobile-menu-item"
                    :class="{ 'menu-active': activeMenu == 'problem' }">
                    了解更多
                </div>
            </div>
            <div class="mobile-menu-footer">
                <div v-if="!isLoggedIn">
                    <div class="mobile-login-btn" @click="handleMobileLogin('login')">登录</div>
                    <div class="mobile-register-btn" @click="handleMobileLogin('register')">注册</div>
                </div>
                <div v-else class="mobile-user-info">
                    <div class="mobile-user-avatar-container">
                        <!-- userInfo.avatar -->
                        <!-- <img :src="userInfo.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" class="mobile-user-avatar"> -->
                        <!-- <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" alt=""> -->
                        <div class="mobile-user-email">{{ userInfo.username || '' }}</div>
                    </div>
                    <div class="mobile-logout-btn" @click="handleLogout">退出登录</div>
                </div>
            </div>
        </div>
        <component :is="component" ref="reviewSpaceRef" :spaceId="currentSpaceId" @spaceCreated="handleSpaceCreated"
            @showLoginModal="handleShowLoginModal">
        </component>
    </div>

    <el-dialog v-model="loginVisible" :title="curretnTitle" :width="dialogWidth"
        :class="['login-dialog', curretnDialog === 'register' ? 'register-dialog' : '']" :close-on-click-modal="false"
        :show-close="true">
        <el-form ref="formRef" :label-position="top" label-width="auto" :model="formLabelAlign" style="max-width: 600px"
            :rules="rules">
            <el-form-item v-if="curretnDialog === 'register'" label="国家/地区" label-position="top" prop="country">
                <div class="country-state-input">
                    <div class="country-prefix">美国</div>
                    <el-select v-model="formLabelAlign.state" class="state-select" placeholder="请选择州">
                        <el-option label="阿拉巴马州" value="AL" />
                        <el-option label="阿拉斯加州" value="AK" />
                        <el-option label="亚利桑那州" value="AZ" />
                        <el-option label="阿肯色州" value="AR" />
                        <el-option label="加利福尼亚州" value="CA" />
                        <el-option label="科罗拉多州" value="CO" />
                        <el-option label="康涅狄格州" value="CT" />
                        <el-option label="特拉华州" value="DE" />
                        <el-option label="佛罗里达州" value="FL" />
                        <el-option label="佐治亚州" value="GA" />
                        <el-option label="夏威夷州" value="HI" />
                        <el-option label="爱达荷州" value="ID" />
                        <el-option label="伊利诺伊州" value="IL" />
                        <el-option label="印第安纳州" value="IN" />
                        <el-option label="爱荷华州" value="IA" />
                        <el-option label="堪萨斯州" value="KS" />
                        <el-option label="肯塔基州" value="KY" />
                        <el-option label="路易斯安那州" value="LA" />
                        <el-option label="缅因州" value="ME" />
                        <el-option label="马里兰州" value="MD" />
                        <el-option label="马萨诸塞州" value="MA" />
                        <el-option label="密歇根州" value="MI" />
                        <el-option label="明尼苏达州" value="MN" />
                        <el-option label="密西西比州" value="MS" />
                        <el-option label="密苏里州" value="MO" />
                        <el-option label="蒙大拿州" value="MT" />
                        <el-option label="内布拉斯加州" value="NE" />
                        <el-option label="内华达州" value="NV" />
                        <el-option label="新罕布什尔州" value="NH" />
                        <el-option label="新泽西州" value="NJ" />
                        <el-option label="新墨西哥州" value="NM" />
                        <el-option label="纽约州" value="NY" />
                        <el-option label="北卡罗来纳州" value="NC" />
                        <el-option label="北达科他州" value="ND" />
                        <el-option label="俄亥俄州" value="OH" />
                        <el-option label="俄克拉荷马州" value="OK" />
                        <el-option label="俄勒冈州" value="OR" />
                        <el-option label="宾夕法尼亚州" value="PA" />
                        <el-option label="罗得岛州" value="RI" />
                        <el-option label="南卡罗来纳州" value="SC" />
                        <el-option label="南达科他州" value="SD" />
                        <el-option label="田纳西州" value="TN" />
                        <el-option label="德克萨斯州" value="TX" />
                        <el-option label="犹他州" value="UT" />
                        <el-option label="佛蒙特州" value="VT" />
                        <el-option label="弗吉尼亚州" value="VA" />
                        <el-option label="华盛顿州" value="WA" />
                        <el-option label="西弗吉尼亚州" value="WV" />
                        <el-option label="威斯康星州" value="WI" />
                        <el-option label="怀俄明州" value="WY" />
                    </el-select>
                </div>
            </el-form-item>
            <el-form-item label="姓名" label-position="top" prop="username">
                <el-input v-model="formLabelAlign.username" placeholder="请输入你的姓名" />
            </el-form-item>
            <el-form-item label="电子邮箱" label-position="top" prop="email">
                <el-input v-model="formLabelAlign.email" placeholder="请输入你的邮箱" />
            </el-form-item>
            <el-form-item label="密码" label-position="top" prop="password">
                <el-input v-model="formLabelAlign.password" type="password" placeholder="请输入你的密码" show-password />
            </el-form-item>
            <el-form-item v-if="curretnDialog === 'register'" label="确认密码" label-position="top" prop="confirmPassword">
                <el-input v-model="formLabelAlign.confirmPassword" type="password" placeholder="请再次输入密码"
                    show-password />
            </el-form-item>
            <el-form-item v-if="curretnDialog === 'register'" label="图形验证码" label-position="top" prop="captcha">
                <div class="captcha-wrapper">
                    <el-input v-model="formLabelAlign.captcha" placeholder="请输入验证码" class="captcha-input" />
                    <div class="captcha-image" @click="fetchCaptcha">
                        <img v-if="captchaImage" :src="captchaImage" alt="验证码" />
                        <el-icon v-else class="is-loading">
                            <loading />
                        </el-icon>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label-position="top">
                <el-button class="w-p-100 login-submit-btn" type="primary" @click="loginButton">{{ curretnDialog ===
                    'register' ? '注册' : '登录' }}</el-button>
            </el-form-item>
            <el-form-item label-position="top">
                <div class="text-button" v-if="curretnDialog == 'login'" @click="loginOpen('register')">还没有账号? 立即注册
                </div>
                <div class="text-button" v-else @click="loginOpen('login')">已有账号?登录</div>
            </el-form-item>
        </el-form>
    </el-dialog>

    <!-- 修改姓名弹窗 -->
    <div v-if="editUsernameVisible" class="edit-username-overlay" @click="closeEditUsernameDialog">
        <div v-loading="editUsernameLoading" element-loading-text="保存中..." class="edit-username-dialog" @click.stop>
            <div class="edit-dialog-header">
                <div class="edit-dialog-title">修改姓名</div>
                <span class="edit-dialog-close" @click="closeEditUsernameDialog">×</span>
            </div>
            <div class="edit-dialog-content">
                <div class="edit-dialog-label">姓名</div>
                <input v-model="editUsernameValue" type="text" class="edit-dialog-input" placeholder="请输入姓名" />
            </div>
            <div class="edit-dialog-footer">
                <button class="edit-dialog-cancel-btn" @click="closeEditUsernameDialog">取消</button>
                <button class="edit-dialog-confirm-btn" @click="confirmEditUsername">确定</button>
            </div>
        </div>
    </div>

    <!-- 修改密码弹窗 -->
    <div v-if="editPasswordVisible" class="edit-username-overlay" @click="closeEditPasswordDialog">
        <div v-loading="editPasswordLoading" element-loading-text="保存中..." class="edit-username-dialog edit-password-dialog" @click.stop>
            <div class="edit-dialog-header">
                <div class="edit-dialog-title">修改密码</div>
                <span class="edit-dialog-close" @click="closeEditPasswordDialog">×</span>
            </div>
            <div class="edit-dialog-content edit-password-content">
                <div class="edit-dialog-label">原始密码</div>
                <input v-model="editPasswordData.oldPassword" type="password" class="edit-dialog-input"
                    placeholder="请输入原始密码" />
                <div class="edit-dialog-label" style="margin-top: 16px;">新密码</div>
                <input v-model="editPasswordData.newPassword" type="password" class="edit-dialog-input"
                    placeholder="请输入新密码" />
                <div class="edit-dialog-label" style="margin-top: 16px;">确认密码</div>
                <input v-model="editPasswordData.confirmPassword" type="password" class="edit-dialog-input"
                    placeholder="请再次输入新密码" />
            </div>
            <div class="edit-dialog-footer">
                <button class="edit-dialog-cancel-btn" @click="closeEditPasswordDialog">取消</button>
                <button class="edit-dialog-confirm-btn" @click="confirmEditPassword">确定</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, shallowRef } from "vue";
import Home from "./home-pageOne.vue";
import Plagiarism from "./plagiarism.vue";
import Article from "./blog/index.vue";
import problem from "./problem.vue";
// 我的报告
import mySpace from "./my-space.vue";
// 我的报告
import myBai from "./my-bai.vue";

// 工具页 ai生成
import AiTool from "./tool-ai.vue";
// 创建空间页 ai生成
import ReviewSpace from "./review-space.vue";
// 审核空间页 ai生成
import auditSpace from "./audit-space.vue";
// 企业材料
import companyMaterial from "./corporate-materials.vue";


import {
    savelorUserRegister,
    savelorUserLogin,
    usersMe,
    usersProfile,
    changePassword,
    captcha
} from "../../composables/login.ts";
import {
    msgList
} from "../../composables/msg.ts";
import { baseUrl } from "../../plugins/api.ts";
import { ElMessage } from 'element-plus';
//消息列表
const msgApiList = reactive([]);

// 是否有新消息提示
const hasNewMessage = ref(false);

// SSE 连接实例
let eventSource = null;

// 初始化 SSE 消息连接
const initSSEMsg = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn('未找到 token，无法建立 SSE 连接');
        return;
    }

    // 如果已有连接，先关闭
    if (eventSource) {
        eventSource.close();
        eventSource = null;
    }

    // SSE 服务器地址（使用 api.ts 中的 baseUrl）
    const sseUrl = `${baseUrl}loonool/notifications/stream`;

    try {
        // 创建 EventSource 连接
        // 注意：EventSource 不支持自定义请求头，token 需要通过 URL 参数传递
        const urlWithToken = `${sseUrl}?token=${encodeURIComponent(token)}`;
        eventSource = new EventSource(urlWithToken);

        // 监听消息事件
        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('收到 SSE 消息:', data);

                // 处理消息数据
                if (Array.isArray(data)) {
                    // 如果是数组，直接替换消息列表（初始加载，不显示提示）
                    msgApiList.length = 0;
                    msgApiList.push(...data);
                    hasNewMessage.value = false;
                } else if (data && data.data && Array.isArray(data.data)) {
                    // 如果数据在 data 字段中（初始加载，不显示提示）
                    msgApiList.length = 0;
                    msgApiList.push(...data.data);
                    hasNewMessage.value = false;
                } else if (data && data.workspaceName) {
                    // 如果是单条消息，添加到列表开头（新消息，显示提示）
                    msgApiList.unshift(data);
                    // 限制列表长度，避免过多消息
                    if (msgApiList.length > 100) {
                        msgApiList.pop();
                    }
                    // 显示新消息提示
                    hasNewMessage.value = true;
                }
            } catch (error) {
                console.error('解析 SSE 消息失败:', error);
            }
        };

        // 监听自定义事件（如果需要）
        eventSource.addEventListener('notification', (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('收到 SSE 通知事件:', data);
                if (data && data.workspaceName) {
                    msgApiList.unshift(data);
                    if (msgApiList.length > 100) {
                        msgApiList.pop();
                    }
                    // 显示新消息提示
                    hasNewMessage.value = true;
                }
            } catch (error) {
                console.error('解析 SSE 通知事件失败:', error);
            }
        });

        // 监听连接打开
        eventSource.onopen = () => {
            console.log('SSE 连接已建立');
        };

        // 监听错误
        eventSource.onerror = (error) => {
            console.error('SSE 连接错误:', error);
            // EventSource 会自动重连，但如果连接被关闭（如 401），需要手动处理
            if (eventSource && eventSource.readyState === EventSource.CLOSED) {
                console.warn('SSE 连接已关闭，可能需要重新认证');
            }
        };
    } catch (error) {
        console.error('创建 SSE 连接失败:', error);
    }
};


// 修改姓名弹窗
const editUsernameVisible = ref(false);
const editUsernameValue = ref('');
const editUsernameLoading = ref(false);

// 打开修改姓名弹窗
const openEditUsernameDialog = () => {
    editUsernameValue.value = userInfo.value.username || '';
    editUsernameVisible.value = true;
};

// 关闭修改姓名弹窗
const closeEditUsernameDialog = () => {
    editUsernameVisible.value = false;
    editUsernameValue.value = '';
};

// 确认修改姓名
const confirmEditUsername = async () => {
    if (!editUsernameValue.value.trim()) {
        ElMessage.warning('姓名不能为空');
        return;
    }

    editUsernameLoading.value = true;
    try {
        const res = await usersProfile({
            avatarUrl: userInfo.value.avatar || '',
            email: userInfo.value.email || '',
            username: editUsernameValue.value.trim()
        });

        if (res.code === 200) {
            ElMessage.success('姓名修改成功');
            closeEditUsernameDialog();
            // 重新获取用户信息以更新显示
            await fetchUserInfo();
        } else {
            ElMessage.error(res.message || '姓名修改失败');
        }
    } catch (error) {
        console.error('修改姓名失败:', error);
        const errorMsg = error?.response?.data?.message || error?.message || '修改姓名失败，请稍后重试';
        ElMessage.error(errorMsg);
    } finally {
        editUsernameLoading.value = false;
    }
};

// 修改密码弹窗
const editPasswordVisible = ref(false);
const editPasswordData = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
});
const editPasswordLoading = ref(false);

// 打开修改密码弹窗
const openEditPasswordDialog = () => {
    editPasswordData.oldPassword = '';
    editPasswordData.newPassword = '';
    editPasswordData.confirmPassword = '';
    editPasswordVisible.value = true;
};

// 关闭修改密码弹窗
const closeEditPasswordDialog = () => {
    editPasswordVisible.value = false;
    editPasswordData.oldPassword = '';
    editPasswordData.newPassword = '';
    editPasswordData.confirmPassword = '';
};

// 确认修改密码
const confirmEditPassword = async () => {
    // 表单验证
    if (!editPasswordData.oldPassword) {
        ElMessage.warning('请输入原始密码');
        return;
    }
    if (!editPasswordData.newPassword) {
        ElMessage.warning('请输入新密码');
        return;
    }
    if (editPasswordData.newPassword.length < 8) {
        ElMessage.warning('新密码长度至少8位');
        return;
    }
    if (!editPasswordData.confirmPassword) {
        ElMessage.warning('请再次输入新密码');
        return;
    }
    if (editPasswordData.newPassword !== editPasswordData.confirmPassword) {
        ElMessage.warning('两次输入的密码不一致');
        return;
    }

    editPasswordLoading.value = true;
    try {
        const res = await changePassword({
            oldPassword: editPasswordData.oldPassword,
            newPassword: editPasswordData.newPassword,
            confirmPassword: editPasswordData.confirmPassword
        });

        if (res.code === 200) {
            ElMessage.success('密码修改成功');
            closeEditPasswordDialog();
            // 密码修改成功后清除token，让用户重新登录
            localStorage.removeItem('token');
            isLoggedIn.value = false;
            userInfo.value = {
                email: '',
                avatar: '',
                username: ''
            };
            userMenuOpen.value = false;
        } else {
            ElMessage.error(res.message || '密码修改失败');
        }
    } catch (error) {
        console.error('修改密码失败:', error);
        const errorMsg = error?.response?.data?.message || error?.message || '修改密码失败，请稍后重试';
        ElMessage.error(errorMsg);
    } finally {
        editPasswordLoading.value = false;
    }
};



// 断开 SSE 连接
const disconnectSSEMsg = () => {
    if (eventSource) {
        eventSource.close();
        eventSource = null;
        console.log('SSE 连接已断开');
    }
};



// 格式化时间函数
const formatDateTime = (dateTime) => {
    if (!dateTime) {
        return '';
    }

    let date;
    // 如果是时间戳（数字），转换为Date对象
    if (typeof dateTime === 'number') {
        // 判断是秒级时间戳还是毫秒级时间戳
        date = new Date(dateTime > 1000000000000 ? dateTime : dateTime * 1000);
    } else if (typeof dateTime === 'string') {
        // 如果是字符串，尝试解析
        // 处理常见的日期格式
        if (dateTime.includes('T')) {
            // ISO格式: 2025-12-11T17:22:23.000Z
            date = new Date(dateTime);
        } else if (dateTime.match(/^\d{4}-\d{2}-\d{2}/)) {
            // 已经是 YYYY-MM-DD 格式，直接返回
            return dateTime;
        } else {
            date = new Date(dateTime);
        }
    } else {
        return String(dateTime);
    }

    // 检查日期是否有效
    if (isNaN(date.getTime())) {
        // 如果无法解析，返回原始值
        return String(dateTime);
    }

    // 格式化为 YYYY-MM-DD HH:mm:ss
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 处理消息下拉菜单显示状态变化
const handleMsgDropdownVisibleChange = (visible) => {
    // 当下拉菜单打开时，清除新消息提示
    if (visible) {
        hasNewMessage.value = false;
    }
};



// 备用 HTTP 接口（用于初始加载或 SSE 失败时）
const msgApi = () => {
    msgList({}).then(res => {
        console.log(res, 'HTTP 消息列表响应');
        if (res && res.data && Array.isArray(res.data)) {
            msgApiList.length = 0;
            msgApiList.push(...res.data);
            // 清除新消息提示（因为已经主动查看了）
            hasNewMessage.value = false;
        }
    }).catch(err => {
        console.error('获取消息列表失败:', err);
    })
};

//  组件切换
const component = shallowRef(Home);

const activeMenu = ref('home');

// 当前空间ID
const currentSpaceId = ref(null);

// 处理空间创建成功事件
const handleSpaceCreated = (spaceId,address) => {
    currentSpaceId.value = spaceId;
    navigaJump(address);
};

// 创建一个 ref 来引用 ReviewSpace 组件
const reviewSpaceRef = ref(null);

// 用户登录状态
const isLoggedIn = ref(false);
const userInfo = ref({
    email: '',
    avatar: '',
    username: ''
});
const userMenuOpen = ref(false);

// 获取用户信息
const fetchUserInfo = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        isLoggedIn.value = false;
        return;
    }

    try {
        const res = await usersMe({});
        if (res.code === 200) {
            userInfo.value = {
                email: res.data.email || '',
                avatar: res.data.avatarUrl || '',
                username: res.data.username || ''
            };
            isLoggedIn.value = true;
        }
    } catch (error) {
        console.error('获取用户信息失败:', error);
        isLoggedIn.value = false;
    }
};

// 检查登录状态
const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    if (token) {
        fetchUserInfo();
    }
};



// 切换用户菜单
const toggleUserMenu = () => {
    userMenuOpen.value = !userMenuOpen.value;
};

// 退出登录
const handleLogout = () => {
    // 断开 SSE 连接
    disconnectSSEMsg();

    localStorage.removeItem('token');
    // 清除可能存在的旧用户信息缓存
    localStorage.removeItem('userInfo');
    isLoggedIn.value = false;
    userInfo.value = {
        email: '',
        avatar: '',
        username: ''
    };
    userMenuOpen.value = false;
    // 清空消息列表
    msgApiList.length = 0;
    // 清除新消息提示
    hasNewMessage.value = false;
    ElMessage.success('已退出登录');
};

// 初始化时检查登录状态
onMounted(() => {
    checkLoginStatus();

    // 如果已登录，初始化 SSE 连接
    if (isLoggedIn.value) {
        // initSSEMsg();
    } else {
        // 如果未登录，使用 HTTP 接口获取消息（如果有的话）
        // msgApi();
    }

    // 点击外部关闭用户菜单
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (target && target.nodeType === 1) {
            const element = target;
            if (!element.closest || !element.closest('.user-avatar-container')) {
                userMenuOpen.value = false;
            }
        }
    });
});

// 响应式对话框宽度
const isMobile = ref(false);
const dialogWidth = computed(() => {
    return isMobile.value ? '90%' : '500px';
});

// 检测屏幕尺寸
const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkMobile);
    // 组件卸载时断开 SSE 连接
    disconnectSSEMsg();
});

// 移动端菜单控制
const mobileMenuOpen = ref(false);
const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
};

// 移动端菜单点击处理
const handleMobileMenuClick = (event) => {
    navigaJump(event);
    mobileMenuOpen.value = false; // 点击后关闭菜单
};

// 移动端登录/注册点击处理
const handleMobileLogin = (type) => {
    loginOpen(type);
    mobileMenuOpen.value = false; // 点击后关闭菜单
};


// 登录弹窗
const loginVisible = ref(false);
// 登录状态 true为登录 false为注册
const curretnDialog = ref('login');
const curretnTitle = ref('Create Account');

// 验证码相关
const captchaImage = ref('');
const captchaId = ref('');
const captchaTimer = ref(null);
const captchaExpiresIn = ref(0);

const handleShowLoginModal = () => {
    loginOpen('login');
};

// 获取验证码
const fetchCaptcha = async () => {
    try {
        // 清除之前的定时器
        if (captchaTimer.value) {
            clearTimeout(captchaTimer.value);
        }

        const res = await captcha({});
        console.log('验证码接口返回数据:', res);

        if (res.code === 200 && res.data) {
            // 后台返回的 base64 数据不包含前缀，需要手动添加
            const base64Data = res.data.imageBase64
            captchaImage.value = `data:image/png;base64,${base64Data}`;
            captchaId.value = res.data.captchaId;
            captchaExpiresIn.value = res.data.expiresInSeconds;

            // 设置定时器，验证码过期后自动刷新
            if (res.data.expiresInSeconds) {
                captchaTimer.value = setTimeout(() => {
                    fetchCaptcha();
                }, (res.data.expiresInSeconds - 10) * 1000); // 提前10秒刷新
            }
        }
    } catch (error) {
        console.error('获取验证码失败:', error);
        ElMessage.error('获取验证码失败，请重试');
    }
};

const loginOpen = (text) => {
    if (text == 'login') {
        curretnTitle.value = '欢迎回来';
    } else {
        curretnTitle.value = '创建账户';
    }
    curretnDialog.value = text;

    // 打开弹窗
    loginVisible.value = true;

    // 在弹窗打开后清空表单数据和验证状态
    nextTick(() => {
        if (formRef.value) {
            formRef.value.resetFields();
        } else {
            // 如果表单引用还未初始化，直接重置数据
            formLabelAlign.country = 'US';
            formLabelAlign.state = '';
            formLabelAlign.username = '';
            formLabelAlign.email = '';
            formLabelAlign.password = '';
            formLabelAlign.confirmPassword = '';
            formLabelAlign.captcha = '';
        }

        // 如果是注册，获取验证码
        if (text === 'register') {
            fetchCaptcha();
        } else {
            // 清除验证码
            captchaImage.value = '';
            captchaId.value = '';
            if (captchaTimer.value) {
                clearTimeout(captchaTimer.value);
            }
        }
    });
};


// 表单
const formLabelAlign = reactive({
    country: 'US',
    state: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    captcha: ''
});
const formRef = ref();


// 邮箱验证规则
const validateEmail = (rule, value, callback) => {
    if (!value) {
        callback(new Error('请输入邮箱地址'));
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            callback(new Error('请输入正确的邮箱格式'));
        } else {
            callback();
        }
    }
};



// 确认密码验证规则
const validateConfirmPassword = (rule, value, callback) => {
    if (!value) {
        callback(new Error('请再次输入密码'));
    } else if (value !== formLabelAlign.password) {
        callback(new Error('两次输入的密码不一致'));
    } else {
        callback();
    }
};



// 表单校验规则
const rules = computed(() => ({
    country: curretnDialog.value === 'register' ? [
        { required: true, message: '请选择国家', trigger: 'change' }
    ] : [],
    state: curretnDialog.value === 'register' ? [
        { required: true, message: '请选择州', trigger: 'change' }
    ] : [],
    username: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
        { min: 2, message: '姓名至少2位', trigger: 'blur' },
        { max: 20, message: '姓名最多20位', trigger: 'blur' }
    ],
    email: [
        { required: true, validator: validateEmail, trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度至少6位', trigger: 'blur' }
    ],
    confirmPassword: curretnDialog.value === 'register' ? [
        { required: true, validator: validateConfirmPassword, trigger: 'blur' }
    ] : [],
    captcha: curretnDialog.value === 'register' ? [
        { required: true, message: '请输入验证码', trigger: 'blur' },
    ] : []
}));



// 确定登录注册按钮
const loginButton = async () => {
    try {
        // 执行表单验证
        await formRef.value.validate();

        if (curretnDialog.value == 'login') {
            // 登录逻辑
            console.log("执行登录");
            savelorUserLogin({
                email: formLabelAlign.email,
                password: formLabelAlign.password,
                username: formLabelAlign.username,
            }).then(res => {
                console.log(res, 'resresresresres');
                if (res.code == 200) {
                    localStorage.setItem('token', res.data.token);
                    // 登录成功后获取用户信息
                    fetchUserInfo();

                    // 登录成功后初始化 SSE 连接
                    // initSSEMsg();

                    // 显示返回的提示语

                    loginVisible.value = false;
                }
                const message = res.message;
                ElMessage.success(message);

            }).catch(err => {
                console.error(err);
                // 显示错误提示
                const errorMsg = err?.response?.data?.message || err?.message || '登录失败，请稍后重试';
                ElMessage.error(errorMsg);
            })
        } else {
            // 注册逻辑
            savelorUserRegister({
                country: formLabelAlign.country,
                state: formLabelAlign.state,
                email: formLabelAlign.email,
                password: formLabelAlign.password,
                username: formLabelAlign.username,
                captchaCode: formLabelAlign.captcha,
                captchaId: captchaId.value
            }).then(res => {
                // 显示返回的提示语
                if (res.code == 200) {
                    loginVisible.value = false;
                }
                const message = res.message;
                ElMessage.success(message);
            }).catch(err => {
                console.error(err);
                // 显示错误提示
                const errorMsg = err?.response?.data?.message || err?.message || '注册失败，请稍后重试';
                ElMessage.error(errorMsg);
                // 验证码错误时刷新验证码
                if (err?.response?.data?.code === 'INVALID_CAPTCHA' || err?.response?.status === 400) {
                    fetchCaptcha();
                }
            })
        }
    } catch (error) {
        // 验证失败，Element Plus 会自动显示错误信息
        console.log("表单验证失败", error);
    }
};


/**
 * 导航跳转
 */
const navigaJump = (event) => {
    switch (event) {
        case 'home':
            component.value = Home
            activeMenu.value = 'home'
            break;
        case 'plagiarism':
            component.value = Plagiarism
            activeMenu.value = 'plagiarism'

            break;
        case 'article':
            component.value = Article
            activeMenu.value = 'article'

            break;
        // ai 生成 问题页
        case 'problem':
            component.value = problem
            activeMenu.value = 'problem'

            break;
        // ai 生成工具页
        case 'AiTool':
            component.value = AiTool
            activeMenu.value = 'AiTool'

            break;
        // ai 生成创建空间
        case 'ReviewSpace':
            component.value = ReviewSpace
            activeMenu.value = 'ReviewSpace'
            break;

        // ai 生成审查空间
        case 'auditSpace':
            component.value = auditSpace
            activeMenu.value = 'auditSpace'
            break;
        // 白皮书
        case 'myBai':
        console.log('白皮书');
            component.value = myBai
            activeMenu.value = 'myBai'
            break;
        // 我的报告
        case 'mySpace':
            component.value = mySpace
            activeMenu.value = 'mySpace'
            break;
        // 企业材料
        case 'companyMaterial':
            component.value = companyMaterial
            activeMenu.value = 'companyMaterial'
            break;
        default:
            break;
    }
};


</script>



<style lang="scss">
body {
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

#app {
    overflow-x: hidden;
    width: 100%;
    max-width: 100vw;
    box-sizing: border-box;
}

.navigation {
    width: 100%;
    height: 100px;
    box-shadow: inset 0px -1px 1px 0px rgba(219, 219, 219, 0.5);
    position: relative;
    background: linear-gradient( 270deg, #0B2226 0%, #004648 100%);

    .logo {
        font-family: var(--font_aiRHjzievx_default);
        font-size: 24px;
        font-weight: 700;
        white-space: pre-wrap;
        margin-left: 50px;

        .logo-img {
            width: 40px;
            height: 40px;
        }

        .logo-text {
            color: #0A5ADB;
        }
    }

    .naviga-menu {
        padding: 0px 34px;
        height: 65px;
        background: rgba(255,255,255,0.1);
        border-radius: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 30px;
        margin-right: 30px;

        .menu-text {
            width: 100px;
            height: 45px;
            background: transparent;
            border-radius: 0;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            font-size: 18px;
            color: #FFFFFF;
            line-height: 25px;
            text-align: left;
            font-style: normal;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
        }



        .menu-active {
            width: 100px;
            height: 45px;
            background: rgba(255,255,255,0.3);
            border-radius: 23px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 500;
            font-size: 18px;
            color: #FFFFFF;
            line-height: 25px;
            text-align: left;
            font-style: normal;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .naviga-button {
        margin-right: 50px;

        .loin {
            padding: 10px 32px;
            border-radius: 26px;
            border: 2px solid #FFFFFF;
            background-color: #FFFFFF;
            color: #0E0E2C;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent; // 移除移动端点击高亮
        }

        .sign {
            padding: 10px 32px;
            border-radius: 26px;
            border: 2px solid #FFFFFF;
            color: #FFFFFF;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent; // 移除移动端点击高亮
        }

        .user-avatar-container {
            position: relative;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;

            .user-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                object-fit: cover;
                border: 2px solid #E5E7EB;
                transition: all 0.2s ease;

                &:hover {
                    border-color: #2134DE;
                    box-shadow: 0 0 0 2px rgba(33, 52, 222, 0.1);
                }
            }

            .user-menu {
                position: absolute;
                top: calc(100% + 8px);
                right: 0;
                width: 454px;
                background: #FFFFFF;
                box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.19);
                border-radius: 12px;
                z-index: 1000;
                overflow: hidden;

                .user-menu-header {
                    width: 454px;
                    height: 182px;
                    background: linear-gradient(180deg, #DCE0FF 0%, #FFFFFF 100%);
                    border-radius: 12px 12px 0px 0px;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    .user-menu-avatar {
                        width: 100px;
                        height: 100px;
                        border-radius: 50%;
                        object-fit: cover;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    }
                }

                .user-info-section {
                    padding: 16px 16px 0px 16px;
                    width: 394px;
                    margin: 0 auto;

                    .info-title {
                        height: 20px;
                        font-family: PingFangSC, PingFang SC;
                        font-weight: 400;
                        font-size: 14px;
                        color: #4E5969;
                        line-height: 20px;
                        text-align: left;
                        font-style: normal;
                        margin-bottom: 10px;
                    }

                    .info-input {
                        width: 394px;
                        height: 48px;
                        background: #F2F3F5;
                        border-radius: 8px;
                        font-family: PingFangSC, PingFang SC;
                        font-weight: 400;
                        font-size: 16px;
                        color: #1D2129;
                        line-height: 22px;
                        text-align: left;
                        font-style: normal;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 0 16px;
                        box-sizing: border-box;
                        overflow: hidden;

                        >span:not(.edit-text) {
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            flex: 1;
                            min-width: 0;
                        }

                        .edit-text {
                            font-family: PingFangSC, PingFang SC;
                            font-weight: 400;
                            font-size: 14px;
                            color: #1D2129;
                            line-height: 20px;
                            text-align: left;
                            font-style: normal;
                            cursor: pointer;
                            flex-shrink: 0;
                            margin-left: 12px;

                            &:hover {
                                color: #2134DE;
                            }
                        }
                    }
                }

                .logout-button {
                    width: 394px;
                    height: 56px;
                    background: #2134DE;
                    border-radius: 8px;
                    font-family: PingFangSC, PingFang SC;
                    font-weight: 500;
                    font-size: 16px;
                    color: #FFFFFF;
                    line-height: 22px;
                    font-style: normal;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin: 36px auto;

                    &:hover {
                        background: #1a2bc5;
                        transform: translateY(-1px);
                    }
                }
            }
        }
    }

    // 手机端汉堡菜单按钮
    .mobile-menu-btn {
        display: none;
        flex-direction: column;
        justify-content: space-around;
        width: 30px;
        height: 30px;
        cursor: pointer;
        z-index: 1001;

        .hamburger-line {
            width: 100%;
            height: 3px;
            background-color: #1D2530;
            border-radius: 3px;
            transition: all 0.3s ease;

            &.active:nth-child(1) {
                transform: rotate(45deg) translate(8px, 8px);
            }

            &.active:nth-child(2) {
                opacity: 0;
            }

            &.active:nth-child(3) {
                transform: rotate(-45deg) translate(8px, -8px);
            }
        }
    }
}

// 手机端侧边栏菜单遮罩
.mobile-menu-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;

    &.active {
        opacity: 1;
        pointer-events: all;
    }
}

// 手机端侧边栏菜单
.mobile-menu {
    display: none;
    position: fixed;
    top: 0;
    right: -100%;
    width: 280px;
    height: 100%;
    background-color: #fff;
    z-index: 1000;
    transition: right 0.3s ease;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    flex-direction: column;

    &.active {
        right: 0;
    }

    .mobile-menu-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px;
        border-bottom: 1px solid #E5E7EB;

        .logo {
            font-size: 20px;

            .logo-img {
                width: 32px;
                height: 32px;
            }
        }

        .close-btn {
            font-size: 32px;
            color: #6C7C93;
            cursor: pointer;
            line-height: 1;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            -webkit-tap-highlight-color: transparent; // 移除移动端点击高亮
            border-radius: 50%;
            transition: all 0.2s ease;

            &:hover {
                color: #1D2530;
                background-color: #F3F4F6;
            }

            &:active {
                background-color: #E5E7EB;
                transform: scale(0.95);
            }
        }
    }

    .mobile-menu-content {
        flex: 1;
        padding: 20px 0;
        overflow-y: auto;

        .mobile-menu-item {
            padding: 16px 20px;
            font-size: 16px;
            font-weight: 400;
            color: #6C7C93;
            cursor: pointer;
            border-bottom: 1px solid #F3F4F6;
            transition: all 0.2s ease;
            -webkit-tap-highlight-color: transparent; // 移除移动端点击高亮
            min-height: 48px; // 增加触摸目标大小
            display: flex;
            align-items: center;

            &:hover {
                background-color: #F9FAFB;
                color: #1D2530;
            }

            &:active {
                background-color: #F0F4FF;
            }

            &.menu-active {
                font-weight: 500;
                color: #2134DE;
                background-color: #F0F4FF;
            }
        }
    }

    .mobile-menu-footer {
        padding: 20px;
        border-top: 1px solid #E5E7EB;
        display: flex;
        flex-direction: column;
        gap: 12px;

        .mobile-login-btn {
            padding: 12px 24px;
            border-radius: 26px;
            border: 1px solid #E5E7EB;
            background-color: #2134DE;
            color: #fff;
            text-align: center;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            -webkit-tap-highlight-color: transparent; // 移除移动端点击高亮
            min-height: 44px; // 增加触摸目标大小
            display: flex;
            align-items: center;
            justify-content: center;

            &:active {
                background-color: #1a28b8;
                transform: scale(0.98); // 点击反馈
            }
        }

        .mobile-register-btn {
            padding: 12px 24px;
            border-radius: 26px;
            border: 1px solid #2134DE;
            color: #2B57FF;
            text-align: center;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            -webkit-tap-highlight-color: transparent; // 移除移动端点击高亮
            min-height: 44px; // 增加触摸目标大小
            display: flex;
            align-items: center;
            justify-content: center;

            &:active {
                background-color: #F0F4FF;
                transform: scale(0.98); // 点击反馈
            }
        }

        .mobile-user-info {
            display: flex;
            flex-direction: column;
            gap: 12px;

            .mobile-user-avatar-container {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                background-color: #F9FAFB;
                border-radius: 8px;

                .mobile-user-avatar {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid #E5E7EB;
                }

                .mobile-user-email {
                    flex: 1;
                    font-size: 14px;
                    color: #1D2530;
                    font-weight: 500;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }

            .mobile-logout-btn {
                padding: 12px 24px;
                border-radius: 26px;
                border: 1px solid #E5E7EB;
                background-color: #fff;
                color: #EF4444;
                text-align: center;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                -webkit-tap-highlight-color: transparent;
                min-height: 44px;
                display: flex;
                align-items: center;
                justify-content: center;

                &:active {
                    background-color: #FEF2F2;
                    transform: scale(0.98);
                }
            }
        }
    }
}

// 响应式设计 - 手机端适配
@media (max-width: 768px) {
    .navigation {
        padding-left: 16px;
        padding-right: 16px;
        height: auto;
        min-height: 60px;
        padding-top: 16px;
        padding-bottom: 16px;
        width: 100%;
        box-sizing: border-box;

        .logo {
            font-size: 20px;

            .logo-img {
                width: 32px;
                height: 32px;
            }
        }

        .naviga-menu {
            display: none;
        }

        .naviga-button {
            display: none;
        }

        .mobile-menu-btn {
            display: flex;
            width: 32px;
            height: 32px;
            padding: 4px;
            -webkit-tap-highlight-color: transparent; // 移除移动端点击高亮
        }
    }

    .mobile-menu-overlay {
        display: block;
    }

    .mobile-menu {
        display: flex;
    }

    // 防止移动端横向滚动
    #app {
        overflow-x: hidden;
        width: 100%;
        max-width: 100vw;
    }
}

// 小屏幕手机适配
@media (max-width: 480px) {
    .navigation {
        padding-left: 12px;
        padding-right: 12px;
        min-height: 56px;
        padding-top: 12px;
        padding-bottom: 12px;

        .logo {
            font-size: 18px;

            .logo-img {
                width: 28px;
                height: 28px;
            }
        }

        .mobile-menu-btn {
            width: 28px;
            height: 28px;
        }
    }

    .mobile-menu {
        width: 100%;
        right: -100%;

        &.active {
            right: 0;
        }

        .mobile-menu-header {
            padding: 16px;

            .logo {
                font-size: 18px;

                .logo-img {
                    width: 28px;
                    height: 28px;
                }
            }

            .close-btn {
                font-size: 28px;
                width: 28px;
                height: 28px;
            }
        }

        .mobile-menu-content {
            padding: 16px 0;

            .mobile-menu-item {
                padding: 14px 16px;
                font-size: 15px;
            }
        }

        .mobile-menu-footer {
            padding: 16px;

            .mobile-login-btn,
            .mobile-register-btn {
                padding: 14px 20px;
                font-size: 15px;
                min-height: 48px; // 增加触摸目标大小
            }
        }
    }

    // 修改密码弹窗移动端适配
    .edit-username-overlay {
        padding: 0 16px;

        .edit-username-dialog {
            width: 100%;
            height: auto;
            min-height: 400px;

            &.edit-password-dialog {
                min-height: 520px;
            }

            .edit-dialog-header {
                padding: 24px;
            }

            .edit-dialog-content {
                padding: 0 24px;

                &.edit-password-content {
                    padding-top: 24px;
                    padding-bottom: 16px;
                }

                .edit-dialog-input {
                    width: 100%;
                }
            }

            .edit-dialog-footer {
                margin-bottom: 16px;

                .edit-dialog-cancel-btn,
                .edit-dialog-confirm-btn {
                    width: 120px;
                    height: 48px;
                }
            }
        }
    }
}

.el-dialog__title {
    font-weight: 600 !important;
    font-size: 28px !important;
    color: #1D2530 !important;
    margin-bottom: 48px;
    padding: 0;
}

.login-dialog {
    background-image: url('/img/login-bg.png');
    background-size: cover;
    padding: 0;

    .el-dialog {
        border-radius: 16px;
        overflow: hidden;
        position: relative;
    }

    .el-dialog__header {
        padding: 32px 32px 0 32px;
        position: relative;
    }

    .el-dialog__headerbtn {
        top: 24px;
        right: 24px;
        width: 32px;
        height: 32px;
        background-color: #F3F4F6;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;

        &:hover {
            background-color: #E5E7EB;
        }

        .el-dialog__close {
            color: #9CA3AF;
            font-size: 16px;
            font-weight: 300;
        }
    }

    .el-dialog__body {
        padding: 32px 32px 32px 32px;
        position: relative;
    }

    .el-form-item__label {
        font-weight: 500;
        color: #1D2530;
        font-size: 14px;
        margin-bottom: 10px;
        padding: 0;
    }

    .el-form-item {
        margin-bottom: 24px;
    }

    .el-input__wrapper {
        min-height: 48px;
        border-radius: 50px;
        box-shadow: 0 0 0 1px #BFDBFE inset;
        background-color: #fff;
        transition: all 0.2s ease;
        padding: 0 16px;

        &:hover {
            box-shadow: 0 0 0 1px #93C5FD inset;
        }

        &.is-focus {
            box-shadow: 0 0 0 1px #60A5FA inset;
        }
    }

    &.register-dialog {
        .country-state-input {
            display: flex;
            align-items: center;
            width: 100%;
            height: 48px;
            background-color: #F3F4F6;
            border-radius: 50px;
            overflow: hidden;
            transition: all 0.2s ease;

            &:hover {
                background-color: #E5E7EB;
            }

            .country-prefix {
                padding: 0 16px;
                height: 100%;
                display: flex;
                align-items: center;
                background-color: #E5E7EB;
                color: #1D2530;
                font-size: 14px;
                font-weight: 500;
                border-right: 1px solid #D1D5DB;
                white-space: nowrap;
            }

            .state-select {
                flex: 1;
                height: 100%;

                :deep(.el-select__wrapper) {
                    min-height: 48px;
                    border-radius: 0;
                    background-color: transparent;
                    box-shadow: none;
                    border: none;
                    padding: 0 12px;
                    transition: all 0.2s ease;

                    &:hover {
                        background-color: transparent;
                    }

                    &.is-focused {
                        background-color: transparent;
                        box-shadow: none;
                    }

                    .el-select__placeholder {
                        color: #9CA3AF;
                    }

                    .el-select__selected-item {
                        color: #1D2530;
                        font-size: 14px;
                    }
                }
            }
        }

        .el-input__wrapper {
            background-color: #F3F4F6;
            box-shadow: none;
            border: none;

            &:hover {
                background-color: #E5E7EB;
                box-shadow: none;
            }

            &.is-focus {
                background-color: #fff;
                box-shadow: 0 0 0 1px #60A5FA inset;
            }
        }

        .el-select__wrapper {
            min-height: 48px;
            border-radius: 50px;
            background-color: #F3F4F6;
            box-shadow: none;
            border: none;
            padding: 0 16px;
            transition: all 0.2s ease;

            &:hover {
                background-color: #E5E7EB;
                box-shadow: none;
            }

            &.is-focused {
                background-color: #fff;
                box-shadow: 0 0 0 1px #60A5FA inset;
            }

            .el-select__placeholder {
                color: #9CA3AF;
            }

            .el-select__selected-item {
                color: #1D2530;
                font-size: 14px;
            }
        }
    }

    .el-input__inner {
        color: #1D2530;
        font-size: 14px;

        &::placeholder {
            color: #9CA3AF;
        }
    }

    .login-submit-btn {
        min-height: 48px;
        border-radius: 50px;
        font-size: 16px;
        font-weight: 500;
        background-color: #2134DE;
        border: none;
        margin-top: 0;
        width: 100%;

        &:hover {
            background-color: #2563EB;
        }
    }

    .text-button {
        font-weight: 400;
        font-size: 14px;
        text-align: center;
        width: 100%;
        margin: auto;
        padding: 16px 10px 0 10px;
        color: #1D2530;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
            color: #3B82F6;
        }
    }
}

// 验证码样式
.captcha-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;

    .captcha-input {
        flex: 1;
    }

    .captcha-image {
        width: 120px;
        height: 48px;
        border-radius: 6px;
        overflow: hidden;
        cursor: pointer;
        border: 1px solid #E5E7EB;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #F9FAFB;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .el-icon {
            font-size: 24px;
            color: #9CA3AF;
        }

        &:hover {
            border-color: #60A5FA;
            background: #F3F4F6;
        }

        &:active {
            transform: scale(0.98);
        }
    }
}

// 移动端登录对话框优化
@media (max-width: 768px) {
    .el-dialog__title {
        font-size: 22px !important;
    }

    .login-dialog {
        .el-dialog__body {
            padding: 20px 16px;
        }

        .el-form-item__label {
            font-size: 14px;
        }

        .el-input__wrapper {
            min-height: 44px; // 增加触摸目标大小
        }

        .el-button {
            min-height: 44px; // 增加触摸目标大小
            font-size: 16px;
        }

        .text-button {
            font-size: 14px;
            padding: 8px 10px;
            min-height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
}

// 小屏幕手机登录对话框优化
@media (max-width: 480px) {
    .el-dialog__title {
        font-size: 20px !important;
    }

    .login-dialog {
        .el-dialog__body {
            padding: 16px 12px;
        }

        .el-form-item {
            margin-bottom: 20px;
        }

        .el-form-item__label {
            font-size: 13px;
            margin-bottom: 8px;
        }

        .el-input__wrapper {
            min-height: 48px;
            font-size: 16px; // 防止iOS自动缩放
        }

        .el-button {
            min-height: 48px;
            font-size: 16px;
        }

        .text-button {
            font-size: 14px;
            min-height: 44px;
        }
    }
}

.example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
}

.iconBox {
    width: 44px;
    height: 44px;
    background: #E9EBFC;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    margin-right: 20px;
    margin-top: -4px;
    position: relative;
    cursor: pointer;
}

.msg-img {
    width: 20px;
    height: 20px;
}

.msg-badge {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 8px;
    height: 8px;
    background-color: #FF4444;
    border-radius: 50%;
    border: 1px solid #fff;
    z-index: 10;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 1;
    }

    50% {
        transform: scale(1.2);
        opacity: 0.8;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.msg-dropdown-menu {
    width: 400px !important;
}

.msg-item {
    width: 400px;
    height: 44px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    box-sizing: border-box;

    .msg-item-img {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        margin-right: 8px;
        flex-shrink: 0;
    }

    .msg-text {
        flex: 1;
        height: 20px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 14px;
        color: #85909C;
        line-height: 20px;
        text-align: left;
        font-style: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 12px;
    }

    .msg-time {
        flex-shrink: 0;
        height: 17px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 12px;
        color: #85909C;
        line-height: 17px;
        text-align: right;
        font-style: normal;
        white-space: nowrap;
    }
}

.el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: #F7F8FA !important;
    color: #85909C;
    border-radius: 8px;
}

.msg-empty {
    padding: 40px 20px;
    text-align: center;
    min-width: 200px;

    .msg-empty-text {
        font-size: 14px;
        color: #85909C;
        line-height: 20px;
    }
}

// 修改用户名弹窗样式
.edit-username-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;

    .edit-username-dialog {
        width: 643px;
        height: 314px;
        background: #FFFFFF;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        position: relative;

        &.edit-password-dialog {
            height: auto;
            min-height: 440px;
        }

        :deep(.el-loading-mask) {
            background-color: rgba(255, 255, 255, 0.9);
            border-radius: 20px;
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

        .edit-dialog-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 30px;
            padding-bottom: 0;

            .edit-dialog-title {
                font-family: PingFangSC, PingFang SC;
                font-weight: 500;
                font-size: 18px;
                color: #1D2129;
                line-height: 25px;
                text-align: left;
                font-style: normal;
            }

            .edit-dialog-close {
                font-size: 24px;
                color: #85909C;
                cursor: pointer;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s ease;

                &:hover {
                    color: #4E5969;
                }
            }
        }

        .edit-dialog-content {
            padding: 0 30px;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;

            &.edit-password-content {
                justify-content: flex-start;
                padding-top: 30px;
                padding-bottom: 20px;
            }

            .edit-dialog-label {
                height: 22px;
                font-family: PingFangSC, PingFang SC;
                font-weight: 500;
                font-size: 16px;
                color: #4E5969;
                line-height: 22px;
                text-align: left;
                font-style: normal;
                margin-bottom: 10px;
            }

            .edit-dialog-input {
                width: 583px;
                height: 50px;
                background: #F2F3F5;
                border-radius: 8px;
                border: none;
                outline: none;
                padding: 0 16px;
                box-sizing: border-box;
                font-family: PingFangSC, PingFang SC;
                font-weight: 400;
                font-size: 16px;
                color: #1D2129;
                line-height: 22px;
                text-align: left;
                font-style: normal;

                &::placeholder {
                    color: #9CA3AF;
                }

                &:focus {
                    background: #FFFFFF;
                    box-shadow: 0 0 0 1px #60A5FA inset;
                }
            }
        }

        .edit-dialog-footer {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 14px;
            margin-bottom: 21px;

            .edit-dialog-cancel-btn,
            .edit-dialog-confirm-btn {
                width: 100px;
                height: 42px;
                border-radius: 6px;
                font-family: PingFangSC, PingFang SC;
                font-weight: 500;
                font-size: 16px;
                line-height: 22px;
                text-align: left;
                font-style: normal;
                border: none;
                outline: none;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;

                &:hover {
                    transform: translateY(-1px);
                }

                &:active {
                    transform: translateY(0);
                }
            }

            .edit-dialog-cancel-btn {
                background: #F2F3F5;
                color: #4E5969;

                &:hover {
                    background: #E5E7EB;
                }
            }

            .edit-dialog-confirm-btn {
                background: #2134DE;
                color: #FFFFFF;

                &:hover {
                    background: #1a28b8;
                }
            }
        }
    }
}
</style>