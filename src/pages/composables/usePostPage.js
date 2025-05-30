// composables/usePostPage.js
import { ref, computed, defineAsyncComponent } from 'vue'
import { useStore } from '@/store'
import { updateRootColor } from '@/dist/theme'
import { useIsMobile } from '../../dist/mobile'
import { useRouter } from 'vue-router'

export function usePostPage(props) {
  const skeleton = ref(true)
  const store = useStore()
  const postDetail = ref(null)
  const loaded = ref(false)
  const { isMobile } = useIsMobile()
  const router = useRouter()

  const getPostDetail = async () => {
    try {
      loaded.value = false
      const res = await store.fetchArticle(props.postId)


      if (res.thumb && ['post'].includes(res.type)) {
        if (typeof window !== 'undefined') {
          updateRootColor(res.thumb.color)
        }
      }

      postDetail.value = res
      store.center_title = res.title
      console.log('postDetail', postDetail.value)
      skeleton.value = false;

    } catch (e) { } finally {
      loaded.value = true
    }
  }

  const getPostComp = computed(() => {
    const map = {
      post: () => import('@/components/single/SinglePost.vue'),
      video: () => import('@/components/single/SingleVideo.vue'),
      shop: () => import('@/components/single/SingleShop.vue'),
      episode: () => import('@/components/single/SingleEpisode.vue'),
    }
    return defineAsyncComponent(map[props.postType])
  })

  const getPostHeaderComp = computed(() => {
    const map = {
      shop: () => import('@/components/single/container/header/ShopHeader.vue'),
      episode: () => import('@/components/single/container/header/EpisodeHeader.vue'),
    }
    return defineAsyncComponent(map[props.postType])
  })


  const scrollTo = (id) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  const go = (path) => {
    router.push(path);
  };

  return {
    postDetail,
    loaded,
    getPostDetail,
    getPostComp,
    getPostHeaderComp,
    skeleton,
    scrollTo,
    go
  }
}