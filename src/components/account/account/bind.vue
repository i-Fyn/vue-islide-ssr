<script setup>
import { ref, reactive, computed, watch, onUnmounted,onMounted } from 'vue'
import axios from 'axios'
import {createMessage as message} from '@/dist/message'
const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  show: Boolean
})

const emit = defineEmits(['update:show','loadinged'])

const param = reactive({
  username: '',
  password: '',
  code: '',
  confirm_password: '',
  type: ''
})

const locked = ref(false)
const countdown = ref(60)
let timerId = null

const typeMap = {
  email: {
    key: 'email',
    name: '绑定邮箱',
    placeholder: '邮箱',
    icon: 'ri-mail-settings-line'
  },
  phone: {
    key: 'phone',
    name: '绑定手机号',
    placeholder: '手机号',
    icon: 'ri-phone-line'
  },
  password: {
    key: 'password',
    name: '修改密码',
    placeholder: '手机号或邮箱',
    icon: 'ri-lock-password-line'
  }
}

const type = computed(() => typeMap[props.data.type])

const changeData = async () => {
  if (locked.value) return
  locked.value = true
  
  try {
    const api = type.value.key === 'password' ? 'changePassword' : 'changeEmailOrPhone'
    param.type = type.value.key
    const res = await axios.post(qk_rest_url + api, param)
    
    message({message: res.data.msg, type:'success'})
    qkCurrentPageReload()
  } catch (err) {
    message({message: err.response?.data?.message || '请求失败', type: 'error'})
  } finally {
    locked.value = false
  }
}

const getCode = async () => {
  if (countdown.value !== 60) return
  
  try {
    const res = await axios.post('/sendCode', param)
    message({message: res.data.msg, type:'success'})
    startCountdown()
  } catch (err) {
    message({message: err.response?.data?.message || '验证码发送失败', type: 'error'})
  }
}

const startCountdown = () => {
  countdown.value = 59
  timerId = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timerId)
      countdown.value = 60
    }
  }, 1000)
}

const resetData = () => {
  Object.assign(param, {
    username: '',
    password: '',
    code: '',
    confirm_password: '',
    type: ''
  })
  countdown.value = 60
  clearInterval(timerId)
}

onUnmounted(() => {
  clearInterval(timerId)
})

onMounted(() => {
  emit('loadinged')
})

watch(
  () => props.show,
  (newVal) => {
    if (!newVal) {
      resetData()
    }
  }
)
</script>

<template>
  <div class="binding-container">
    <slot></slot>
    <div class="colorful-header qk-flex">
      <div class="title">
        <i :class="type.icon"></i>
        <div>{{ type.name }}</div>
      </div>
    </div>
    <div class="form-container">
      <form @submit.stop.prevent="changeData">
        <label class="form-item" v-if="type.key !== 'password'">
          <input
            type="text"
            name="username"
            v-model="param.username"
            spellcheck="false"
            autocomplete="off"
            :placeholder="type.placeholder"
          >
        </label>
        <label class="form-item" v-if="type.key !== 'password'">
          <input
            type="text"
            name="code"
            v-model="param.code"
            spellcheck="false"
            autocomplete="off"
            placeholder="请输入验证码"
          >
          <div 
            class="login-eye text"
            @click.stop.prevent="getCode"
          >
            {{ countdown < 60 ? `${countdown}秒后可重发` : '发送验证码' }}
          </div>
        </label>
        <label class="form-item" v-if="type.key === 'password'">
          <input
            type="password"
            name="password"
            v-model="param.password"
            autocomplete="off"
            spellcheck="false"
            placeholder="新密码"
          >
        </label>
        <label class="form-item" v-if="type.key === 'password'">
          <input
            type="password"
            name="confirm_password"
            v-model="param.confirm_password"
            autocomplete="off"
            spellcheck="false"
            placeholder="确认密码"
          >
        </label>
        <div class="form-button">
          <button>确认</button>
        </div>
      </form>
    </div>
  </div>
</template>