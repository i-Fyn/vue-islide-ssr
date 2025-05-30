// useCheckIn.js
import { ref,computed } from 'vue'
import { useStore } from '@/store'
import axios from '@/dist/axios'
import { createMessage as message } from '@/dist/message'

export function useCheckIn() {
  const store = useStore()
  const isCheckIn = computed(() => store.isCheckIn)
  const consecutiveDays = ref(0)
  const locked = ref(false)

  const checkin = async () => {
    if (locked.value) return
    locked.value = true

    try {
      const res = await axios.post('/userSignin')
      store.isCheckIn = res.data.success
      consecutiveDays.value = res.data.consecutiveDays

      const value = res.data.value
      let _message = []
      if (value.credit) _message.push(`积分+${value.credit}`)
      if (value.exp) _message.push(`经验+${value.exp}`)

      message({ message: `签到成功，${_message.join('、')}`, type: 'success' })
    } catch (err) {
      message({ message: '签到失败，请稍后再试', type: 'error' })
    } finally {
      locked.value = false
    }
  }

  return {
    isCheckIn,
    consecutiveDays,
    locked,
    checkin
  }
}
