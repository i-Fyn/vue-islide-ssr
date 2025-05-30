<template>
    <div class="bg-base-100 rounded-lg">
        <div class="bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-t-lg">
            <div class="text-xl font-bold">提现申请</div>
        </div>
        <div class="p-4">
            <div class="text-center text-sm text-base-content/60">可提现金额</div>
            <div class="text-center text-3xl font-semibold text-primary my-4">
                <span class="text-xl">￥</span>{{ money }}
            </div>
            <div class="w-full max-w-md mx-auto">
                <form @submit.stop.prevent="cashOut">
                    <div class="relative mb-4">
                        <input 
                            type="number" 
                            v-model="amount"
                            maxlength="9"
                            placeholder="请输入提现金额"
                            class="input input-bordered w-full pl-12"
                            autocomplete="off"
                        >
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60 opacity-80">
                            <i class="ri-money-cny-circle-line text-xl"></i>
                        </span>
                        <span class="absolute -top-3 -right-2 text-sm bg-base-100 px-2 py-0.5 rounded border border-primary text-primary">
                            最低提现 {{ limit }} 元
                        </span>
                    </div>

                    <div class="flex justify-between items-center p-4 bg-base-200 rounded-lg mb-4">
                        <div class="text-sm">提现至</div>
                        <div @click="editQrcode" class="flex items-center text-base-content/60 cursor-pointer">
                            <span>编辑</span>
                            <i class="ri-arrow-right-s-line text-base"></i>
                        </div>
                    </div>

                    <button class="btn btn-primary w-full">申请提现</button>
                </form>
            </div>
            <div class="text-center text-sm text-base-content/60 mt-4">
                提现时扣除 {{ ratio }}% 的手续费，以实际到账为准
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { createMessage as message } from '../../dist/message'
import { createVanModal } from '@/dist/createVanModal'
import axios from '@/dist/axios'

const emit = defineEmits(['close-modal', 'loadinged'])
const props = defineProps(['type', 'money', 'ratio', 'limit'])

const amount = ref('')
const locked = ref(false)

const cashOut = () => {
    if (!confirm('申请提现需后台人工处理，一般24小时，确认要提现吗？')) return;

    if (locked.value) return
    locked.value = true

    axios.post('/cashOut', {
        type: props.type,
        money: amount.value
    }).then(res => {
        locked.value = false
        message({message: '提现申请已提交，请耐心等待后台审核', type:'success'})
        emit('close-modal')
        //刷新当前页面
        setTimeout(() => {
            window.location.reload()
        }, 2000)
    }).catch(err => {
        locked.value = false
        message({message: err.response.data?.message, type: 'error'})
    })
}

const editQrcode = () => {
    import('./Qrcode.vue').then(m => {
        createVanModal(m.default,{
            size:356
        })
    })
}

onMounted(() => {
    emit('loadinged')
})

</script>