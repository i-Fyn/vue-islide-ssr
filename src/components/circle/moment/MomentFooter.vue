<template>
    <div class="moment-footer flex justify-between  flex-row  mt-4">
        <MomentCat :item="item" />
        <div class="moment-actions flex items-center justify-center text-sm flex-col lg:flex-row gap-4">
        <div class="moment-tip w-full text-right whitespace-nowrap" v-if="!item['visible']">
            <p class="text-sm"><van-icon name="info-o" style="margin-right: 3px;" />该动态已被隐藏，如需查看请加入圈子</p>
        </div>
        <div class="publish-info w-full text-right leading-7">
            编辑于 {{ item.date }} {{ item.ip !== '未知' ? item.ip : '' }}
        </div>
    </div>
    </div>
</template>

<script setup>
import MomentCat from './MomentCat.vue';
defineProps({
    item: {
        type: Object,
        required: true
    }
})

</script>