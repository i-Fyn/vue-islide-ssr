// composables/usePostSeo.js
import { useSeoMeta, useHead } from '@unhead/vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export function usePostSeo(postDetail, config, postId) {
  const route = useRoute()

  useSeoMeta({
    title: computed(() => postDetail.value?.seo?.title),
    ogType: 'article',
    ogDescription: () => postDetail.value?.seo?.description,
    ogTitle: () => postDetail.value?.seo?.title,
    ogSiteName: () => config.value.blog_name,
    ogImage: () => postDetail.value?.seo?.image,
    articleModifiedTime: () => postDetail.value?.seo?.updated_time,
    articlePublishedTime: () => postDetail.value?.seo?.published_time,
    articleAuthor: () => postDetail.value?.seo?.author,
    articleSection: () => postDetail.value?.seo?.category,
    articleTag: () => postDetail.value?.seo?.tag,
    ogUrl: () => import.meta.env.VITE_BASE_URL + route.fullPath,
    twitterCard: 'summary_large_image',
    twitterTitle: () => postDetail.value?.seo?.title,
    twitterDescription: () => postDetail.value?.seo?.description,
    twitterImage: () => postDetail.value?.seo?.image,
  })

  useHead({
    link: [
      {
        rel: 'prev',
        href: () =>
          import.meta.env.VITE_BASE_URL +
          route.fullPath.replace(postId, postDetail.value?.seo?.prevnext?.prev_post?.ID || postId),
      },
      {
        rel: 'next',
        href: () =>
          import.meta.env.VITE_BASE_URL +
          route.fullPath.replace(postId, postDetail.value?.seo?.prevnext?.next_post?.ID || postId),
      },
    ],
  })
}