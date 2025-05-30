<template>
  <div class="menu-user-box text-xl group">
    <div class="cursor-pointer flex items-center justify-center">
    <div v-if="!isLogin">
      <i class="ri-user-line" @click="showLoginHandler"></i>
    </div>
    <avatarVue :data="userData" @click="showUserMenu" v-if="isLogin && userData.login" :size="23"  />
  </div>
    <div class="bg-base-100 text-base-content card user-menu-wrap invisible  absolute max-w-75 z-99 opacity-0 -translate-y-2 transition  duration-300 ease-in-out -right-2.5 group-hover:visible group-hover:opacity-100 group-hover:translate-y-3" v-if="isLogin && !isMobile && userData.login">
      <UserMenu :userData="userData" :shadow="true" />
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from '@/store';
import avatarVue from '../user/avatarVue.vue';
import { useIsMobile } from '@/dist/mobile'
import UserMenu from './UserMenu.vue';
import { useLoginStatus } from '../header/composables/useLoginStatus';
const { isMobile } = useIsMobile()
const { isLogin } = useLoginStatus();
import { createVanModal } from '@/dist/createVanModal'



// 响应式变量
const userId = ref(null);
const userData = ref({});
const store = useStore();


const showLoginHandler = () => {
  if (isLogin.value) return;
  import('./Login.vue').then((module) => {
    createVanModal(module.default, {
      size: 350,
    })
  });
}

const showUserMenu = () => {
  if (!isMobile.value) return;
  import('./UserMenu.vue').then((module) => {
    createVanModal(module.default, {
      size: 'auto',
      height: '100%',
      radius: false,
      position: 'right',
      props: {
        userData: userData.value,
      }
    })
  })
}

// 方法
const fetchUserData = () => {
  store.fetchUserInfo().then((res) => {
    userId.value = res.id;
    userData.value = res;
  }).catch((error) => {
    console.error(error);
  })

};

// 生命周期钩子
onMounted(() => {
  fetchUserData();
});



</script>

<style scoped>
.UserMenu{
  background-color: var(--color-base-100);
}
</style>