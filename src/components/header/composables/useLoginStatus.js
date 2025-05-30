// useLoginStatus.js
import { ref,watch } from 'vue'
import {createVanModal} from '@/dist/createVanModal';
import { useStore } from '@/store';

export function useLoginStatus() {
  const store = useStore()
  const isLogin = ref(store.token ? true : false) ;

  watch(()=> store.token, () => {
    isLogin.value = store.token ? true : false;
  })

  const checkIsLogin = () => {
    isLogin.value = store.token ? true : false;
    if(!isLogin.value){
      import('@/components/login/Login.vue').then((module) => {
        createVanModal(module.default,{
         size: 350,
        })
     });
    }
  }


  return {
    isLogin,
    checkIsLogin
  }
}
