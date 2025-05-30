<template>
    <div class="circle-manage-container w-full h-full bg-base-200 flex flex-row">
        <div class="manage-sidebar w-10 lg:w-40 select-none bg-base-100 overflow-auto flex flex-col items-center pt-6 shadow-sm" v-if="!isCreate">
            <div class="hidden lg:flex circle-image card w-24 h-24 overflow-hidden bg-base-200 rounded-full items-center justify-center mb-4">
                <img :src="data.icon" width="96" height="96" class="object-cover w-full h-full" v-if="data.icon">
                <i class="ri-user-fill text-3xl text-base-content/60" v-else></i>
            </div>
            <div class="hidden lg:block text-center font-medium mb-4 px-2 truncate max-w-full" v-if="data.name">{{ data.name }}</div>
            <div class="line border-b border-base-300 w-full mt-2 mb-4"></div>
            <div class="circle-sidebar-menu w-full">
                <ul class="menu-list flex flex-col w-full">
                    <li class="menu-item cursor-pointer text-sm h-12 w-full flex items-center gap-3 px-3 lg:px-6 relative transition-colors duration-200 hover:bg-base-200" 
                        v-for="(item, index) in tabs" @click="changeTab(index)" :key="index"
                        :class="[{ 'active bg-primary/10 text-primary font-medium': tabIndex == index, 'disabled opacity-50 cursor-not-allowed': item.disabled, 'text-base-content/70': tabIndex != index && !item.disabled }]"
                        >
                        <span v-if="!item.disabled" class="menu-icon text-lg"><i :class="item.icon"></i></span>
                        <span class="hidden lg:block" v-if="!item.disabled" v-text="item.name"></span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="manage-content min-w-0 p-3 lg:p-6 flex-1 flex flex-col h-full">
            <div class="manage-content-head h-14 flex items-center border-b border-base-300 mb-4">
                <span class="title text-lg font-medium" v-text="tabs[tabIndex].name"></span>
            </div>
            <div class="manage-content-wrap flex-1 overflow-auto pb-16">
                <!---基础--->
                <div class="base-manage" v-show="tabIndex == ''">
                    <div class="base bg-base-100 card p-4 lg:p-6 mb-6 shadow-sm">
                        <div class="circle-cover flex justify-center bg-base-200 h-40 lg:h-48 overflow-hidden items-center text-2xl text-base-content/60 cursor-pointer rounded-box transition-all duration-200 hover:bg-base-300" @click="imgUploadBox('cover')">
                            <div class="cover-img w-full h-full flex items-center justify-center">
                                <img :src="data.cover" class="w-full h-full object-cover" v-if="data.cover">
                                <div class="flex flex-col items-center" v-else>
                                    <i class="ri-landscape-fill mb-2"></i>
                                    <span class="text-sm">点击上传封面</span>
                                </div>
                            </div>
                        </div>
                        <div class="circle-icon flex justify-center bg-base-200 w-24 h-24 rounded-full overflow-hidden -mt-12 mx-auto border-4 border-base-100 items-center text-xl cursor-pointer relative  transition-all duration-200 hover:bg-base-300" @click="imgUploadBox('icon')">
                            <div class="icon-img w-full h-full flex items-center justify-center">
                                <img :src="data.icon" class="w-full h-full object-cover" v-if="data.icon">
                                <div class="flex flex-col items-center gap-2" v-else>
                                    <i class="ri-camera-fill"></i>
                                    <span class="text-xs">上传头像</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-container bg-base-100 card p-4 lg:p-6 mb-6 shadow-sm">
                        <form>
                            <label class="form-item flex-col text-base-content/60 mb-4 flex relative">
                                <span class="text-sm mb-1 font-medium">圈子名称</span>
                                <input type="text" v-model="data.name" autocomplete="off" maxlength="100"
                                    placeholder="请输入圈子名称" class="input w-full h-10.5 leading-5 bg-base-200 rounded-lg border-0 pl-10.5 focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                                    :disabled="!currentUser.is_admin && !currentUser.is_circle_staff && !isCreate">
                                    <span class="icon absolute left-3 top-6 text-center leading-10.5 text-xl opacity-80"><i class="ri-file-text-line"></i></span>
                            </label>
                            <label class="form-item flex-col text-base-content/60 mb-4 flex relative">
                                <span class="text-sm mb-1 font-medium">圈子简介</span>
                                <textarea placeholder="请输入圈子简介" v-model="data.desc"
                                    class="h-24 pb-3 pt-3 pl-10.5 pr-2.5 w-full bg-base-200 rounded-lg border-0 focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                                    :disabled="!currentUser.is_admin && !currentUser.is_circle_staff && !isCreate"></textarea>
                                    <span class="icon absolute left-3 top-6 text-center leading-10.5 text-xl opacity-80"><i class="ri-file-text-line"></i></span>
                            </label>
                            <label class="form-item flex-col text-base-content/60 mb-4 flex relative">
                                <span class="text-sm mb-1 font-medium">圈子链接</span>
                                <input type="text" autocomplete="off" maxlength="100" v-model="data.slug"
                                    placeholder="请输入圈子链接" class="input w-full h-10.5 leading-5 bg-base-200 rounded-lg border-0 pl-10.5 focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                                    :disabled="!currentUser.is_admin && !currentUser.is_circle_staff && !isCreate">
                                    <span class="icon absolute left-3 top-6 text-center leading-10.5 text-xl opacity-80"><i class="ri-link"></i></span>
                                <p class="desc text-xs mt-1 text-base-content/60">链接：/circle/{{ data.slug || '您的链接' }}</p>
                            </label>
                        </form>
                        <div class="circle-cats mt-6">
                            <div class="section-title text-base font-medium mb-2">圈子分类</div>
                            <ul class="circle-cats-list flex gap-3 mt-3 flex-wrap">
                                <li class="list-item py-1.5 px-4 text-sm rounded-full cursor-pointer transition-all duration-200"
                                    :class="[{ 'bg-primary text-white shadow-sm': item.name == data.circle_cat, 'bg-base-200 text-base-content/70 hover:bg-base-300': item.name != data.circle_cat, 'opacity-50 cursor-not-allowed': !currentUser.is_admin && !currentUser.is_circle_staff && !isCreate }]"
                                    v-for="(item, index) in circle_cats" :key="index" v-text="item.name"
                                    @click="data.circle_cat = item.name"></li>
                            </ul>
                        </div>
                    </div>
                    <div class="nocan-info left-0 absolute inset-0 bg-base-100/90 z-10 backdrop-blur-sm flex items-center justify-center" v-if="isCreate && !currentUser.can_create_circle">
                        <div class="text-center max-w-xs p-6 bg-base-200 rounded-box shadow-lg">
                            <i class="ri-shield-user-fill text-5xl text-primary leading-9 block mb-4"></i>
                            <p class="text-lg font-medium">当前权限不足</p>
                            <p class="text-sm text-base-content/70 mt-2">您暂时无法创建圈子，请联系管理员获取权限</p>
                        </div>
                    </div>
                </div>
                <!---用户管理---->
                <circleUserManage class="bg-base-100 p-4 lg:p-6 card shadow-sm" :currentUser="currentUser" v-if="tabIndex == 'user'" />
                <!---帖子管理---->
                <circlePostManage class="bg-base-100 p-4 lg:p-6 card shadow-sm" :currentUser="currentUser" v-if="tabIndex == 'post'" />
                <!---布局---->
                <div class="circle-layout bg-base-100 p-4 lg:p-6 card shadow-sm" v-show="tabIndex == 'layout'">
                    <div class="setting-row flex justify-between text-sm items-center p-3 mb-2 rounded-lg hover:bg-base-200 transition-colors duration-200">
                        <div class="left font-medium">顶部信息显示</div>
                        <div class="right cursor-pointer relative text-base-content/70 group">
                            <div class="select bg-base-200 px-3 py-1.5 rounded-lg flex items-center gap-1 group-hover:bg-base-300 transition-colors duration-200">
                                <span v-text="layoutOptions[setting.layout.info_show]"></span>
                                <i class="ri-arrow-down-s-line text-base"></i>
                            </div>
                            <ul class="select-options absolute top-full mt-1 bg-base-100 invisible opacity-0 translate-y-1 transition duration-200 right-0 whitespace-nowrap rounded-lg shadow-lg p-1 border border-base-300 z-20 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0">
                                <li class="item px-4 py-2 flex items-center gap-3 text-sm cursor-pointer rounded-md hover:bg-base-200 transition-colors duration-200" 
                                    :class="[{ 'bg-primary/10 text-primary font-medium': index == setting.layout.info_show }]"
                                    v-for="(item, index) in layoutOptions" v-text="item" :key="index"
                                    @click="setting.layout.info_show = index"></li>
                            </ul>
                        </div>
                    </div>
                    <div class="setting-row flex justify-between text-sm items-center p-3 mb-2 rounded-lg hover:bg-base-200 transition-colors duration-200">
                        <div class="left font-medium">帖子发布框显示</div>
                        <div class="right cursor-pointer relative text-base-content/70 group">
                            <div class="select bg-base-200 px-3 py-1.5 rounded-lg flex items-center gap-1 group-hover:bg-base-300 transition-colors duration-200">
                                <span v-text="layoutOptions[setting.layout.editor_show]"></span>
                                <i class="ri-arrow-down-s-line text-base"></i>
                            </div>
                            <ul class="select-options absolute top-full mt-1 bg-base-100 invisible opacity-0 translate-y-1 transition duration-200 right-0 whitespace-nowrap rounded-lg shadow-lg p-1 border border-base-300 z-20 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0">
                                <li class="item px-4 py-2 flex items-center gap-3 text-sm cursor-pointer rounded-md hover:bg-base-200 transition-colors duration-200" 
                                    :class="[{ 'bg-primary/10 text-primary font-medium': index == setting.layout.editor_show }]"
                                    v-for="(item, index) in layoutOptions" v-text="item" :key="index"
                                    @click="setting.layout.editor_show = index"></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <!---权限---->
                <div class="circle-role bg-base-100 p-4 lg:p-6 card shadow-sm" v-show="tabIndex == 'role'">
                    <div class="setting-row flex justify-between text-sm items-center p-3 mb-2 rounded-lg hover:bg-base-200 transition-colors duration-200">
                        <div class="left font-medium">加入圈子才能发帖</div>
                        <div class="right cursor-pointer relative text-base-content/70 group">
                            <div class="select bg-base-200 px-3 py-1.5 rounded-lg flex items-center gap-1 group-hover:bg-base-300 transition-colors duration-200">
                                <span v-text="roleOptions[setting.role.join_post]"></span>
                                <i class="ri-arrow-down-s-line text-base"></i>
                            </div>
                            <ul class="select-options absolute top-full mt-1 bg-base-100 invisible opacity-0 translate-y-1 transition duration-200 right-0 whitespace-nowrap rounded-lg shadow-lg p-1 border border-base-300 z-20 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0">
                                <li class="item px-4 py-2 flex items-center gap-3 text-sm cursor-pointer rounded-md hover:bg-base-200 transition-colors duration-200" 
                                    :class="[{ 'bg-primary/10 text-primary font-medium': index == setting.role.join_post }]"
                                    v-for="(item, index) in roleOptions" v-text="item" :key="index"
                                    @click="setting.role.join_post = index"></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <!---隐私管理---->
                <div class="circle-privacy bg-base-100 p-4 lg:p-6 card shadow-sm" v-show="tabIndex == 'privacy' || (isCreate && tabIndex == '')">
                    <div class="setting-row flex justify-between text-sm items-center p-3 mb-3 rounded-lg hover:bg-base-200 transition-colors duration-200">
                        <div class="left font-medium">帖子公开显示</div>
                        <div class="right cursor-pointer relative text-base-content/70">
                            <label class="switch h-6 w-11 block relative">
                                <input type="checkbox" v-model="setting.privacy.privacy" class="sr-only peer">
                                <span class="slider-dot rounded-full cursor-pointer h-full transition duration-300 w-full inline-block bg-base-300 peer-checked:bg-primary/60 before:content-[''] before:absolute before:h-5 before:w-5 before:rounded-full before:bg-white before:left-0.5 before:bottom-0.5 before:transition-all before:duration-300 peer-checked:before:translate-x-5 before:shadow-sm"></span>
                            </label>
                        </div>
                    </div>

                    <div class="setting-row flex justify-between text-sm items-center p-3 mb-3 rounded-lg hover:bg-base-200 transition-colors duration-200">
                        <div class="left font-medium">圈子类型</div>
                        <div class="right cursor-pointer relative text-base-content/70 group">
                            <div class="select bg-base-200 px-3 py-1.5 rounded-lg flex items-center gap-1 group-hover:bg-base-300 transition-colors duration-200">
                                <span v-text="privacyTypeOptions[setting.privacy.type]"></span>
                                <i class="ri-arrow-down-s-line text-base"></i>
                            </div>
                            <ul class="select-options absolute top-full mt-1 bg-base-100 invisible opacity-0 translate-y-1 transition duration-200 right-0 whitespace-nowrap rounded-lg shadow-lg p-1 border border-base-300 z-20 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0">
                                <li class="item px-4 py-2 flex items-center gap-3 text-sm cursor-pointer rounded-md hover:bg-base-200 transition-colors duration-200" 
                                    :class="[{ 'bg-primary/10 text-primary font-medium': index == setting.privacy.type }]"
                                    v-for="(item, index) in privacyTypeOptions" v-text="item" :key="index"
                                    @click="setting.privacy.type = index"></li>
                            </ul>
                        </div>
                    </div>
                    <div class="setting-row flex justify-between text-sm items-center p-3 mb-3 rounded-lg hover:bg-base-200 transition-colors duration-200" v-if="setting.privacy.type == 'password'">
                        <div class="left font-medium">圈子密码</div>
                        <div class="right cursor-pointer relative text-base-content/70">
                            <input type="text" autocomplete="off" v-model="setting.privacy.password" maxlength="4"
                                placeholder="圈子密码（纯数字）" class="input w-32 bg-base-200 border border-base-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all duration-200">
                        </div>
                    </div>
                    <div class="setting-roles mt-5 p-4 bg-base-200 rounded-lg" v-if="setting.privacy.type == 'roles'">
                        <div class="title text-sm font-medium mb-3">请选择专属等级</div>
                        <ul class="flex text-xs flex-wrap gap-x-6 gap-y-2">
                            <li v-for="(lv, key) in roles" :key="key">
                                <label class="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors duration-200">
                                    <input type="checkbox" v-model="setting.privacy.roles" :value="key" class="checkbox checkbox-sm checkbox-primary"/>
                                    <span v-text="lv"></span>
                                </label>
                            </li>
                        </ul>
                    </div>
                    <div class="setting-pay-group text-sm mt-6 bg-base-200 p-4 rounded-lg"
                        v-if="setting.privacy.type == 'money' || setting.privacy.type == 'credit'">
                        <div class="title text-base font-medium mb-3">设置付费组</div>
                        <div class="pay-group-header flex gap-3 text-xs mb-3 text-base-content/70 border-b border-base-300 pb-2">
                            <div class="name flex-1 font-medium">名称<b class="text-error">*</b></div>
                            <div class="price flex-1 font-medium">入圈价格(元/积分)<b class="text-error">*</b></div>
                            <div class="time flex-1 font-medium">有效期(天)<b class="text-error">*</b></div>
                            <div class="discount flex-1 font-medium">会员折扣(%)<b class="text-error">*</b></div>
                            <div class="action w-16"></div>
                        </div>
                        <div class="pay-group-body flex gap-3 my-3 text-sm text-base-content/80" v-for="(item, index) in setting.privacy.pay_group">
                            <div class="name flex-1">
                                <input class="w-full p-2 bg-base-100 rounded-lg border border-base-300 focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all duration-200" 
                                    type="text" v-model="item.name" @input="handleInput" placeholder="例：一个月" />
                            </div>
                            <div class="price flex-1">
                                <input class="w-full p-2 bg-base-100 rounded-lg border border-base-300 focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all duration-200" 
                                    type="number" v-model="item.price" step="1" maxlength="4" @input="handleInput" placeholder="例：20" />
                            </div>
                            <div class="time flex-1">
                                <input class="w-full p-2 bg-base-100 rounded-lg border border-base-300 focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all duration-200" 
                                    type="number" v-model="item.time" step="1" maxlength="4" @input="handleInput" placeholder="例：30" />
                            </div>
                            <div class="discount flex-1">
                                <input class="w-full p-2 bg-base-100 rounded-lg border border-base-300 focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all duration-200" 
                                    type="number" v-model="item.discount" step="1" maxlength="4" @input="handleInput" placeholder="例：97" />
                            </div>
                            <div class="action w-16 flex items-center justify-center">
                                <button class="btn btn-sm btn-error btn-outline" v-if="setting.privacy.pay_group.length > 1"
                                    @click="deletePayGroup(index)">删除</button>
                            </div>
                        </div>
                        <div class="add-pay-group mt-3">
                            <button class="w-full btn btn-sm btn-primary btn-outline" @click="addPayGroup">
                                <i class="ri-add-line mr-1"></i> 添加付费组
                            </button>
                        </div>
                        <div class="pay-group-matter mt-4 text-xs text-base-content/70 bg-base-100 p-3 rounded-lg">
                            <div class="font-medium mb-2">注意事项：</div>
                            <ol class="list-decimal pl-5 space-y-1">
                                <li>名称：入圈支付时显示，比如 月付、季付、年付、永久有效 等等</li>
                                <li>价格：入圈支付的金额或积分</li>
                                <li>有效期：用户入圈有效天数，如果填写0则永久有效</li>
                                <li>会员折扣：如果用户是会员使用折扣价</li>
                            </ol>
                        </div>
                    </div>
                </div>
                <!---保存---->
                <div class="submit-button fixed right-8 bottom-8 z-10"
                    v-if="tabIndex != 'post' && tabIndex != 'user' && (currentUser.is_admin || currentUser.is_circle_staff || (currentUser.can_create_circle && isCreate))">
                    <button class="btn btn-primary btn-lg shadow-lg rounded-full px-8" @click="createCircle">
                        <i class="ri-save-line mr-1"></i> {{ isCreate ? '创建圈子' : '保存修改' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>



<script setup name="circleManage">
import circleUserManage from './manage/manageUser.vue'
import circlePostManage from './manage/managePost.vue'
import { useStore } from '@/store';
import { useRoute } from 'vue-router';
import { ref, computed, onMounted } from 'vue'
import axios from '@/dist/axios';
import { createMessage as message } from '@/dist/message';
import { createVanModal } from '@/dist/createVanModal'

defineOptions({
    name: 'CircleManage',
})


const emit = defineEmits(['close-modal'])

const store = useStore();
const route = useRoute();
const props = defineProps({
    type: {
        type: String,
    },
    name: {
        type: String,
    },
    id: {
        type: [Number, String],
        default: 0,
    }
})
const tabIndex = ref('');
const tabs = ref({
    '': { name: '基础信息', icon: 'ri-donut-chart-line', disabled: false },
    user: { name: '用户成员', icon: 'ri-group-line', disabled: true },
    post: { name: '帖子管理', icon: 'ri-article-line', disabled: true },
    layout: { name: '布局设置', icon: 'ri-layout-line', disabled: true },
    role: { name: '权限设置', icon: 'ri-shield-user-line', disabled: true },
    privacy: { name: '隐私设置', icon: 'ri-spy-line', disabled: true },
});
const circle_cats = ref([]);
const data = ref({
    id: 0,
    name: '',
    desc: '',
    icon: '',
    cover: '',
    slug: '',
    circle_cat: '',
    original_cover: '',
    original_icon: '',
})
const setting = ref({
    privacy: {
        type: 'free',
        password: '',
        roles: [],
        pay_group: [{
            name: '',
            price: '',
            time: '',
            discount: ''
        }],
        privacy: 'public'
    },
    role: {
        join_post: 'global'
    },
    layout: {
        info_show: 'global',
        editor_show: 'global',
    }
});
const currentUser = ref({
    can_create_circle: false,
    is_admin: false,
    is_circle_admin: false,
    is_circle_staff: false,
})
const privacyTypeOptions = ref({
    free: '免费',
    money: '付费',
    credit: '积分',
    roles: '专属',
    password: '密码'
})
const layoutOptions = ref({
    global: '使用系统设置',
    0: '关闭',
    pc: 'pc端',
    mobile: '移动端',
    all: 'pc端和移动端都显示'
})
const roleOptions = ref({
    global: '使用系统设置',
    0: '关闭',
    1: '开启',
}
)
const roles = ref([])

const locked = ref(false)

const isCreate = computed(() => props.type == 'create')


const getUserCircleCapabilities = () => {
    axios.post('/getUserCircleCapabilities', 'circle_id=' + data.value.id).then(res => {
        delete res.data.editor
        for (let key in res.data) {
            if (currentUser.value.hasOwnProperty(key)) {
                currentUser.value[key] = res.data[key];
            }
        }

        roles.value = res.data.roles

        if (!isCreate.value) {
            getCircleData()
            if (currentUser.value.is_admin || currentUser.value.is_circle_admin) {
                getManageCircle()
            }
        }

        getCircleCats()

        updateTabs()
    })
}


const getCircleData = () => {
    store.fetchCircleData(data.value.id).then(res => {
        data.value = res
    })
}


const getCircleCats = () => {
    axios.post('/getCircleCats').then(res => {
        circle_cats.value = res.data
    }).catch(err => {
        message({ message: err.response.data.message, type: 'error' })
    })
}

const getManageCircle = () => {
    axios.post('/getManageCircle', 'circle_id=' + data.value.id).then(res => {
        setting.value = res.data
    }).catch(err => {
        message({ message: err.response.data.message, type: 'error' })
    })
}

const createCircle = () => {
    if (locked.value) return;

    locked.value = true;

    let params = {
        ...data.value,
        ...setting.value
    }
    params.cover = data.value.original_cover ? data.value.original_cover : params.cover;
    params.icon = data.value.original_icon ? data.value.original_icon : params.icon;

    axios.post('/createCircle', params).then(res => {
        locked.value = false;
        message({ message: '成功', type: 'success' });
        emit('close-modal')
    }).catch(err => {
        locked.value = false;
        message({ message: err.response.data.message, type: 'error' })
    })
}


const updateTabs = () => {
    const isAdminOrCircleStaff = currentUser.value.is_admin || currentUser.value.is_circle_staff;
    const isAdminOrCircleAdmin = currentUser.value.is_admin || currentUser.value.is_circle_admin;

    tabs.value.user.disabled = isCreate.value;
    tabs.value.post.disabled = !isAdminOrCircleStaff || isCreate.value;
    tabs.value.layout.disabled = !isAdminOrCircleAdmin || isCreate.value;
    tabs.value.role.disabled = !isAdminOrCircleAdmin || isCreate.value;
    tabs.value.privacy.disabled = !isAdminOrCircleAdmin || isCreate.value;
}

const changeTab = (index) => {
    tabIndex.value = index;
}



const imgUploadBox = (imgtype) => {
    if (!currentUser.value.is_admin && !currentUser.value.is_circle_staff && !(currentUser.value.can_create_circle && isCreate.value)) return

    import('@/components/other/Uploadimage.vue').then(module => {
        createVanModal(module.default, {
            size: 350,
            props: {
                data: {
                    showTabType: 1,
                    maxPicked: 1,
                    postType: 'circle',
                    callback: (res, type) => {
                        if (imgtype == 'icon') {
                            data.value.icon = res[0].url
                            data.value.original_icon = ''
                        } else {
                            data.value.cover = res[0].url
                            data.value.original_cover = ''
                        }
                    }
                }
            }
        })
    });
}



const addPayGroup = () => {
    setting.value.privacy.pay_group.push({
        name: '',
        price: '',
        time: '',
        discount: ''
    })
}

const deletePayGroup = (index) => {
    if (confirm('确定删除吗?')) {
        setting.value.privacy.pay_group.splice(index, 1)
    }
}

const handleInput = () => {


}



onMounted(() => {
    if (!isCreate.value) {
        data.value.id = props.id;
    } else {
        props.name && (data.value.name = props.name)
    }
    getUserCircleCapabilities()
})



</script>


<style scoped>
.circle-image {
    --avatar-size: 30px;
}

.menu-item.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 60%;
    background-color: var(--color-primary);
    border-radius: 0 4px 4px 0;
}

.checkbox {
    appearance: none;
    width: 16px;
    height: 16px;
    border: 1.5px solid var(--color-base-content-secondary);
    border-radius: 3px;
    position: relative;
}

.checkbox:checked {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
}

.checkbox:checked::after {
    content: '✓';
    position: absolute;
    font-size: 12px;
    color: white;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* 确保下拉菜单在悬停时显示 */
.setting-row .right.group:hover .select-options {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
}
</style>