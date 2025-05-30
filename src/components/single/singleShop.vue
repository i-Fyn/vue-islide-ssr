<template>
    <div class="single-shop wrapper">
        <div class="content-area p-4 bg-base-100">

            <div id="tabs" class="tabs tabs-border h-20  ">
                <a v-for="(tab, index) in tabs" :key="index" :class="[
                    'tab tab-bordered transition-all duration-300',
                    activeTab === index
                        ? 'tab-active border-primary text-primary font-medium'
                        : 'hover:border-primary/50 hover:text-primary/70'
                ]" @click="changeTab(index)">
                    {{ tab }}
                </a>
            </div>
            <div class="tabs-content mt-4">
                <div class=" mg-t ">
                    <div>
                        <article class="min-h-[50vh] transition-all duration-300"
                            :class="activeTab === 0 ? 'opacity-100 visible block' : 'opacity-0 invisible hidden'">
                            <Articles :postDetail="postDetail" :key="postDetail.id" />
                        </article>

                        <article class="min-h-[50vh] transition-all duration-300"
                            :class="activeTab === 1 ? 'opacity-100 visible block' : 'opacity-0 invisible hidden'">
                            <h2
                                class="productinfosection-header text-base font-bold mb-6 pl-4 border-l-4 border-primary">
                                <span class="typography-callout">产品信息</span>
                            </h2>
                            <div class="productinfosection-content flex flex-col gap-6 px-4">
                                <div v-if="parsedShopAttr.length" class="space-y-6">
                                    <div v-for="(panel, index) in parsedShopAttr" :key="index"
                                        class="pdsection-panel flex flex-row mt-6 pt-6 border-t border-base-200 first:border-t-0 first:mt-0 first:pt-0">
                                        <div class="pdsection-sidepanel flex-1 max-w-37">
                                            <h3 data-autom="sectionTitle"
                                                class="pdsection-title text-base mb-3 font-bold text-base-content/80">
                                                {{ panel.name }}
                                            </h3>
                                        </div>
                                        <div class="pdsection-mainpanel flex-3">
                                            <div>
                                                <ul class="space-y-2.5">
                                                    <li v-for="(value, i) in panel.values" :key="i"
                                                        class="text-base-content/70 hover:text-base-content transition-colors duration-200">
                                                        {{ value }}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p v-else class="text-base-content/70 text-center py-8">没有找到相关的商店信息。</p>
                            </div>
                        </article>
                        <Comment :postDetail="postDetail" class="min-h-[50vh] transition-all duration-300"
                            :class="activeTab === 2 ? 'opacity-100 visible block' : 'opacity-0 invisible hidden'" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Comment from './container/comment/Comment.vue';
import { useHead } from '@unhead/vue';
import Articles from '@/components/single/container/article/Articles.vue'

import { ref, onMounted, watch, nextTick, computed } from 'vue';
const props = defineProps({
    postDetail: {
        type: Object,
        required: true,
    },
});
const tabs = ref(['商品介绍', '商品参数', '商品评价']); // 标签页名称
const activeTab = ref(0); // 当前激活的标签索引
const articleContent = ref(null);
const list = ref([]);
const activeBarStyle = ref({}); // 用于动态更新 active-bar 样式



// 切换标签页
const changeTab = async (index) => {
    activeTab.value = index;
};



const parsedShopAttr = computed(() => {
    const shopAttr = props.postDetail?.shop?.attr || ''; // 获取 shop_attr 数据
    if (!shopAttr) return [];

    // 将属性以换行符分割为每一行
    const lines = shopAttr.split('\n');
    return lines
        .map((line) => {
            const params = line.trim().split('|'); // 按 | 分割每一行
            if (params.length > 1) {
                return {
                    name: params[0], // 第一个为名称
                    values: params.slice(1).flatMap((value) => value.split('|')), // 其余为值
                };
            }
            return null;
        })
        .filter((panel) => panel !== null); // 过滤掉无效数据
});



</script>