<template>
    <div class="flex flex-col gap-4">
        <!-- 用户等级信息区域 -->
        <div class="flex flex-col lg:flex-row gap-4">
            <!-- 用户等级卡片 -->
            <div class="card bg-base-100  flex-1">
                <div class="card-body p-4 relative">
                    <div class="flex items-center gap-2 mb-4">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10">
                            <i class="ri-vip-crown-line text-primary"></i>
                        </div>
                        <h2 class="card-title text-base m-0">{{ lv.name }}</h2>
                    </div>
                    
                    <div class="level-exp w-full">
                        <div class="level-exp-progress mb-4">
                            <div class="flex items-center justify-between mb-2">
                                <div class="level-icon">
                                    <img :src="lv.icon" class="h-5 w-auto" />
                                </div>
                                <span class="text-sm font-medium text-primary">Lv. {{ lv.lv }}</span>
                            </div>
                            <div class="level-exp-progress-bar w-full h-2 rounded-full bg-base-200 overflow-hidden">
                                <div class="h-full bg-gradient-to-r from-primary/60 to-primary transition-all duration-300" 
                                     :style="'width:' + lv.exp_ratio + '%'"></div>
                            </div>
                        </div>
                        
                        <div class="level-exp-info flex justify-between text-sm text-base-content/70">
                            <span class="font-mono">{{ lv.exp }} / {{ lv.next_lv_exp }}</span>
                            <span class="exp-need">升级还需 <span class="font-medium text-primary">{{ lv.exp >= lv.next_lv_exp ? 0 : lv.next_lv_exp - lv.exp }}</span> 经验</span>
                        </div>
                    </div>
                    
                    <div class="level-mark absolute right-4 top-4 w-16 h-16 opacity-70">
                        <img :src="'https://img-static.mihoyo.com/levelMark/levelMark' + (parseInt(lv.lv) + 1) + '.png'"
                             class="w-auto h-full" />
                    </div>
                </div>
            </div>

            <!-- 等级进度条 -->
            <div class="card bg-base-100  lg:w-2/5">
                <div class="card-body p-4">
                    <div class="flex items-center gap-2 mb-4">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center bg-success/10">
                            <i class="ri-bar-chart-grouped-line text-success"></i>
                        </div>
                        <h2 class="card-title text-base m-0">等级进度</h2>
                    </div>
                    
                    <div class="levels-container flex items-end h-24 w-full scroll-x pb-2 scrollbar-hide" v-if="lv_data.length">
                        <div v-for="(item, index) in lv_data" 
                             :key="index"
                             class="level-item flex flex-col items-center justify-end mx-1 min-w-12"
                             :class="{'border border-primary/20 rounded-lg px-2': index == lv.lv}">
                            <div class="level-exp text-xs text-base-content/70 mb-1">{{ item.exp }}</div>
                            <div class="rounded-full transition-all duration-300" 
                                 :class="index <= lv.lv ? 'bg-primary' : 'bg-base-200'"
                                 :style="'height:' + 75 * ((index + 1) / lv_data.length) + 'px; width: 4px;'"></div>
                            <div class="level-icon mt-1">
                                <img :src="item.image" class="h-4 w-auto" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 内容区域 -->
        <div class="card bg-base-100 ">
            <div class="card-body p-0">
                <!-- 标签页 -->
                <div class="p-4 border-b border-base-200">
                    <div class="scroll-x">
                        <div class="tabs tabs-boxed bg-base-200/50 p-1">
                            <a v-for="(item, index) in tabs" 
                                :key="index"
                                :class="['tab', index == activeIndex ? 'tab-active' : '']"
                                @click="changeTab(index)">
                                <i :class="getTabIcon(index)" class="mr-2"></i>
                                {{ item.name }}
                            </a>
                        </div>
                    </div>
                </div>

                <div class="p-4">
                    <div v-if="loading && !isDataEmpty" class="flex flex-col items-center justify-center py-12 text-center">
                        <span class="loading loading-spinner loading-lg text-primary"></span>
                        <span class="mt-4 text-sm text-base-content/60">加载中...</span>
                    </div>

                    <!-- 经验任务卡片 -->
                    <div v-if="activeIndex === 0 && tasks && !loading" class="task-content">
                        <div v-for="(task, index) in tasks" :key="index" class="task-group mb-8">
                            <div class="group-header mb-4">
                                <div class="group-title flex items-center">
                                    <i :class="getTaskGroupIcon(index)" class="mr-2 text-lg"></i>
                                    <h3 class="text-base font-medium m-0">
                                        <span v-if="index == 'newbie_task'">初次见面</span>
                                        <span v-else-if="index == 'daily_task'">每日任务</span>
                                        <span v-else>推荐任务</span>
                                    </h3>
                                    
                                    <span v-if="index == 'daily_task'" class="task-badge ml-2 text-xs bg-base-200/50 text-base-content/60 px-2.5 py-1 rounded-full">每日可重复</span>
                                </div>
                                
                                <div class="task-summary mt-2">
                                    <div class="task-progress">
                                        <div class="progress-text text-sm text-base-content/70 mb-1">
                                            完成 {{ getCompletedTaskCount(task) }}/{{ task.length }}
                                        </div>
                                        <div class="progress-bar h-1.5 bg-base-200 rounded-full overflow-hidden">
                                            <div class="progress-fill h-full bg-gradient-to-r from-primary/60 to-primary" 
                                                 :style="`width: ${getCompletedTaskPercentage(task)}%`"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div v-for="(item, i) in task" 
                                     :key="i"
                                     class="task-card card bg-base-100 shadow-sm hover:shadow transition-all duration-300 hover:-translate-y-0.5">
                                    <div class="card-body p-4">
                                        <div class="flex justify-between items-start">
                                            <div class="task-info">
                                                <h4 class="font-medium text-sm mb-3">{{ item.name }}</h4>
                                                
                                                <div class="task-rewards flex flex-wrap gap-3">
                                                    <div v-for="prize in item.task_bonus" 
                                                         :key="prize.key"
                                                         class="reward-item flex items-center gap-1.5" 
                                                         :class="`reward-${prize.key}`">
                                                        <div class="reward-icon">
                                                            <img :src="getRewardIcon(prize.key)" alt="奖励" class="w-4 h-4" />
                                                        </div>
                                                        <span class="reward-value" :class="{
                                                          'text-primary': prize.key === 'credit',
                                                          'text-success': prize.key === 'exp',
                                                          'text-warning': prize.key === 'other'
                                                        }">+{{ prize.value }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div class="task-status">
                                                <template v-if="parseInt(item.completed_count) >= parseInt(item.task_count) || item.is_completed">
                                                    <div class="completed-status">
                                                        <i class="ri-checkbox-circle-fill text-success text-xl"></i>
                                                    </div>
                                                </template>
                                                <template v-else>
                                                    <div class="progress-status">
                                                        <div class="progress-count font-semibold text-sm text-primary text-right mb-1 flex items-center">
                                                            <span class="current">{{ item.completed_count }}</span>
                                                            <span class="divider">/</span>
                                                            <span class="total">{{ item.task_count }}</span>
                                                        </div>
                                                        <div class="mini-progress w-16 h-1.5 bg-base-200 rounded-full overflow-hidden">
                                                            <div class="mini-progress-fill h-full bg-gradient-to-r from-primary/60 to-primary" 
                                                                 :style="`width:${Math.min((item.completed_count / item.task_count).toFixed(4) * 100, 100)}%`">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </template>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 经验记录卡片 -->
                    <div v-if="activeIndex === 1 && data.length && !loading" class="exp-records">
                        <div class="record-list divide-y divide-base-200">
                            <div v-for="(item, index) in data" 
                                 :key="index"
                                 class="record-item py-4 first:pt-0 hover:bg-base-200/20 px-2 rounded-lg transition-colors duration-200">
                                <div class="flex justify-between items-start">
                                    <div class="flex items-center gap-2">
                                        <div class="w-8 h-8 rounded-full flex items-center justify-center" 
                                             :class="item.value < 0 ? 'bg-error/10' : 'bg-success/10'">
                                            <i :class="item.value < 0 ? 'ri-arrow-down-line text-error' : 'ri-arrow-up-line text-success'"></i>
                                        </div>
                                        <div>
                                            <div class="text-sm font-medium">{{ item.type_text }}</div>
                                            <div class="text-xs text-base-content/60">{{ item.content }}</div>
                                        </div>
                                    </div>
                                    <div class="flex flex-col items-end">
                                        <div :class="[
                                            'text-base font-medium',
                                            item.value < 0 ? 'text-error' : 'text-success'
                                        ]">
                                            <b>{{ item.value > 0 ? '+' + item.value : item.value }}</b> 经验
                                        </div>
                                        <div class="text-xs text-base-content/60">{{ item.date }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="!loading && ((activeIndex === 1 && !data.length) || (activeIndex === 0 && !tasks)) && isDataEmpty" class="flex flex-col items-center justify-center py-12 text-center">
                        <van-empty image-size="10rem" description="暂无内容" />
                        <button class="btn btn-sm btn-outline mt-4" @click="activeIndex === 0 ? getTaskData() : fetchData()">刷新</button>
                    </div>

                    <!-- 分页 -->
                    <div v-if="activeIndex === 1 && data.length" class="pagination mt-4 border-t border-base-200 pt-4">
                        <PageNav ref="jsonPageNav" 
                                :paged="paged" 
                                :pages="pages" 
                                navtype="json" 
                                type="page" 
                                :api="api"
                                :param="param" 
                                @change="change" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onServerPrefetch } from 'vue'
import axios from '@/dist/axios'
import PageNav from '@/components/footer/PageNav.vue';
import { useStore } from '@/store';
import Loading from '../other/Loading.vue';

const store = useStore();
const lv = ref('');
const lv_data = ref([]);
const tasks = ref('');
const isDataEmpty = ref(false);
const loading = ref(true);
const locked = ref(false);
const data = ref([]);
const jsonPageNav = ref(null);
const paged = ref(1);
const pages = ref(1);
// 分页数据
const api = ref('getUserRecords');

const tabs = ref([{ name: '经验任务', id: 0 }, { name: '经验记录', id: 1 }])
const param = ref({
    size: 6,
    type: 'exp'
});
const activeIndex = ref(0);

// 获取标签页图标
const getTabIcon = (index) => {
  switch(index) {
    case 0: return 'ri-task-line';
    case 1: return 'ri-file-list-line';
    default: return 'ri-file-list-line';
  }
};

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

const getLevelBarPercentage = (index) => {
    const maxExp = parseInt(lv_data.value[lv_data.value.length - 1].exp);
    let h = 75 * ((index + 1) / lv_data.value.length);
}

const getTaskData = async () => {
    try {
        loading.value = true;
        let res = await axios.post('/getTaskData', {
            user_id: 0,
            key: 'exp'
        })
        tasks.value = res.data;
        isDataEmpty.value = (tasks.value.length === 0);
    } catch (error) {
        console.error('获取任务数据失败:', error);
    } finally {
        loading.value = false;
    }
}

const fetchData = async () => {
    try {
        locked.value = true;
        loading.value = true;
        let res = await store.fetchApiPostData(api.value, Object.assign(param.value, { paged: paged.value }))
        change(res)
    } catch (error) {
        console.error('获取经验记录失败:', error);
    }
}

const change = (recievedData) => {
    data.value.push(...recievedData.data);
    isDataEmpty.value = (data.value.length === 0);
    loading.value = false;
    locked.value = false;
}

const changeTab = async (index) => {
    if (locked.value) return;
    data.value = [];
    tasks.value = '';
    isDataEmpty.value = false;
    activeIndex.value = index;
    
    // 加载数据
    if (index == 1) {
        await fetchData();
    } else {
        await getTaskData();
    }
}

const getUserLvInfo = async () => {
    try {
        loading.value = true;
        let res = await axios.post('/getUserLvInfo');
        lv.value = res.data.lv;
        lv_data.value = res.data.lv_group;
        nextTick(() => {
            getLevelBarPercentage();
        });
    } catch (error) {
        console.error('获取用户等级信息失败:', error);
    } finally {
        loading.value = false;
    }
}

onMounted(async () => {
    await getUserLvInfo();
    await getTaskData();
});

onServerPrefetch(async () => {
    await getUserLvInfo();
    await getTaskData();
});
</script>

<style scoped>
/* 标签页样式 */
.tabs-container {
  overflow-x: auto;
  scrollbar-width: none;
}

.tabs-container::-webkit-scrollbar {
  display: none;
}

.tabs-wrapper {
  display: flex;
  min-width: max-content;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 任务完成进度条 */
.progress-fill {
  transition: width 0.5s ease;
}
</style>

