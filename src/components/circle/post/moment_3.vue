<template>
    <article class="p-0 list-group-item border-b border-base-300">
        <div class="py-2 sm:py-3 flex flex-col md:flex-row gap-2 sm:gap-4">
            <!-- 左侧统计信息 -->
            <div class="flex sm:flex-shrink-1 mb-2 md:mb-0">
                <div class="bg-base-200 card card-border border-primary py-0.5 px-2 sm:px-3 mr-2 flex flex-row lg:flex-col items-center justify-center sm:w-16 sm:h-16"
                      :class="{ 'bg-primary text-primary-content': item.question.is_adopted }"
                >
                    <span class="text-sm mr-1 lg:mr-0">{{ item.question.answer_count }}</span>
                    <span class="text-sm whitespace-nowrap">{{ item.question.is_adopted ? '已解决' : '回答' }}</span>
                </div>
                <div class="bg-base-200 text-base-content/60 card py-0.5 px-2 sm:px-3 flex flex-row lg:flex-col items-center justify-center sm:w-16 sm:h-16">
                    <span class="text-sm mr-1 lg:mr-0">{{ item.meta.views }}</span>
                    <span class="text-sm whitespace-nowrap">阅读</span>
                </div>
            </div>

            <!-- 右侧内容区 -->
            <div class="w-full">
                <!-- 标题 -->
                <div class="flex items-start mb-2 sm:mb-3">
                    <h3 class="text-base  mb-0 line-clamp-2 break-all h-[3.5rem]">
                        <a :href="item.link" @click.prevent="router.push(item.link)" class="text-base-content hover:text-primary block h-full" target="">
                           {{ item.title }}
                        </a>
                    </h3>
                </div>

                <!-- 底部信息 -->
                <div class="flex items-center flex-wrap gap-1 sm:gap-2">
                    <!-- 标签 -->
                    <div class="flex flex-wrap items-center mr-2 sm:mr-3">
                        <div class="-m-0.5 sm:-m-1 flex flex-wrap items-center">
                            <a :href="'/topic/' + tag.id" @click="router.push('/topic/' + tag.id)" v-for="tag in item.topics" class="m-0.5 sm:m-1 badge badge-primary text-sm">{{ tag.name }}</a>
                        </div>
                    </div>

                    <!-- 用户信息 -->
                    <div class="text-sm flex items-center justify-end flex-1">
                        <nameVue :data="item.author" :icon="false" class="mr-1 sm:mr-2 text-primary"></nameVue>
                        <span class="mx-1 sm:mx-2 text-base-content/60">·</span>
                        <a :href="'/moment/' + item.id" @click="router.push('/moment/' + item.id)" class="text-base-content/60 hover:text-primary" target="">
                            {{item.date}}回答
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </article>
</template>


<script setup>
import { useRouter } from 'vue-router';
import nameVue from '../../user/nameVue.vue';

const router = useRouter();
const props = defineProps({
    item: {
        type: Object,
        default: () => { }
    },
    index: {
        type: Number,
        default: 0
    },
    selectTabs: {
        type: Object,
    }
})
</script>