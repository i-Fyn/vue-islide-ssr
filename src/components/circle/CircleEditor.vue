<template>
    <div class="single-page my-auto mx-0 h-full pb-19">
        <div class="wrapper relative">
            <div class="editor-card card bg-base-100 shadow-md flex flex-col lg:flex-row rounded-xl overflow-hidden" ref="circleEditor">
                <!-- 编辑区域 -->
                <div class="editor-body card-body p-4 md:p-4 w-full flex-1">
                    <!-- 顶部标题栏 -->
                    <div class="editor-header mb-4">
                        <h2 class="text-xl font-bold flex items-center gap-2">
                            <i class="ri-edit-line text-primary"></i>
                            创建{{ momentTypeList.find(i => i.value === momentType)?.text || '内容' }}
                        </h2>
                        <p class="text-sm text-base-content/70 mt-1">
                            在{{ circle?.name || '圈子' }}中分享你的想法和经验
                        </p>
                    </div>

                    <!-- 标题输入 -->
                    <div class="title-input form-control group relative mb-4">
                        <div class="flex items-center gap-2 text-base-content/70 text-sm mb-2">
                            <i class="ri-heading text-primary"></i> 标题
                            <span v-if="privacy.type != 'none'" class="text-primary">*</span>
                        </div>
                        <input v-model="title"
                            :placeholder="'标题' + (privacy.type != 'none' ? '' : '非') + '必填，最多 ' + numberLimit.maxTitke + ' 字'"
                            :maxlength="numberLimit.maxTitke" class="input input-bordered w-full transition-all duration-200"
                            :class="{'input-primary': privacy.type != 'none', 'focus:ring-2 focus:ring-primary focus:ring-opacity-50': true}" ref="momentTitle" />
                        
                        <div class="title-counter text-right text-xs text-base-content/60 mt-1">
                            {{ numberLimit.titleLength }}/{{ numberLimit.maxTitke }}
                        </div>
                    </div>

                    <!-- 内容输入 -->
                    <div class="content-input mb-4">
                        <div class="flex items-center gap-2 text-base-content/70 text-sm mb-2">
                            <i class="ri-text text-primary"></i> 内容
                            <span class="text-primary">*</span>
                        </div>
                        <div v-if="momentType === 'card'" class="card card-bordered border-base-300 bg-base-50 rounded-xl overflow-hidden">
                            <textarea v-model="content" ref="momentContent"
                                class="textarea w-full min-h-[40vh] border-0 resize-none focus:outline-none p-4" 
                                :maxlength="numberLimit.maxContent"
                                :minlength="numberLimit.minContent" 
                                placeholder="有什么新鲜事？" 
                                @input="autoResize"></textarea>
                            <div class="flex justify-between items-center px-4 py-2 border-t border-base-200 bg-base-100">
                                <div class="text-xs text-base-content/60">
                                    {{ numberLimit.contentLength }}/{{ numberLimit.maxContent }} 字
                                </div>
                                <div class="text-xs" :class="{'text-success': numberLimit.contentLength >= numberLimit.minContent, 'text-error': numberLimit.contentLength < numberLimit.minContent}">
                                    最少 {{ numberLimit.minContent }} 字
                                </div>
                            </div>
                        </div>
                        <div v-else class="card card-bordered border-base-300 overflow-hidden rounded-xl">
                            <TinyEditor v-model="content" :height="300" style="height: 300px;" />
                        </div>
                    </div>
                </div>

                <!-- 工具栏 -->
                <div class="toolbar border-t lg:border-t-0 lg:border-l border-base-200 p-4 md:p-4 relative w-full lg:w-75 lg:max-w-sm bg-base-50">
                    <div class="toolbar-header mb-4 pb-2 border-b border-base-200">
                        <h3 class="font-medium flex items-center gap-2">
                            <i class="ri-tools-line text-primary"></i>
                            编辑选项
                        </h3>
                    </div>
                    
                    <div class="toolbar-content space-y-4 max-h-[calc(100vh-16rem)]  pr-1 pb-4">
                        <!-- 帖子类型选择 -->
                        <div class="type-selector">
                            <div class="label mb-2 text-sm text-base-content/70 flex items-center gap-2">
                                <i class="ri-file-list-line"></i> 内容类型
                            </div>
                            <div class="btn-group w-full flex gap-2 justify-between p-4p-4">
                                <button 
                                    v-for="item in momentTypeList" 
                                    :key="item.value"
                                    @click="momentType = item.value"
                                    class="btn flex-1"
                                    :class="momentType === item.value ? 'btn-primary' : 'btn-outline'"
                                >
                                    <i :class="item.icon" class="mr-1"></i>
                                    {{ item.text }}
                                </button>
                            </div>
                        </div>

                        <!-- 图片上传 -->
                        <div v-if="momentType === 'card'" class="image-upload mb-4">
                            <div class="label mb-2 text-sm text-base-content/70 flex items-center gap-2">
                                <i class="ri-image-line"></i> 图片 <span class="text-xs">(最多{{ image.count }}张)</span>
                            </div>
                            <div class="image-list grid grid-cols-3 lg:grid-cols-4 gap-3">
                                <div v-for="(item, index) in image.list" 
                                    class="image-item relative w-full aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-base-200 group">
                                    <img :src="item.url" class="w-full h-full object-cover" />
                                    <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button class="delete-btn btn btn-circle btn-sm bg-error hover:bg-error-focus text-white border-none"
                                            @click.stop="image.list.splice(index, 1)">
                                            <i class="ri-delete-bin-line"></i>
                                        </button>
                                    </div>
                                </div>

                                <div v-if="image.list.length < image.count" class="w-full aspect-square">
                                    <button @click.stop="showImgUploadBox"
                                        class="add-image-btn w-full h-full btn btn-outline border-2 border-dashed hover:border-primary hover:bg-primary/10 flex flex-col items-center justify-center gap-2 transition-all rounded-lg">
                                        <i class="ri-add-line text-2xl"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- 视频上传 -->
                        <div v-if="momentType === 'card' && video.list.length" class="video-upload">
                            <div class="label mb-2 text-sm text-base-content/70 flex items-center gap-2">
                                <i class="ri-video-line"></i> 视频
                            </div>
                            <div class="space-y-4">
                                <div v-for="(item, index) in video.list" class="video-item card bg-base-100 border border-base-200 rounded-xl overflow-hidden">
                                    <div class="card-body p-3">
                                        <div class="flex items-center gap-3">
                                            <i class="ri-file-video-fill text-2xl text-primary"></i>
                                            <div class="flex-1">
                                                <div class="flex justify-between">
                                                    <span class="text-sm truncate">{{ item.name }}</span>
                                                    <span class="text-sm">{{ item.progress }}%</span>
                                                </div>
                                                <progress class="progress progress-primary w-full" :value="item.progress"
                                                    max="100"></progress>
                                            </div>
                                            <button class="refresh-btn btn btn-ghost btn-sm" @click="$refs.videoInput.click()">
                                                <i class="ri-refresh-line"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- 视频封面 -->
                                <div class="video-cover card bg-base-100 border border-base-200 rounded-xl overflow-hidden">
                                    <div class="card-body p-4">
                                        <h3 class="font-medium mb-2 text-sm flex items-center gap-2">
                                            <i class="ri-gallery-line text-primary"></i>
                                            视频封面
                                        </h3>

                                        <div class="cover-preview aspect-video bg-base-200 rounded-lg overflow-hidden mb-4 border border-base-300">
                                            <img v-if="video.thumb" :src="video.thumb.url" class="w-full h-full object-cover" />
                                            <div v-else class="flex items-center justify-center h-full">
                                                <span class="text-base-content/60">点击设置封面</span>
                                            </div>
                                        </div>

                                        <div class="cover-options space-y-2">
                                            <p class="text-xs text-base-content/60">系统默认选中第一帧为视频封面，以下为更多智能推荐封面</p>
                                            <div class="cover-grid grid grid-cols-4 gap-2">
                                                <div v-for="item in video.list[0].thumbList"
                                                    class="cover-item aspect-video bg-base-200 rounded cursor-pointer border-2"
                                                    :class="{ 'border-primary': item.url === video.thumb.url, 'border-transparent': item.url !== video.thumb.url }"
                                                    @click="changeVideoThumb(item)">
                                                    <img v-if="item.url" :src="item.url" class="w-full h-full object-cover" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 标签选择 -->
                        <div v-if="circle && circle.circle_tags.length" class="tag-selector">
                            <div class="label mb-2 text-sm text-base-content/70 flex items-center gap-2">
                                <i class="ri-price-tag-3-line"></i> 所属板块
                            </div>
                            <div class="tag-list flex flex-wrap gap-2">
                                <button class="tag-item badge badge-lg"
                                    :class="{ 'badge-primary': momentTag == '', 'badge-outline': momentTag != '' }"
                                    @click="momentTag = ''">
                                    综合
                                </button>
                                <button v-for="item in circle.circle_tags" class="tag-item badge badge-lg"
                                    :class="{ 'badge-primary': momentTag == item.name, 'badge-outline': momentTag != item.name }" 
                                    @click="momentTag = item.name">
                                    {{ item.name }}
                                </button>
                            </div>
                        </div>

                        <!-- 权限设置 -->
                        <div v-if="privacy.type != 'none'" class="privacy-settings card bg-base-100 border border-base-200 rounded-xl overflow-hidden">
                            <div class="card-body p-4">
                                <div class="privacy-header flex items-center gap-2 mb-4">
                                    <i :class="privacy.list[privacy.type].icon + ' text-primary'"></i>
                                    <span class="font-medium">{{ privacy.list[privacy.type].text }}可见</span>
                                </div>

                                <input v-if="['password', 'money', 'credit'].includes(privacy.type)"
                                    :placeholder="'(数字) 设置' + privacy.list[privacy.type].text" maxlength="20"
                                    class="privacy-input input input-bordered w-full mb-3" v-model="privacy.value" />

                                <div v-if="privacy.type == 'roles'" class="roles-list flex flex-wrap gap-2 mb-3">
                                    <label v-for="(lv, key) in currentUser.roles"
                                        class="role-item flex items-center gap-2 px-3 py-1.5 bg-base-200 rounded-lg cursor-pointer hover:bg-base-300 transition-colors">
                                        <input type="checkbox" v-model="privacy.roles" :value="key"
                                            class="checkbox checkbox-primary checkbox-sm" />
                                        <span class="label-text">{{ lv }}</span>
                                    </label>
                                </div>

                                <textarea v-model="privacy.content"
                                    class="privacy-content textarea textarea-bordered w-full focus:textarea-primary"
                                    :placeholder="'请在这里输入想要' + privacy.list[privacy.type].text + '才可查看隐藏的内容'"
                                    maxlength="800" minlength="5" rows="3"></textarea>
                            </div>
                        </div>

                        <!-- 投票选项 -->
                        <div v-if="toolType === 'vote' || voteOptions.length" class="vote-settings card bg-base-100 border border-base-200 rounded-xl overflow-hidden">
                            <div class="card-body p-4 space-y-4">
                                <h3 class="card-title text-sm font-medium flex items-center gap-2">
                                    <i class="ri-bar-chart-grouped-line text-primary"></i> 投票设置
                                </h3>

                                <!-- 标题 -->
                                <div class="form-control">
                                    <label class="label">
                                        <span class="label-text text-xs">投票标题</span>
                                    </label>
                                    <input v-model="voteTitle" class="input input-bordered input-sm w-full" maxlength="50"
                                        placeholder="请输入投票标题" @click.stop />
                                </div>

                                <!-- 选项列表 -->
                                <div class="vote-list space-y-2">
                                    <div v-for="(option, index) in voteOptions" :key="index"
                                        class="flex items-center gap-2">
                                        <span class="text-sm text-primary font-medium w-4 text-center">{{ index + 1 }}</span>
                                        <input v-model="option.option_text" class="input input-bordered input-sm flex-1"
                                            :placeholder="'选项 ' + (index + 1)" maxlength="50" />
                                        <button class="btn btn-ghost btn-sm btn-circle" @click="voteOptions.splice(index, 1)">
                                            <i class="ri-delete-bin-line text-error"></i>
                                        </button>
                                    </div>
                                    <button v-if="voteOptions.length < 10" class="btn btn-outline btn-sm w-full"
                                        @click="voteOptions.push({ option_text: '' })">
                                        <i class="ri-add-line mr-1"></i>添加选项
                                    </button>
                                </div>

                                <!-- 截止时间 -->
                                <div class="form-control">
                                    <label class="label">
                                        <span class="label-text text-xs">截止时间</span>
                                    </label>
                                    <input v-model="voteEndTime" type="datetime-local" class="input input-bordered input-sm w-full"
                                        placeholder="请选择投票截止时间" />
                                </div>
                            </div>
                        </div>

                        <!-- 悬赏积分 -->
                        <div v-if="momentType === 'question'" class="reward-settings card bg-base-100 border border-base-200 rounded-xl overflow-hidden">
                            <div class="card-body p-4 space-y-3">
                                <h3 class="card-title text-sm font-medium flex items-center gap-2">
                                    <i class="ri-coin-line text-warning"></i> 悬赏设置
                                </h3>

                                <div class="form-control">
                                    <label class="label">
                                        <span class="label-text text-xs">积分数量</span>
                                    </label>
                                    <div class="input-group flex gap-2">
                                        <input v-model="questionReward.value" type="number" class="input input-bordered w-full"
                                            placeholder="请输入悬赏积分数量" min="0" max="99999" />
                                    </div>

                                    <label class="label">
                                        <span class="label-text-alt text-error text-xs">* 悬赏积分发布后不可修改</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 底部工具栏 -->
            <div class="bottom-toolbar fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-200 p-3 z-3000 h-18">
                <div class="container mx-auto flex items-center justify-between gap-2">
                    <div class="tool-buttons flex gap-2 lg:gap-4 overflow-x-auto">
                        <!-- 圈子选择 -->
                        <button class="tool-btn btn btn-sm" @click.stop="toolClick('circle_cat', $event)">
                            <i class="ri-price-tag-3-line"></i>
                            <span class="ml-1 truncate max-w-[120px]">{{ circle?.name || '选择圈子' }}</span>
                            <i class="ri-arrow-down-s-line ml-1"></i>
                        </button>
                        
                        <!-- 内容类型 -->
                        <button class="tool-btn btn btn-sm" @click.stop="toolClick('type', $event)">
                            <i :class="momentTypeList.find(i => i.value === momentType)?.icon || 'ri-file-line'"></i>
                            <span class="ml-1">{{momentTypeList.find(i => i.value === momentType)?.text || '类型'}}</span>
                        </button>
                        
                        <!-- 可见性设置 -->
                        <button class="tool-btn btn btn-sm" @click.stop="toolClick('privacy', $event)">
                            <i :class="privacy.list[privacy.type].icon"></i>
                            <span class="ml-1">{{ privacy.list[privacy.type].text }}</span>
                        </button>
                        
                        <!-- 其他工具按钮 -->
                        <button v-for="item in editor.toolbar.filter(i => !['circle_cat', 'type', 'privacy'].includes(i.tool))" 
                            class="tool-btn btn btn-sm"
                            :class="{ 'btn-disabled': isToolDisabled(item.tool) }"
                            @click.stop="toolClick(item.tool, $event)">
                            <i :class="item.icon"></i>
                            <span v-if="item.name_show == '1'" class="ml-1 hidden sm:inline">
                                {{ item.name }}
                            </span>
                        </button>
                    </div>
                    
                    <button class="submit-btn btn btn-primary" :class="{ 'btn-disabled': submitdisabled }"
                        @click="submitMoment()">
                        发布
                    </button>
                </div>

                <!-- 弹出菜单 -->
                <div class="popup-menu absolute left-0 bottom-full z-50" v-cloak>
                    <!-- Emoji选择器 -->
                    <div v-show="showEmoji" v-click-outside="() => showEmoji = false"
                        class="emoji-selector card bg-base-100 shadow-lg border border-base-200 rounded-xl menu-item mb-2">
                        <div class="card-body p-3">
                            <CommentEmoji v-model="showEmoji" @emoji-click="handleClick" />
                        </div>
                    </div>

                    <!-- 帖子类型菜单 -->
                    <div v-show="toolType == 'type'" v-click-outside="() => toolType = ''"
                        class="type-menu card bg-base-100 shadow-lg border border-base-200 rounded-xl menu-item mb-2">
                        <div class="card-body p-2">
                            <div class="menu bg-base-100 w-56">
                                <button v-for="item in momentTypeList" :key="item.value"
                                    class="btn btn-ghost justify-start gap-2 w-full"
                                    :class="{ 'text-primary': momentType === item.value }"
                                    @click="momentType = item.value">
                                    <i :class="item.icon"></i>
                                    {{ item.text }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 话题/圈子选择器 -->
                    <div v-show="toolType == 'topic' || toolType == 'circle_cat'"
                        v-click-outside="() => toolType = ''"
                        class="topic-selector card bg-base-100 shadow-lg border border-base-200 rounded-xl w-80 h-96 menu-item mb-2">
                        <div class="card-body p-4 overflow-hidden">
                            <!-- 搜索框 -->
                            <div class="search-box form-control">
                                <div class="input-group flex gap-4">
                                    <input type="text" v-model="searchText"
                                        class="search-input input input-bordered w-full focus:input-primary"
                                        :placeholder="toolType == 'topic' ? '搜索话题' : '搜索社区圈子'"
                                        @input="handleInput" @compositionstart="composing = true"
                                        @compositionend="composing = false" @click.stop />
                                    <button class="search-btn btn btn-primary btn-square">
                                        <i class="ri-search-2-line"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- 分类标签 -->
                            <div v-if="selectorTabs.length && toolType == 'circle_cat' && !searchText"
                                class="category-tabs tabs tabs-boxed mt-4 whitespace-nowrap overflow-auto flex-nowrap">
                                <a v-for="(item, index) in selectorTabs" class="tab-item tab"
                                    :class="{ 'tab-active': index == selectorTabIndex }"
                                    @click="selectorTabChange(index)">
                                    {{ item.name }}
                                </a>
                            </div>

                            <!-- 列表 -->
                            <div class="selector-list mt-4 flex-1 overflow-y-auto max-h-[calc(100%-5rem)]">
                                <div v-for="item in selectorList"
                                    class="selector-item flex items-center gap-3 p-3 hover:bg-base-200 rounded-lg cursor-pointer mb-2"
                                    @click="selector(item)">
                                    <div class="avatar">
                                        <div class="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center overflow-hidden">
                                            <i v-if="!item.icon" class="ri-hashtag text-xl text-primary"></i>
                                            <img v-else :src="item.icon" class="w-full h-full object-cover" />
                                        </div>
                                    </div>

                                    <div class="item-info flex-1">
                                        <div class="font-medium">{{ item.name }}</div>
                                        <div class="text-xs text-base-content/60">
                                            <span v-if="item.id">
                                                {{ item.user_count }}圈友 · {{ item.post_count }}动态
                                            </span>
                                            <span v-else>{{ item.desc }}</span>
                                        </div>
                                    </div>

                                    <div v-if="item.id == circle_id && toolType == 'circle_cat'" class="text-primary">
                                        <i class="ri-checkbox-circle-fill"></i>
                                    </div>

                                    <button v-if="!item.id" class="create-btn btn btn-primary btn-sm"
                                        @click="create(item)">
                                        创建
                                    </button>
                                </div>

                                <div v-if="!selectorList.length && loading"
                                    class="loading-state py-8 text-center">
                                    <span class="loading loading-spinner text-primary"></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 权限菜单 -->
                    <div v-show="toolType == 'privacy'"
                        class="privacy-menu card bg-base-100 shadow-lg border border-base-200 rounded-xl menu-item mb-2">
                        <div class="card-body p-2">
                            <div class="menu bg-base-100 w-56">
                                <button v-for="(item, index) in privacy.list"
                                    class="privacy-option btn btn-ghost justify-start gap-2 w-full" 
                                    :class="{
                                        'text-primary': privacy.type == index,
                                        'btn-disabled': currentUser.privacy_role && !currentUser.privacy_role[index]
                                    }" 
                                    @click="privacy.type = index; toolType = ''">
                                    <i :class="item.icon"></i>
                                    {{ item.text }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <input ref="videoInput" type="file" accept="video/*" @change="fileUpload($event)"
                class="video-input hidden" />
        </div>
    </div>
</template>

<script setup>
import CommentEmoji from '@/components/single/container/comment/CommentEmoji.vue';
import { ref, reactive, computed, onMounted, watch, nextTick, defineAsyncComponent } from 'vue';
import axios from '@/dist/axios';
import { useStore } from '@/store';
import { createVanModal } from '@/dist/createVanModal'
import { useRouter, useRoute } from 'vue-router';
import { createMessage as message } from '@/dist/message';

const TinyEditor = defineAsyncComponent({
    loader: () => import.meta.env.SSR
        ? Promise.resolve({ render: () => null })
        : import('@/components/tinymce/TinyEditor.vue'),
    loadingComponent: { render: () => null },
    errorComponent: { render: () => null },
    delay: 200,
    timeout: 5000
});

defineOptions({
    name: 'CircleEditor',
});

const emit = defineEmits(['loadinged', 'close-modal']);
const router = useRouter();
const store = useStore();
const route = useRoute();
const circle_id = ref(0); // 圈子id
const tax = ref(route.query.id || 0)
const circle = ref(null);
const momentContent = ref(null);
const videoInput = ref(null);
const moment_id = ref(0);
const title = ref('');
const content = ref('');
const momentType = ref('card'); // 帖子类型
const momentTag = ref('');
const showTypeMenu = ref(false);

//投票类型
const voteTitle = ref('');
const voteOptions = ref([]);
const voteEndTime = ref(null);


const searchText = ref(''); // 搜索词
const toolType = ref(''); // 工具栏点击类型
const showEmoji = ref(false);
const locked = ref(false);
const loading = ref(false);
const composing = ref(false); // 用于判断是否中文打字输入
const typingTimer = ref(null);
const selectorTabIndex = ref(0);

const circleList = ref([]); // 圈子列表
const topicList = ref([]); // 话题列表
const selectorTabs = ref([]); // 选择器选项卡
const selectorList = ref([]); // 选择器列表
const momentTitle = ref(null);



const image = reactive({
    allow: true,
    list: [],
    count: 9,
});

const video = reactive({
    allow: true,
    list: [],
    thumb: {},
    count: 0,
});

const privacy = ref({
    type: 'none',
    value: '',
    roles: [],
    content: '',
    list: {
        none: {
            text: '公开',
            icon: 'ri-earth-line',
        },
        money: {
            text: '付费',
            icon: 'ri-money-cny-circle-line',
        },
        credit: {
            text: '积分',
            icon: 'ri-coin-line',
        },
        login: {
            text: '登录',
            icon: 'ri-login-circle-line',
        },
        comment: {
            text: '评论',
            icon: 'ri-chat-2-line',
        },
        password: {
            text: '密码',
            icon: 'ri-lock-password-line',
        },
        roles: {
            text: '限制等级',
            icon: 'ri-vip-diamond-line',
        },
    },
});

const momentTypeList = [
    {
        value: 'card',
        text: '文章',
        icon: 'ri-image-line',
    },
    {
        value: 'question',
        text: '问答',
        icon: 'ri-question-line',
    }
]


const questionReward = reactive({
    "type": "credit",  // 悬赏类型：credit(积分)
    "value": 0       // 悬赏数量
})

const editor = ref({ // 编辑器功能
    media_size: null,
    toolbar: [],
});

const currentUser = ref({
    media_role: null,
    type_role: null,
    privacy_role: null,
});

const defaultSelectorList = computed(() => {
    return [{
        icon: false,
        name: searchText.value ? searchText.value : '创建新圈子',
        desc: toolType.value == 'topic' ? '创建自定义话题' : '创建专属自己的圈子'
    }];
});

const numberLimit = computed(() => {
    let contentLength = 0;

    // 在客户端环境下才执行DOM操作
    if (typeof window !== 'undefined') {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content.value;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        contentLength = plainText.replace(/\s+/g, '').length;
    } else {
        // 服务器端简单处理
        contentLength = content.value.replace(/<[^>]+>/g, '').replace(/\s+/g, '').length;
    }

    return { //数量限制
        maxTitke: 50,
        titleLength: title.value.length,
        minContent: store.config.circle_post?.min_word_limit || 10,
        maxContent: store.config.circle_post?.max_word_limit || 1000,
        contentLength: contentLength,
    }
})


const submitdisabled = computed(() => {
    console.log(numberLimit.value)
    if (locked.value) return true;
    if (numberLimit.value.contentLength < numberLimit.value.minContent || numberLimit.value.contentLength > numberLimit.value.maxContent) return true;
})


const autoResize = () => {
    const el = momentContent.value
    if (el) {
        el.style.height = 'auto' // reset
        el.style.height = el.scrollHeight + 'px'
    }
}

const getUserCircleCapabilities = () => {
    axios.post('/getUserCircleCapabilities', 'circle_id=' + circle_id.value).then(res => {
        editor.value = res.data.editor;
        delete res.data.editor;
        currentUser.value = res.data;
    })
}

const getEditMomentData = () => {
    let post_id = route.query.id || 0;
    let topic = route.query.topic || null;
    if (topic && !post_id) {
        content.value += "#" + topic.trim() + "#";
        if (momentType.value == 'card')
            momentContent.value.focus();
    }

    if (!post_id) return;

    axios.post('/getEditMomentData', 'post_id=' + post_id).then(res => {
        console.log(res.data)
        moment_id.value = res.data.id;
        title.value = res.data.title;
        content.value = res.data.content;
        momentType.value = res.data.type; //帖子类型 比如投票等等
        momentTag.value = res.data.tag;
        image.list = res.data.image;
        video.list = res.data.video;
        if (video.list.length) {
            video.thumb = res.data.video[0].thumbList[0]
        }
        privacy.value = { ...privacy.value, ...res.data.privacy };
        nextTick(() => {
            autoResize();
        });
    }).catch(err => {
        message({ message: err.response.data.message, type: 'error' });
    })
}


const submitMoment = async () => {
    if (circle_id.value === 0) {
        message({ message: '请选择圈子', type: 'warning' });
        return;
    }
    if (momentType.value !== 'question' && (image.list.length === 0 && video.list.length === 0)) {
        message({ message: '请上传图片或视频', type: 'warning' });
        return;
    }
    if (momentType.value === 'question' && questionReward.value === 0) {
        message({ message: '请设置悬赏金额', type: 'warning' });
        return;
    }


    if (locked.value) return
    locked.value = true;
    await videoThumbUpload();

    let { list, ...privacies } = privacy.value;

    let contentHidden = privacy.value.content.length > 0 ? '[content_hide]' + privacy.value.content + '[/content_hide]' : '';

    let data = {
        'moment_id': moment_id.value,
        'type': momentType.value,
        'circle_id': circle_id.value,
        'title': momentTitle.value.value,
        'content': content.value + contentHidden,
        'tag': momentTag.value,
        'privacy': privacies
    }


    if (momentType.value === 'card') {
        data.image = image.list;
        data.video = video.list.map((value, index) => {
            return {
                id: value.id,
                url: value.url,
                thumb: video.thumb.url
            };
        });
    }

    if (momentType.value === 'question') {
        data.reward = questionReward
    }

    if (voteTitle.value.length && voteOptions.value.length && voteEndTime.value) {
        data.vote_title = voteTitle.value;
        data.vote_options = voteOptions.value;

        //转化为YYYY-MM-DD HH:mm:ss格式
        let date = new Date(voteEndTime.value);
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        let hours = date.getHours().toString().padStart(2, '0');
        let minutes = date.getMinutes().toString().padStart(2, '0');
        let seconds = date.getSeconds().toString().padStart(2, '0');
        voteEndTime.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        data.vote_end_time = voteEndTime.value;
    }

    axios.post('/insertMoment', data).then(res => {
        message({ message: res.data.message, type: 'success' });
        restData()
        locked.value = false;
    }).catch(err => {
        locked.value = false
        message({ message: err.response.data.message, type: 'error' });
    })
}


const restData = () => {
    title.value = ''
    content.value = ''
    voteTitle.value = ''
    voteOptions.value = []
    questionReward.value = 0;
    privacy.value = {
        type: 'none',
        value: '',
        roles: [],
        content: '',
        list: {
            none: {
                text: '公开',
                icon: 'ri-earth-line',
            },
            money: {
                text: '付费',
                icon: 'ri-money-cny-circle-line',
            },
            credit: {
                text: '积分',
                icon: 'ri-coin-line',
            },
            login: {
                text: '登录',
                icon: 'ri-login-circle-line',
            },
            comment: {
                text: '评论',
                icon: 'ri-chat-2-line',
            },
            password: {
                text: '密码',
                icon: 'ri-lock-password-line',
            },
            roles: {
                text: '限制等级',
                icon: 'ri-vip-diamond-line',
            },
        },
    };

    Object.assign(video, {
        allow: true,
        list: [],
        thumb: {},
        count: 0,
    })

    momentTag.value = ''
    momentType.value = 'card'
    Object.assign(image, {
        allow: true,
        list: [],
        count: 9,
    })


}

const handleClick = (emoji) => {
    content.value += "[" + emoji.name + "]";
    momentContent.value.focus()
    showEmoji.value = !showEmoji.value;
}

const isToolDisabled = (tool) => {
    const mergedRole = { ...currentUser.value.media_role, ...currentUser.value.type_role }; // 合并权限配置

    if (mergedRole[tool] !== undefined && mergedRole[tool] === false) {
        return true; // 如果权限存在且为false，则禁用工具
    } else {
        return false; // 其他情况不禁用工具
    }
}


const toolClick = (type, event) => {
    showEmoji.value = false;
    showTypeMenu.value = false;

    if (toolType.value === type) {
        toolType.value = '';
        return;
    }

    if ((type === 'video' || type === 'image') && momentType.value !== 'card') {
        message({ message: '请先选择卡片类型', type: 'warning' });
        return;
    }

    toolType.value = type;
    selectorTabIndex.value = 0;
    selectorList.value = [];
    searchText.value = '';

    if (type === 'emoji') {
        showEmoji.value = true;
    }



    switch (type) {
        case 'circle_cat':
            selectorList.value = circleList.value.length ? circleList.value[0].list : [];
            if (!circleList.value.length) getHotCircles();
            break;

        case 'topic':
            selectorList.value = topicList.value.length ? topicList.value : [];
            if (!topicList.value.length) getTopics();
            break;

        case 'video':
            if (momentType.value === 'card') {
                videoInput.value.click();
            } else {
                message({ message: '请先选择卡片类型', type: 'warning' });
            }
            break;
    }
    if (getScreenWidth() > 768) {
        toolPosition(event);
    }
};

const getTopics = () => {
    loading.value = true;
    axios.post('/getTopics').then(res => {
        selectorList.value = topicList.value = res.data.list;

        loading.value = false;

    })
}

const getHotCircles = () => {
    loading.value = true;
    axios.post('/getAllCircles').then(res => {
        circleList.value = res.data.list;
        selectorTabs.value = res.data.cats;
        if (circleList.value[selectorTabIndex.value].list.length) {
            selectorList.value = circleList.value[selectorTabIndex.value].list;
        } else {
            selectorList.value = defaultSelectorList.value
        }

        if (Number(tax.value) !== 0) {
            const find = circleList.value.flatMap(category => category.list)?.find(circle => Number(circle.id) === Number(tax.value));
            if (find) {
                momentTag.value = ''
                circle.value = find;
                circle_id.value = find.id;
            } else {
            }
        }

        loading.value = false;
    })
}


const selectorTabChange = (index) => {
    selectorTabIndex.value = index;
    if (circleList.value[selectorTabIndex.value].list.length) {
        selectorList.value = circleList.value[selectorTabIndex.value].list;
    } else {
        selectorList.value = defaultSelectorList.value
    }
}


const selector = (item) => {
    if (item.id) {
        if (toolType.value == 'topic') {
            content.value += "#" + item.name + "#";
            if (momentType.value == 'card')
                momentContent.value.focus();
            //圈子页面发表不允许选择圈子
        } else {
            if (Number(tax.value) !== Number(item.id)) {
                if (item.in_circle || !item.is_join_circle_post) {
                    momentTag.value = ''
                    circle.value = item;
                    circle_id.value = item.id;
                } else {
                    return message({ message: `您还没加入该[${item.name}]，无法选中`, type: 'warning' });
                }
            }
        }

        toolType.value = ''
    }

}

const toolPosition = ($event) => {
    // 确保在客户端环境下执行
    if (typeof window === 'undefined') return;

    nextTick(() => {
        const popupMenu = document.querySelector('.popup-menu');
        if (!popupMenu) return;

        // 获取父元素的位置和大小信息
        const parentRect = popupMenu.getBoundingClientRect();
        //可以通过event.currentTarget来获取当前被点击的元素
        const targetRect = $event.target.getBoundingClientRect();

        // 计算组件应该显示的位置
        const left = targetRect.left - parentRect.left + window.pageXOffset;
        // 获取浏览器窗口的宽度和高度
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;

        // 计算组件的边界
        const menuItem = document.querySelector('.menu-item');
        if (!menuItem) return;

        const componentWidth = menuItem.offsetWidth;
        const maxLeft = windowWidth - componentWidth - 16; // 留有16px的间隙

        // 根据浏览器边界调整组件的位置
        const adjustedLeft = Math.min(Math.max(left, 12), maxLeft);

        // 设置组件的位置
        const circleElements = popupMenu.children;
        Array.from(circleElements).forEach(item => {
            if (item.style.display !== 'none') {
                item.style.left = adjustedLeft + 'px';
            }
        });
    });
}


const showImgUploadBox = () => {
    import('@/components/other/Uploadimage.vue').then(module => {
        createVanModal(module.default, {
            size: 350,
            props: {
                data: {
                    showTabType: 1,
                    maxPicked: image.count,
                    postType: 'circle',
                    callback: (res, type) => {
                        console.log(res, type)
                        image.list.push(...res);
                    }
                }
            }
        })
    });
}

const changeVideoThumb = (data) => {
    if (!data) {
        import('@/components/other/Uploadimage.vue').then(module => {
            createVanModal(module.default, {
                size: 350,
                props: {
                    showTabType: 2,
                    maxPicked: 1,
                    postType: 'circle',
                    callback: (res, type) => {
                        res.length && (video.thumb = res[0]);
                    }
                }
            })
        });

    } else {
        video.thumb = data
    }
}

const fileUpload = (event) => {
    if (locked.value) return
    locked.value = true

    for (let i = 0; i < event.target.files.length; i++) {
        let file = event.target.files[i]
        let url = URL.createObjectURL(file)

        if (file.size <= editor.value.media_size.video * 1024000) {

            // 检查是否已经上传过
            if (video.list.findIndex(item => item.name === file.name && item.size === file.size) !== -1) {
                setTimeout(() => {
                    message({ message: `文件[${file.name}]已经上传过，请选择其他文件`, type: 'warning' });
                }, 300);

                locked.value = false
                continue
            }
            video.list.splice(i, 1, {
                'id': '',
                'url': url,
                'name': file.name,
                'thumbList': Array(4).fill(''),
                'progress': 0,
                'success': false,
                'size': file.size,
            })

            video.thumb = '';

            getVideoCover(file, 4, {
                quality: 0.8,       // 图片质量
                format: 'image/webp', // 输出格式
                width: 400          // 缩略图宽度
            }).then((thumbList) => {
                video.list[i].thumbList = thumbList.map((value, index) => {
                    return {
                        url: URL.createObjectURL(value),
                        file: value
                    };
                });
                video.thumb = video.list[i].thumbList[0]
            });

            let formData = new FormData()
            formData.append('file', event.target.files[i], event.target.files[i].name)
            formData.append("post_id", 1)
            formData.append("type", 'circle')

            const config = {
                onUploadProgress: (progress) => {
                    video.list[i].progress = Math.floor(progress.loaded / progress.total * 100)
                },
            }

            axios.post('/fileUpload', formData, config).then(res => {

                video.list[i].url = res.data.url
                video.list[i].id = res.data.id
                video.list[i].success = true
                locked.value = false

            }).catch(err => {
                let msg = err.response.data
                message({ message: msg ? msg.message : '网络原因上传失败，请重新上传', type: 'warning' });
                video.list.splice(i, 1);
                locked.value = false
            })

        } else {
            setTimeout(() => {
                message({ message: "文件[" + file.name + "]大小超过限制" + editor.value.media_size.video + "M，请重新选择", type: 'error' });
                locked.value = false
            }, 300);
        }
    }

    videoInput.value.value = "" // 清空选择的文件
}

const videoThumbUpload = async () => {

    if (!video.list.length || !video.thumb.file) return
    let videoImg = new FormData()
    let fimeName = video.list[0].url.substring(0, video.list[0].url.lastIndexOf('.')) + '.jpg';
    fimeName = fimeName.substring(fimeName.lastIndexOf('/') + 1, fimeName.length)
    videoImg.append('file', video.thumb.file, fimeName)
    videoImg.append("post_id", 1)
    videoImg.append("set_poster", video.list[0].id)
    videoImg.append("type", 'circle')

    axios.post('/fileUpload', videoImg).then(res => {
        video.thumb = res.data
    })
}

/**
 * 获取视频封面截图
 * @param {File} file - 视频文件对象
 * @param {number} count - 需要截取的封面数量
 * @param {object} [options] - 配置选项
 * @param {number} [options.quality=0.92] - 图片质量(0-1)
 * @param {string} [options.format=image/jpeg] - 图片格式
 * @param {number} [options.width=256] - 缩略图宽度
 * @returns {Promise<Blob[]>} - 返回Promise对象，解析为封面图Blob数组
 */
function getVideoCover(file, count, options = {}) {
    return new Promise((resolve, reject) => {
        // 参数校验
        if (!(file instanceof File)) {
            return reject(new Error('第一个参数必须是File对象'));
        }
        if (typeof count !== 'number' || count < 1) {
            return reject(new Error('第二个参数必须是大于0的数字'));
        }

        // 合并配置
        const { quality = 0.92, format = 'image/jpeg', width = 256 } = options;
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const results = [];

        // 创建临时URL
        const url = URL.createObjectURL(file);
        video.src = url;

        // 设置静音避免自动播放限制
        video.muted = true;

        // 元数据加载完成
        video.addEventListener('loadedmetadata', () => {
            // 计算时间点（优化算法避免超过时长）
            const duration = video.duration;
            const timePoints = [];

            // 动态计算间隔（至少1秒间隔）
            const interval = Math.max(1, duration / (count + 1));

            // 生成时间点（从5%位置开始避免黑屏）
            for (let i = 1; i <= count; i++) {
                timePoints.push(Math.min(
                    duration * 0.05 + interval * i,
                    duration - 0.1
                ));
            }

            captureFrames(timePoints);
        });

        video.addEventListener('error', (e) => {
            cleanup();
            reject(new Error('视频加载失败'));
        });

        // 逐帧捕获
        function captureFrames(times) {
            let current = 0;

            const seekToTime = () => {
                if (current >= times.length) {
                    cleanup();
                    resolve(results);
                    return;
                }

                video.currentTime = times[current];
            };

            video.addEventListener('seeked', async () => {
                try {
                    // 计算画布尺寸保持比例
                    const height = (video.videoHeight / video.videoWidth) * width;
                    canvas.width = width;
                    canvas.height = height;

                    // 绘制视频帧
                    ctx.drawImage(video, 0, 0, width, height);

                    // 转Blob
                    canvas.toBlob(
                        blob => {
                            results.push(blob);
                            current++;
                            seekToTime();
                        },
                        format,
                        quality
                    );
                } catch (err) {
                    cleanup();
                    reject(err);
                }
            });

            // 开始处理第一个时间点
            seekToTime();
        }

        // 清理资源
        function cleanup() {
            URL.revokeObjectURL(url);
            video.remove();
            canvas.remove();
        }
    });
}

const handleInput = () => {
    if (searchText.value.trim()) {
        selectorList.value = [];
        loading.value = true;
    }
    // 如果不是中文输入状态，则调用getSuggestions方法
    if (!composing.value) {
        if (typingTimer.value) {
            clearTimeout(typingTimer.value);
        }
        typingTimer.value = setTimeout(() => {
            getSearchCircle();
        }, 500);
    } else {
    }

}


const getSearchCircle = () => {
    if (!searchText.value.trim()) return;
    loading.value = true;
    axios.post('/getSearchCircle', {
        'keyword': searchText.value.trim(),
        'type': toolType.value
    }).then(res => {
        if (searchText.value && res.data.length) {
            selectorList.value = res.data
        } else {
            selectorList.value = defaultSelectorList.value
        }

        loading.value = false;
    })
}
//获取屏幕宽度
const getScreenWidth = () => {
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    return windowWidth;
}

const create = (item) => {
    if (!currentUser.value.can_create_circle) return message({ message: `您当前无权创建[${item.name}]`, type: 'warning' });
    if (toolType.value == 'topic') {
        import('@/components/circle/func/CreateTopic.vue').then(module => {
            createVanModal(module.default, {
                size: 363,
                props: {
                    name: item.name,
                }
            })
        })
    } else {

        import('@/components/circle/CircleManage.vue').then(module => {
            createVanModal(module.default, {
                radius: false,
                position: 'right',
                height: '100%',
                size: 784,
                props: {
                    type: 'create',
                    name: item.name,
                }
            })
        })
    }
}

watch(searchText, (newVal) => {
    searchText.value = newVal.trim(); // 清除前后空格

    if (!searchText.value) {
        if (toolType.value === 'topic') {
            selectorList.value = topicList.value;
        } else if (toolType.value === 'circle_cat' && circleList.value.length) {
            selectorList.value = circleList.value[selectorTabIndex.value]?.list || [];
        }
    }
});
onMounted(() => {
    getUserCircleCapabilities();
    getEditMomentData();
    getHotCircles();
    nextTick(() => autoResize())
})

</script>

<style scoped>
.toolbar-content::-webkit-scrollbar {
    width: 4px;
}

.toolbar-content::-webkit-scrollbar-track {
    background: transparent;
}

.toolbar-content::-webkit-scrollbar-thumb {
    background-color: var(--b3);
    border-radius: 20px;
}

.selector-list::-webkit-scrollbar {
    width: 4px;
}

.selector-list::-webkit-scrollbar-track {
    background: transparent;
}

.selector-list::-webkit-scrollbar-thumb {
    background-color: var(--b3);
    border-radius: 20px;
}

.bg-base-50 {
    background-color: hsl(var(--b1) / 0.3);
}

@media (max-width: 768px) {
    .bottom-toolbar .container {
        padding: 0 0.5rem;
    }
    
    .tool-buttons {
        overflow-x: auto;
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }
    
    .tool-buttons::-webkit-scrollbar {
        display: none;
    }
}
</style>
