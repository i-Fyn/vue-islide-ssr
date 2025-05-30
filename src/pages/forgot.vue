<template>
    <div class="w-full max-w-md mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl overflow-hidden">
        <div class="w-full space-y-6 bg-base-100/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20">
            <!-- 标题部分 -->
            <div class="text-center">
                <h2 class="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">找回账号密码</h2>
                <p class="mt-2 text-sm text-base-content/60">请输入您账号绑定的手机号码或邮箱地址</p>
            </div>

            <!-- 表单部分 -->
            <form @submit.prevent="resetPassword" class="space-y-4">
                <div class="relative">
                    <input type="text" 
                           v-model="form.username" 
                           class="appearance-none rounded-xl relative block w-full px-4 py-2.5 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-base-100/50 backdrop-blur-sm"
                           placeholder="请输入绑定的手机号或邮箱">
                </div>

                <div class="relative">
                    <input type="text" 
                           v-model="form.code" 
                           class="appearance-none rounded-xl relative block w-full px-4 py-2.5 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-base-100/50 backdrop-blur-sm"
                           placeholder="请输入验证码">
                    <div @click="countdown === 60 ? getCode() : null" 
                         class="absolute right-4 top-2.5 text-sm text-indigo-600 hover:text-indigo-500 cursor-pointer font-medium transition-colors duration-200">
                        {{ countdown < 60 ? countdown + '秒后可重发' : '发送验证码' }}
                    </div>
                </div>

                <div class="relative">
                    <input type="password" 
                           v-model="form.password" 
                           class="appearance-none rounded-xl relative block w-full px-4 py-2.5 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-base-100/50 backdrop-blur-sm"
                           placeholder="新密码">
                </div>

                <div class="relative">
                    <input type="password" 
                           v-model="form.confirmPassword" 
                           class="appearance-none rounded-xl relative block w-full px-4 py-2.5 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-base-100/50 backdrop-blur-sm"
                           placeholder="确认密码">
                </div>

                <!-- 提示文本 -->
                <div class="flex items-center justify-between text-sm">
                    <div class="text-base-content/60">
                        <span @click="go('/')" class="text-indigo-600 hover:text-indigo-500 cursor-pointer font-medium transition-colors duration-200">返回首页</span>
                    </div>
                </div>

                <!-- 提交按钮 -->
                <div>
                    <button type="submit" 
                            class="btn btn-primary w-full">
                        重置密码
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from '@/dist/axios'
import { createMessage as message } from '../dist/message'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useStore()
const form = reactive({
    username: '',
    code: '',
    password: '',
    confirmPassword: ''
})

const locked = ref(false)
const countdown = ref(60)
let intervalId = null

const resetPassword = async () => {
    if (!form.username.trim()) return message({ message: '请输入绑定的手机号或邮箱', type: 'error' })
    if (!form.code.trim()) return message({ message: '请输入验证码', type: 'error' })
    if (!form.password.trim() || !form.confirmPassword.trim()) return message({ message: '请输入新密码或确认密码', type: 'error' })
    if (form.password !== form.confirmPassword) return message({ message: '请确保两次密码相同', type: 'error' })
    if (locked.value) return

    locked.value = true

    try {
        await axios.post('/resetPassword', form)
        message({ message: '密码重设成功！请牢记新密码', type: 'success' })
        Object.assign(form, { username: '', code: '', password: '', confirmPassword: '' })
        setTimeout(() => {
            router.push('/')
        }, 3000)
    } catch (err) {
        message({ message: err.response?.data?.message || err.message, type: 'error' })
    } finally {
        locked.value = false
    }
}

const getCode = async () => {
    if (!form.username.trim()) return message({ message: '请输入绑定的手机号或邮箱', type: 'error' })
    if (locked.value) return

    locked.value = true

    try {
        const res = await axios.post('/sendCode', { username: form.username, type: 'forgot' })
        message({ message: res.data.msg, type: 'success' })
        startCountdown()
    } catch (err) {
        message({ message: err.response?.data?.message || err.message, type: 'error' })
    } finally {
        locked.value = false
    }
}

const startCountdown = () => {
    if (intervalId) clearInterval(intervalId)
    countdown.value = 60
    intervalId = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
            clearInterval(intervalId)
            countdown.value = 60
        }
    }, 1000)
}

const go = (path) => {
    router.push(path)
}
</script>