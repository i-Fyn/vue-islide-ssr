<template>
    <div class="article-footer">
        <div class="">
            <div class="like " :class="{ active: postDetail.like.is_like }" :num="postDetail.like.count">
                <div @click="vote('like', $event)">
                    <i class="ri-thumb-up-fill"></i>
                </div>
            </div>
            <div class="comment " :num="postDetail.comments" @click="goComment">
                <div>
                    <i class="ri-chat-4-fill"></i>
                </div>
            </div>
            <div class="collect " :class="{ active: postDetail.collect.is_favorite }"
                :num="postDetail.collect.count">
                <div @click="collect($event)">
                    <i class="ri-star-fill"></i>
                </div>
            </div>
            <div class="share ">
                <div>
                    <i class="ri-share-forward-fill"></i>
                </div>
                <div class="share-dropdown-menu">
                    <div class="social-share">
                        <a rel="nofollow" class="share-btn qq" target="_blank" title="QQ好友"
                            :href="shareLinks['qq']">
                            <span class="icon qq">
                                <i class="ri-qq-fill"></i>
                            </span>
                            <span>QQ好友</span>
                        </a>
                        <a rel="nofollow" class="share-btn qzone" target="_blank" title="QQ空间"
                            :href="shareLinks['qzone']">
                            <span class="icon qzone">
                                <i class="ri-star-fill"></i>
                            </span>
                            <span>QQ空间</span>
                        </a>
                        <a rel="nofollow" class="share-btn weibo" target="_blank" title="微博"
                            :href="shareLinks['weibo']">
                            <span class="icon weibo">
                                <i class="ri-weibo-fill"></i>
                            </span>
                            <span>微博</span>
                        </a>
                    </div>
                </div>
            </div>
            <div class="report ">
                <div @click="report">
                    <i class="ri-error-warning-fill"></i>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup >
import { ref, onMounted } from 'vue'
import axios from '@/dist/axios'
import { createVanModal } from '@/dist/createVanModal'
import { createMessage as message } from '@/dist/message';


const props = defineProps({
    postDetail: {
        type: Object,
        required: true
    }
})
const locked = ref(false)
const voteLocked = ref(false)
const post_id = ref(props.postDetail.id)


const shareLinks = ref({
    "title": props.postDetail.seo.title,
    "weibo": "",
    "qq": "",
    "qzone": "",
    "weixin": ""
})

const vote = (type, e) => {
    if (voteLocked.value) return;
    voteLocked.value = true;
    axios.post('/postVote', {
        type: type,
        post_id: post_id.value
    }).then(res => {
        setNum(e, res.data.like);
        voteLocked.value = false;
        message({ message: res.data.message, type: 'success' });
    }).catch(err => {
        voteLocked.value = false;
        message({ message: err.response.data.message, type: 'error' });
    })
}

function setNum(e, num) {
    if (e.target.tagName != 'DIV') {
        e = e.target.parentNode.parentNode;
    } else {
        e = e.target.parentNode;
    }

    if (e.classList.contains('active')) {
        e.classList.remove("active");
    } else {
        e.classList.add("active");

    }

    e.setAttribute('num', num)
}

const collect = (e) => {
    if (locked.value) return;
    locked.value = true;
    axios.post('/userFavorites', 'post_id=' + post_id.value).then(res => {
        setNum(e, res.data.count);
        locked.value = false;
        message({ message: res.data.message, type: 'success' });
    }).catch(err => {
        locked.value = false;
        message({ message: err.response.data.message, type: 'error' });
    })
}


const goComment = () => {
  const target = document.querySelector('#comments');
  if (!target) return;

  // 计算最终滚动位置（考虑偏移量）
  const offset = -85;
  const targetTop = target.getBoundingClientRect().top + window.scrollY;
  const finalPosition = targetTop + offset;

  // 使用原生平滑滚动
  window.scrollTo({
    top: finalPosition,
    behavior: 'smooth'
  });
}

const report = async() => {
    const singleReport = (await import('@/components/single/container/article/ArticleReport.vue')).default;
    createVanModal(singleReport,{
        size:356,
        props: {
            id: props.postDetail.id
        }
    })
}


onMounted(async() => {
    shareLinks.value.weibo = `http://service.weibo.com/share/share.php?url=${window.location.href}&title=${shareLinks.value.title}&pic=${props.postDetail.image}&sharesource=weibo`;
    shareLinks.value.qq = `http://connect.qq.com/widget/shareqq/index.html?url=${window.location.href}&title=${shareLinks.value.title}&summary=${props.postDetail.seo.description}&site=${props.postDetail.seo.title}&pics=${props.postDetail.image}&sharesource=qzone`;
    shareLinks.value.qzone = `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${window.location.href}&title=${shareLinks.value.title}&summary=${props.postDetail.seo.description}&site=${props.postDetail.seo.title}&pics=${props.postDetail.image}&sharesource=qzone`;
})



 


</script>

<style>
.article-footer .active{
color: var(--islide-main) !important;
}
</style>