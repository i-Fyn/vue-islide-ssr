<template>
    <div class="p-4 lg:p-6 border rounded-lg"
        :class="{ 'border-success bg-success/5': item.is_best, 'border-base-200': !item.is_best }">
        <!-- 用户信息区域 -->
        <div class="mb-4">
            <div class="flex items-center gap-3">
                <a href="/" class="flex items-center gap-3">
                    <div class="relative">
                        <avatarVue :data="item.user" :size="40" ></avatarVue>
                    </div>
                    <div class="flex flex-col">
                        <nameVue :data="item.user" class="text-sm"></nameVue>
                        <div class="text-sm text-base-content/60">
                            <time>发布于 {{ item.date }} · </time>
                            <span>{{ item.ip }}</span>
                        </div>
                    </div>
                </a>
            </div>
        </div>

        <!-- 最佳答案标签 -->
        <span v-if="item.is_best"
            class="inline-flex items-center px-2 py-1 mb-4 text-sm font-medium text-success bg-success/10 rounded-4xl">
            <i class="ri-check-line mr-1"></i>已被采纳
        </span>

        <!-- 回答内容 -->
        <article :id="item.id" class="prose max-w-none">
            <AnswerContent :content="item.content"></AnswerContent>
        </article>

        <!-- 操作按钮区 -->
        <div class="mt-4">
            <div class="flex flex-wrap gap-2 text-sm">
                <button @click="likeAction(item.id, 'like')" class="btn btn-sm btn-outline rounded-4xl btn-accent"
                    :class="{ 'btn-primary': item.vote_status === 'like' }">
                    <i class="ri-thumb-up-line"></i>有用({{ item.like_count }})
                </button>
                <button @click="likeAction(item.id, 'dislike')" class="btn btn-sm btn-outline rounded-4xl btn-secondary"
                    :class="{ 'btn-primary': item.vote_status === 'dislike' }">
                    <i class="ri-thumb-down-line"></i>({{ item.dislike_count }})
                </button>
                <button v-if="is_self" @click="handleAdoptAnswer" class="btn btn-sm rounded-4xl btn-outline"
                    :class="{ 'btn-success': item.is_best, 'btn-info': !item.is_best }">
                    {{ item.is_best ? '取消采纳' : '采纳' }}
                </button>
            </div>
            <div class="flex justify-between items-center mt-4">
                <div @click="handleOpenReply(item.id)" class="  text-base-content/60 cursor-pointer">回复</div>
                <div class="relative group">
                    <div class="more-menu-box">
                        <div class="more-menu-icon">
                            <i class="ri-more-2-line"></i>
                        </div>
                        <ul class="more-menu-list box">
                            <li @click="report(item.id, 'answer')">
                                投诉
                            </li>
                            <li v-if="item.is_self" @click="deleteAnswer(item.id)">
                                删除
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- 回复框 -->
        <div v-if="openReply && currentCommentId === item.id" class="mt-4">
            <div class="p-4 bg-base-200/50 rounded-lg">
                <div class="mb-3">
                    <textarea rows="3" placeholder="给问答点赞就是支持，请勿在评论里发布+1、感谢等信息" v-model="replyContent"
                        class="w-full px-3 py-2 text-sm border border-base-200 rounded-lg resize-none bg-base-100 focus:ring-1 focus:ring-primary focus:border-primary">
                    </textarea>
                </div>
                <div class="flex flex-col gap-2">
                    <small class="text-base-content/60">评论用于指出存在的问题，提醒作者澄清改进，请勿在评论里回答或补充信息</small>
                    <div class="flex items-center justify-end gap-2">
                        <button class="btn btn-sm btn-ghost">
                            <i class="far fa-circle-info"></i>
                        </button>
                        <button class="btn btn-sm btn-ghost">
                            <i class="far fa-face-laugh"></i>
                        </button>
                        <button :disabled="replyContent.length < 5" @click="submitReply(item.id)"
                            class="btn btn-sm btn-primary w-fit" :class="{ 'btn-disabled': replyContent.length < 5 }">
                            提交评论
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 子评论列表 -->
        <div v-if="item.children.length" class="mt-4 p-4 bg-base-200/80 rounded-lg">
            <div v-for="(comment, index) in item.children" :key="index" :id="`comment-${comment.id}`"
                class="py-4 first:pt-0 last:pb-0"
                :class="{ 'border-b border-base-200': index !== item.children.length - 1 }">
                <div class="flex items-start gap-4">
                    <div class="flex-1">
                        <div class="text-sm">
                            <div class="flex flex-wrap items-start gap-1 mb-2">
                                <nameVue :data="comment.user" :icon="false" class="text-primary"
                                    style="--name-size:14px"></nameVue>
                                <template
                                    v-if="comment.parent && comment.top_parent !== comment.parent && comment.parent?.id !== comment.top_parent?.id">
                                    <span class="text-base-content/60">回复</span>
                                    <nameVue :data="comment.parent.user" :icon="false" class="text-primary"
                                        style="--name-size:14px"></nameVue>
                                </template>
                                <span class="text-base-content/60">：</span>
                                <div class="prose prose-sm" v-html="comment.content"></div>
                            </div>
                            <div class="flex flex-wrap items-center gap-3 text-sm text-base-content/60">
                                <button @click="likeAction(comment.id, 'like')"
                                    class="hover:text-primary transition-colors">
                                    <i class="ri-thumb-up-line"></i>
                                    {{ comment.like_count }}
                                </button>
                                <button @click="handleOpenReply(comment.id)"
                                    class="hover:text-primary transition-colors">回复</button>
                                <span>{{ comment.date }}</span>
                                <span>来自{{ comment.ip }}</span>
                                <div class="relative  ml-auto">
                                    <div class="more-menu-box">
                                        <div class="more-menu-icon">
                                            <i class="ri-more-2-line"></i>
                                        </div>
                                        <ul class="more-menu-list box">
                                            <li @click="report(comment.id, 'comment')">
                                                投诉
                                            </li>
                                            <li v-if="comment.is_self" @click="deleteComment(comment.id)">
                                                删除
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 子评论的回复框 -->
                        <div v-if="openReply && currentCommentId === comment.id" class="mt-3">
                            <div class="p-4 bg-base-200/50 rounded-lg">
                                <div class="mb-3">
                                    <textarea rows="3" placeholder="给问答点赞就是支持，请勿在评论里发布+1、感谢等信息" v-model="replyContent"
                                        class="w-full px-3 py-2 text-sm border border-base-200 rounded-lg resize-none bg-base-100 focus:ring-1 focus:ring-primary focus:border-primary">
            </textarea>
                                </div>
                                <div class="flex flex-col gap-2">
                                    <small class="text-base-content/60">评论用于指出存在的问题，提醒作者澄清改进，请勿在评论里回答或补充信息</small>
                                    <div class="flex items-center justify-end gap-2">
                                        <button class="text-base-content/60 hover:text-primary transition-colors">
                                            <i class="far fa-circle-info"></i>
                                        </button>
                                        <button class="text-base-content/60 hover:text-primary transition-colors">
                                            <i class="far fa-face-laugh"></i>
                                        </button>
                                        <button :disabled="replyContent.length < 5" @click="submitReply(comment.id)"
                                            class="btn btn-sm btn-primary w-fit rounded-4xl">
                                            提交评论
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>

import nameVue from '../../user/nameVue.vue';
import avatarVue from '../../user/avatarVue.vue';
import axios from '@/dist/axios';
import { ref, onMounted } from 'vue';
import { createMessage as message } from '../../../dist/message';
import { useStore } from '../../../store';
import { report } from '@/dist/theme'
import { showConfirmDialog } from 'vant';
import AnswerContent from './AnswerContent.vue';

const props = defineProps({
    item: {
        type: Object,
        default: () => { }
    },
    is_self: {
        type: Boolean,
        default: false
    }
})

const store = useStore()
const item = ref(props.item)
const openReply = ref(false)
const replyContent = ref('')
const currentCommentId = ref(null)

const emit = defineEmits(['adoptAnswer', 'insertComment', 'deleteAnswer'])

const likeAction = (id, type) => {
    if (id === item.value.id) {
        if (item.value.vote_status === type) return message({ message: '请不要重复操作', type: 'error' });
    } else {
        const index = item.value.children.findIndex(item => item.id === id)
        if (item.value.children[index].vote_status === type) return message({ message: '请不要重复操作', type: 'error' });
    }
    axios.post('/answer/vote/' + id, {
        type: type
    }).then(res => {
        if (id === item.value.id) {
            item.value.vote_status = res.data.status
            item.value.like_count = res.data.like_count
            item.value.dislike_count = res.data.dislike_count
        } else {
            const index = item.value.children.findIndex(item => item.id === id)
            item.value.children[index].vote_status = res.data.status
            item.value.children[index].like_count = res.data.like_count
            item.value.children[index].dislike_count = res.data.dislike_count
        }
    })
}



const handleAdoptAnswer = () => {
    if (item.value.is_best) {
        cancel_adopt_answer()
    } else {
        adopt_answer()
    }
}

const handleOpenReply = (id) => {
    if (currentCommentId.value === id) {
        openReply.value = false
        currentCommentId.value = null
    } else {
        openReply.value = true
        currentCommentId.value = id
    }
    replyContent.value = ''
}

const adopt_answer = () => {
    axios.post('/circle/answer/adopt', {
        answer_id: item.value.id
    }).then(res => {
        item.value.is_best = true;
        emit('adoptAnswer', item.value)
    }).catch(err => {
        message({ message: err.response?.data?.message, type: 'error' })
    })
}

const cancel_adopt_answer = () => {
    axios.post('/circle/answer/cancel-adopt', {
        answer_id: item.value.id
    }).then(res => {
        item.value.is_best = false
        emit('adoptAnswer', item.value)
    }).catch(err => {
        message({ message: err.response?.data?.message, type: 'error' })
    })
}




const submitReply = (id) => {
    axios.post('/circle/answer/comment', {
        answer_id: id,
        content: replyContent.value
    }).then(res => {
        message({ message: '回复成功', type: 'success' })
        openReply.value = false
        replyContent.value = ''
        emit('insertComment', res.data.data)
    }).catch(err => {
        message({ message: err.response?.data?.message, type: 'error' })
    })
}


const deleteAnswer = (id) => {
    showConfirmDialog({
        title: '删除回答',
        message:
            '确定要删除该回答吗？删除后回答将无法恢复。',
    })
        .then(() => {
            axios.post('/circle/answer/delete', {
                answer_id: id
            }).then(res => {
                message({ message: '删除成功', type: 'info' })
                emit('deleteAnswer', id)
            }).catch(err => {
                message({ message: err.response?.data?.message, type: 'error' })
            })
        })

}

const deleteComment = (id) => {
    showConfirmDialog({
        title: '删除评论',
        message:
            '确定要删除该评论吗？删除后评论将无法恢复。',
    })
        .then(() => {
            axios.post('/deleteComment', { id: id }).then(res => {
                message({ message: '删除成功', type: 'success' });
                emit('deleteAnswer', id)
            }).catch(err => {
                //  console.log(err);
                message({ message: err.response.data?.message, type: 'error' });
            })
        })

}

onMounted(() => {
    console.log(props.is_self)
    console.log(props.item.children)
})


</script>