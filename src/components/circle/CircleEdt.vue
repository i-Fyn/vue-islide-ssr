<template>
    <div class="circle-editor-wrapper bg-base-100 mb-4">
        <div class="circle-editor-simple p-4 flex items-center gap-4 justify-between">
            <avatarVue :data="store.userInfo" />
            <div class="simple-text-input text-sm text-ellipsis flex-1 bg-base-200 cursor-pointer text-center text-base-content/60 p-2 rounded-4xl" @click="isOpen = !isOpen">
                记录、讨论、分享你的日常 </div>
            <div class="image">
                <i class="ri-camera-fill"></i>
            </div>
        </div>
        <CircleEditor class="circle-editor-toolbar" v-show="isOpen" />
    </div>
</template>

<script setup>
import CircleEditor from './CircleEditor.vue';
import avatarVue from '../user/avatarVue.vue';
import { useStore } from '../../store';
import { ref } from 'vue';

const store = useStore();
const isOpen = ref(false);
</script>

<style  lang="scss">
.circle-editor-toolbar{
   .content-input{
    margin: 0;
   }
   .textarea{
    min-height: fit-content;
   }
   .editor-card{
    box-shadow: none;
   }
}
</style>
