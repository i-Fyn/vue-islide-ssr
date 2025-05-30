<template>
    <div class="single-page link-register">
        <div class="container wrapper">
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <!-- 左侧 - 站点信息卡 -->
                <div class="site-info-container">
                    <div class="card bg-base-100 shadow-lg  overflow-hidden border border-base-200 sticky top-24">
                        <!-- 站点头像区域 -->
                        <div class="relative h-28 bg-gradient-to-r from-primary/20 to-secondary/30">
                            <div class="w-24 h-24 rounded-full ring-4 ring-base-300 absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                                <img :src="userInfo.avatar" alt="站点头像" class="object-cover w-full h-full" />
                            </div>
                        </div>
                        
                        <!-- 站点信息 -->
                        <div class="card-body pt-16 pb-6">
                            <h2 class="card-title justify-center text-xl font-bold mb-1">{{ userInfo.name }}</h2>
                            <p class="text-center text-base-content/60 text-sm whitespace-normal">{{ userInfo.desc }}</p>
                            
                            <div class="divider my-3">站点信息</div>
                            
                            <!-- 信息列表 -->
                            <ul class="space-y-2.5">
                                <li v-for="(value, key) in userInfo" :key="key" 
                                    
                                    class="group hover:bg-base-200 rounded-xl transition-all duration-200 p-1.5">
                                    <div class="flex items-center gap-3">
                                        <div class="bg-primary/10 p-2 rounded-lg text-primary flex-shrink-0">
                                            <i :class="getIcon(key)"></i>
                                        </div>
                                        <div class="flex-grow">
                                            <div class="text-xs text-base-content/50">{{ getLabel(key) }}</div>
                                            <div class="font-medium text-sm truncate whitespace-normal">{{ value }}</div>
                                        </div>
                                        <button 
                                            @click="copyText(value)"
                                            class="btn btn-ghost btn-sm btn-circle text-primary opacity-0 group-hover:opacity-100 transition-all">
                                            <i class="ri-file-copy-line"></i>
                                        </button>
                                    </div>
                                </li>
                            </ul>
                            
                            <!-- 社交图标 -->
                            <div class="social-links flex justify-center gap-3 mt-5 pt-2 border-t border-base-200">
                                <a href="#" class="btn btn-circle btn-sm btn-ghost hover:bg-primary/10 hover:text-primary transition-colors">
                                    <i class="ri-github-fill"></i>
                                </a>
                                <a href="#" class="btn btn-circle btn-sm btn-ghost hover:bg-primary/10 hover:text-primary transition-colors">
                                    <i class="ri-twitter-x-fill"></i>
                                </a>
                                <a href="#" class="btn btn-circle btn-sm btn-ghost hover:bg-primary/10 hover:text-primary transition-colors">
                                    <i class="ri-telegram-fill"></i>
                                </a>
                                <a href="#" class="btn btn-circle btn-sm btn-ghost hover:bg-primary/10 hover:text-primary transition-colors">
                                    <i class="ri-rss-fill"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 右侧 - 表单区域 -->
                <div class="form-container  col-span-1 lg:col-span-2 card bg-base-100 shadow-lg border border-base-200">
                    <div class="">
                        <div class="card-body p-6 md:p-8 overflow-hdden">
                            <!-- 标题 -->
                            <h2 class="text-base font-bold mb-6 flex items-center gap-3">
                                <span class="bg-primary/20 text-primary p-2 rounded-lg">
                                    <i class="ri-links-line"></i>
                                </span>
                                提交友链申请
                            </h2>
                            
                            <!-- 友链指南 -->
                            <div class="guidelines mb-8">
                                <div class="collapse collapse-arrow bg-base-200/50 rounded-xl">
                                    <input type="checkbox" checked /> 
                                    <div class="collapse-title font-medium flex items-center gap-2">
                                        <i class="ri-lightbulb-line text-warning"></i>
                                        友链申请指南
                                    </div>
                                    <div class="collapse-content text-sm"> 
                                        <p class="text-base-content/70 mb-4 whitespace-normal">我非常希望在您提交申请前能有一些交流互动，让我们相互了解，使连接更有意义。</p>
                                        
                                        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div class="bg-base-100 p-3 rounded-xl hover:shadow-sm transition-all">
                                                <div class="flex items-center gap-2 text-primary mb-1.5">
                                                    <i class="ri-chat-1-line"></i>
                                                    <h4 class="font-medium">交流互动</h4>
                                                </div>
                                                <p class="text-xs text-base-content/60">保持联系和互动是友链的核心价值</p>
                                            </div>
                                            
                                            <div class="bg-base-100 p-3 rounded-xl hover:shadow-sm transition-all">
                                                <div class="flex items-center gap-2 text-primary mb-1.5">
                                                    <i class="ri-article-line"></i>
                                                    <h4 class="font-medium">内容原创</h4>
                                                </div>
                                                <p class="text-xs text-base-content/60">至少有10篇原创文章，保证内容质量</p>
                                            </div>
                                            
                                            <div class="bg-base-100 p-3 rounded-xl hover:shadow-sm transition-all">
                                                <div class="flex items-center gap-2 text-primary mb-1.5">
                                                    <i class="ri-link"></i>
                                                    <h4 class="font-medium">预设链接</h4>
                                                </div>
                                                <p class="text-xs text-base-content/60">请提前做好本站链接，确保双向互联</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 申请表单 -->
                            <form id="friend-form" class="application-form" @submit.prevent="linkSubmit">
                                <!-- 步骤指示器 -->
                                <ul class="steps steps-horizontal w-full mb-8" style="margin-bottom: 32px;">
                                    <li class="step" :class="{ 'step-primary': currentStep >= 1 }">类型</li>
                                    <li class="step" :class="{ 'step-primary': currentStep >= 2 }">基本信息</li>
                                    <li class="step" :class="{ 'step-primary': currentStep >= 3 }">扩展信息</li>
                                    <li class="step" :class="{ 'step-primary': currentStep >= 4 }">提交</li>
                                </ul>
                                
                                <!-- 类型选择 -->
                                <div class="form-section mb-8 fade-in" v-show="currentStep === 1">
                                    <h3 class="text-base font-medium flex items-center gap-2 mb-4">
                                        <i class="ri-folder-line text-primary"></i>
                                        选择类型 <span class="text-error">*</span>
                                    </h3>
                                    
                                    <div class="category-options grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        <label v-for="item in linksCats" 
                                            :key="item.term_id" 
                                            class="category-option">
                                            <input type="radio" 
                                                name="category_id" 
                                                :value="item.term_id"
                                                v-model="formData.category_id" 
                                                class="peer hidden">
                                            <div class="flex flex-col items-center gap-2 p-3 bg-base-200 rounded-xl cursor-pointer transition-all duration-200 border border-transparent peer-checked:bg-primary/10 peer-checked:border-primary hover:bg-base-300">
                                                <span class="text-xl" v-if="getCategoryIcon(item.name)">
                                                    <i :class="getCategoryIcon(item.name)"></i>
                                                </span>
                                                <span class="text-center font-medium text-sm">{{ item.name }}</span>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <!-- 导航按钮 -->
                                    <div class="flex justify-end mt-6">
                                        <button type="button" class="btn btn-primary rounded-full btn-sm btn-outline " @click="nextStep" :disabled="!formData.category_id">
                                            下一步 <i class="ri-arrow-right-line ml-1"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <!-- 基本信息 -->
                                <div class="form-section mb-8 fade-in" v-show="currentStep === 2">
                                    <h3 class="text-base font-medium flex items-center gap-2 mb-4">
                                        <i class="ri-profile-line text-primary"></i>
                                        基本信息 <span class="text-error">*</span>
                                    </h3>
                                    
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div class="form-control">
                                            <div class="input-group flex">
                                                <span class="input-group-addon bg-base-200 border-y border-l border-base-300 rounded-l-lg px-3">
                                                    <i class="ri-user-line text-base-content/60"></i>
                                                </span>
                                                <input type="text" 
                                                    placeholder="站点名称" 
                                                    class="input input-bordered w-full rounded-l-none focus:border-primary focus:ring-1 focus:ring-primary" 
                                                    v-model="formData.name"
                                                    name="friend-name" 
                                                    id="friend-name"
                                                    required>
                                            </div>
                                        </div>
                                        
                                        <div class="form-control">
                                            <div class="input-group flex">
                                                <span class="input-group-addon bg-base-200 border-y border-l border-base-300 rounded-l-lg px-3">
                                                    <i class="ri-file-text-line text-base-content/60"></i>
                                                </span>
                                                <input type="text" 
                                                    placeholder="站点简述" 
                                                    class="input input-bordered w-full rounded-l-none focus:border-primary focus:ring-1 focus:ring-primary" 
                                                    v-model="formData.description"
                                                    name="friend-description" 
                                                    id="friend-description"
                                                    required>
                                            </div>
                                        </div>
                                        
                                        <div class="form-control">
                                            <div class="input-group flex">
                                                <span class="input-group-addon bg-base-200 border-y border-l border-base-300 rounded-l-lg px-3">
                                                    <i class="ri-links-line text-base-content/60"></i>
                                                </span>
                                                <input type="url" 
                                                    placeholder="站点链接" 
                                                    class="input input-bordered w-full rounded-l-none focus:border-primary focus:ring-1 focus:ring-primary" 
                                                    v-model="formData.url"
                                                    name="friend-url" 
                                                    id="friend-url"
                                                    required>
                                            </div>
                                        </div>
                                        
                                        <div class="form-control">
                                            <div class="input-group flex">
                                                <span class="input-group-addon bg-base-200 border-y border-l border-base-300 rounded-l-lg px-3">
                                                    <i class="ri-image-line text-base-content/60"></i>
                                                </span>
                                                <input type="url" 
                                                    placeholder="LOGO链接" 
                                                    class="input input-bordered w-full rounded-l-none focus:border-primary focus:ring-1 focus:ring-primary" 
                                                    v-model="formData.logo"
                                                    name="friend-logo" 
                                                    id="friend-logo"
                                                    required>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- 导航按钮 -->
                                    <div class="flex justify-between mt-6">
                                        <button type="button" class="btn" @click="previousStep">
                                            <i class="ri-arrow-left-line mr-1"></i> 上一步
                                        </button>
                                        <button type="button" class="btn btn-primary" @click="nextStep" 
                                            :disabled="!formData.name || !formData.description || !formData.url || !formData.logo">
                                            下一步 <i class="ri-arrow-right-line ml-1"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <!-- 额外信息 -->
                                <div class="form-section mb-8 fade-in" v-show="currentStep === 3">
                                    <h3 class="text-base font-medium flex items-center gap-2 mb-4">
                                        <i class="ri-information-line text-primary"></i>
                                        扩展信息
                                    </h3>
                                    
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div class="form-control col-span-1 md:col-span-2">
                                            <div class="input-group flex">
                                                <span class="input-group-addon bg-base-200 border-y border-l border-base-300 rounded-l-lg px-3">
                                                    <i class="ri-rss-line text-base-content/60"></i>
                                                </span>
                                                <input type="url" 
                                                    placeholder="RSS订阅链接" 
                                                    class="input input-bordered w-full rounded-l-none focus:border-primary focus:ring-1 focus:ring-primary" 
                                                    v-model="formData.rss"
                                                    name="friend-url-rss" 
                                                    id="friend-url-rss">
                                            </div>
                                            <label class="label">
                                                <span class="whitespace-normal label-text-alt text-base-content/60 text-xs">每天自动同步更新，按W3C标准规则获取，低更新频率可能导致链接取消</span>
                                            </label>
                                        </div>
                                        
                                        <div class="form-control">
                                            <div class="input-group flex">
                                                <span class="input-group-addon bg-base-200 border-y border-l border-base-300 rounded-l-lg px-3">
                                                    <i class="ri-mail-line text-base-content/60"></i>
                                                </span>
                                                <input type="email" 
                                                    placeholder="联系邮箱" 
                                                    class="input input-bordered w-full rounded-l-none focus:border-primary focus:ring-1 focus:ring-primary" 
                                                    v-model="formData.email"
                                                    name="friend-email" 
                                                    id="friend-email">
                                            </div>
                                            <label class="label">
                                                <span class="label-text-alt text-base-content/60 text-xs">用于审核通知及后续沟通</span>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <!-- 导航按钮 -->
                                    <div class="flex justify-between mt-6">
                                        <button type="button" class="btn" @click="previousStep">
                                            <i class="ri-arrow-left-line mr-1"></i> 上一步
                                        </button>
                                        <button type="button" class="btn btn-primary" @click="nextStep">
                                            预览提交 <i class="ri-arrow-right-line ml-1"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <!-- 提交确认 -->
                                <div class="form-section mb-8 fade-in" v-show="currentStep === 4">
                                    <h3 class="text-base font-medium flex items-center gap-2 mb-4">
                                        <i class="ri-check-double-line text-primary"></i>
                                        确认信息
                                    </h3>
                                    
                                    <div class="bg-base-200/50 p-4 rounded-xl mb-6">
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div class="flex flex-col gap-1">
                                                <div class="text-xs text-base-content/60">站点名称</div>
                                                <div class="font-medium">{{ formData.name || '未填写' }}</div>
                                            </div>
                                            <div class="flex flex-col gap-1">
                                                <div class="text-xs text-base-content/60">站点简述</div>
                                                <div class="font-medium">{{ formData.description || '未填写' }}</div>
                                            </div>
                                            <div class="flex flex-col gap-1">
                                                <div class="text-xs text-base-content/60">站点链接</div>
                                                <div class="font-medium">{{ formData.url || '未填写' }}</div>
                                            </div>
                                            <div class="flex flex-col gap-1">
                                                <div class="text-xs text-base-content/60">LOGO链接</div>
                                                <div class="font-medium">{{ formData.logo || '未填写' }}</div>
                                            </div>
                                            <div class="flex flex-col gap-1">
                                                <div class="text-xs text-base-content/60">RSS订阅</div>
                                                <div class="font-medium">{{ formData.rss || '未填写' }}</div>
                                            </div>
                                            <div class="flex flex-col gap-1">
                                                <div class="text-xs text-base-content/60">联系邮箱</div>
                                                <div class="font-medium">{{ formData.email || '未填写' }}</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- 导航按钮 -->
                                    <div class="flex justify-between mt-6">
                                        <button type="button" class="btn" @click="previousStep">
                                            <i class="ri-arrow-left-line mr-1"></i> 上一步
                                        </button>
                                        <button type="submit" class="btn btn-primary px-8" :disabled="isSubmitting">
                                            <i class="ri-send-plane-fill mr-1"></i> {{ isSubmitting ? '提交中...' : '提交申请' }}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup name="linksAdd">
import axios from '@/dist/axios';
import { createMessage as message } from '@/dist/message';
import { useStore } from '../store';
import { ref, onMounted, reactive } from 'vue';

const store = useStore();
const linksCats = store.config.link_category;
const currentStep = ref(1); // 默认从第一步开始

// 表单数据对象
const formData = reactive({
    category_id: '',
    name: '',
    description: '',
    url: '',
    logo: '',
    rss: '',
    email: ''
});

// 步骤控制
const nextStep = () => {
    if (currentStep.value < 4) {
        currentStep.value++;
    }
};

const previousStep = () => {
    if (currentStep.value > 1) {
        currentStep.value--;
    }
};

const linkSubmit = async (e) => {
    // **验证必填项**
    if (!formData.category_id) {
        currentStep.value = 1;
        return message({ message: "请选择友链类型", type: "error" });
    }
    
    if (!formData.name?.trim()) {
        currentStep.value = 2;
        return message({ message: "请填写站点名称", type: "error" });
    }
    
    if (!formData.description?.trim()) {
        currentStep.value = 2;
        return message({ message: "请填写站点简述", type: "error" });
    }
    
    if (!formData.url?.trim()) {
        currentStep.value = 2;
        return message({ message: "请填写站点链接", type: "error" });
    }
    
    if (!formData.logo?.trim()) {
        currentStep.value = 2;
        return message({ message: "请填写LOGO链接", type: "error" });
    }

    // **验证 URL 格式**
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!urlPattern.test(formData.url) || !urlPattern.test(formData.logo)) {
        currentStep.value = 2;
        return message({ message: "请输入有效的网址格式", type: "error" });
    }

    // **验证rss格式**
    if (formData.rss && !urlPattern.test(formData.rss)) {
        currentStep.value = 3;
        return message({ message: "请输入有效的RSS格式", type: "error" });
    }

    // **邮箱格式验证**
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        currentStep.value = 3;
        return message({ message: "请输入有效的邮箱地址", type: "error" });
    }
    
    // **简述长度验证**
    if (formData.description && formData.description.length < 5) {
        currentStep.value = 2;
        return message({ message: "简述不能少于5个字符", type: "error" });
    }

    // **构建 API 请求数据**
    const requestData = {
        name: formData.name.trim(),
        desc: formData.description.trim(),
        url: formData.url.trim(),
        logo: formData.logo.trim(),
        cat_id: Number(formData.category_id),
    };

    // **可选字段**
    if (formData.email) {
        requestData.email = formData.email.trim();
    }
    if (formData.rss) {
        requestData.rss = formData.rss.trim();
    }

    try {
        // 提交前动画
        isSubmitting.value = true;
        
        // **提交数据**
        const response = await axios.post('/apply/friend', requestData);

        // **反馈用户**
        message({ message: response.data.message || "提交成功，请等待管理员审核", type: "success" });

        // **重置表单**
        Object.keys(formData).forEach(key => formData[key] = '');
        currentStep.value = 1;
        
        // 提交后状态
        isSubmitting.value = false;
    } catch (error) {
        // **错误处理**
        console.error("友链提交错误:", error);
        message({
            message: error.response?.data?.message || "提交失败，请稍后重试",
            type: "error"
        });
        isSubmitting.value = false;
    }
};

const isSubmitting = ref(false);

const userInfo = {
    name: store.config.link_page_name,
    desc: store.config.link_page_desc,
    link: store.config.link_page_url,
    rss: store.config.link_page_rss,
    avatar: store.config.link_page_avatar,
    email: store.config.link_page_email,
}

const getLabel = (key) => {
    const labels = {
        name: "站名",
        desc: "简述",
        email: "邮箱",
        link: "链接",
        rss: "订阅",
        avatar: "标识"
    };
    return labels[key] || ''; 
};

const getIcon = (key) => {
    const icons = {
        name: "ri-user-line",
        desc: "ri-file-text-line",
        email: "ri-mail-line",
        link: "ri-links-line",
        rss: "ri-rss-line",
        avatar: "ri-image-line"
    };
    return icons[key] || 'ri-information-line';
};

const getCategoryIcon = (name) => {
    const iconMap = {
        "技术": "ri-code-box-line",
        "博客": "ri-article-line",
        "生活": "ri-heart-line",
        "摄影": "ri-camera-line",
        "设计": "ri-palette-line",
        "游戏": "ri-gamepad-line",
        "艺术": "ri-brush-line",
        "音乐": "ri-music-line",
        "影视": "ri-movie-line",
        "阅读": "ri-book-open-line",
        "其他": "ri-more-line"
    };
    
    for (const [key, icon] of Object.entries(iconMap)) {
        if (name.includes(key)) {
            return icon;
        }
    }
    
    return "ri-links-line"; 
};

const copyText = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        message({ message: '复制成功', type: 'success' })
    } catch (error) {
        message({ message: '复制失败', type: 'error' })
    }
};

onMounted(() => {
    // 初始动画效果
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.form-section').forEach(section => {
        observer.observe(section);
    });
});
</script>

<style scoped>
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 表单段落动画 */
.form-section {
    opacity: 0;
}

.fade-in-up {
    animation: fadeInUp 0.5s ease forwards;
}

/* 输入框样式优化 */
.input-group-addon {
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 表单元素集中 */
.form-control:focus-within .input-group-addon {
    border-color: hsl(var(--p));
    color: hsl(var(--p));
}

/* 标题下划线动画 */
header h1 div {
    transition: transform 0.3s ease;
}

header h1:hover div {
    transform: scale-x-100;
}
</style>


