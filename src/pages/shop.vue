<template>
    <div v-if="loaded && postDetail" class="single-page">
        <component :is="getPostHeaderComp" :postDetail="postDetail" />
        <component :is="getPostComp" :postDetail="postDetail" />
    </div>
    <div v-if="skeleton" class="single-page z-10000 fixed inset-0 bg-base-100 pt-18">
        <ShopHeaderSkeleton />
        <ShopSkeleton />
    </div>
</template>
  
  <script setup>
  import { onMounted, watch, onServerPrefetch, computed } from 'vue'
  import { useStore } from '@/store'
  import { usePostPage } from './composables/usePostPage'
  import { usePostSeo } from './composables/usePostSeo'
  import ShopHeaderSkeleton from '../components/single/container/header/ShopHeaderSkeleton.vue'
  import ShopSkeleton from '../components/single/container/article/ShopSkeleton.vue'
  const props = defineProps({
    postId: String,
  })

  const propsCopy = {
    ...props,
    postType: 'shop',
  }
  
  
  const store = useStore()
  const config = computed(() => store.config)
  
  const { postDetail, loaded, getPostDetail, getPostComp, getPostHeaderComp,skeleton } = usePostPage(propsCopy)
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