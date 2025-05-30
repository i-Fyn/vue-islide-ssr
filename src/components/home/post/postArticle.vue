<template>
    <div :class="[module.post_type, 'product-container']">
        <WaterFall :items="postList" :column="isMobile ? getMobileRowCount(module.post_type) : Number(module.post_row_count)" 
            :gap="isMobile ? 10 : 20"
            :enabled="module.waterfall_show == '1' ? true : false">
            <template  #default="{ item, index }">
                <component :is="postComponent" :item="item" :module="module" />
            </template>
            <template #pagination>
                <slot name="pagination" />
            </template>
        </WaterFall>
    </div>
</template>

<script setup>
import { defineAsyncComponent, computed, ref, onMounted, onUnmounted } from 'vue';
import WaterFall from '../../other/WaterFall.vue';
import { useIsMobile } from '../../../dist/mobile';
const { isMobile } = useIsMobile();

const props = defineProps({
    postList: Array,
    module: Object,
    animationEnabled: {
        type: Boolean,
        default: true
    }
});


const asyncComponents = {
  'post-1': defineAsyncComponent(() => import('./post_1.vue')),
  'post-2': defineAsyncComponent(() => import('./post_2.vue')),
  'post-3': defineAsyncComponent(() => import('./post_3.vue')),
  'post-5': defineAsyncComponent(() => import('./post_5.vue')),
  'post-6': defineAsyncComponent(() => import('./post_6.vue')),
}

const postComponent = computed(() => {
  return asyncComponents[props.module.post_type] || null
})

const getMobileRowCount = (type) => {
  switch (type) {
    case 'post-1':
      return 1;
    case 'post-2':
      return 1;
    case 'post-3':
      return 2;
    case 'post-5':
      return 2;
    default:
      return 1;
  }
}
</script>

<style scoped>
.product-container {
  width: 100%;
  margin: 0 auto;
  transition: opacity 0.5s ease;
}

.product-item-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.animated-grid.post-5 .product-item-wrapper {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* 优化移动端显示 */
@media (max-width: 768px) {
  .animated-grid.post-5 {
    grid-gap: 12px !important;
  }
}
</style>