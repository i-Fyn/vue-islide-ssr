<template>
    <div class="post_download mb-4 relative" v-if="data">
        <div id="download-box" class="download-box card bg-base-100 card-border border-base-300">
            <div class="tabs tabs-boxed mt-5 flex-nowrap whitespace-nowrap scroll-y scroll scrollbar-none" ref="scrollTab" v-if="list.length">
                <a v-for="(item, i) in list" :key="i" :class="['tab', { 'tab-active text-primary': i === index }]"
                    :checked="i === index ?'checked':''"
                    @click="changeTab(i)">
                    {{ item.title }}
                </a>
            </div>
            <div class="card-body pb-0">
                <div class="card-title">
                    <h2>{{ data.title }}</h2>
                </div>
                <div class="flex flex-col gap-2" v-if="data.attrs.length">
                    <div v-for="(item, index) in data.attrs" class="flex gap-2">
                        <span class="font-bold">{{ item.key }}：</span>
                        <span>{{ item.value }}</span>
                    </div>
                </div>
                <div class="flex flex-col">
                    <div class=" items-center relative">
                        <div v-if="!data.current_user.can.allow" class=" items-center gap-2">
                            <span v-if="data.current_user.can.type == 'money'" class="flex items-center gap-1">
                                需支付 <i class="ri-coin-line text-primary"></i>
                                <span class="text-primary text-xl">{{ data.current_user.can.value }}</span>
                            </span>
                            <span v-if="data.current_user.can.type == 'credit'" class="flex items-center gap-1">
                                需支付 <span class="text-primary text-xl">{{ data.current_user.can.value }}</span>
                                <span class="text-primary">积分</span>
                            </span>
                            <span v-if="data.current_user.can.type == 'free'">免费下载</span>
                            <span v-if="data.current_user.can.type == 'comment'">评论后下载</span>
                            <span v-if="data.current_user.can.type == 'login'">登录后下载</span>
                            <span v-if="data.current_user.can.type == 'password'">输入密码下载</span>
                            <span v-if="data.current_user.can.type == 'none'">
                                <div class="collapse collapse-arrow min-h-15">
                                    <input type="checkbox" /> 
                                    <div class="pl-0 collapse-title text-sm font-medium justify-center items-center w-fit flex text-center leading-8">
                                        当前为指定权限用户下载
                                    </div>
                                    <div class="collapse-content pl-0"> 
                                        <div class="flex flex-col gap-2">
                                            <div v-for="(item, index) in data.rights" 
                                                :class="['flex justify-between items-center p-2 rounded-lg',
                                                    item.lv == data.current_user.lv.lv.lv || item.lv == data.current_user.lv.vip.lv
                                                        ? 'bg-primary/10' : '']">
                                                <span>{{ item.name }}</span>
                                                <span>{{ getTagName(item) }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </span>
                        </div>
                        <div v-else class="flex items-center gap-2 py-4 min-h-15">
                            <span v-if="data.current_user.can.free_count" class="flex items-center gap-1 leading-8">
                                今日免费下载剩余 <span class="text-primary text-xl">{{ data.current_user.can.free_count }}</span> 次
                            </span>
                            <span class="leading-8" v-else>已获得下载权限</span>
                        </div>
                        <button class="btn btn-soft btn-primary px-4 lg:px-12 text-white btn-sm absolute top-4 right-4 " @click.stop="go()">
                            <i class="ri-download-fill"></i>下载
                        </button>
                    </div>
                    <div class="flex flex-col gap-2">
                        <div v-for="(item, index) in data.rights" >
                            <div class="pay-tag absolute left-0 top-0 z-10 text-sm px-2.5 py-0.5 bg-gradient-to-r from-[#ff74cd] to-[#ec7d0b] text-white rounded-tl-lg rounded-br-lg">
                                <i class="fa fa-book mr-1"></i>{{ getTagName(item) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, onServerPrefetch, computed } from 'vue'
import { useStore } from '@/store';
import { createMessage as message } from '@/dist/message';
import { useRouter } from 'vue-router';
import { islidepay, passwordVerify } from '@/dist/pay';


const router = useRouter();
const list = ref([
    {
        "title": "--",
        "link": "",
        "attrs": [],
        "rights": [
            {
                "lv": "",
                "name": "",
                "type": "",
                "value": ""
            }
        ],
        "current_user": {
            "can": {
                "allow": "",
                "type": "",
                "value": "",
                "free_count": "",
                "free_down": ""
            },
            "lv": {
                "lv": {
                    "name": "",
                    "exp": "",
                    "icon": "",
                    "lv": "",
                    "next_lv_name": "",
                    "next_lv_exp": "",
                    "next_lv_icon": "",
                    "exp_ratio": ""
                },
                "vip": {
                    "name": "",
                    "lv": "",
                    "image": "",
                    "icon": "",
                    "color": "",
                    "time": "",
                    "date": ""
                }
            },
            "not_login_pay": ""
        },
        "can_not_login_pay": ""
    },
    {
        "title": "--",
        "link": "",
        "attrs": [
            {
                "key": "",
                "value": ""
            },
            {
                "key": "",
                "value": ""
            }
        ],
        "rights": [
            {
                "lv": "",
                "name": "",
                "type": "",
                "value": ""
            }
        ],
        "current_user": {
            "can": {
                "allow": "",
                "type": "",
                "value": "",
                "free_count": "",
                "free_down": ""
            },
            "lv": {
                "lv": {
                    "name": "",
                    "exp": "",
                    "icon": "",
                    "lv": "",
                    "next_lv_name": "",
                    "next_lv_exp": "",
                    "next_lv_icon": "",
                    "exp_ratio": ""
                },
                "vip": {
                    "name": "",
                    "lv": "",
                    "image": "",
                    "icon": "",
                    "color": "",
                    "time": "",
                    "date": ""
                }
            },
            "not_login_pay": ""
        },
        "can_not_login_pay": ""
    }
]
);
const show = ref(false);
const index = ref(0);
const data = ref(list.value[index.value]);

const store = useStore();
const config = computed(() => store.config);

const changeTab = async (i) => {
    index.value = i;
    data.value = list.value[index.value]
};

const props = defineProps({
    postDetail: {
        type: Object,
        required: true
    },
    settings: {
        type: Object,
        default: {}
    }
})


const getDownloadData = async () => {
    try {
        let res = await store.fetchDownloadData(props.postDetail.id)
        list.value = res;
        console.log(list.value)
        data.value = list.value[index.value];
    } catch (error) {
    }
}


const getTagName = (item) =>{
    if(item.type == 'money') {
        return '付费下载 '+item.value
    } else if(item.type == 'credit') {
        return '积分下载 '+item.value
    } else if(item.type == 'free') {
        return '免费下载'
    } else if(item.type == 'comment') {
        return '评论下载'
    } else if(item.type == 'login') {
        return '登录下载'
    } else if(item.type == 'password') {
        return '密码下载'
    } else {
        return '无权下载'
    }
}


const go = () => {
    if (!data.value.current_user.can.allow) {
        if (data.value.current_user.can.type == 'comment') {
            return message({ message: '评论并刷新后免费下载！', type: 'warning' });
        } else if (data.value.current_user.can.type == 'credit' || data.value.current_user.can.type == 'money') {
            islidepay({
                'title': data.value.title,
                'order_price': data.value.current_user.can.value,
                'order_type': 'xiazai',
                'order_key': index.value,
                'post_id': props.postDetail.id,
                'type': data.value.current_user.can.type,
                'tag': '资源下载'
            }, data.value.current_user.can.type)
        } else if (data.value.current_user.can.type == 'password') {
            config.value.password_verify.post_id = props.postDetail.id;
            passwordVerify(config.value.password_verify)
        } else {
            return message({ message: '您无权下载，请升级权限！', type: 'warning' });
        }

    } else {
        router.push(data.value.link)
    }
}




onMounted(async () => {
    if (props.postDetail.download && props.postDetail.download == '1') {
        await getDownloadData()
    }
})

onServerPrefetch(async () => {
    if (props.postDetail.download && props.postDetail.download == '1') {
        await getDownloadData()
    }
})



</script>