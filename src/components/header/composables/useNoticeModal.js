import { ref } from 'vue'
import { useStore } from '@/store'
import { createVanModal } from '@/dist/createVanModal'
import { islideGetCookie } from '@/dist/theme'

export function useNoticeModal() {
  const store = useStore()
  const noticeList = ref([])
  const currentNoticeIndex = ref(0)

  const getNewNoticeList = async () => {
    const res = await store.fetchNoticeList();
    if(res && res.length)
    noticeList.value = res
    setTimeout(() => {
      showNextNotice()
    }, 3000)
  }

  const showNextNotice = () => {
    let readNotices = decodeURIComponent(islideGetCookie('read_notices'))
    if (!readNotices || readNotices === '[]' || readNotices === 'null') {
      readNotices = '{}'
    }
    readNotices = JSON.parse(readNotices)

    while (currentNoticeIndex.value < noticeList.value.length) {
      const currentNotice = noticeList.value[currentNoticeIndex.value]
      if (currentNotice.show && !readNotices[currentNotice.id]) {
        import('@/components/notice/notice.vue').then(module => {
          createVanModal(module.default, {
            size: 400,
            props:{
              data: currentNotice,
              close: () => {
                currentNoticeIndex.value++
                setTimeout(() => {
                  showNextNotice()
                }, 1000)
            }
          }
        })
        })
        break
      } else {
        currentNoticeIndex.value++
      }
    }
  }

  return {
    noticeList,
    currentNoticeIndex,
    getNewNoticeList,
    showNextNotice
  }
}
