<template>
    <div class="push-message box">
        <h2 class="page-title">推送信息</h2>
        <form class="form" @submit.prevent="handleSubmit">
            <div class="form-group">
                <label>消息类型</label>
                <select v-model="form.type">
                    <option v-for="option in typeOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                    </option>
                </select>
            </div>

            <div class="form-group">
                <label>接收对象</label>
                <select v-model="form.receiver_type">
                    <option v-for="option in receiverTypeOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                    </option>
                </select>
            </div>

            <div class="form-group" v-if="form.receiver_type === 'select'">
                <label>接收ID</label>
                <input v-model="form.receiver_id" placeholder="例如：2,3,5" />
            </div>

            <div class="form-group" v-if="form.type !== 'system'">
                <label>样式</label>
                <div class="style-options">
                    <label v-for="style in styleOptions" :key="style.label">
                        <input type="radio" name="style" :value="style.label" v-model="form.style" />
                        <van-image lazy-load :src="style.value" :alt="style.label" class="style-preview" />
                    </label>
                </div>
            </div>

            <div class="form-group" v-if="form.style !== 'image'">
                <label>标题</label>
                <input v-model="form.title" type="text" placeholder="请输入标题" />
            </div>

            <div class="form-group" v-if="form.style !== 'image'">
                <label>内容</label>
                <textarea v-model="form.content" rows="2" placeholder="请输入内容"></textarea>
            </div>

            <div class="form-group" v-if="form.style === 'image'">
                <label>图片链接</label>
                <input v-model="form.image" type="text" placeholder="请输入图片URL" />
                <button type="button" class="btn" @click="handleImageUpload">上传</button>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn">发送</button>
                <button type="button" class="btn cancel" @click="emit('close-modal')">取消</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/dist/axios'
import { createMessage as message } from '@/dist/message'
import { createVanModal } from '@/dist/createVanModal'

const emit = defineEmits(['loadinged', 'close-modal'])

const form = ref({
    type: 'chat',
    sender_id: 0,// 0表示系统消息
    receiver_type: 'all',
    receiver_id: '',
    style: 'normal',
    title: '',
    content: '',
    image: '',
})

const typeOptions = [
    { label: '聊天', value: 'chat' },
    { label: '系统通知', value: 'system' },
    { label: '会员通知', value: 'vip' },
]

const receiverTypeOptions = [
    { label: '所有用户', value: 'all' },
    { label: '指定用户', value: 'select' },
]

const styleOptions = [
    { label: 'normal', value: '/assets/image/message-style-1.png' },
    { label: 'image', value: '/assets/image/message-style-2.png' },
    { label: 'card', value: '/assets/image/message-style-3.png' },
]

const handleSubmit = async () => {
    try {
        await axios.post('/pushMsg', form.value)
        message({ message: '发送成功', type: 'success' })
        emit('close-modal')
    } catch (err) {
        message({ message: err?.response?.data?.message || '发送失败', type: 'error' })
    }
}


const handleImageUpload = () => {
    form.value.image = '';
    import('@/components/other/UploadImage.vue').then(module => {
        createVanModal(module.default, {
            size: 350,
            props: {
                data: {
                    showTabType: 1,
                    maxPicked: 1,
                    postType: 'message',
                    callback: (res, type) => {
                        if (res && res.length > 0) {
                            const imageUrl = res[0]?.url;
                            if (imageUrl) {
                                form.value.image = imageUrl;
                            }
                        }
                    }
                },
            }
        })
    })
}

onMounted(() => emit('loadinged'))
</script>


<style>
.style-options {
    display: flex;
    gap: 10px;
    align-items: center;
}

.style-preview {
    width: 80px;
    height: auto;
    border-radius: 6px;
    border: 1px solid #ccc;
    margin-left: 6px;
}

.form-group input {
    display: flex;
    flex-grow: 1;
}

.push-message {
    padding: 24px;
    max-width: 600px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

.page-title {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 24px;
    border-left: 4px solid var(--primary-color, #3b82f6);
    padding-left: 12px;
    color: #1e293b;
}

.form {
    display: flex;
    flex-direction: column;
}

.form-group {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    gap: 12px;
}

.form-group label {
    font-weight: 500;
    color: #334155;
    min-width: 60px;
    font-size: 15px;
}

input,
select,
textarea {
    padding: 10px 14px;
    font-size: 14px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background-color: #fff;
    color: #111827;
    transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus,
select:focus,
textarea:focus {
    border-color: #3b82f6;
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

textarea {
    resize: vertical;
    display: flex;
    flex-grow: 1;
}

.form-actions {
    display: flex;
    justify-content: flex-start;
    gap: 12px;
    margin-top: 10px;
}


.btn:hover {
    opacity: 0.95;
}

.btn.cancel {
    background-color: #e5e7eb;
    color: #1f2937;
}

@media (max-width: 480px) {

    .btn {
        width: 100%;
    }
}

/* 移动端 */

@media (max-width: 768px) {
    .form-group {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        gap: 8px;
    }



}
</style>