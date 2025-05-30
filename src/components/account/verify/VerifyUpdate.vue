<template>
  <div class="max-w-3xl mx-auto my-2.5 bg-base-100 p-2.5 rounded-lg">
    <form @submit.prevent="submit">
      <div class="flex items-center mb-4 gap-3 flex-wrap">
        <label class="w-24 font-medium text-slate-600">认证ID</label>
        <input type="text" v-model="formData.id" disabled class="flex-1 p-2 border border-slate-200 rounded-md" />
      </div>

      <div class="flex items-center mb-4 gap-3 flex-wrap">
        <label class="w-24 font-medium text-slate-600">认证用户</label>
        <input type="text" v-model="formData.name" disabled class="flex-1 p-2 border border-slate-200 rounded-md" />
      </div>

      <div class="flex items-center mb-4 gap-3 flex-wrap">
        <label class="w-24 font-medium text-slate-600">认证类型</label>
        <select v-model="formData.type" class="select select-bordered flex-1">
          <option v-for="(item, index) in config.verify_group" :key="index" :value="item.type">{{ item.name }}</option>
        </select>
      </div>

      <div class="flex items-center mb-4 gap-3 flex-wrap">
        <label class="w-24 font-medium text-slate-600">认证名称</label>
        <input type="text" v-model="formData.title" class="input input-bordered flex-1" />
      </div>

      <div class="flex items-center mb-4 gap-3 flex-wrap">
        <label class="w-24 font-medium text-slate-600">认证金额</label>
        <input type="number" v-model="formData.money" class="input input-bordered flex-1" />
      </div>

      <div class="flex items-center mb-4 gap-3 flex-wrap">
        <label class="w-24 font-medium text-slate-600">认证积分</label>
        <input type="number" v-model="formData.credit" class="input input-bordered flex-1" />
      </div>

      <div class="flex items-center mb-4 gap-3 flex-wrap">
        <label class="w-24 font-medium text-slate-600">是否实名</label>
        <input type="checkbox" v-model="formData.verified" true-value="1" false-value="0" class="toggle toggle-primary" />
        <span class="text-slate-700">{{ formData.verified == '1' ? '已实名' : '未实名' }}</span>
      </div>

      <div class="flex items-center mb-4 gap-3 flex-wrap">
        <label class="w-24 font-medium text-slate-600">认证状态</label>
        <select v-model="formData.status" class="select select-bordered flex-1">
          <option v-for="status in statusOptions" :key="status.value" :value="status.value">{{ status.label }}</option>
        </select>
      </div>

      <div class="flex items-center mb-4 gap-3 flex-wrap">
        <label class="w-24 font-medium text-slate-600">认证资料</label>
        <div class="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-wrap gap-8 flex-1">
          <div v-for="(value, key) in formData.data" :key="key" class="grid gap-3 pb-2 border-b border-slate-100">
            <div class="font-medium text-slate-500 flex items-center">{{ formatKey(key) }}：</div>
            <div class="flex-1">
              <div v-if="isImage(value)" class="flex gap-2 flex-wrap">
                <van-image lazy-load v-for="(img, index) in getImages(value)" :data-fancybox="'gallery-'+index" :key="index" :src="img" 
                  class="w-28 h-20 rounded-lg border border-slate-200 cursor-pointer transition-transform hover:-translate-y-0.5 hover: bg-base-100" />
              </div>
              <div v-else class="text-slate-700 py-1.5 break-words">{{ value }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center mb-4 gap-3 flex-wrap">
        <label class="w-24 font-medium text-slate-600">审核意见</label>
        <textarea v-model="formData.opinion" rows="3" placeholder="请输入审核意见" class="textarea textarea-bordered flex-1"></textarea>
      </div>

      <div class="flex items-center mb-4 gap-3 flex-wrap">
        <button type="submit" class="btn btn-primary">保存</button>
        <button type="button" @click="emit('close-modal')" class="btn">返回</button>
      </div>
    </form>
  </div>
</template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import axios from '@/dist/axios'
  import { createMessage as message } from '@/dist/message'
  import { useStore } from '@/store'
  
  const store = useStore();
  const config = computed(() => store.config)
  
  const emit = defineEmits(['loadinged', 'close-modal'])
  const props = defineProps({
    data: {
      type: Object,
      default: () => ({
        id: 0,
        name: '',
        user_id: 0,
        type: '',
        title: '',
        money: 0,
        credit: 0,
        verified: 0,
        status: 0,
        data: {},
      })
    },
    callback: {
      type: Function,
      default: () => { }
    }
  })
  
  const formData = ref(props.data)
  
  const isImage = (value) => {
    return typeof value === 'string' &&
      (value.match(/\.(jpeg|jpg|gif|png|webp)$/) !== null || value.includes('http'))
  }
  
  const getImages = (value) => {
    if (typeof value !== 'string') return [value]
    return value.split(',').map(url => url.trim())
  }
  
  const statusOptions = [
    { label: '待审核', value: "0" },
    { label: '审核通过', value: "1" },
    { label: '审核未通过', value: "2" }
  ]
  
  const formatKey = (key) => {
    const map = {
      id_card: '身份证',
      business_license: '营业执照',
      contact: '联系方式',
      idcard_front: '身份证正面',
      idcard_verso: '身份证反面',
      idcard_hand: '手持身份证照',
      operator: '经营者',
      telephone: '联系电话',
      title: '认证名称',
      email: '邮箱',
    }
    return map[key] || key
  }
  
  const submit = () => {
    if (Object.keys(formData.value.data).length > 0) {
      formData.value.data.title = formData.value.title.trim();
    }
    axios.post('/UpdateVerify', formData.value).then(res => {
      message({ message: '保存成功', type: 'success' })
      props.callback(formData.value)
      emit('close-modal')
    }).catch(err => {
      message({ message: '保存失败', type: 'error' })
    })
  }
  
  onMounted(() => {
    emit('loadinged')
  })
  </script>