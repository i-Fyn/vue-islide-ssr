import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/dist/axios'

export const useCircleStore = defineStore('circle', () => {
  const momentLists = ref([])
  const pages = ref(1)
  const paged = ref(1)
  const param = ref({ "size": 10, "circle_id": 0, "index": 0, "orderby": "date" })

  const getMomentList = async () => {
    try {
      const res = await axios.post('/getMomentList', Object.assign(param.value, { "paged": paged.value }))
      return res.data
    } catch (error) {
      console.error(error)
      return null
    }
  }

  const updateParams = (newParams) => {
    param.value = { ...param.value, ...newParams }
  }

  const clearData = () => {
    momentLists.value = []
    pages.value = 1
    paged.value = 1
  }

  const updateMomentLists = (data, isFirstPage = false) => {
    if (isFirstPage) {
      momentLists.value = data
    } else {
      momentLists.value.push(...data)
    }
  }

  const updatePages = (newPages) => {
    pages.value = newPages
  }

  return {
    momentLists,
    pages,
    paged,
    param,
    getMomentList,
    updateParams,
    clearData,
    updateMomentLists,
    updatePages
  }
}) 