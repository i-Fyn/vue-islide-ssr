<template>
  <div class="user-menu-container w-full max-w-82 min-h-25  select-none rounded-lg bg-base-100"
     :class="{'shadow-[4px_4px_24px_0_rgba(96,101,108,.12)]': shadow}">
    <div class="user-menu-content p-4">
      <div class="user-info-item flex justify-between mb-4">
        <div class="user-info flex">
          <avatarVue :data="userData" class="mr-3" :size="40" ></avatarVue>
          <div class="user-name">
            <nameVue :data="userData" class="text-base"></nameVue>
            <div class="desc text-xs text-base-content/60 mt-0.5 text-ellipsis" v-text="userData.desc"></div>
          </div>
        </div>
      </div>
      <div class="vip-panel-item whitespace-nowrap mb-4">
        <a href="/vip" @click.stop.prevent="go('/vip')" title="会员中心" class="vip-panel-link block rounded-lg p-2 text-sm cursor-pointer bg-base-200 text-primary w-full">
          <div class="vip-panel flex justify-between items-center">
            <div class="vip-panel-info flex items-center h-full">
              <div class="vip-icon mx-2"><i class="ri-vip-crown-2-line text-xl leading-5"></i></div>
              <div class="vip-name text-sm">{{ vipName }}</div>
              <div class="divider border-l border-primary h-1.5 mx-2"></div>
              <div class="vip-expire-time">{{ vipExpireTime }}</div>
            </div>
            <div class="divider border-l border-primary h-1.5 mx-2"></div>
            <button class="vip-btn  btn btn-primary btn-sm btn-ghost text-sm  leading-4 !p-0" @click.stop.prevent="payVip">{{ vipButtonText }}</button>
          </div>
        </a>
      </div>
      <div class="user-assets-item mb-4">
        <div class="user-assets flex justify-between">
          <a class="user-money-card  rounded-lg h-[65px] p-2 px-4 relative cursor-pointer text-sm w-[calc(50%-0.75rem)] border border-base-300 overflow-hidden" @click.stop.prevent="recharge('balance')" href="/account/center" target="_blank" rel="nofollow">
            <div class="user-assets-name mb-1.5">余额<i class="ri-arrow-right-s-line"></i></div>
            <div class="user-assets-num text-lg font-semibold text-primary z-1 relative overflow-ellipsis">{{ userData.money }}</div>
            <div class="assets-icon absolute top-0 right-0 w-[50px] h-[65px] rounded-r-lg bg-no-repeat bg-cover bg-center transition-[background-image] duration-300 bg-[url('/assets/image/balance-img.jpg')]"></div>
          </a>
          <a class="user-credit-card  rounded-lg h-[65px] p-2 px-4 relative cursor-pointer text-sm w-[calc(50%-0.75rem)] border border-base-300 " @click.stop.prevent="recharge('credit')" href="/account/center" target="_blank" rel="nofollow">
            <div class="user-assets-name mb-1.5">积分<i class="ri-arrow-right-s-line"></i></div>
            <div class="user-assets-num text-lg font-semibold text-warning z-1 relative">{{ userData.credit }}</div>
            <div class="assets-icon absolute top-0 right-0 w-[50px] h-[65px] rounded-r-lg bg-no-repeat bg-cover bg-center transition-[background-image] duration-300 bg-[url('/assets/image/credit-img.jpg')]"></div>
          </a>
        </div>
      </div>
      <div class="links-item">
        <div v-for="link in links" :key="link.title" class="link-item flex justify-between mb-0.5 px-3.5 h-9 rounded-lg text-base-content text-sm transition-colors duration-300 whitespace-nowrap cursor-pointer hover:bg-base-200">
          <a @click.stop.prevent="go(link.link)" :href="link.link" target="_blank" class="link-title flex items-center" rel="nofollow">
            <i :class="link.icon" class="mr-4 text-lg leading-5"></i>
            <span>{{ link.title }}</span>
          </a>
        </div>
      </div>
      <div class="split-line my-2.5 w-full h-px bg-base-300"></div>
      <div class="logout-item flex px-3.5 h-9 rounded-lg text-base-content text-sm transition-colors duration-300 whitespace-nowrap cursor-pointer hover:bg-base-200 items-center" @click="logout">
        <i class="ri-logout-circle-r-line mr-4 text-lg leading-5"></i>
        <span>退出登录</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'
import { createVanModal } from '@/dist/createVanModal'
import { createMessage as message } from '@/dist/message'
import nameVue from '../user/nameVue.vue'
import avatarVue from '../user/avatarVue.vue'
import { islideDelCookie } from '@/dist/theme'
import { payVip } from '@/dist/pay'


const emit = defineEmits(['close-modal']);
const router = useRouter();
const store = useStore();
const props = defineProps({
  userData: {
    type: Object,
    required: true
  },
  shadow: {
    type: Boolean,
    default: false
  }
})
const config = computed(() => store.config);
const links = computed(() => config.value['top_menu_user_links']);
const go = (path) => {
  emit('close-modal');
  router.push(path);
};


const vipName = computed(() => (props.userData.vip?.name || '会员'));
const vipExpireTime = computed(() => {
  if (!Object.keys(props.userData.vip).length) return '未开通';
  return props.userData.vip.time === 0 ? '永久' : `${props.userData.vip.time}天后到期`;
});

const vipButtonText = computed(() => {
  if (!Object.keys(props.userData.vip).length) return '去开通';
  return props.userData.vip.time === 0 ? '去升级' : '去续费';
});




const recharge = async (type) => {
  import('@/components/pay/Recharge.vue').then((m) => {
    createVanModal(m.default, { size: 370, props: { type: type } });
  });
};

const logout = () => {
  store.fetchLoginOut().then(() => {
    message({ message: '退出登录成功', type: 'success' })
    islideDelCookie('islide_token');
    localStorage.removeItem('token');
    store.token='';
    window.location.reload();
  }).catch((error) => {
    console.error(error);
    message({ message: '退出登录失败', type: 'error' });
  });
};


onMounted(() => {
  if (props.userData.admin && links.length > 0) {
    links.push({
      title: '后台管理',
      icon: 'ri-settings-line',
      link: '/admin',
    });
  }

})

</script>