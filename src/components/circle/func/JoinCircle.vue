<template>
    <div class="p-6 space-y-6">
        <!-- 圈子信息卡片 -->
        <div class="card bg-base-100 p-6 text-center relative">
            <div class="relative">
                <div class="avatar mb-4">
                    <div class="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <van-image lazy-load :src="circle.icon" class="w-full h-full rounded-full"/>
                    </div>
                    <div class="badge badge-primary absolute -bottom-1 left-1/2 -translate-x-1/2 w-full text-sm badge-sm" v-text="circle_role.type_name"></div>
                </div>
                <h2 class="text-xl font-bold mb-2" v-text="circle.name"></h2>
                <p class="text-base-content/60">欢迎您即将成为第 <span class="text-primary font-medium" v-text="parseInt(circle.user_count) + 1"></span> 位成员</p>
            </div>
        </div>

        <!-- 角色权限列表 -->
        <div v-if="circle_role.type == 'roles'" class="card bg-base-100 p-6">
            <div class="divider text-base-content/60">专属圈子，以下用户组可加入</div>
            <ul class="flex flex-wrap gap-2">
                <li v-for="(item, index) in circle_role.roles" 
                    class="badge" 
                    v-text="item.name">
                </li>
            </ul>
        </div>

        <!-- 付费选项列表 -->
        <div v-if="circle_role.type == 'credit' || circle_role.type == 'money'" class="card bg-base-100 p-6">
            <div class="divider text-base-content/60">付费加入圈子</div>
            <ul class="space-y-3">
                <li v-for="(item, index) in circle_role.pay_group"
                    :class="[
                        'card p-4 cursor-pointer transition-colors',
                        payIndex === index ? 'bg-primary/10 border-primary' : 'hover:bg-base-200'
                    ]"
                    @click="payIndex = index">
                    <div class="font-medium mb-2" v-text="item.name"></div>
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-base-content/60">服务时间：{{ item.time == 0 ? '永久有效' : item.time + '天' }}</span>
                        <div class="text-primary font-medium">
                            <span class="text-sm">{{ circle_role.type == 'credit' ? '积分' : '￥' }}</span>
                            <span class="text-lg">{{ item.price }}.00</span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-center">
            <button v-if="circle_role.type == 'password'"
                    @click="passwordJoin"
                    class="btn btn-primary w-full rounded-4xl">输入密码加入</button>
            <button v-else-if="circle_role.type == 'free'"
                    @click="joinCircle"
                    class="btn btn-primary w-full rounded-4xl">免费加入</button>
            <button v-else-if="circle_role.type == 'roles' && circle_role.allow"
                    @click="joinCircle"
                    class="btn btn-primary w-full rounded-4xl">加入圈子</button>
            <button v-else-if="circle_role.type == 'credit' || circle_role.type == 'money'"
                    @click="payJoin"
                    class="btn btn-primary w-full rounded-4xl">支付入圈</button>
            <button v-else
                    disabled
                    class="btn btn-disabled w-full rounded-4xl">无权加入</button>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/dist/axios';
import { createMessage as message } from '@/dist/message';
import { islidepay,passwordVerify } from '@/dist/pay';

const props = defineProps({
    circle: {
        type: Object,
    }
})


const locked = ref(false);
const circle_role = ref({});
const payIndex = ref(0);
const password = ref('');


onMounted(() => {
    getCircleRoleData()
})

const getCircleRoleData = () => {
    axios.post('/getCircleRoleData', { circle_id: props.circle.id }).then(res => {
        console.log(res.data)
        circle_role.value = res.data;
    })
}

const payJoin = () => {

    if (!circle_role.value.pay_group[payIndex.value]) return
    
    islidepay({
        order_price: circle_role.value.pay_group[payIndex.value].price,
        order_type: 'join_circle',
        post_id: props.circle.id,
        title: '加入圈子',
        type: circle_role.value.type,
        tag: circle_role.value.pay_group[payIndex.value].name,
        order_key: payIndex.value,
        order_value: circle_role.value.pay_group[payIndex.value].time
    })
}


const passwordJoin = () => {
    let data = {};
    data.post_id = props.circle.id;
    data.type = 'circle';
    data.confirm = (params) => {
        password.value = params.code
        joinCircle()
    }
    passwordVerify(data)
}

const joinCircle = () => {
    if (locked.value == true) return;
    locked.value = true

    let params = {
        circle_id: props.circle.id,
        password: password.value,
        type: circle_role.value.type
    }

    axios.post('/joinCircle', params).then(res => {
        locked.value = false
        message({ message: '加入成功', type: 'success' });
        //刷新当前页面
        setTimeout(() => {
            islideCurrentPageReload()
        }, 2000)
    }).catch(err => {
        locked.value = false
        message({ message: err.response.data.message, type: 'error' });
    })
}


function islideCurrentPageReload(url) {
    if (!url) {
        url = location.href
    }
    setTimeout(() => {
        location.replace(url)
    }, 200);

}

</script>