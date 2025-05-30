<template>
    <aside class="widget-author card bg-base-100  flex gap-6 p-4 text-[95%] relative z-10  lg:flex-row flex-col  lg:mt-1" v-if="open == '1' && data.author">
        <div class="authors flex flex-col justify-between flex-1 gap-2">
            <h6 class="tracking-wider text-base-content/60 text-xs cursor-pointer" >{{
                data.author.name }} · 本文作者信息 <span @click.passive="openDonateCredit" class="text-base-content/60">打赏豆豆</span></h6>
            <div class="has-line-clamp text-sm line-clamp-2">{{ data.author.desc }}</div>
            <nav class="flex flex-row gap-2.5 flex-wrap">
                <a target="_blank" title="查看更多资料" href="javascript:void(0)" class="m-1.5 flex p-2 gap-2 rounded-full h-9 min-w-9 bg-primary/10 text-sm text-primary no-underline justify-center items-center hover:bg-primary hover:text-primary-content hover:scale-110 transition-all duration-300"><i class="ri-user-add-line"></i>更多资料</a>
                <a target="_blank" title="作者QQ" :href="qq || '#'" class="m-1.5 flex p-2 gap-2 rounded-full h-9 min-w-9 bg-primary/10 text-sm text-primary no-underline justify-center items-center hover:bg-primary hover:text-primary-content hover:scale-110 transition-all duration-300"><i class="ri-qq-line"></i></a>
                <a target="_blank" title="作者微信" :href="wechat || '#'" class="m-1.5 flex p-2 gap-2 rounded-full h-9 min-w-9 bg-primary/10 text-sm text-primary no-underline justify-center items-center hover:bg-primary hover:text-primary-content hover:scale-110 transition-all duration-300"><i class="ri-wechat-2-line"></i></a>
                <a target="_blank" title="作者GitHub" :href="github || '#'" class="m-1.5 flex p-2 gap-2 rounded-full h-9 min-w-9 bg-primary/10 text-sm text-primary no-underline justify-center items-center hover:bg-primary hover:text-primary-content hover:scale-110 transition-all duration-300"><i class="ri-github-line"></i></a>
            </nav>
        </div>
        <div class="avatars flex justify-center text-center items-center mb-0 mx-auto order-[-1] flex-1 lg:mt-0 lg:order-0">
            <avatar-vue :data="data.author" :size="isMobile ? 70 : 80" class="avatar rounded-full bg-primary/10 mt-5 text-primary outline  outline-offset-2 align-middle"></avatar-vue>
        </div>
        <div class="article flex flex-col gap-2 items-start lg:items-end relative">
            <h6 class="tracking-wider text-base-content/60 text-xs">本文附加信息</h6>
            <ul class="flex gap-4 list-none text-sm">
                <li class="ri-copyright-line relative before:content-[''] before:text-xl before:leading-none before:rounded-full before:bg-[radial-gradient(circle,var(--color-warning)_50%,#0000_50%)] before:bg-no-repeat before:bg-[150%_150%/.7em_.7em] hover:after:opacity-100 hover:after:transform-none after:content-[attr(text)] after:text-sm after:absolute after:top-6 after:left-1/2 after:-translate-x-1/2 after:w-[min(15em,80vw)] after:h-fit after:bg-base-100 after: after:backdrop-blur-xl after:rounded-2xl after:p-2 after:opacity-0 after:z-10 after:pointer-events-none after:transition-all after:duration-300 after:leading-normal" text="请您在转载、复制时注明本文作者、链接及内容来源信息。若涉及转载第三方内容，还需一同注明。">
                    具有版权性
                </li>
                <li class="ri-timer-line relative before:content-[''] before:text-xl before:leading-none before:rounded-full before:bg-[radial-gradient(circle,var(--color-success)_50%,#0000_50%)] before:bg-no-repeat before:bg-[150%_150%/.7em_.7em] hover:after:opacity-100 hover:after:transform-none after:content-[attr(text)] after:text-sm after:absolute after:top-6 after:left-1/2 after:-translate-x-1/2 after:w-[min(15em,80vw)] after:h-fit after:bg-base-100 after: after:backdrop-blur-xl after:rounded-2xl after:p-2 after:opacity-0 after:z-10 after:pointer-events-none after:transition-all after:duration-300 after:leading-normal" text="文章内容不具时效性。若文章内容有错误之处，请您批评指正。">
                    不具时效性
                </li>
            </ul>
            <nav v-if="data.prevPost || data.nextPost" class="flex flex-col">
                <a @click.prevent="navigateToPost(data.prevPost.post_type, data.prevPost.ID)"
                    :href="getArticleUrl(data.prevPost.post_type, data.prevPost.ID)"
                    :title="'上一篇：' + data.prevPost.post_title" rel="prev"
                    class="w-full my-1.5 lg:m-1.5 flex p-2 gap-2 rounded-full bg-base-200 text-sm text-base-content/60 no-underline flex-row self-start lg:justify-end hover:bg-primary hover:text-primary-content transition-colors duration-300 justify-start">
                    <i class="ri-arrow-left-line flex-none self-center"></i>
                    <span class="overflow-hidden text-ellipsis line-clamp-1">{{ data.prevPost.post_title }}</span>
                </a>
                <a @click.prevent="navigateToPost(data.nextPost.post_type, data.nextPost.ID)"
                    :href="getArticleUrl(data.nextPost.post_type, data.nextPost.ID)"
                    :title="'下一篇：' + data.nextPost.post_title" rel="next"
                    class="my-1.5 lg:m-1.5 flex p-2 gap-2 rounded-full bg-base-200 text-sm text-base-content/60 no-underline flex-row self-start lg:justify-end hover:bg-primary hover:text-primary-content transition-colors duration-300 justify-start w-full">
                    <i class="ri-arrow-right-line flex-none self-center"></i>
                    <span class="overflow-hidden text-ellipsis line-clamp-1">{{ data.nextPost.post_title }}</span>
                </a>
            </nav>
        </div>
    </aside>
</template>

<script setup>
import { computed, ref, onMounted, onServerPrefetch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import avatarVue from '../../../user/avatarVue.vue';
import { createVanModal } from '@/dist/createVanModal';
import { useIsMobile } from '../../../../dist/mobile';

const {isMobile} = useIsMobile();
const store = useStore();
const router = useRouter();
const props = defineProps({
    post_id: {
        type: [Number, String],
        required: true
    }
});
const data = ref({
    "author": {
        "url": "",
        "self": false,
        "admin": false,
        "id": 1,
        "money": "",
        "credit": "",
        "is_follow": false,
        "commission": {
            "money": 0,
            "withdrawn": 0,
            "data": {
                "lv1": 0,
                "lv2": 0,
                "lv3": 0,
                "total": 0
            }
        },
        "name": "",
        "link": "",
        "avatar": "/assets/image/default-avatar.png",
        "desc": "",
        "pendant": "",
        "badge": "",
        "lv": {
            "name": "",
            "exp": "",
            "icon": "",
            "lv": 0,
            "next_lv_name": "",
            "next_lv_exp": 0,
            "next_lv_icon": "",
            "exp_ratio": ""
        },
        "vip": {
            "name": "",
            "lv": "",
            "image": "",
            "icon": "",
            "color": "",
            "time": 0,
            "date": ""
        },
        "verify": {
            "icon": "",
            "name": "",
            "title": "",
            "type": ""
        },
        "ip": "",
        "stats": {
            "posts_views_count": 0,
            "posts_like_count": 0,
            "posts_count": "",
            "dynamic_count": "",
            "comments_count": "",
            "favorites_count": 0
        },
        "followers": {
            "follow": 0,
            "fans": 0
        },
        "login": false,
        "cover": ""
    },
    "prevPost": {
        "ID": 0,
        "post_author": "",
        "post_date": "",
        "post_date_gmt": "",
        "post_content": "",
        "post_title": "-",
        "post_excerpt": "",
        "post_status": "",
        "comment_status": "",
        "ping_status": "",
        "post_password": "",
        "post_name": "",
        "to_ping": "",
        "pinged": "",
        "post_modified": "",
        "post_modified_gmt": "",
        "post_content_filtered": "",
        "post_parent": 0,
        "guid": "",
        "menu_order": 0,
        "post_type": "",
        "post_mime_type": "",
        "comment_count": "",
        "filter": ""
    },
    "nextPost": {
        "ID": 0,
        "post_author": "",
        "post_date": "",
        "post_date_gmt": "",
        "post_content": "",
        "post_title": "-",
        "post_excerpt": "",
        "post_status": "",
        "comment_status": "",
        "ping_status": "",
        "post_password": "",
        "post_name": "",
        "to_ping": "",
        "pinged": "",
        "post_modified": "",
        "post_modified_gmt": "",
        "post_content_filtered": "",
        "post_parent": 0,
        "guid": "",
        "menu_order": 0,
        "post_type": "",
        "post_mime_type": "",
        "comment_count": "",
        "filter": ""
    }
}
);

const config = computed(() => {
    return store.config;
});

const open = config.value.single_next_open;


function navigateToPost(postType, postId) {
    router.push({ name: 'article', params: { postId } });
}


const getArticleUrl = (postType, postId) => {
    return '/detail/' + postType + '/' + postId;
}

const qq = config.value.my_qq

const wechat = config.value.my_wechat

const github = config.value.my_github

const getPreNextPost = async () => {
    try {
        let res = await store.fetchPrenextList(props.post_id)
        data.value = res
    } catch (error) {

    }
}

const openDonateCredit = () => {
    import('@/components/pay/DonateCredit.vue').then(module => {
        createVanModal(module.default,{
            position: isMobile.value ? 'bottom' : 'center',
            size: isMobile.value ? '100%' : 350
        })
    })
}

onMounted(async () => {
    await getPreNextPost();
})

onServerPrefetch(async () => {
    await getPreNextPost();
})


</script>



<style lang="scss" scoped>
.user-avatar {
    --avatar-size: var(--avatar-mobile-size);
}

.widget-author .user-avatar {
    --avatar-size: 6em;
}

img.loaded {
    animation: opacity 1s;
}

@media screen and (max-width: 768px) {
    .widget-author .user-avatar {
        --avatar-size: 5em;
    }
}
</style>