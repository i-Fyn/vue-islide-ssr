<template>
    <div class="generate-card box">
        <h2 class="page-title">生成卡密</h2>
        <form class="form" @submit.prevent="handleSubmit">
            <div class="form-group">
                <label>卡密类型</label>
                <select v-model="form.type" required>
                    <option value="money">充值卡</option>
                    <option value="credit">积分卡</option>
                    <option value="invite">邀请卡</option>
                    <option value="vip">会员卡</option>
                </select>
            </div>

            <div class="form-group">
                <label>面值</label>
                <input type="number" v-model="form.value" required />
            </div>

            <div class="form-group" v-if="form.type === 'vip'">
                <label>会员等级标识（card_key）</label>
                <select v-model="form.card_key" required>
                    <option v-for="(item, index) in config.user_vip_group" :value="'vip'+index" > {{ item.name }}</option>
                </select>
            </div>

            <div class="form-group" v-if="form.type === 'vip'">
                <label>时长（单位：天，card_value）</label>
                <input type="number" v-model="form.card_value" placeholder="如 30" required />
            </div>

            <div class="form-group">
                <label>生成数量</label>
                <input type="number" v-model="form.count" min="1" required />
            </div>

            <div class="form-actions">
                <button type="submit" class="btn">生成卡密</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/dist/axios'
import { createMessage as message } from '@/dist/message'
import { useStore } from '@/store'

const emit = defineEmits(['loadinged', 'close-modal'])

const props = defineProps({
    // 接收父组件传递的 props
    type: {
        type: String,
        default: 'money',
    },
    callback : {
        type: Function,
        default: () => {}
    }
})

const store = useStore()

const config = ref(store.config)
const form = ref({
    type: 'money',
    value: 0,
    card_key: '',
    card_value: '',
    count: 1,
})

const handleSubmit = () => {
    axios.post('/generateCard', form.value).then(res => {
        message({ message: '卡密生成成功', type: 'success' })
        props.callback()
        emit('close-modal')
    }).catch(err => {
        message({ message: err?.response?.data?.message || '生成失败', type: 'error' })
    })
}
onMounted(() => {
    form.value.type = props.type;
    emit('loadinged')
})
</script>

<style >
.page-title {
    font-size: 20px;
    margin-bottom: 20px;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 480px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    font-weight: 500;
    margin-bottom: 6px;
}

input,
select {
    padding: 10px;
    font-size: 14px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
}

.btn {
    padding: 10px 20px;
    font-size: 15px;
    background-color: var(--primary-color, #3b82f6);
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.btn:hover {
    opacity: 0.9;
}
</style>