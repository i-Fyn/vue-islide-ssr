<template>
  <div class="flex justify-center my-4">
    <!-- 分页按钮 -->
    <div class="join shadow-sm" v-if="type === 'page' && pageCount > 1">
      <button class="join-item btn btn-sm hover:opacity-90 transition-all" 
        :class="[currentPage <= 1 ? 'btn-disabled opacity-50' : 'btn-primary']"
        :disabled="currentPage <= 1"
        @click="load(currentPage - 1, 'next')">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button v-for="page in pagers" 
        :key="page"
        class="join-item btn btn-sm btn-square transition-all"
        :class="{
          'btn-primary': currentPage === page,
          'btn-disabled opacity-50': isDisabled(page) || page === 0,
          'hover:bg-base-200': currentPage !== page && page !== 0
        }"
        :disabled="isDisabled(page) || page === 0 || currentPage === page"
        @click="load(page)">
        <span :class="{'font-bold': currentPage === page}">{{ page !== 0 ? page : '•••' }}</span>
      </button>

      <button class="join-item btn btn-sm hover:opacity-90 transition-all"
        :class="[currentPage >= pageCount ? 'btn-disabled opacity-50' : 'btn-primary']"
        :disabled="currentPage >= pageCount" 
        @click="load(currentPage + 1, 'per')">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- 加载更多 -->
    <div class="flex flex-col items-center gap-2 w-full max-w-xs" ref="loadMoreTrigger" v-else>
      <div v-if="loading && currentPage > 1" class="flex items-center gap-2">
        <div class="loading loading-spinner loading-xs text-primary"></div>
        <span class="text-sm text-base-content/70">正在加载...</span>
      </div>
      <div v-else-if="noMore" class="text-base-content/60 py-2 text-sm">- 没有更多内容了 -</div>
      <button v-else-if="currentPage < pageCount && pageCount >= 1"
        class="btn btn-ghost btn-primary btn-sm w-full max-w-40 transition-all "
        @click="load(currentPage + 1, 'per')">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
        </svg>
        加载更多
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import axios from '@/dist/axios'; // 替换为您的 HTTP 请求工具
const loadMoreTrigger = ref(null);
let observer = null;
const ready = ref(false)

const emit = defineEmits(['change','loading']);
const props = defineProps({
  paged: {
    type: Number,
    required: true,
  },
  pages: {
    type: Number,
    required: true,
  },
  navtype: {
    type: String,
    default: 'json',
  },
  type: {
    type: String,
    default: 'page',
  },
  selector: {
    type: String,
    default: '',
  },
  param: {
    type: Object,
    default: () => ({}),
  },
  api: {
    type: String,
    required: true,
  },
});
const locked = ref(false);
const currentPage = ref(props.paged);
const pageCount = ref(props.pages);



const errorRes = ref({
  data: [],
  pages: 0,
  pages: 0,
})

const pagers = computed(() => {
  const pagerCount = 7; // 页码按钮的数量
  const array = [];

  if (pageCount.value > pagerCount) {
    if (currentPage.value < 5) {
      for (let i = 1; i <= pageCount.value; i++) {
        if (i >= 6) break;
        array.push(i);
      }
      array.push(0, pageCount.value);
    } else if (currentPage.value >= 5 && pageCount.value - 3 > currentPage.value) {
      array.push(1, 0);
      for (let i = currentPage.value - 2; i <= currentPage.value + 2; i++) {
        array.push(i);
      }
      array.push(0, pageCount.value);
    } else if (pageCount.value - 3 <= currentPage.value) {
      array.push(1, 0);
      for (let i = currentPage.value - 3; i <= pageCount.value; i++) {
        array.push(i);
      }
    }
  } else {
    for (let i = 1; i <= pageCount.value; i++) {
      array.push(i);
    }
  }
  return array;
});

const noMore = computed(() => (currentPage.value >= pageCount.value) && pageCount.value > 0 );
const loading = computed(() => locked.value);

const isDisabled = (page) => page === currentPage.value && locked.value;

const load = (page, action = true) => {
  if (locked.value || page === 0 || (currentPage.value === page && !action)) return;
  locked.value = true;
  if (props.type === 'auto' && currentPage.value >= pageCount.value && page !== 1) return;

  currentPage.value = page;
  props.param.paged = page;
  emit && emit('loading');
  axios.post(props.api, props.param).then((res) => {
    console.log(res.data);
    emit('change', res.data)
    locked.value = false;
    pageCount.value = res.data.pages;
  }).catch((err) => {
    locked.value = false;
    errorRes.value.error = err.response?.data?.message || err.message;
    emit('change', errorRes.value);
  }).finally(() => {
  });
};

onMounted(() => {
  if (props.type === 'auto') {
    observer = new IntersectionObserver(([entry]) => {
      if (ready.value && entry.isIntersecting && !locked.value && currentPage.value < pageCount.value) {
        load(currentPage.value + 1);
      }
    }, {
      rootMargin: '0px 0px 100px 0px', // 提前触发
      threshold: 0.1
    });

    nextTick(() => {
      if (loadMoreTrigger.value) {
        observer.observe(loadMoreTrigger.value);
        setTimeout(() => {
          ready.value = true;
        }, 1500);
      }
    });
  }
});

onUnmounted(() => {
  if (observer && loadMoreTrigger.value) {
    observer.unobserve(loadMoreTrigger.value);
  }
});

watch(
  () => props.paged,
  (newPaged) => {
    currentPage.value = newPaged;
  }
);

watch(
  () => props.pages,
  (newPages) => {
    pageCount.value = newPages;
  }
);

defineExpose({
  load
  });
</script>