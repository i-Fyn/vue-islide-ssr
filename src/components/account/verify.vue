<template>
  <div class="flex flex-col gap-4">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="flex items-center gap-4 p-4 rounded-xl shadow-sm transition-all bg-primary/10 hover:-translate-y-1 hover:">
        <div class="flex items-center justify-center w-12 h-12 rounded-xl text-2xl text-primary">
          <i class="ri-verified-badge-line"></i>
        </div>
        <div class="flex flex-col">
          <div class="text-2xl font-semibold leading-tight">{{ total }}</div>
          <div class="text-sm text-base-content/70">认证总数</div>
        </div>
      </div>
      
      <div class="flex items-center gap-4 p-4 rounded-xl shadow-sm transition-all bg-warning/10 hover:-translate-y-1 hover:">
        <div class="flex items-center justify-center w-12 h-12 rounded-xl text-2xl text-warning">
          <i class="ri-time-line"></i>
        </div>
        <div class="flex flex-col">
          <div class="text-2xl font-semibold leading-tight">{{ unprocessed }}</div>
          <div class="text-sm text-base-content/70">待审核</div>
        </div>
      </div>
    </div>

    <!-- 列表区域 -->
    <div class="card bg-base-100 ">
      <div class="card-body p-0">
        <!-- 搜索栏 -->
        <div class="p-4 border-b border-base-200 flex flex-wrap gap-4 justify-between items-center">
          <div class="join">
            <div class="join-item relative">
              <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 opacity-50 z-1"></i>
              <input type="text" v-model="search" 
                placeholder="搜索认证用户/认证名称" 
                class="input input-bordered pl-10 w-80 input-sm"
                @input="filterTable" />
            </div>
          </div>
        </div>

        <!-- 表格 -->
        <div class="scroll-x" v-if="filteredData.length">
          <table class="table table-zebra table-sm table-pin-rows">
            <thead>
              <tr>
                <th >ID</th>
                <th >认证用户</th>
                <th >认证类型</th>
                <th >认证名称</th>
                <th >认证金额</th>
                <th >认证积分</th>
                <th >是否实名</th>
                <th >认证资料</th>
                <th >认证状态</th>
                <th >审核意见</th>
                <th >日期</th>
                <th >操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in filteredData" :key="item.id" class="hover">
                <td class="w-max">{{ item.id }}</td>
                <td class="w-max whitespace-normal">
                  <a @click="router.push({ name: 'user', params: { user_id: item.user_id } })"
                    class="text-primary hover:underline cursor-pointer">
                    {{ item.name }}
                  </a>
                </td>
                <td class="w-max">{{ item.type }}</td>
                <td class="w-max whitespace-normal">{{ item.title }}</td>
                <td class="w-max">{{ item.money }}</td>
                <td class="w-max">{{ item.credit }}</td>
                <td class="w-max">
                  <div class="badge" :class="item.verified == 1 ? 'badge-success' : 'badge-ghost'">
                    {{ item.verified == 1 ? '是' : '否' }}
                  </div>
                </td>
                <td >
                  <div class="badge w-max" :class="Object.keys(item.data).length ? 'badge-info' : 'badge-ghost'">
                    {{ Object.keys(item.data).length ? '有' : '无' }}
                  </div>
                </td>
                <td>
                  <div class="badge w-max" 
                    :class="{
                      'badge-warning': item.status === '0',
                      'badge-success': item.status === '1',
                      'badge-error': item.status === '2'
                    }">
                    {{ item.status === '0' ? '待审核' : (item.status === '1' ? '审核通过' : '审核失败') }}
                  </div>
                </td>
                <td class="w-48 whitespace-normal">{{ item.opinion || '—' }}</td>
                <td class="w-max">{{ item.date }}</td>
                <td class="w-30">
                  <button class="btn btn-primary btn-sm gap-2 w-max" @click="handleClick(index)">
                    <i class="ri-edit-line"></i>
                    编辑
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 加载中 -->
        <div class="flex flex-col items-center justify-center py-16" v-else-if="loading && !isDataEmpty">
          <span class="loading loading-spinner loading-lg text-primary"></span>
          <span class="mt-4 text-base-content/60 text-sm">加载认证数据中...</span>
        </div>

        <!-- 空状态 -->
        <div class="flex flex-col items-center justify-center py-16" v-else-if="!filteredData.length && isDataEmpty">
          <van-empty image-size="10rem" description="暂无认证数据" />
          <button class="btn btn-sm btn-outline mt-4" @click="fetchData">刷新数据</button>
        </div>

        <!-- 分页 -->
        <div class="p-4 border-t border-base-200">
          <PageNav ref="jsonPageNav" :paged="paged" :pages="pages" navtype="json" type="page" 
            :api="api" :param="param" @change="change" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import PageNav from '@/components/footer/PageNav.vue'
import axios from '@/dist/axios'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
import { router } from '../../main'
import { createVanModal } from '@/dist/createVanModal'


const tableData = ref([])
const filteredData = ref([])
const loading = ref(false)
const isDataEmpty = ref(false)
const paged = ref(1)
const pages = ref(1)
const locked = ref(false)
const search = ref('')
const jsonPageNav = ref(null)

const store = useStore()
const api = ref('getVerifyList')

const param = ref({
    page_size: 10
})
const total = ref(0)
const unprocessed = ref(0)

const change = (recievedData) => {
    tableData.value = recievedData.data;
    filteredData.value = tableData.value
    pages.value = recievedData.pages;
    isDataEmpty.value = recievedData.value == ''
    loading.value = !loading.value
}

const filterTable = () => {
    const keyword = search.value.trim().toLowerCase()
    filteredData.value = tableData.value.filter(item => {
        return (
            item.name.toLowerCase().includes(keyword) ||
            item.title.toLowerCase().includes(keyword)
        )
    })
}

const handleClick = (index) => {
    import('@/components/account/verify/VerifyUpdate.vue').then(module => {
        createVanModal(module.default, {
            size: '100%',
            props: {
                data: filteredData.value[index],
                callback: (data) => {
                    jsonPageNav.value.load(1)
                }
            }
        })
    })
}


onMounted(async () => {
    await fetchData()
    getVerifyStats()
})

const getVerifyStats = () => {
    axios.get('/getVerifyStats').then(res => {
        total.value = res.data.total
        unprocessed.value = res.data.status[0]
    })
}

const fetchData = async () => {
    try {
        locked.value = true
        loading.value = true
        let res = await store.fetchApiPostData(api.value, Object.assign(param.value, { paged: paged.value }))
        change(res)
    } catch (error) {
        console.error(error)
    }
}
</script>
