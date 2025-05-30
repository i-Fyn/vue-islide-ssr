<template>
    <div class="password-pay-container bg-base-100 rounded-box shadow-lg">
        <slot></slot>
        <div class="colorful-header  p-6 rounded-t-box">
            <div class="title flex items-center gap-3 text-lg font-medium">
                <i class="ri-lock-2-line text-primary text-xl"></i>
                <div>密码验证</div>
            </div>
        </div>
        <div class="form-container p-6">
            <div class="scan-info flex flex-col items-center gap-6 mb-8">
                <div class="qrcode-img bg-base-200 p-4 rounded-box shadow-sm" v-if="data.qrcode_img">
                    <van-image lazy-load :src="data.qrcode_img" class="w-h rounded-lg" />
                </div>
                <div class="text text-base-content/70 text-center" v-if="data.tips_text" v-html="data.tips_text"></div>
            </div>
            <form @submit.stop.prevent="passwordVerify" class="space-y-6">
                <div class="form-control w-full">
                    <passwordInput v-model="code" :length="data.length" :mask="false" :focused="true" class="input input-bordered w-full" />
                </div>
                <div class="form-button">
                    <button class="btn btn-primary w-full gap-2">
                        <i class="ri-check-line"></i>
                        确认
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>


<script setup>
import passwordInput from './PasswordInput.vue'
import { ref,   onMounted } from 'vue'
import axios from '@/dist/axios'
import { createMessage as message } from '@/dist/message';
import { islideSetCookie } from '@/dist/theme'


const props = defineProps({
    data: {
        type: Object,
    },
    show: {
        type: Boolean,
    }
})
const emit = defineEmits(['close-modal','loadinged'])
const code = ref('')
const locked = ref(false)

const passwordVerify = () => {
    if (!code.value.trim()) return message({ message: '请输入密码', type: 'error' });

    if (locked.value == true) return
    locked.value = true

    let params = {
        'post_id': props.data.post_id,
        'code': code.value,
        'type': props.data.type ? props.data.type : 'post',
    };

    axios.post('/passwordVerify', params).then(res => {
        locked.value = false
        emit('close-modal')

        //回调
        if (typeof props.data.confirm === 'function') {
            return props.data.confirm(params);
        }

        message({ message: res.data.msg, type: 'success' });

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

onMounted(() => {
    emit('loadinged')
})

</script>