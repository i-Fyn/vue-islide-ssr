<template>
    <div class="comments-wrap tab-pane card  " v-if="postDetail">
        <div id="comments" class="comments-area bg-base-200 lg:bg-base-100 card ">
            <!-- 评论输入组件 -->
            <CommentSend v-show="showReply || (isMobile && !$route.meta.articleHeader) || !isMobile"
                :postDetail="postDetail" v-model:newComment="newComment" @submit="submit" ref="commentSendRef" />

            <!-- 评论排序和筛选 -->
            <div class="comment-orderby flex justify-between text-sm p-4 items-center bg-base-100 lg:mt-4 rounded-t-box">
                <div class="comment-orderby-left cursor-pointer">
                    <span  :class="{ active: !showAuthorComments }" @click="tabClick(false)">全部评论</span>
                    <span class="ml-2.5" :class="{ active: showAuthorComments }" @click="tabClick(true)">只看作者</span>
                </div>
                <div class="comment-orderby-rigth cursor-pointer">
                    <span class="ml-2.5" :class="{ active: orderBy === 'desc' }" @click="changeOrder('desc')">最新</span>
                    <span class="ml-2.5" :class="{ active: orderBy === 'islide_comment_like' }"
                        @click="changeOrder('islide_comment_like')">热门</span>
                </div>
            </div>

            <!-- 评论列表 -->
            <div class="comments-area-content relative">
                <transition-group name="comment-list" tag="ol" class="comment-list" ref="commentList"
                    @before-enter="beforeCommentEnter" @enter="commentEnter" @leave="commentLeave" appear>
                    <li v-for="(comment, index) in comments" :key="comment.id" class="comment-item border-t-1 border-dashed border-base-300  mb-4 lg:mb-0  w-full" :data-index="index">
                        <div :id="`comment-${comment.id}`" class="comments-container flex flex-row break-all mt-0 pt-2">
                            <div class="comment-avatar mr-4 flex font-bold">
                                <avatarVue :data="comment.author" :size="40" />
                            </div>
                            <div class="comment-main flex-1 w-0">
                                <CommentWrapper :comment="comment" @islideComments="handleCommentsWrapper"
                                    @deleteComment="deleteComment" @setCommentSticky="setCommentSticky" />

                                <transition-group name="child-comment" tag="ul" class="children pl-5 lg:pl-10 relative"
                                    @before-enter="beforeChildEnter" @enter="childEnter" @leave="childLeave">
                                    <!-- 子评论 -->
                                    <template v-for="(child, idx) in comment.children" :key="child.id">
                    <li class="comment-item border-t-1 border-dashed   child-item  w-full" :class="{ 'collapsed-child hidden': !comment.isExpanded && idx !== 0 }"
                        :data-child-index="idx" v-show="comment.isExpanded || idx === 0">
                        <div :id="`comment-${child.id}`" class="comments-container flex flex-row break-all mt-0 pt-2">
                            <div class="comment-avatar mr-4 flex font-bold">
                                <avatarVue :data="child.author" />
                            </div>
                            <div class="comment-main flex-1 w-0">
                                <CommentWrapper :comment="child" @islideComments="handleCommentsWrapper" />
                            </div>
                        </div>
                    </li>
</template>

<!-- 展开/收起按钮 -->
<li v-if="comment.children.length > 1" class="comment-item border-t-1 border-dashed border-base-300 collapse-control z-1 relative  w-full" key="control">
    <div class="comment-collapse-wrap px-5 text-sm">
        <div class="comment-expand text-base-content/60   w-full p-1.5 card card-border border-base-300 text-center bg-base-100 relative" @click="toggleCommentExpand(comment)">
            {{ comment.isExpanded ? '收起' : `展开剩余 ${comment.children.length - 1}条回复` }}
        </div>
    </div>
</li>
</transition-group>
</div>
</div>
</li>
</transition-group>
<div class="comments-area-content text-center w-full" v-if="isDataEmpty && !loading">
    <van-empty class="bg-base-100" image-size="10rem" description="暂无评论" />
</div>
</div>



<!-- 分页 -->
<div class="pagenav json-nav bg-base-100">
    <PageNav ref="jsonPageNav" :paged="paged" :pages="pages" navtype="json" type="auto" :api="api" :param="param"
        @change="change" @loading="loading = true"></PageNav>
</div>
</div>
<van-popup v-model:show="commentStore.showComment" position="bottom" :style="{ height: '25%', overflowY: 'visible' }"
    safe-area-inset-bottom @closed="resetting" teleport="body">
    <div class="comment-respond-wrap">
        <div class="comment-respond"></div>
    </div>
</van-popup>
</div>
</template>


<script setup>
import { ref, onMounted, onServerPrefetch, nextTick, watch } from 'vue';
import axios from '@/dist/axios';
import CommentWrapper from './CommentWrapper.vue';
import CommentSend from './CommentSend.vue';
import { useStore } from '@/store';
import { createMessage as message } from '@/dist/message';
import PageNav from '../../../footer/PageNav.vue';
import avatarVue from '../../../user/avatarVue.vue';
import { useIsMobile } from '../../../../dist/mobile';
import { useCommentStore } from '@/store/comment'
import { useLoginStatus } from '@/components/header/composables/useLoginStatus.js'
const { isLogin, checkIsLogin } = useLoginStatus()
const commentStore = useCommentStore()

const props = defineProps({
    postDetail: {
        type: Object,
        default: () => ({}),
    },
});
const { isMobile } = useIsMobile();
const locked = ref(false);
const commentSendRef = ref(null);


const isDataEmpty = ref(false);
const showReply = ref(false);
const loading = ref(true);
const store = useStore();
const comments = ref([]);
const newComment = ref('');
const orderBy = ref('desc');
const showAuthorComments = ref(false);
const openReplyDom = ref(false);
const comment_id = ref(0);
const comment_parent_id = ref(0);
const commentList = ref(null);
const pages = ref(1);
const paged = ref(1);
const api = ref('getCommentList');
const param = ref({
    post_id: props.postDetail.id,
    orderby: orderBy.value,
    size: 5,
    author: showAuthorComments.value,
});
const jsonPageNav = ref(null);

const toggleCommentExpand = (comment) => {
    comment.isExpanded = !comment.isExpanded;
};


const change = (recievedData) => {
    pages.value = recievedData.pages;
    if (recievedData.paged === 1) {
        comments.value = recievedData.data;
    } else {
        comments.value = comments.value.concat(recievedData.data);
    }
    comments.value = comments.value.map(comment => ({
        ...comment,
        isExpanded: false // 默认收起状态
    }));
    loading.value = false;
    isDataEmpty.value = comments.value.length === 0;
}

const setCommentSticky = (comment_id, status) => {
    comments.value.forEach(comment => {
        if (comment.id === comment_id) {
            comment.sticky = status;
        }
    });
    comments.value.sort((a, b) => {
        // 先按 sticky
        if (a.sticky !== b.sticky) {
            return (b.sticky === true) - (a.sticky === true);
        }

        if (param.value.orderby === 'desc') {
            // 然后按 datetime 时间倒序
            return new Date(b.datetime) - new Date(a.datetime);
        } else {
            // 然后按 点赞数 倒序
            return b.likes - a.likes;
        }
    });
};


const deleteComment = (comment_id, top_comment_id) => {
    if (comment_id == top_comment_id) {
        comments.value = comments.value.filter(comment => comment.id !== comment_id);
    } else {
        var td = top_comment_id;
        var c = comments.value.find(c => c.id === td);
        if (c) {
            c.children = c.children.filter(child => child.id !== comment_id);
        }
    }
}

const getComments = async (page = 1) => {
    try {
        let response = await store.fetchCommentList({
            post_id: props.postDetail.id,
            orderby: orderBy.value,
            author: showAuthorComments.value,
            paged: page,
            size: 5,
        })
        change(response);

    } catch (error) {

    }

};



const handleCommentsWrapper = (commentId, topCommentId, event) => {
    // 阻止事件冒泡
    event.stopPropagation()

    // 检查是否点击了图片或子元素
    const isMediaElement = event.target.closest('img, video, iframe')
    if (isMediaElement) return

    // 设置评论ID
    comment_id.value = commentId
    comment_parent_id.value = topCommentId

    // 切换回复框状态
    if (!openReplyDom.value) {
        console.log(commentId, event)
        openReply(commentId, event)

    } else {
        resetting()
    }
}

const openReply = async (commentId = '', event = null) => {
    // 清除无效调用
    if (!commentId && !event) {
        resetting()
    }

    // 获取目标容器
    let targetContainer = null
    const respondElement = commentSendRef.value.respond;
    console.log(1, respondElement)
    if (respondElement) {
        // 设置占位符文本
        const textarea = respondElement.querySelector('textarea')
        console.log(2, textarea)
        if (textarea) {
            if (event && commentId) {
                const nickEl = event.target.closest('.comments-container')?.querySelector('.comment-nick')
                console.log(3, nickEl)
                console.log(4, nickEl.querySelector('.user-name').textContent)
                textarea.placeholder = nickEl ? `回复 @${nickEl.querySelector('.user-name').textContent} :` : '回复评论';
                console.log(5, textarea.placeholder)
            } else {
                textarea.placeholder = '说点什么...'
                console.log(6, textarea.placeholder)
            }
        }
    }

    // PC端逻辑
    if (!isMobile.value) {
        const commentEl = document.getElementById(`comment-${commentId}`)
        if (commentEl) {
            targetContainer = commentEl.querySelector('.comment-container')
            targetContainer?.insertAdjacentElement('afterend', respondElement)
        }
    }
    // 移动端逻辑
    else {
        commentStore.showComment = true;
        nextTick(() => {
            const commentRespond = document.querySelector('.comment-respond')
            commentRespond?.insertAdjacentElement('afterbegin', respondElement)
            showReply.value = true;
        })
        nextTick(() => {
            const textarea = respondElement.querySelector('textarea')
            if (textarea) {
                textarea.focus()
            }
        })
    }

    openReplyDom.value = true
}

const resetting = () => {
    // 移动端关闭弹窗
    if (isMobile.value) {
        commentStore.showComment = false;
        showReply.value = false;
    }

    // 将回复框重置到默认位置
    const commentsArea = document.getElementById('comments')
    if (commentsArea && commentSendRef.value.respond) {
        commentsArea.insertAdjacentElement('afterbegin', commentSendRef.value.respond)
    }

    // 清除状态
    openReplyDom.value = false
    comment_parent_id.value = 0

    // 重置输入框
    const textarea = commentSendRef.value.respond?.querySelector('textarea')
    if (textarea) {
        textarea.placeholder = '只是一直在等你而已，才不是想被评论呢～'
        textarea.value = ''
    }
}




const sendComment = () => {
    if (!isLogin.value) {
        return checkIsLogin()
    }
    axios.post('/sendComment', {
        'comment_post_ID': props.postDetail.id,
        'comment': newComment.value,
        'comment_parent': comment_parent_id.value,
    }).then(res => {
        message({ message: '评论成功!', type: 'success' });
        if (res.data?.data) {
            var cl = res.data.data;
            if (cl.id == cl.top_comment_id) {
                comments.value = [cl, ...comments.value];
            } else {
                var td = cl.top_comment_id;
                var c = comments.value.find(c => c.id === td);
                if (c) {
                    c.children = [cl, ...c.children];
                }
            }
            isDataEmpty.value = false;
        }
        resetting();
        nextTick(() => {
            const insertComment = document.querySelector('#comment-' + cl.id);
            if (insertComment) {
                insertComment.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
            }
        });
    }).catch(err => {
        message({ message: err.response.data.message, type: 'error' });
        locked.value = false;
        resetting();
    })
};




const submit = () => {
    if (!newComment.value.trim()) {
        message({ message: '评论内容不能为空!', type: 'error' });
        return;
    }
    // 调用提交接口逻辑
    sendComment();
    newComment.value = '';
};


const changeOrder = (order) => {
    if (orderBy.value !== order) {
        orderBy.value = order;
        param.value.orderby = order;
        loading.value = true;
        jsonPageNav.value.load(1)
    }
};

const tabClick = (bool) => {
    if (showAuthorComments.value !== bool) {
        loading.value = true;
        showAuthorComments.value = bool;
        param.value.author = bool;
        jsonPageNav.value.load(1)
    }
};





const beforeCommentEnter = (el) => {
    el.style.opacity = 0
    el.style.transform = 'translateY(20px) scale(0.98)'
}

const commentEnter = (el, done) => {
    const delay = el.dataset.index * 50
    setTimeout(() => {
        el.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        el.style.opacity = 1
        el.style.transform = 'translateY(0) scale(1)'
        done()
    }, delay)
}

const commentLeave = (el, done) => {
    el.style.transition = 'all 0.3s ease-in'
    el.style.opacity = 0
    el.style.transform = 'translateY(-20px) scale(0.98)'
    setTimeout(done, 300)
}

const beforeChildEnter = (el) => {
    el.style.opacity = 0
    el.style.transform = 'translateX(30px)'
}

const childEnter = (el, done) => {
    const delay = el.dataset.childIndex * 30
    setTimeout(() => {
        el.style.transition = 'all 0.3s ease-out'
        el.style.opacity = 1
        el.style.transform = 'translateX(0)'
        done()
    }, delay)
}

const childLeave = (el, done) => {
    el.style.transition = 'all 0.2s ease-in'
    el.style.opacity = 0
    el.style.transform = 'translateX(-30px)'
    setTimeout(done, 200)
}

onServerPrefetch(async () => {
    await getComments();
})

onMounted(async () => {
    await getComments();
    console.log(commentSendRef.value.respond);
});

watch(() => commentStore.showComment, (val) => {
    if (val && !openReplyDom.value) {  // 只有没打开的时候才 open
        openReply();
    }
});

</script>


<style scoped>
/* 主评论动画 */
.comment-list-move,
.comment-list-enter-active,
.comment-list-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.comment-list-enter-from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
}

.comment-list-enter-to {
    opacity: 1;
    transform: translateY(0) scale(1);
}

.comment-list-leave-active {
    position: absolute;
    width: calc(100% - 40px);
    margin-left: 40px;
}

.comment-list-leave-to {
    opacity: 0;
    transform: translateY(-20px) scale(0.98);
}

/* 子评论动画 */
.child-comment-move,
.child-comment-enter-active,
.child-comment-leave-active {
    transition: all 0.3s ease;
}

.child-comment-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.child-comment-enter-to {
    opacity: 1;
    transform: translateX(0);
}

.child-comment-leave-active {
    position: absolute;
    width: 100%;
}

.child-comment-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}


/* 移动端适配 */
@media (max-width: 768px) {


    .comment-list-leave-active {
        width: calc(100% - 20px);
        margin-left: 20px;
    }
}




</style>