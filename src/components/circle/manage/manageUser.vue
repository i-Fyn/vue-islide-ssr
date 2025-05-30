<template>
    <div class="h-full flex flex-col">
        <form>
            <label class="flex flex-row  items-center gap-4">
                <input class="input" v-model="searchText" type="text" autocomplete="off" maxlength="100"
                    placeholder="搜索用户" @input="handleInput" @compositionstart="composing = true"
                    @compositionend="composing = false">
                <span class="icon"><i class="ri-search-2-line"></i></span>
                <span class="text-2xl leading-6 text-gray-500 cursor-pointer"><i class="ri-user-add-line"></i></span>
            </label>
        </form>
        <div class="pb-2.5 border-b border-gray-200 my-4" v-show="!searchText">
            <ul class="flex gap-6">
                <li :class="[{ 'text-primary': tabType == 'staff' }]" @click="changeTab('staff')" class="cursor-pointer">管理</li>
                <li :class="[{ 'text-primary': tabType == 'user' }]" @click="changeTab('user')" class="cursor-pointer">圈友</li>
            </ul>
        </div>
        <ul class="scroll-x scroll-y" v-if="userList.length">
            <li class="flex items-center py-4" v-for="(item, index) in userList" :key="index">
                <avatar-vue :data="item" style="--avatar-size:38px" ></avatar-vue>
                <div class="flex-1 mx-3 flex flex-col justify-around flex-wrap">
                    <div class="flex items-center flex-wrap">
                        <name-vue :data="item"></name-vue>
                        <div class="transform scale-90 bg-red-500 text-white px-1.5 py-0.5 text-xs leading-[13px] rounded" v-if="item.role == 'admin'">圈主</div>
                        <div class="transform scale-90 bg-orange-500 text-white px-1.5 py-0.5 text-xs leading-[13px] rounded" v-if="item.role == 'staff'">版主</div>
                    </div>
                    <div class="text-xs text-gray-500 leading-[18px] truncate" v-text="item.date ? item.date : item.desc"></div>
                </div>
                <div class="flex gap-3"
                    v-if="(currentUser.is_circle_staff && (item.role == 'member' || !item.role)) || currentUser.is_admin || currentUser.is_circle_admin">
                    <span class="btn  btn-primary btn-outline btn-sm rounded-4xl" @click="removeCircleUser(item.id, index)"
                        v-if="item.in_circle">移除</span>
                    <span class="btn  btn-primary btn-outline btn-sm rounded-4xl" @click="inviteUserJoinCircle(item.id, index)" v-else>邀请</span>
                    <span class="btn  btn-accent btn-outline btn-sm rounded-4xl" @click="setUserCircleStaff(item.id, index)"
                        v-if="(item.role == 'member' || !item.role) && (currentUser.is_admin || currentUser.is_circle_admin)">设为版主</span>
                </div>
            </li>
        </ul>
        <template v-else-if="isDataEmpty">
            <van-empty image-size="10rem" description="暂无内容" />
        </template>
        <div class="islide-pagenav json-nav">
            <PageNav ref="jsonPageNav" :paged="paged" :pages="pages" navtype="json" type="page" :api="api"
                :param="param" @change="changeUsers" v-once />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import axios from '@/dist/axios';
import { useRoute } from 'vue-router';
import { createMessage as message } from '@/dist/message';
import avatarVue from '../../user/avatarVue.vue';
import nameVue from '../../user/nameVue.vue';
import PageNav from '@/components/footer/PageNav.vue';


const route = useRoute()
const props = defineProps({
    currentUser: {
        type: Object,
        required: true
    }
})
const api = 'getCircleUsers';

const param = ref({
    size: 10,
    circle_id: route.params.circle_id,
    type: 'staff'
})
const locked = ref(false)
const loading = ref(false)
const isDataEmpty = ref(false)

const circle_id = ref(route.params.circle_id)
const composing = ref(false)
const searchText = ref('')
const tabType = ref('staff')
const tabs = ref({
    staff: '管理',
    user: '圈友',
})
const userList = ref([])
const users = ref([])

const typingTimer = ref(null)

onMounted(() => {
    loading.value = true;
    isDataEmpty.value = false;
    userList.value = []
    nextTick(() => {
        getCircleUsers()
    });
})


const changeTab = (type) => {

    if (type == tabType.value) return;
    tabType.value = type;
    loading.value = true;
    isDataEmpty.value = false;
    userList.value = []
    nextTick(() => {
        getCircleUsers()
    });
}

const getCircleUsers = (search='') => {
    loading.value = true
    users.value = []
    axios.post('/getCircleUsers', 'circle_id=' + circle_id.value + '&type=' + tabType.value + '&search=' + search).then(res => {
        users.value = res.data
        userList.value = users.value.list

        isDataEmpty.value = !userList.value.length

        loading.value = false
    }).catch(err => {
        loading.value = false
        isDataEmpty.value = true
        message({ message: err.response.data.message, type: 'error' });
    })
}

const setCircleAdmin = (user, index) => {
    if (locked.value) return
    locked.value = true

    axios.post('/setCircleAdmin', 'circle_id=' + circle_id.value + '&user_id=' + user.id).then(res => {
        message({ message: res.data.message, type: 'success' });
        userList.value[index].circle_role = 'staff'
        userList.value[index].circle_role_name = '管理员'

        locked.value = false
    }).catch(err => {
        locked.value = false
        message({ message: err.response.data.message, type: 'error' });
    })
}

const removeCircleUser = (user, index) => {
    if (locked.value) return
    locked.value = true

    axios.post('/removeCircleUser', 'circle_id=' + circle_id.value + '&user_id=' + user.id).then(res => {
        message({ message: res.data.message, type: 'success' });
        userList.value.splice(index, 1);
        users.value.splice(index, 1);
        locked.value = false
    }).catch(err => {
        locked.value = false
        message({ message: err.response.data.message, type: 'error' });
    })
}


const handleInput = () => {
    if (searchText.value.trim()) {
        users.value = [];
        loading.value = true;
    }

    // 如果不是中文输入状态，则调用getSuggestions方法
    if (!composing.value) {
        clearTimeout(typingTimer.value);
        typingTimer.value = setTimeout(() => {
            circleSearchUsers();
        }, 500);
    }
}

const circleSearchUsers = () => {
    if (!searchText.value.trim()) {
        users.value = [];
        getCircleUsers()
        return;
    }

    getCircleUsers(searchText.value.trim())

}

</script>
