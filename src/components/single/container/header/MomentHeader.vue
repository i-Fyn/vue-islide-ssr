<template>
    <div class="article-header hidden lg:block ">
        <div class="post-meta mb-6 border-b-1 border-solid border-base-300">
            <div class="post-user-info flex flex-row justify-between  py-4 bg-base-100">
                <div class="left flex flex-row gap-4">
                    <avatarVue :data="postDetail.author" :size="40" ></avatarVue>
                    <div class="user-info flex flex-col justify-around">
                        <nameVue :data="postDetail.author" class="text-sm"></nameVue>
                        <div class="post-meta-row flex-row content-center text-xs text-base-content/60 flex gap-2">
                            <span class="post-date">
                                <div v-html="postDetail.date"></div>
                            </span>
                            <span> · </span>
                            <span class="post-views">浏览{{ postDetail.meta.views }}</span>
                            <span v-if="postDetail.author.id == store.userInfo?.id"> ·</span>
                            <span v-if="postDetail.author.id == store.userInfo?.id"
                                class="post-edit"><a :href="`/moments?id=${postDetail.id}`">编辑</a></span>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <button class="btn btn-soft btn-primary follow rounded-4xl btn-sm" @click="onFollow()" v-if="!is_follow"> <i
                            class="ri-heart-add-line"></i><span>关注</span></button>
                    <button class="btn btn-soft btn-primary follow rounded-4xl btn-sm" @click="onFollow()" v-else v-cloak><i
                            class="ri-heart-fill"></i><span>已关注</span></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref,  computed,onMounted } from 'vue'
import { useStore } from '@/store';
const store = useStore();
import { createMessage as message } from '@/dist/message';
import { useRouter } from 'vue-router';
import nameVue from '../../../user/nameVue.vue';
import avatarVue from '../../../user/avatarVue.vue';
import axios from '@/dist/axios';
import { useFollowStore } from '@/store/follow'
const followStore = useFollowStore()
import {useLoginStatus}   from '@/components/header/composables/useLoginStatus.js'
const { isLogin,checkIsLogin } = useLoginStatus()

const props = defineProps({
    postDetail: {
        type: Object,
        required: true
    },
})
const locked = ref(false)

const user_id = ref(props.postDetail.author.id)
const is_follow = computed(() => followStore.isFollowed(user_id.value) )

const onFollow = () => {
  if (!isLogin.value) return checkIsLogin()
  if (locked.value || props.postDetail.is_self) return

  locked.value = true
  axios.post('/userFollow', 'user_id=' + user_id.value)
    .then(res => {
      followStore.setFollowStatus(user_id.value, res.data)
      locked.value = false
    }).catch(err => {
      message({ message: err.response.data.message, type: 'error' })
      locked.value = false
    })
}

onMounted(() => {
    followStore.setFollowStatus(user_id.value, props.postDetail.author.followers.is_follow)
})

</script>
