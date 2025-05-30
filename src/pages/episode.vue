<template>
  <div v-if="loaded && postDetail" class="single-page">
    <component :is="getPostHeaderComp" :postDetail="postDetail" />
    <component :is="getPostComp" :postDetail="postDetail" />
  </div>
  <div v-if="skeleton" class="single-page  z-10000 fixed inset-0 bg-base-100">
    <EpisodeHeaderSkeleton />
    <EpisodeSkeleton />
  </div>
</template>

<script setup>
import { onMounted, watch, onServerPrefetch, computed } from 'vue'
import { useStore } from '@/store'
import { usePostPage } from './composables/usePostPage'
import { usePostSeo } from './composables/usePostSeo'
import EpisodeHeaderSkeleton from '../components/single/container/header/EpisodeHeaderSkeleton.vue'
import EpisodeSkeleton from '../components/single/container/article/EpisodeSkeleton.vue'
const props = defineProps({
  postId: String,
})

const propsCopy = {
  ...props,
  postType: 'episode',
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