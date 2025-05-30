<template>
  <div class="bg-base-100 rounded-lg">
    <div class="bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-t-lg">
      <div class="text-xl font-bold">设置收款码</div>
    </div>
    <div class="p-4 flex justify-around gap-4">
      <div class="flex flex-col items-center gap-3 text-base-content/60 text-sm">
        <div 
          class="w-30 h-30 bg-base-200 rounded-lg flex items-center justify-center text-2xl cursor-pointer overflow-auto"
          @click="imgUploadBox('weixin')"
        >
          <van-image lazy-load class="w-full h-full" :src="data.weixin" v-if="data.weixin" />
          <i class="ri-image-add-line" v-else></i>
        </div>
        <p>微信收款码</p>
      </div>
      <div class="flex flex-col items-center gap-3 text-base-content/60 text-sm">
        <div
          class="w-30 h-30 bg-base-200 rounded-lg flex items-center justify-center text-2xl cursor-pointer overflow-auto"
          @click="imgUploadBox('alipay')"
        >
          <van-image lazy-load class="w-full h-full" :src="data.alipay" v-if="data.alipay"/>
          <i class="ri-image-add-line" v-else></i>
        </div>
        <p>支付宝收款码</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted,nextTick } from 'vue'
import axios from '@/dist/axios'
import { createMessage as message } from '../../dist/message'
import { createVanModal } from '@/dist/createVanModal'
const emit = defineEmits(['loadinged','close-modal'])
const locked = ref(false)
const data = ref({
    weixin: '',
    alipay: ''
})

onMounted(() => {
    getUserQrcode()
})

const getUserQrcode = () => {
    if (locked.value) return
    locked.value = true
    axios.post('/getUserQrcode').then(res => {
        data.value = res.data
        nextTick(() => {
            emit('loadinged')
        })
    }).catch(err => {
        message({ message: err.response.data.message, type: 'error' })
    }).finally(() => {
        locked.value = false
    })
}

const saveQrcode = (type, url) => {
    if (locked.value) return
    locked.value = true
    axios.post('/saveQrcode', {
        type,
        url
    }).then(res => {
        message({ message: '收款码设置成功', type:'success' })
        data.value[type] = url
        emit('loadinged')
    }).catch(err => {
        message({ message: err.response.data.message, type: 'error' })
    }).finally(() => {
        locked.value = false
    })
}

const imgUploadBox = (imgtype) => {
    import('@/components/other/Uploadimage.vue').then(module => {
        createVanModal(module.default, {
            size: 350,
            props:{
                data: {
                    maxPicked: 1,
                    postType: 'qrcode',
                    showTabType: 1,
                    callback: (data, type) => {
                        saveQrcode(imgtype, data[0].url)
                    }
                }
            }
        })
    })
}
</script>