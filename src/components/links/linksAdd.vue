<template>
    <section class="friend-form-container wrapper">
        <!-- 用户信息面板 -->
        <aside class="user-panel">
            <h2 class="panel-title">添加好友</h2>
            <ul class="user-info-list">
                <li v-for="(value, key) in userInfo" :key="key" class="info-item">
                    <span class="info-label">{{ getLabel(key) }}</span>
                    <em class="info-value" v-if="getLabel(key)">{{ value }}</em>
                    <button v-if="getLabel(key)" class="copy-button ri-file-copy-line" @click="copyText(value)"
                        aria-label="复制">
                    </button>
                </li>
            </ul>
        </aside>

        <!-- 表单主体 -->
        <main class="form-main">
            <div class="form-intro">
                <p>我非常并且迫切地希望能在您热情地提交之前，看到我们的交流互动，生活博客比较看重仪式感，所以不妨让我们互相了解使得连接更紧实吧。</p>
                <div class="spacer"></div>
                <ul class="requirement-list">
                    <li>1. 交流互动并且保持联系（重点）；</li>
                    <li>2. 至少有 10 篇原创文章；</li>
                    <li>3. 请提前做好本站链接。</li>
                </ul>
            </div>

            <!-- 表单内容 -->
            <form id="friend-form" class="friend-form" @submit.prevent="linkSubmit">
                <!-- 类型选择 -->
                <fieldset class="form-section">
                    <legend class="section-title">
                        类型<em class="mark">必填</em>
                    </legend>
                    <div class="category-group">
                        <label v-for="item in linksCats" class="category-option" :key="item.category_id">
                            <input type="radio" name="category_id" :value="item.category_id" class="radio-input">
                            <span class="option-label">{{ item.category_name }}</span>
                        </label>
                    </div>
                    <p class="form-tip">
                        <em>提示：会根据文章内容调整分类。</em>
                    </p>
                </fieldset>

                <!-- 主要资料 -->
                <fieldset class="form-section">
                    <legend class="section-title">
                        主要资料<em class="mark">必填</em>
                    </legend>
                    <div class="input-group">
                        <input type="text" placeholder="名称" class="form-input" name="friend-name" required>
                        <input type="text" placeholder="简述" class="form-input" name="friend-description" required>
                        <input type="url" placeholder="站点链接" class="form-input" name="friend-url" required>
                        <input type="url" placeholder="logo" class="form-input" name="friend-logo" required>
                    </div>
                </fieldset>

                <!-- 附加资料 -->
                <fieldset class="form-section">
                    <legend class="section-title">
                        附加资料<em class="mark">选填</em>
                    </legend>
                    <div class="input-group">
                        <input type="url" placeholder="订阅链接" class="form-input" name="friend-url-rss">
                        <p class="form-tip">
                            <em>提示：每天分别在清晨和傍晚同步更新。首次添加或修改后会在下一周期获取。按W3C标准规则获取，可到卡片下方进入W3C检测失败原因。考虑到资源消耗，如果更新频率过低会取消RSS链接。而站点的排序首先会以添加顺序为基础，然后以
                                RSS 动态里第一条的时间逐个降序。</em>
                        </p>
                        <input type="email" placeholder="邮箱" class="form-input" name="friend-email">
                        <p class="form-tip">
                            <em>提示：您填写的邮箱用来邮件通知。</em>
                            <em>背景：每天由 wordpress 截图自动生成，如果 WP.COM 所属服务器的 IP（在国外）无法访问您的站点或访问 IP 不稳定，则背景会出现错误。</em>
                        </p>
                    </div>
                </fieldset>

                <button type="submit" class="submit-button">
                    提交链接
                </button>
            </form>
        </main>
    </section>
</template>





<script setup name="linksAdd">
import axios from '@/dist/axios';
import { createMessage as message } from '@/dist/message';




const props = defineProps({
    userInfo: {
        type: Object,
        default: () => ({})
    },
    linksCats: {
        type: Array,
        default: () => []
    }
});


const linkSubmit = async () => {
    const form = document.getElementById('friend-form');
    if (!form) return;
    const formData = new FormData(form);
    const requestBody = Object.fromEntries(formData.entries());

    // **验证必填项**
    const requiredFields = {
        "friend-name": "名称",
        "friend-url": "站点链接",
        "friend-logo": "Logo",
        "category_id": "分类",
        "friend-description": "简述"
    };

    for (const [field, label] of Object.entries(requiredFields)) {
        if (!requestBody[field]?.trim()) {
            return message({ message: `请填写 ${label}`, type: "error" });
        }
    }

    // **验证 URL 格式**
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!urlPattern.test(requestBody["friend-url"]) || !urlPattern.test(requestBody["friend-logo"])) {
        return message({ message: "请输入有效的网址格式", type: "error" });
    }

    // **验证rss格式**
    if (requestBody['friend-url-rss'] && !urlPattern.test(requestBody['friend-url-rss'])) {
        return message({ message: "请输入有效的RSS格式", type: "error" });
    }

    // **邮箱格式验证**
    if (requestBody["friend-email"] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(requestBody["friend-email"])) {
        return message({ message: "请输入有效的邮箱地址", type: "error" });
    }
    // **简述长度验证**
    if (requestBody['friend-description'] && requestBody['friend-description'].length < 5) {
        return message({ message: "简述不能少于5个字符", type: "error" });
    }

    // **构建 API 请求数据**
    const requestData = {
        name: requestBody["friend-name"].trim(),
        desc: requestBody["friend-description"].trim(),
        url: requestBody["friend-url"].trim(),
        logo: requestBody["friend-logo"].trim(),
        cat_id: Number(requestBody["category_id"]),
    };

    // **可选字段**
    if (requestBody["friend-email"]) {
        requestData.email = requestBody["friend-email"].trim();
    }
    if (requestBody["friend-url-rss"]) {
        requestData.rss = requestBody["friend-url-rss"].trim();
    }

    try {
        // **提交数据**
        const response = await axios.post('/apply/friend', requestData);

        // **反馈用户**
        message({ message: response.data.message || "提交成功，请等待管理员审核", type: "success" });

        // **重置表单**
        form.reset();
    } catch (error) {
        // **错误处理**
        console.error("友链提交错误:", error);
        message({
            message: error.response?.data?.message || "提交失败，请稍后重试",
            type: "error"
        });
    }
};

const getLabel = (key) => {
    const labels = {
        name: "站名",
        desc: "简述",
        email: "邮箱",
        link: "链接",
        rss: "订阅",
        avatar: "标识"
    };
    return labels[key] || ''; // 如果找不到映射，默认返回 key
};


const copyText = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        message({ message: '复制成功', type: 'success' })
    } catch (error) {
        message({ message: '复制失败', type: 'error' })
    }
};





</script>
