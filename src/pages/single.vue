<template>
    <div v-if="loaded && postDetail" class="single-page ">
      <component :is="getPostHeaderComp" :postDetail="postDetail" />
      <component :is="getPostComp" :postDetail="postDetail" />
    </div>
  </template>
  
  <script setup>
  import { onMounted, watch, onServerPrefetch, computed } from 'vue'
  import { useStore } from '@/store'
  import { usePostPage } from './composables/usePostPage'
  import { usePostSeo } from './composables/usePostSeo'
  
  const props = defineProps({
    postId: String,
    postType: String,
  })
  
  const store = useStore()
  const config = computed(() => store.config)
  
  const { postDetail, loaded, getPostDetail, getPostComp, getPostHeaderComp } = usePostPage(props)
  usePostSeo(postDetail, config, props.postId)
  
  onMounted(async () => {
    await getPostDetail()
  })
  
  onServerPrefetch(() => getPostDetail())
  
  watch(() => props.postId, async () => {
    loaded.value = false
    await getPostDetail()
  })
  </script>