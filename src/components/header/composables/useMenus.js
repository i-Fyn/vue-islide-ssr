// useMenus.js
import { ref,computed } from 'vue'
import { useStore } from '@/store'

export function useMenus() {
  const store = useStore()
  const headerMenus = ref([])
  const centerTitle = ref('')

  const fetchMenus = async () => {
    const res = await store.fetchMenus()
    headerMenus.value = res
    centerTitle.value = res['center_title'] || ''
  }

  const channelMenus = computed(() => {
    return store.config?.menu?.['channel-menu'] || []
  })

  const topMenus = computed(() => {
    return store.config?.menu?.['top-menu'] || []
  })

  return {
    headerMenus,
    centerTitle,
    channelMenus,
    topMenus,
    fetchMenus
  }
}
