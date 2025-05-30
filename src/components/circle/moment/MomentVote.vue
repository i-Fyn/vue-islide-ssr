<template>
    <div class="w-full py-4 lg:py-6">
        <div class="bg-base-200/70 rounded-lg border border-base-200 flex flex-col gap-3 p-4 lg:p-6">
            <div class="vote-header flex items-center gap-2">
                <span class="inline-flex justify-center items-center w-[18px] h-[18px] text-sm border border-primary text-primary rounded-md">
                    <i class="ri-list-radio"></i>
                </span>
                <span class="text-base">{{ item.title }}</span>
            </div>
            <div class="vote-content">
                <ul class="flex flex-col gap-3">
                    <li v-for="(option, index) in item.options"
                        :key="index" 
                        @click="submit_moment_vote(index)"
                        class="relative overflow-hidden px-4 py-2 border rounded-4xl cursor-pointer transition-colors"
                        :class="{ 
                            'bg-primary text-primary-content border-primary': option.is_voted, 
                            'bg-base-100 border-base-200 hover:border-primary': !option.is_voted 
                        }">
                        <div class="relative z-10 flex justify-between items-center">
                            <div class="text-sm">{{ option.text }}</div>
                            <div class="text-sm">{{ option.percentage }}%</div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="vote-footer flex justify-between items-center">
                <span class="text-sm text-base-content/60">
                    {{ item.total_votes }}人参与，{{ item.is_ended ? '已结束' : '截止' + item.end_time }}
                </span>
            </div>
        </div>
    </div>
</template>


<script setup>
import axios from '@/dist/axios';
import { useRoute } from 'vue-router';
import { createMessage as message } from '@/dist/message';
import { ref } from 'vue';

const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    }
})
const route = useRoute();
const item = ref(props.item);



const submit_moment_vote = (index) => {
    if (item.value.has_voted) return message({ message: '您已投过票', type: 'warning' })
    axios.post('/submit_moment_vote', {
        post_id: route.params.postId,
        option_index: index
    }).then(res => {
        message({ message: '投票成功', type: 'success' })
        item.value = res.data.data
    }).catch(err => {

    })
}

</script>
