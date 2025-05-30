<template>
  <div class="comment-container flex flex-col gap-1">
    <div class="comment-row flex-1 flex flex-row justify-between mb-5">
      <div class="comment-meta flex  flex-col">
        <strong class="comment-nick ">
          <nameVue :data="comment.author"></nameVue>
        </strong>
        <small class="comment-time text-base-content/60 text-sm mr-2 line-clamp-1 overflow-hidden">
          <time :datetime="comment.date" itemprop="datePublished" class="islide-timeago">{{ comment.date }}
          </time>
        </small>
      </div>
      <div class="comment-action">
        <a href="/" @click.prevent="openReply(comment.id, comment.top_comment_id, $event)"
          class="comment-action-link select-none py-2 px-3 card card-border border-base-300 mr-2 flex items-center"><i class="ri-message-fill"><span class="comment-reply"></span></i></a>
      </div>
    </div>
    <div class="comment-content comment-content-expand mt-2 overflow-hidden relative max-h-none has-[a]:my-2.5 flex flex-col gap-4">
      <span class="comment-content-expand-tip text-sm" v-if="comment.parent_user">
        回复
        <a :href="`#comment-${comment.parent_user.comment_id}`"
          @click.prevent="scrollTo(`#comment-${comment.parent_user.comment_id}>.bsnx-avatar>.user-avatar img`)"
          class="user-name mr-1 text-primary text-sm">@{{ comment.parent_user.name }}</a>
        ：
      </span>
      <span class="comment-content-text !text-sm" >
        <p v-if="comment.sticky" class="badge badge-primary badge-sm mr-1 mb-1">
          置顶
        </p>
        <p v-html="comment.content"></p>
      </span>
    </div>
    <div class="comment-extras mt-2 text-base-content/60 text-sm flex flex-wrap">
      <div class="comment-extra bg-base-200 card card-border border-base-300 py-1 px-1.5 mr-1 text-base-content/60  mt-1.5 text-[.5rem] items-center inline-flex" v-if="comment.ip">
        <span class="comment-extra-text">{{
          comment.ip }}</span>
      </div>
      <div class="comment-extra bg-base-200 card card-border border-base-300 py-1 px-1.5 mr-1 text-base-content/60  mt-1.5 text-[.5rem] items-center inline-flex" v-if="comment.user_os">
        <span class="comment-extra-text">{{ comment.user_os
          }}</span>
      </div>
      <div class="comment-extra bg-base-200 card card-border border-base-300 py-1 px-1.5 mr-1 text-base-content/60  mt-1.5 text-[.5rem] items-center inline-flex" v-if="comment.user_browser">
        <span class="comment-extra-text">{{
          comment.user_browser }}</span>
      </div>
      <div class="comment-extra bg-base-200 card card-border border-base-300 py-1 px-1.5 mr-1 text-base-content/60  mt-1.5 text-[.5rem] items-center inline-flex">
        <span @click="vote('like', comment.id, $event)" class="comment-like dislike"
          :class="{ 'voted': comment.votes }">
          <a href="javascript:void(0)">
            <i class="ri-thumb-up-line"></i><span>{{ comment.likes }}</span>
          </a></span>
      </div>
      <div class="comment-actions grow-1">
        <div class="more-menu-box  float-right relative flex grow-1 justify-end group">
          <div class="more-menu-icon text-xl z-0">
            <i class="ri-more-2-line"></i>
          </div>
          <ul class="card invisible absolute top-1.5 min-w-44 opacity-0 -translate-y-2 right-0 whitespace-nowrap bg-base-100 border border-base-300 mt-1.5 py-1.5 z-10 group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible group-hover:shadow-lg">
            <li class="px-4 flex items-center gap-3 text-sm h-9 hover:bg-base-200 cursor-pointer" @click="report($event)">投诉</li>
            <li class="px-4 flex items-center gap-3 text-sm h-9 hover:bg-base-200 cursor-pointer" @click="setCommentSticky($event)" v-if="is_admin(store) && comment.top_comment_id === comment.id">
              {{ comment.sticky ? '取消置顶' : '置顶' }}
            </li>
            <li class="px-4 flex items-center gap-3 text-sm h-9 hover:bg-base-200 cursor-pointer" @click="deleteComment($event)" v-if="is_admin(store) || comment.is_self">删除</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="comment-replies comment-replies-expand"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from '@/dist/axios';
import { createMessage as message } from '@/dist/message';
import { is_admin } from '../../../../dist/theme';
import { useStore } from '../../../../store';
import { createVanModal } from '@/dist/createVanModal'
import nameVue from '../../../user/nameVue.vue';
import { showConfirmDialog } from 'vant';
import { useLoginStatus } from '@/components/header/composables/useLoginStatus.js'
const { isLogin, checkIsLogin } = useLoginStatus()

const store = useStore()
const emit = defineEmits(['islideComments', 'deleteComment', 'setCommentSticky'])
const props = defineProps({
  comment: {
    type: Object,
    required: true
  }
})
const openReply = (comment_id, top_comment_id, $event) => {
  emit('islideComments', comment_id, top_comment_id, $event)
}

const locked = ref(false)

const scrollTo = (id) => {
  const element = document.querySelector(id);
  if (element) {
    element.style.scrollMarginTop = `64px`;
    element.classList.add('highlight');
    element.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      element.classList.remove('highlight');
    }, 1000);
  }
}

const vote = (type, comment_id, e) => {
  if (!isLogin.value) return checkIsLogin()

  if (locked.value) return;
  locked.value = true;
  axios.post('/commentVote', {
    type: type,
    comment_id: comment_id
  }).then(res => {
    var like = e.target.closest('.comment-like');
    if (like.classList.contains('voted')) {
      like.classList.remove("voted");
      message({ message: '取消点赞成功', type: 'info' });
    } else {
      like.classList.add("voted");
      message({ message: '点赞成功', type: 'success' });
    }

    locked.value = false;

    like.querySelector('span').innerText = ' ' + res.data.like
  }).catch(err => {
    locked.value = false;
    //  console.log(err);
    message({ message: err.response.data?.message, type: 'error' });
  })
}


const report = (e) => {
  const comment_id = props.comment.id;
  import('@/components/single/container/article/ArticleReport.vue').then(m => {
    createVanModal(m.default, {
      size: 356,
      props: {
        id: comment_id,
        type: 'comment'
      }
    })
  })
}


const deleteComment = (e) => {
  if (!isLogin.value) return checkIsLogin()
  showConfirmDialog({
    title: '删除评论',
    message:
      '确定要删除该评论吗？删除后评论将无法恢复。',
  })
    .then(() => {
      const comment_id = props.comment.id;
      const top_comment_id = props.comment.top_comment_id;
      axios.post('/deleteComment', { id: comment_id }).then(res => {
        message({ message: '删除成功', type: 'success' });
        emit('deleteComment', comment_id, top_comment_id)
      }).catch(err => {
        //  console.log(err);
        message({ message: err.response.data?.message, type: 'error' });
      })
    })

}

const setCommentSticky = (e) => {
  if (!isLogin.value) return checkIsLogin()
  showConfirmDialog({
    title: '置顶评论',
    message:
      '确定要置顶该评论吗？置顶后评论将会在其他评论的前面显示，并会被其他用户看到。',
  })
    .then(() => {
      const comment_id = props.comment.id;
      axios.post('/setCommentSticky', { id: comment_id }).then(res => {
        message({ message: res.data.message, type: 'success' });
        if (res.data.message === '评论已置顶') {
          emit('setCommentSticky', comment_id, true)
        } else {
          emit('setCommentSticky', comment_id, false)
        }
      }).catch(err => {
        // console.log(err);
        message({ message: err.response.data?.message, type: 'error' });
      })
    })

}




</script>