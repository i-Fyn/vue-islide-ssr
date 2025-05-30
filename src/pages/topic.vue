<template>
    <div class="single-page" v-if="topic">
    <div class="wrapper flex gap-4">
        <div  class="content-area bg-base-100">
            <div class="tax-topic relative  card p-4">
                <div class="islide-tax-header">
                    <div class="tax-info">
                        <div class="pb-6">
                            <div class="mb-6">
                                <div class="space-y-4">
                                    <div class="flex items-center gap-3">
                                        <avatarVue :data="topic.admin" style="--avatar-size: 30px;" />
                                        <nameVue :data="topic.admin" :icon="false" />
                                        <span class="text-sm text-base-content/60 ">发起话题</span>
                                    </div>
                                    <h1 class="flex items-center gap-2 text-base font-bold">
                                        <i class="ri-hashtag text-primary"></i>
                                        <span class="hover:text-primary cursor-pointer " @click="editTopic">{{ topic.name }}</span>
                                        <i class="ri-hashtag text-primary"></i>
                                        <span v-if="topic.weight" class="badge badge-primary gap-1">
                                            <i class="ri-fire-fill"></i>
                                            <span>{{ topic.weight }}</span>
                                        </span>
                                    </h1>
                                    <p v-if="topic['desc']" class="text-base-content/60">{{ topic['desc'] }}</p>
                                </div>
                            </div>
                            <div class="flex items-center justify-between">
                                <div class="flex gap-4 text-sm text-base-content/60">
                                    <span>帖数 {{ topic['post_count'] }}</span>
                                    <span>浏览 {{ topic['views'] }}</span>
                                    <span>用户 {{ topic['user_count'] }}</span>
                                </div>
                                <div class="flex gap-3">
                                    <button class="btn btn-outline btn-primary btn-sm" @click="followAction">{{ topic.is_followed ? '已关注' : '关注' }}</button>
                                    <a :href="'/moments?topic='+topic.name" @click.prevent="router.push('/moments?topic='+topic.name)">
                                        <button class="btn btn-primary btn-sm">参与话题</button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <main class="site-main">
                <CircleMoment :stickys="stickys" :tax="topic_id" :tabSelector="tabSelector" :key="topic_id" />
            </main>
        </div>
        <Secondary :enabled="config.topic_layout.sidebar_select.enabled" />
    </div>
</div>
</template>

<script setup>
import { ref, onMounted, watch, computed, onServerPrefetch } from 'vue'
import CircleMoment from '@/components/circle/CircleMoment.vue'
import Secondary from '@/components/secondary/SecondarySingle.vue';
import { useStore } from '@/store';
import { createVanModal } from '@/dist/createVanModal'
import avatarVue from '@/components/user/avatarVue.vue';
import nameVue from '@/components/user/nameVue.vue';
import { useRouter } from 'vue-router';
import axios from '@/dist/axios';

const router = useRouter();
const store = useStore();
const topic = ref(null)
const config = computed(() => {
    return store.config;
})
const stickys = ref([]);
const tabSelector = ref({});

const props = defineProps({
    topic_id: {
        type: [Number, String],
        default: 0
    },
})

defineOptions({
    name: 'topics'
})

const getTopicData = async () => {
    try {
        let res = await store.fetchTopicData(props.topic_id);
        topic.value = res;
    } catch (error) {
    }
}

onMounted(async () => {
    await getTopicData()
})
onServerPrefetch(async () => {
    await getTopicData()
})

const editTopic = () => {
    if (!topic.value || !topic.value.is_topic_admin) return;
    import('@/components/circle/func/CreateTopic.vue').then(module => {
        createVanModal(module.default, {
            size: 363,
            props: {
                topic_id: props.topic_id,
                topic: topic.value,
            }
        })
    })
}

const followTopic = async () => {
    if (!topic.value) return;
    try {
        let res = await axios.post(`topic/follow`,{
            topic_id: props.topic_id,
        });
        if(res.data?.status){
            topic.value.is_followed = true
        }else{
            topic.value.is_followed = false
        }
    } catch (error) {
    }
}

const unfollowTopic = async () => {
    if (!topic.value) return;
    try {
        let res = await axios.post(`topic/unfollow`,{
            topic_id: props.topic_id,
        });
        if(res.data?.status){
            topic.value.is_followed = false
        }
    } catch (error) {

        }
}

const followAction = () => {
    if (!topic.value) return;
    if (topic.value.is_followed) {
        unfollowTopic();
    } else {
        followTopic();
    }
}



watch(() => props.topic_id, async (newVal, oldVal) => {
    if (newVal !== oldVal) {
        topic.value = null;
        await getTopicData();
    }
})

</script>
