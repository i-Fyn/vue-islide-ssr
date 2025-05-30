<template>
    <div class="flex flex-col gap-4">
        <div v-if="tasks" class="flex flex-col gap-6">
            <!-- 任务分组 -->
            <div v-for="(task, index) in tasks" :key="index" class="card bg-base-100 ">
                <div class="card-body">
                    <!-- 任务组标题 -->
                    <div class="flex justify-between items-center flex-wrap gap-4 mb-4">
                        <div class="flex items-center gap-2">
                            <i :class="[getTaskGroupIcon(index), 'text-lg text-primary']"></i>
                            <h3 class="text-base font-semibold m-0">
                                <span v-if="index == 'newbie_task'">初次见面</span>
                                <span v-else-if="index == 'daily_task'">每日任务</span>
                                <span v-else>推荐任务</span>
                            </h3>
                            
                            <span v-if="index == 'daily_task'" class="badge badge-sm badge-ghost text-xs">每日可重复</span>
                        </div>
                        
                        <div>
                            <div class="flex flex-col gap-1 min-w-[150px]">
                                <div class="text-xs text-base-content/60 text-right">
                                    完成 {{ getCompletedTaskCount(task) }}/{{ task.length }}
                                </div>
                                <div class="w-full bg-base-200 rounded-full h-2 overflow-hidden">
                                    <div class="bg-primary h-full rounded-full" :style="`width: ${getCompletedTaskPercentage(task)}%`"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 任务卡片网格 -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div v-for="(item, i) in task" :key="i" class="bg-base-200/30 rounded-xl border border-base-200 hover: transition-shadow duration-300">
                            <div class="p-4 flex justify-between gap-4">
                                <!-- 任务信息 -->
                                <div class="flex-1 min-w-0">
                                    <h4 class="text-sm font-medium mb-2">{{ item.name }}</h4>
                                    
                                    <div class="flex flex-wrap gap-3">
                                        <div v-for="prize in item.task_bonus" :key="prize.key"
                                            class="flex items-center gap-1 text-xs font-medium" 
                                            :class="{
                                                'text-primary': prize.key === 'credit',
                                                'text-success': prize.key === 'exp',
                                                'text-warning': prize.key !== 'credit' && prize.key !== 'exp'
                                            }">
                                            <div class="w-4 h-4 flex items-center justify-center">
                                                <img :src="getRewardIcon(prize.key)" alt="奖励" class="w-full h-full object-contain" />
                                            </div>
                                            <span>+{{ prize.value }}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- 任务状态 -->
                                <div class="flex flex-col items-end justify-center min-w-[70px]">
                                    <template v-if="parseInt(item.completed_count) >= parseInt(item.task_count) || item.is_completed">
                                        <div class="flex flex-col items-center text-success">
                                            <i class="ri-checkbox-circle-fill text-xl mb-1"></i>
                                            <span class="text-xs">已完成</span>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="flex flex-col items-end gap-2">
                                            <div class="flex items-baseline text-primary font-semibold">
                                                <span class="text-base">{{ item.completed_count }}</span>
                                                <span class="mx-0.5 text-xs text-base-content/60">/</span>
                                                <span class="text-xs text-base-content/60">{{ item.task_count }}</span>
                                            </div>
                                            <div class="w-[60px] h-1 bg-base-200 rounded-full overflow-hidden">
                                                <div class="h-full bg-primary rounded-full" 
                                                    :style="`width:${Math.min((item.completed_count / item.task_count).toFixed(4) * 100, 100)}%`">
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                            
                            <!-- 任务操作按钮 -->
                            <div v-if="!(parseInt(item.completed_count) >= parseInt(item.task_count) || item.is_completed)" 
                                class="px-4 py-3 border-t border-base-200 flex justify-end">
                                <button class="btn btn-sm btn-primary btn-outline gap-1">
                                    <span>去完成</span>
                                    <i class="ri-arrow-right-line"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 加载状态 -->
        <div v-else-if="loading && !isDataEmpty" class="flex flex-col items-center justify-center py-16">
            <span class="loading loading-spinner loading-lg text-primary"></span>
            <span class="mt-4 text-base-content/60 text-sm">加载任务中...</span>
        </div>
        
        <!-- 空状态 -->
        <div v-else-if="!tasks && isDataEmpty" class="flex flex-col items-center justify-center py-16">
            <van-empty image-size="10rem" description="暂无任务" />
            <button class="btn btn-sm btn-outline mt-4" @click="getTaskData">刷新</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onServerPrefetch, computed } from 'vue'
import { useStore } from '../../store';
import axios from '@/dist/axios'

const store = useStore()
const tasks = ref('');
const loading = ref(true);
const isDataEmpty = ref(false);

// 获取任务组图标
const getTaskGroupIcon = (groupType) => {
    switch(groupType) {
        case 'newbie_task': return 'ri-award-line';
        case 'daily_task': return 'ri-calendar-check-line';
        default: return 'ri-list-check-2';
    }
};

// 获取奖励图标
const getRewardIcon = (rewardType) => {
    switch(rewardType) {
        case 'credit': 
            return 'https://qhstaticssl.kujiale.com/newt/102315/image/png/1625220425721/680E417FFC36BAEF1F3CC7A4D3817A2F.png';
        case 'exp': 
            return 'https://qhstaticssl.kujiale.com/newt/102315/image/png/1625220425623/B48597D88FC9BA3032CAB4C3CF688E2E.png';
        default:
            return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwLjMzMjUgNDQuNjQ5QzIyLjQyMDUgNDYuNDUwMyAyNS41Nzk0IDQ2LjQ1MDMgMjcuNjY3NSA0NC42NDlMNDYuMTY3MiAyOC42ODk3QzQ3Ljg2MjcgMjcuMjI3IDQ4LjQ0OTEgMjQuOTA4OCA0Ny42NDI1IDIyLjg1NzdMNDAuNzg1NCA1LjQyMjcxQzM5Ljk3NTIgMy4zNjI1IDM3LjkyNzkgMiAzNS42NDI2IDJIMTIuMzU3NEMxMC4wNzIxIDIgOC4wMjQ4NCAzLjM2MjUgNy4yMTQ1NyA1LjQyMjcxTDAuMzU3NTM5IDIyLjg1NzdDLTAuNDQ5MTIzIDI0LjkwODggMC4xMzcyOTggMjcuMjI3IDEuODMyODEgMjguNjg5N0wyMC4zMzI1IDQ0LjY0OVoiIGZpbGw9IiMzQjMwOEQiLz4KPHBhdGggZD0iTTMzIDIxLjI5MjZDMzMgMjAuNzM5IDMyLjYyNjkgMjAuMjU0MiAzMi4wOTE1IDIwLjExMzNMMTUgMTUuNjE0N1YyMi4xNTQ3QzE1IDIyLjcwODMgMTUuMzczMSAyMy4xOTI0IDE1LjkwODUgMjMuMzMzM0wzMyAyNy44MzE5QzMzIDI1LjIzOTQgMzMgMjMuNjU3OCAzMyAyMS4yOTI2WiIgZmlsbD0iI0RDQTA0NCIvPgo8cGF0aCBkPSJNMjUuNTE5NyA3LjE2NDE3QzI1LjkwNDUgNi45NDUyOCAyNi4zNzkyIDYuOTQ1MjggMjYuNzY0MSA3LjE2NDE3TDMyLjc2MTkgMTAuNTc1OEMzMy4wNzk0IDEwLjc1NjQgMzMuMDc5NCAxMS4yMDY0IDMyLjc2MTkgMTEuMzg3TDE1LjY2NjcgMjEuMTEwOUMxNS4zMDAxIDIxLjMxOTQgMTUuMDU4NyAyMS42ODQxIDE1LjAwOTQgMjIuMDkxMkMxNS4wMDM0IDIyLjA0NCAxNS4wMDAzIDIxLjk5NjEgMTUgMjEuOTQ3NlYxMy44NTAzQzE1IDEzLjQxNTUgMTUuMjM1OSAxMy4wMTM3IDE1LjYxOSAxMi43OTU3TDI1LjUxOTcgNy4xNjQxN1oiIGZpbGw9IiNGRkQxOTUiLz4KPHBhdGggZD0iTTIyLjQ4MDkgMzUuODM1NEMyMi4wOTI3IDM2LjA1NDkgMjEuNjE0MyAzNi4wNTQ5IDIxLjIyNjEgMzUuODM1NEwxNS4yNDEzIDMyLjQ1MjZDMTQuOTE5NiAzMi4yNzA3IDE0LjkxOTYgMzEuODE2MSAxNS4yNDEzIDMxLjYzNDJMMzIuMzI0MyAyMS45NzgyQzMyLjY5MjUgMjEuNzcwMSAzMi45MzYyIDIxLjQwNjYgMzIuOTg5MSAyMUMzMi45OTYzIDIxLjA1MzEgMzMgMjEuMTA3MSAzMyAyMS4xNjE3VjI5LjE4MDNDMzMgMjkuNjE5MiAzMi43NjA4IDMwLjAyNDggMzIuMzcyNiAzMC4yNDQzTDIyLjQ4MDkgMzUuODM1NFoiIGZpbGw9IiNGRkQxOTUiLz48L3N2Zz4=';
    }
};

// 获取已完成任务数量
const getCompletedTaskCount = (taskGroup) => {
    return taskGroup.filter(task => 
        parseInt(task.completed_count) >= parseInt(task.task_count) || task.is_completed
    ).length;
};

// 获取任务完成百分比
const getCompletedTaskPercentage = (taskGroup) => {
    const completedCount = getCompletedTaskCount(taskGroup);
    const totalCount = taskGroup.length;
    return totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
};

const getTaskData = async () => {
    loading.value = true;
    try {
        let res = await axios.post('/getTaskData')
        tasks.value = res.data
        isDataEmpty.value = !tasks.value || Object.keys(tasks.value).length === 0;
    } catch (error) {
        console.error('获取任务数据失败:', error);
        isDataEmpty.value = true;
    } finally {
        loading.value = false;
    }
}

onMounted(async () => {
    await getTaskData()
})

onServerPrefetch(async () => {
    await getTaskData()
})
</script>