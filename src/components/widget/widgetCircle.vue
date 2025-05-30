<template>
    <section class="widget-circle overflow-hidden card  bg-base-100 ">
        <div class="widget-box p-4">
            <div class="circle-info-widget" v-if="circle">
                <div class="circle-info-inner">
                    <div class="cover w-auto h-14 bg-center opacity-0 animate-fadeIn bg-cover bg-no-repeat relative overflow-hidden m-[-16px_-32px_0]" v-lazy:background-image="circle.cover" >
                        <div class="bg-cover absolute w-full h-full left-0 bottom-0 circle-bg"></div>
                    </div>
                    <div class="circle-info">
                        <div class="circle-info-top relative flex items-center justify-between gap-3">
                            <div class="circle-image">
                                <van-image lazy-load :src="circle.icon" width="46" height="46" class="circle-image-face w-h rounded-lg overflow-hidden" />
                            </div>
                            <div class="circle-title flex-1 flex flex-col">
                                <h2 class="circle-name text-base leading-6 font-bold">{{ circle.name }}</h2>
                                <div class="circle-info-tag mt-2 text-sm flex flex-row flex-wrap gap-1">
                                    <div class="tag-item official px-1  flex items-center gap-1.5 m-0 bg-primary text-primary-content border-1 border-primary rounded-4xl">
                                        <i class="ri-star-smile-fill"></i>
                                        <span>官方</span>
                                    </div>
                                    <a class="tag-item flex items-center gap-1.5 m-0  overflow-hidden" :href="circle.admin?.link">
                                        <van-image lazy-load :src="circle.admin?.avatar" width="22" height="22" class="rounded-full overflow-hidden" />
                                        <span>{{ circle.admin?.name }}</span>
                                        <span> 创建</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="circle-info-bottom mt-4">
                            <p class="circle-desc min-h-9 text-sm py-2 px-3 relative bg-base-200 rounded-sm text-base-content/60" v-if="circle.desc">{{ circle.desc }}</p>
                            <div class="circle-statistics w-full mt-4 flex gap-2 text-base-content/60 justify-between items-center">
                                <div class="flex flex-col items-center flex-1" >
                                    <span><i class="ri-group-line text-primary"></i></span>
                                    <span>{{ circle.user_count }}人</span>
                                </div>
                                <div class="flex flex-col items-center flex-1">
                                    <span><i class="ri-article-line text-primary "></i></span>
                                    <span>{{ circle.post_count }}篇</span>
                                </div>
                                <div class="flex flex-col items-center flex-1">
                                    <span><i class="ri-eye-2-line text-primary"></i></span>
                                    <span>{{ circle.views }}次</span>
                                </div>
                                <div class="flex flex-col items-center flex-1">
                                    <span><i class="ri-earth-line text-primary"></i></span>
                                    <span>{{ circle['privacy'] == 'public' ? '公开' : (circle['privacy'] == 'private' ? '私密' : '半公开')
                                        }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, onServerPrefetch } from 'vue'
import { useRoute } from 'vue-router';
import { useStore } from '@/store';

const route = useRoute();
const store = useStore();
const circle_id = ref(0);
const circle = ref({
    "staff": [],
    "today_comment_count": "0",
    "comment_count": "0",
    "today_post_count": "0",
    "id": 0,
    "name": "圈子",
    "slug": "",
    "desc": "圈子描述～",
    "original_icon": "",
    "original_cover": "",
    "icon": "",
    "cover": "",
    "circle_count": "15",
    "circle_tags": [],
    "circle_cat": "-",
    "circle_badge": [],
    "in_circle": true,
    "privacy": "public",
    "is_circle_staff": "false",
    "is_join_circle_post": false,
    "user_count": 0,
    "post_count": 0,
    "views": 0,
    "recommends": [],
    "stickys": [],
    "weight": "0"
});
const post_id = ref(0);

const getCircleData = async () => {
    try {
        let res = await store.fetchCircleData(circle_id.value);
        circle.value = res;
        console.log(circle.value);
    } catch (error) {
    }
}

const fetchPostData = async () => {
    try {
        let res = await store.fetchMoment(post_id.value);
        if(res.circle?.id){
            circle_id.value = res.circle.id;
            await getCircleData();
        }
    } catch (error) {
    }
}

const init = async () => {
    if (route.name === 'circles') {
        circle_id.value = route.params.circle_id;
        await getCircleData();
    }else if(route.name==='moment'){
        post_id.value = route.params.postId;
        await fetchPostData();
    }
}


onMounted(async () => {
    await init();
});


onServerPrefetch(async () => {
    await init();
});


</script>

<style scoped>
.circle-info-widget {
    opacity: 1;
    transition: opacity 0.2s ease;
}

.circle-info-widget:empty {
    opacity: 0;
}
</style>
