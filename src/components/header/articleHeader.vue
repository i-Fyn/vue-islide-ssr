<template>
    <div>
    <div class="article-header-warp">
        <van-nav-bar :border="false" fixed
            style="--van-nav-bar-height: var(--top-menu-height); --van-nav-bar-background:var(--color-base-100)"
            left-arrow z-index="1001">
            <template #right>
                <div class="right-box">
                    <div class="right"><button class="btn btn-primary btn-soft  btn-sm min-w-24 rounded-4xl"
                            style="border-radius: 100px;"
                            :disabled="is_follow || postDetail.author?.followers.is_self"><span>
                                {{ is_follow ? '已关注' : '关注' }}</span></button></div>
                    <i title="ri-share-box-line" @click="showBottom = true"
                        style="color: var(--color-text-regular);font-size: 24px;"
                        class="ri-share-box-line text-base-content/60"></i>
                </div>
            </template>
            <template #left>
                <div class="left-box" style="display: flex; align-items: center;gap: 10px;">
                    <div class="close-box cursor-pointer text-base-content/60" @click="router.go(-1)"
                        style="width: 40px; height: 40px; display: flex; justify-content: center; align-items: center; cursor: pointer;">
                        <van-icon name="cross" class="text-base-content/60" size="18" />
                    </div>
                    <avatar-vue :data="postDetail.author || {}" :icon="false" style="--avatar-size: 35px;" />
                    <name-vue :data="postDetail.author || {}" class="text-base" :icon="false" />
                </div>
            </template>
        </van-nav-bar>
        <van-share-sheet v-model:show="showBottom" :options="options" @select="onSelect" teleport="body" />
        <van-action-sheet v-model:show="showAction" :actions="actions" cancel-text="取消" close-on-click-action
            teleport="body" @select="onSelectAction" />
    </div>
    <div class="bottom-bar-wrap van-tabbar van-tabbar--fixed van-hairline--top-bottom van-safe-area-bottom toolbar-inner" style="z-index: 1002;--van-tabbar-height: var(--top-menu-height); --van-nav-bar-background:var(--color-base-100)">
        <div class="comment-input">
            <div class="input-box py-2 px-4 rounded-4xl  w-full bg-base-200">
                <van-icon size="16" :name="isLogin ? 'edit' : 'user-circle-o'" style="margin-right: 3px;" />
                <span @click="openReply">{{ isLogin ? '说点什么...' : '登录后评论' }}</span>
            </div>
        </div>
        <div class="icon-box">
            <van-icon size="24" :name="liked ? 'like' : 'like-o'" @click="vote" :color="liked ? 'red' : ''">
                <div class="bottom-bar-count text-base ml-1">{{ likeCount == 0 ? '' : likeCount }}</div>
            </van-icon>
            <van-icon size="24" :name="collected ? 'star' : 'star-o'" @click="collect"
                :color="collected ? 'var(--theme-color)' : ''">
                <div class="bottom-bar-count text-base ml-1">{{ collectCount == 0 ? '' : collectCount }}</div>
            </van-icon>
            <van-icon size="24" name="chat-o">
                <div class="bottom-bar-count text-base ml-1">{{ commentCount == 0 ? '' : commentCount }}</div>
            </van-icon>
            <van-icon size="24" name="more-o" @click="showAction = true" />
        </div>
    </div>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { report, deleteMoment } from '@/dist/theme'
import { showConfirmDialog } from 'vant';
import { watch, computed } from 'vue';
import { useStore } from '@/store';
import avatarVue from '@/components/user/avatarVue.vue'
import nameVue from '@/components/user/nameVue.vue'
import { useCommentStore } from '@/store/comment'
import { createMessage as message } from '@/dist/message';
import axios from '@/dist/axios';
import { ref, onMounted, onServerPrefetch } from 'vue'
import { useLoginStatus } from '@/components/header/composables/useLoginStatus.js'
import { useFollowStore } from '@/store/follow'
const followStore = useFollowStore()


const router = useRouter()
const route = useRoute()
const store = useStore()
const commentStore = useCommentStore()
const { isLogin, checkIsLogin } = useLoginStatus()
const user_id = ref(0)
const postDetail = ref({})
const is_follow = computed(() => followStore.isFollowed(user_id.value))
const locked = ref(false)
const liked = ref(false)
const collected = ref(false)
const collectCount = ref(0)
const likeCount = ref(0)
const commentCount = ref(0)
const post_id = ref(route.params.postId || 0)

const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    path: {
        type: String,
        default: 'home'
    },
    back: {
        type: Function,
    }
})

const openReply = () => {
    if (!isLogin.value) {
        return checkIsLogin()
    }
    commentStore.showComment = true
}

const shareLinks = ref({
    title: postDetail.value.seo?.title || '',
    weibo: '',
    qq: '',
    qzone: '',
    wechat: '#',
})


const options = [
    {
        name: 'QQ',
        icon: 'qq',
    },
    {
        name: '微信',
        icon: 'wechat',
    },
    {
        name: '微博',
        icon: 'weibo',
    },
    {
        name: 'QQ空间',
        icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/custom-icon-earth.png',
    }
];
const actions = ref([
    { name: '投诉' },
])

const showBottom = ref(false)
const showAction = ref(false)



const onSelect = (item) => {
    if (item.name === 'QQ') {
        window.open(shareLinks.value.qq)
    }
    if (item.name === '微信') {
        window.open(shareLinks.value.wechat)
    }
    if (item.name === '微博') {
        window.open(shareLinks.value.weibo)
    }
    if (item.name === 'QQ空间') {
        window.open(shareLinks.value.qzone)
    }
}

const onSelectAction = (item) => {

    if (item.name === '投诉') {
        report(post_id.value, 'post')
    }
    if (item.name === '删除') {
        showConfirmDialog({
            title: '删除提醒',
            message:
                '您确定要删除这条动态吗？',
        })
            .then(() => {
                deleteMoment(post_id.value)
            })
            .catch(() => {
                // on cancel
            });

    }
    if (item.name === '编辑') {
        if (route.name === 'moment') {
            router.push({ name: 'moments', query: { id: post_id.value } })
        } else {
            router.push({ name: 'write', query: { id: post_id.value } })
        }
    }

}

const collect = () => {
    if (locked.value) return;
    locked.value = true;
    axios.post('/userFavorites', 'post_id=' + postDetail.value.id || 0).then(res => {
        locked.value = false;
        if (res.data.message === '收藏取消！') {
            collected.value = false;
            if (collectCount.value > 0) collectCount.value--;
        } else {
            collected.value = true;
            collectCount.value++;
        }
        message({ message: res.data.message, type: 'success' });
    }).catch(err => {
        locked.value = false;
        message({ message: err.response.data.message, type: 'error' });
    })
}


const vote = () => {
    if (locked.value) return;
    locked.value = true;
    axios.post('/postVote', {
        type: 'like',
        post_id: postDetail.value.id || 0
    }).then(res => {
        locked.value = false;
        message({ message: res.data.message, type: 'success' });
    }).catch(err => {
        locked.value = false;
        message({ message: err.response.data.message, type: 'error' });
    })
}



async function init() {
    try {
        let res;
        if (route.name === 'moment') {
            res = await store.fetchMoment(post_id.value)
        } else {
            res = await store.fetchArticle(post_id.value)
        }
        if (res) {
            postDetail.value = res;
            user_id.value = postDetail.value.author?.id || 0;
            console.log(postDetail.value)
            shareLinks.value.weibo = postDetail.value.seo ? `http://service.weibo.com/share/share.php?url=${window.location.href}&title=${shareLinks.value.title}&pic=${postDetail.value.seo.image}&sharesource=weibo` : '';
            shareLinks.value.qq = postDetail.value.seo ? `http://connect.qq.com/widget/shareqq/index.html?url=${window.location.href}&title=${shareLinks.value.title}&summary=${postDetail.value.seo.description}&site=${postDetail.value.seo.title}&pics=${postDetail.value.seo.image}&sharesource=qzone` : '';
            shareLinks.value.qzone = postDetail.value.seo ? `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${window.location.href}&sharesource=qzone&title=${encodeURIComponent(postDetail.value.seo.title)}&pics=${postDetail.value.seo.image}&summary=${encodeURIComponent(postDetail.value.seo.description)}` : '';

            if (postDetail.value.is_self) {
                actions.value.push({ name: '删除' })
                actions.value.push({ name: '编辑' })
            }
            liked.value = postDetail.value.meta?.like.is_like || false
            likeCount.value = handleNumber(postDetail.value.meta?.like.count || 0)
            collected.value = postDetail.value.meta?.collect.is_collect || false
            collectCount.value = handleNumber(postDetail.value.meta?.collect.count || 0)
            commentCount.value = handleNumber(postDetail.value.meta?.comment || 0)
            followStore.setFollowStatus(user_id.value, postDetail.value.author.followers.is_follow)
        }
    } catch (err) {

    }
}


const handleNumber = (num) => {
    if (num > 10 && num < 100) {
        return '10+'
    } else if (num > 100 && num < 1000) {
        return '100+'
    } else if (num > 1000 && num < 10000) {
        return '1千+'
    } else if (num > 10000 && num < 100000) {
        return '1万+'
    } else if (num > 100000 && num < 1000000) {
        return '10万+'
    } else if (num > 1000000 && num < 10000000) {
        return '100万+'
    } else if (num > 10000000 && num < 100000000) {
        return '1千万+'
    } else if (num > 100000000 && num < 1000000000) {
        return '1亿+'
    } else {
        return num
    }
}


onMounted(async () => {
    await init()
})

onServerPrefetch(async () => {
    await init()
})

watch(() => route.path, async () => {
    if (route.params.postId) {
        post_id.value = route.params.postId;
        console.log(post_id.value)
        await init()
    }
})

</script>

<style lang="scss" scoped>

.bottom-bar-wrap {

    &:before {
        position: absolute;
        box-sizing: border-box;
        content: " ";
        pointer-events: none;
        top: -50%;
        right: -50%;
        bottom: -50%;
        left: -50%;
        border: 0 solid var(--van-border-color);
        transform: scale(.5);
    }

    .comment-input {
        flex: 1;
        padding: 6px 16px;
        font-size: 16px;
        height: 100%;
        outline: none;
        display: flex;
        align-items: center;
        background: var(--bg-body-color);
        border-radius: 40px;
        color: var(--color-text-secondary);
    }

    .icon-box {
        display: flex;
        gap: 15px;
        margin:0  12px;
    }

    .icon-box i {
        font-size: 20px;
        color: var(text-base-content/60);
        cursor: pointer;
        display: inline-flex;
        align-items: center;
    }


}

.right-box {
    display: flex;
    gap: 20px;
    align-items: center;
}
</style>