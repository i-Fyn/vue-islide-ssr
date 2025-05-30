<template>
  <div class="secure-page right-wrap">
    <div class="secure-header w-full h-[184px] bg-center bg-no-repeat bg-[url(/assets/image/bg-secure.png)] relative">
      <div class="secure-info absolute inset-0 flex items-center flex-col justify-center">
        <span class="secure-shield block w-20 h-25 leading-25 bg-[url(/assets/image/secure.png)] bg-no-repeat bg-center bg-cover text-white text-4xl text-center">{{ data.security_info['score'] }}</span>
        <span class="secure-desc no-risk inline-block px-2 my-2 mx-auto bg-[#fc1944] rounded-xl text-white text-sm">{{ data.security_info['status'] }}</span>
        <p class="secure-suggest text-sm text-[--color-text-regular]">为了更好的保障您账号的安全，请您继续完善：<span class="">{{ data.security_info['suggest'] }}</span></p>
      </div>
    </div>

    <div class="secure-content bg-base-100 p-4">
      <div class="section-title my-4">账号设置</div>
      <div class="secure-setting-list">
        <ul>
          <li class="setting-item flex justify-between items-center p-3 border border-base-300 rounded-md hover:bg-base-200 mb-3">
            <div class="left">
              <div class="title text-sm mb-2 ">密码</div>
              <div class="desc text-sm text-base-content/60">安全性高的密码可以使帐号更安全</div>
            </div>
            <div class="right text-sm  cursor-pointer" @click="BindType('password')">修改密码</div>
          </li>

          <li class="setting-item flex justify-between items-center p-3 border  border-base-300 rounded-md hover:bg-base-200 mb-3">
            <div class="left">
              <div class="title text-sm mb-2">邮箱</div>
              <div class="desc text-sm text-base-content/60">{{ data.user_data.user_email ? data.user_data.user_email : '未绑定邮箱，绑定邮箱后可以通过邮箱登录账户和找回密码。' }}</div>
            </div>
            <div class="right text-sm  cursor-pointer" @click="BindType('email')">{{ data.user_data.user_email ? '更换' : '绑定' }}邮箱</div>
          </li>

          <li class="setting-item flex justify-between items-center p-3 border  border-base-300 rounded-md hover:bg-base-200">
            <div class="left">
              <div class="title text-sm mb-2">手机</div>
              <div class="desc text-sm text-base-content/60">{{ data.user_data.user_login ? data.user_data.user_login : '您还没有绑定手机' }}</div>
            </div>
            <div class="right text-sm  cursor-pointer" @click="BindType('phone')">{{ data.user_data.user_login ? '更换' : '绑定' }}手机</div>
          </li>
        </ul>
      </div>
    </div>

    <div class="secure-account-binding my-4 bg-base-100 p-4">
      <div class="section-title">社交账号绑定</div>
      <div class="secure-setting-list">
        <ul>
          <li v-for="value in data.oauth" class="setting-item flex justify-between items-center p-3 border  border-base-300 rounded-md hover:bg-base-200 mb-3">
            <div class="left">
              <div class="title text-sm mb-2">{{ value.name }}</div>
              <div class="desc text-sm text-base-content/60">{{ value.is_binding ? value.user_name ? value.user_name : '已绑定' : '未绑定' }}</div>
            </div>
            <div class="right text-sm  cursor-pointer">
              <span v-if="value.is_binding" @click="unBinding(value.name)">解绑</span>
              <span v-else @click="binding(value[key])">绑定</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onServerPrefetch, nextTick } from 'vue';
import axios from '@/dist/axios';
import { useStore } from '../../store';
import { createVanModal } from '@/dist/createVanModal'


const store = useStore();
const data = ref({
    user_data: {
        user_email: '',
        user_login: '',
    },
    security_info: {
        status: '安全',
        suggest: '请尽快修改密码',
    },
    oauth: [
        {
            name: 'QQ',
            is_binding: false,
            user_name: '',
        },
        {
            name: '微信',
            is_binding: false,
            user_name: '',
        },
        {
            name: '微博',
            is_binding: false,
            user_name: '',
        },
    ],
})


const getSecureInfo = async () => {
    try {
        let res = await axios.get('/getSecureInfo');
        data.value = res.data;
    } catch (error) {

    }
}

const BindType = (type) => {
    import('@/components/account/account/bind.vue').then(module => {
        createVanModal(module.default, {
            size: 356,
            props: {
                data: { type }
            }
        })
    })
}

onMounted(async () => {
    await getSecureInfo();
})


onServerPrefetch(async () => {
    await getSecureInfo();
})



</script>