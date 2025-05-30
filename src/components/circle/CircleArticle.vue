<template>
    <WaterFall :items="momentLists" :column="isMobile ? mobileColumn : Number(selectTabs.list_grid_column)"
        ref="waterFallRef"
        :gap="isMobile ? 10 : 20" :enabled="isWaterFall">
        <template #default="{ item, index }">
                <moment_2 :item="item" :index="index" :selectTabs="selectTabs" v-if="selectTabs.type == 'card' && selectTabs.style == 'grid' " />
                <moment_3 :item="item" :index="index" :selectTabs="selectTabs" v-if="selectTabs.type == 'question'" />
                <moment_4 :item="item" :index="index" :selectTabs="selectTabs" v-if="selectTabs.type == 'card' && selectTabs.style == 'list' " />
        </template>
        <template #pagination>
            <slot name="pagination" />
        </template>
    </WaterFall>
</template>


<script setup>
import WaterFall from '../other/WaterFall.vue'
import moment_2 from './post/moment_2.vue'
import moment_3 from './post/moment_3.vue'
import moment_4 from './post/moment_4.vue'
import { useIsMobile } from '../../dist/mobile'
import { computed, watch, ref } from 'vue'

defineOptions({
    name: 'CircleArticle'
})

const props = defineProps({
    momentLists: {
        type: Array,
        default: () => []
    },
    selectTabs: {
        type: Object,
        default: () => { }
    }
})

const { isMobile } = useIsMobile()
const waterFallRef = ref(null)

const mobileColumn = computed(() => {
    return props.selectTabs.type == 'question' ? 1 : props.selectTabs.style == 'grid' ? 2 : 1
})

const isWaterFall = computed(() => {
    return props.selectTabs.waterFall == '1'
})

watch(() => props.selectTabs, (newVal, oldVal) => {
   if(waterFallRef.value){
    waterFallRef.value.onResize();
   }
}, { deep: true, immediate: true });

</script>
