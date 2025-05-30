// useArticleSections.js
import { defineAsyncComponent } from 'vue'

export function useArticleSections(postDetail, config) {
  const ArticleHide = defineAsyncComponent(() =>
    postDetail?.content?.content_hide
      ? import('@/components/single/container/article/ArticleHide.vue')
      : Promise.resolve({ render: () => null })
  )

  const ArticleDownload = defineAsyncComponent(() =>
    !postDetail?.download || postDetail.download == '0'
      ? Promise.resolve({ render: () => null })
      : import('@/components/single/container/article/ArticleDownload.vue')
  )

  const SecondarySingle = defineAsyncComponent(() =>
    config?.single_sidebar_open === '1'
      ? import('@/components/secondary/SecondarySingle.vue')
      : Promise.resolve({ render: () => null })
  )

  return {
    ArticleHide,
    ArticleDownload,
    SecondarySingle
  }
}