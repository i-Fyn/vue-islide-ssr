<template>
    <div class="mb-2 lg:mb-4 bg-base-100 rounded-lg border border-base-200 p-4 lg:p-6" v-if="totalAnswer" >
        <div class="flex items-center justify-between pb-4" 
             :class="{'border-b border-base-200': totalAnswer.value > 0}">
            <span class="text-lg font-medium">{{ totalAnswer }}个回答</span>
            <div class="flex gap-2">
                <button class="btn btn-sm btn-outline rounded-4xl"
                    :class="{ 'btn-primary text-primary-content': param.orderby == 'like_count' }"
                    @click.prevent="changeOrderby('like_count')">得票</button>
                <button class="btn btn-sm rounded-4xl"
                    :class="{ 'btn-primary text-primary-content': param.orderby == 'date', 'btn-outline': param.orderby != 'date' }"
                    @click.prevent="changeOrderby('date')">最新</button>
            </div>
        </div>
        <div v-for="item in answerLists" :key="item.id" 
            class="py-6 border-b border-base-200 last:border-0">
            <MomentAnswer :item="item" :is_self="postDetail.is_self" 
                @adoptAnswer="handleAdoptAnswer"
                @insertComment="handleInsertComment" 
                @deleteAnswer="handleDeleteAnswer" />
        </div>
    </div>

    <PageNav ref="jsonPageNav" :paged="paged" :pages="pages" navtype="json" type="auto" 
        :api="api" :param="param" @change="listChange" />

    <div id="answer-question" 
        class="w-full bg-base-100 rounded-lg border border-base-200 p-4"
        :class="{ 'sticky bottom-0 z-50 border-base-300': answerSticky }">
        <div class="flex justify-between items-center border-b border-base-200 pb-4">
            <span class="text-lg font-medium">撰写回答</span>
            <div v-show="openEditor" class="flex gap-3">
                <button v-if="answerSticky" 
                    @click="answerSticky = false"
                    class="btn btn-sm btn-ghost">
                    取消停靠
                </button>
                <button @click="openEditor = false;answerSticky = false" 
                    class="btn btn-sm btn-ghost">
                    返回
                </button>
            </div>
        </div>
        <div class="pt-4">
            <div class="space-y-6" v-show="!openEditor">
                <div>
                    <h6 class="text-success font-medium mb-3 text-base">适合作为回答的</h6>
                    <ul class="space-y-2">
                        <li class="flex items-center gap-2 text-base">
                            <i class="ri-checkbox-circle-line text-success"></i>
                            经过验证的有效解决办法
                        </li>
                        <li class="flex items-center gap-2 text-base">
                            <i class="ri-checkbox-circle-line text-success"></i>
                            自己的经验指引，对解决问题有帮助
                        </li>
                        <li class="flex items-center gap-2 text-base">
                            <i class="ri-checkbox-circle-line text-success"></i>
                            遵循 Markdown 语法排版，代码语义正确
                        </li>
                    </ul>
                </div>
                <div>
                    <h6 class="text-error font-medium mb-3 text-base">不该作为回答的</h6>
                    <ul class="space-y-2">
                        <li class="flex items-center gap-2 text-base">
                            <i class="ri-close-circle-line text-error"></i>
                            询问内容细节或回复楼层
                        </li>
                        <li class="flex items-center gap-2 text-base">
                            <i class="ri-close-circle-line text-error"></i>
                            与题目无关的内容
                        </li>
                        <li class="flex items-center gap-2 text-base">
                            <i class="ri-close-circle-line text-error"></i>
                            "赞""顶""同问""看手册""解决了没"等毫无意义的内容
                        </li>
                    </ul>
                </div>
                <div class="flex flex-col gap-4">
                    <button @click="open" type="button" class="btn btn-primary btn-soft w-fit btn-sm rounded-4xl">
                        撰写解决方法
                    </button>
                    <span class="text-sm text-base-content/60">
                        询问细节、提出修改意见时，请使用每条内容下方的"回复"功能
                    </span>
                </div>
            </div>
            <div class="space-y-4" v-show="openEditor">
                <div class="border border-base-200 rounded-lg overflow-hidden">
                    <TinyEditor v-model="answerContent" :height="240" />
                </div>
                <div class="flex justify-end">
                    <button type="button"
                        :disabled="answerContent.length < 10"
                        @click="submitAnswer"
                        class="btn btn-primary"
                        :class="{ 'btn-disabled': answerContent.length < 10 }">
                        提交回答
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import axios from '@/dist/axios';
import { ref, onMounted, computed, onServerPrefetch, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import PageNav from '@/components/footer/PageNav.vue';
import MomentAnswer from './MomentAnswer.vue';
import { useStore } from '../../../store';
import { createMessage as message } from '../../../dist/message';
import { useLoginStatus } from '../../header/composables/useLoginStatus';

const TinyEditor = defineAsyncComponent({
    loader: () => import.meta.env.SSR
        ? Promise.resolve({ render: () => null })
        : import('@/components/tinymce/TinyEditor.vue'),
    loadingComponent: { render: () => null },
    errorComponent: { render: () => null },
    delay: 200,
    timeout: 5000
});

const props = defineProps({
    postDetail: {
        type: Object,
        required: true
    }
});

const { isLogin,checkIsLogin } = useLoginStatus();
const store = useStore();
const route = useRoute();
const momentId = ref(route.params.postId);
const pages = ref(1);
const paged = ref(1);
const api = ref('circle/answer/list');
const param = ref({
    moment_id: momentId.value,
    per_page: 5,
    orderby: 'like_count'
});
const answerContent = ref('');
const openEditor = ref(false);


const jsonPageNav = ref(null);
const answerLists = ref([]);
const totalAnswer = ref(0);
const locked = ref(false);
const loading = ref(false);
const isDataEmpty = ref(false);
const answerSticky = ref(false);


const listChange = (data) => {
    if (data.paged == 1 || data.pages == 0) {
        answerLists.value = data.data;
    } else {
        answerLists.value.push(...data.data)
    }
    totalAnswer.value = data.count;
    pages.value = data.pages;
    locked.value = false;
    loading.value = false;
    isDataEmpty.value = answerLists.value.length == 0;
}

const submitAnswer = () => {
    axios.post('/circle/answer/submit', {
        moment_id: momentId.value,
        content: answerContent.value,
    }).then(res => {
        console.log(res.data);
        openEditor.value = false;
        answerContent.value = '';
        answerSticky.value = false;
        answerLists.value.push(res.data.data);
    }).catch(err => {
        message({ message: err.response?.data?.message, type: 'error' })
    })
}

const fetchData = async () => {
    try {
        locked.value = true
        loading.value = true
        let res = await store.fetchApiPostData(api.value, Object.assign(param.value, { paged: paged.value }))
        listChange(res)
    } catch (error) {
        console.log(error)
    }
}

const handleAdoptAnswer = (item) => {
    //寻找替换item
    let index = answerLists.value.findIndex(i => i.id == item.id);
    if (index == -1) return;
    answerLists.value[index] = item;

    // 将采纳的答案排到第一位
    answerLists.value.sort((a, b) => {
        if (a.is_best && !b.is_best) return -1;
        if (!a.is_best && b.is_best) return 1;
        return 0;
    });
}

const handleInsertComment = (item) => {
    let index = answerLists.value.findIndex(i => i.id == item.top_parent.id);
    if (index == -1) return;
    //插入到children的第一个
    answerLists.value[index].children.unshift(item);
}


const handleDeleteAnswer = (id) => {
    //父级
    let index = answerLists.value.findIndex(i => i.id == id);
    if (index !== -1) {
        answerLists.value.splice(index, 1);
        totalAnswer.value--;
    } else {
        //子级
        answerLists.value.forEach(item => {
            let index = item.children.findIndex(i => i.id == id);
            if (index !== -1) {
                item.children.splice(index, 1);
            }
        })
    }
}

const changeOrderby = (orderby) => {
    if (param.value.orderby == orderby) return;
    param.value.orderby = orderby;
    fetchData()
}

const open = () => {
    if (!isLogin.value) {
        checkIsLogin();
        return;
    }
    openEditor.value = true;
    answerSticky.value = true;
}



onMounted(async () => {
    await fetchData()
})

onServerPrefetch(async () => {
    await fetchData()
})


</script>

<style scoped>
#answer-question {
    h6 {
        margin-bottom: .5rem;
    }

    .list-inline {
        margin-bottom: 1rem;
    }

    li {
        margin-bottom: .5rem;
    }
}
</style>