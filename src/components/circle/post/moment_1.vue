<template>
    <section class="bg-base-100 rounded-lg shadow-sm hover: transition-all duration-300 overflow-hidden" :key="item['id']">
        <div class="relative" :data-id="item['id']">
            <!-- 头部信息 -->
            <div class="p-4 flex items-start gap-3">
                <div class="flex-shrink-0">
                    <a target="_blank" class="block hover:opacity-80 transition-opacity">
                        <avatarVue :data="item['author']" style="--avatar-size:42px"  />
                    </a>
                </div>
                <div class="flex-1 min-w-0">
                    <nameVue :data="item['author']" class="font-medium text-base-content hover:text-primary transition-colors text-sm" />
                    <div class="text-sm text-base-content/60 mt-1 flex items-center gap-1.5">
                        <span v-html="item['date'] + ' · ' + item['author'].ip" class="flex items-center"></span>
                        <span v-if="item['status'] == 'pending'" class="text-error bg-error/5 px-1.5 py-0.5 rounded text-sm">待审核</span>
                        <span v-if="item['tag']" class="text-primary bg-primary/5 px-1.5 py-0.5 rounded text-sm">{{ item['tag'] }}</span>
                    </div>
                </div>
                <div class="relative group">
                    <button class="p-1.5 hover:bg-base-200 rounded-full transition-colors">
                        <i class="ri-more-2-line text-base"></i>
                    </button>
                    <ul class="absolute right-0 top-full mt-1 bg-base-100 shadow-lg rounded-lg py-1 w-32 hidden group-hover:block z-10 border border-base-200">
                        <li class="px-3 py-2 hover:bg-base-200 cursor-pointer flex items-center gap-1.5 text-sm" @click="report($event)">
                            <i class="ri-flag-line"></i>投诉
                        </li>
                        <li v-if="item['manage_role']['can_best']" class="px-3 py-2 hover:bg-base-200 cursor-pointer flex items-center gap-1.5 text-sm" @click="setMomentBest($event)">
                            <i class="ri-award-line"></i>加精
                        </li>
                        <li v-if="item['manage_role']['can_sticky']" class="px-3 py-2 hover:bg-base-200 cursor-pointer flex items-center gap-1.5 text-sm" @click="setMomentSticky($event)">
                            <i class="ri-pushpin-line"></i>置顶
                        </li>
                        <li v-if="item['manage_role']['can_delete']" class="px-3 py-2 hover:bg-base-200 cursor-pointer flex items-center gap-1.5 text-sm" @click="deleteMoment($event)">
                            <i class="ri-delete-bin-line"></i>删除
                        </li>
                        <li v-if="item['manage_role']['can_edit']" class="px-3 py-2 hover:bg-base-200 cursor-pointer flex items-center gap-1.5 text-sm">
                            <i class="ri-edit-line"></i>
                            <a target="_blank" class="block w-full">编辑</a>
                        </li>
                        <li v-if="item['status'] == 'pending' && item['manage_role']['can_public']" 
                            class="px-3 py-2 hover:bg-base-200 cursor-pointer flex items-center gap-1.5 text-sm" 
                            @click="changeMomentStatus($event)">
                            <i class="ri-check-line"></i>通过审核
                        </li>
                    </ul>
                </div>
            </div>

            <!-- 内容区域 -->
            <div class="px-4 pb-4">
                <div class="cursor-pointer group" @click="savaMoment(item)">
                    <h2 class="text-base font-medium mb-2 group-hover:text-primary transition-colors">
                        <span v-if="item['best']" class="inline-block w-2 h-2 bg-primary rounded-full mr-2"></span>
                        <a>{{ item['title'] }}</a>
                    </h2>
                    <p class="text-sm text-base-content/80">
                        <a v-for="topic in item['topics']" 
                           :key="topic.id"
                           @click="router.push({ name: 'topics', params: { topic_id: topic.id } })"
                           class="text-primary hover:text-primary-focus hover:underline mr-2 transition-colors">
                            #{{ topic['name'] }}#
                        </a>
                        <span v-html="item['excerpt']"></span>
                    </p>
                </div>
                <MomentVote :item="item.vote" />
            </div>

            <!-- 底部操作栏 -->
            <div class="px-4 py-3 bg-base-200/50 flex items-center justify-between">
                <MomentCat :item="item" />
                <div class="flex items-center gap-4 text-base-content/60 text-sm">
                    <span class="flex items-center gap-1 hover:text-primary transition-colors">
                        <i class="ri-eye-line"></i>
                        {{ item['meta']['views'] }}
                    </span>
                    <button class="flex items-center gap-1 hover:text-primary transition-colors" 
                            @click="mataClick('comment', $event)">
                        <i class="ri-chat-smile-2-line"></i>
                        {{ item['meta']['comment'] }}
                    </button>
                    <button class="flex items-center gap-1 hover:text-primary transition-colors"
                            @click="mataClick('like', $event)">
                        <i class="ri-thumb-up-line"></i>
                        {{ item['meta']['like']['count'] }}
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>


<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/dist/axios'
import { useStore } from '@/store'
import { createVanModal } from '@/dist/createVanModal'
import { createMessage as message } from '@/dist/message'
import LazyLoad from 'vanilla-lazyload'
import nameVue from '@/components/user/nameVue.vue'
import avatarVue from '@/components/user/avatarVue.vue'
import MomentCat from '@/components/circle/moment/MomentCat.vue'
import { useIsMobile } from '@/dist/mobile'
import { showImagePreview } from 'vant'
import MomentVote from '../moment/MomentVote.vue'


const store = useStore()
const { isMobile } = useIsMobile()
let lazyLoader = null;
const videoPlayId = ref(null)
const router = useRouter()

const emit = defineEmits(['addStickys'])
const playStatus = ref(false)
const props = defineProps({
    item: {
        type: Object,
        default: () => { }
    },
    index: {
        type: Number,
        default: 0
    },
    selectTabs:{
        type: Object,
    }
})
const locked = ref(false)





const savaMoment = (item) => {
    store.article[item.id] = item;
    router.push(item.link)
}


const report = ($event) => {
    var post_id = getMomentId($event);
    if (post_id) {
        import('@/components/single/container/article/ArticleReport.vue').then(module => {
            createVanModal(module.default, {
                size: 356,
                props: {
                    id: Number(post_id),
                }
            });
        })
    }
}
const palyVideo = (id) => {
    const videoEl = document.querySelector(`[data-video-id="${id}"]`)
    if (videoEl) {
        videoPlayId.value = id;
    }
    playStatus.value = !playStatus.value;
}

const setMomentBest = ($event) => {
    var parentElement = $event.target.closest('.moment-card-inner')
    let h2 = parentElement.querySelector('h2');
    if (!h2) {
        h2 = parentElement.querySelector('.content');
    }
    var post_id = getMomentId($event);
    if (post_id) {
        axios.post('/setMomentBest', 'post_id=' + post_id).then(res => {

            if (res.data.type) {
                let span = document.createElement('span');
                span.className = 'moment-best';
                h2.insertBefore(span, h2.firstChild);
            } else {
                let span = h2.querySelector('.moment-best');
                if (span) {
                    h2.removeChild(span);
                }
            }

            message({ message: res.data.message, type: 'success' });
        }).catch(err => {
            message({ message: err.response.data.message, type: 'error' });
        })
    }
}

const setMomentSticky = ($event) => {
    var parentElement = $event.target.closest('.moment-item')
    var post_id = getMomentId($event);
    if (post_id) {
        axios.post('/setMomentSticky', 'post_id=' + post_id).then(res => {
            message({ message: res.data.message, type: 'success' });
            if (parentElement) {
                parentElement.remove();
            }
        }).catch(err => {
            message({ message: err.response.data.message, type: 'error' });
        })
    }
}

const deleteMoment = ($event) => {
    if (!confirm('确定要删除这个帖子吗？')) return
    var parentElement = $event.target.closest('.moment-item')
    var post_id = getMomentId($event);
    if (post_id) {
        axios.post('/deleteMoment', 'post_id=' + post_id).then(res => {
            message({ message: res.data.message, type: 'success' });
            if (parentElement) {
                parentElement.remove();
            }
        }).catch(err => {
            message({ message: err.response.data.message, type: 'error' });
        })
    }
}

const videoEnded = () => {
    videoPlayId.value = null;
    playStatus.value = false
}

const changeMomentStatus = ($event) => {
    var post_id = getMomentId($event);
    if (post_id) {
        var parentElement = $event.target.closest('.moment-card-inner')
        let pending = parentElement.querySelector('span .pending');
        axios.post('/changeMomentStatus', 'post_id=' + post_id).then(res => {
            message({ message: '审核成功', type: 'success' });
            if (pending) {
                pending.remove();
            }
        }).catch(err => {
            message({ message: err.response.data.message, type: 'error' });
        })
    }
}

// 图片列数逻辑：1 张图 1 列，其余 3 列
const getColumnNum = (count) => {
    if (isMobile.value) {
        return count === 1 ? 3 : (count === 2 ? 2 : 3);
    } else {
        return 3
    }
};

// 图片尺寸：1 张图时不限制正方形，允许自然长宽比
const getImageStyle = (count) => {
    return count === 1
        ? { width: '100%', height: 'auto', borderRadius: '6px', overflow: 'hidden' }
        : { width: '100%', aspectRatio: '1 / 1', borderRadius: '6px', overflow: 'hidden' };
};



const mataClick = (type, event) => {
    if (type == 'like') {
        doLike(event)
    } else if (type == 'comment') {
        router.push('/moment/' + getMomentId(event) + '#comments')
    }
}
const doLike = (event) => {
    if (locked.value) return;
    axios.post('/postVote', {
        post_id: getMomentId(event),
    }).then(res => {
        locked.value = false;
        setNum(res.data.count, event.target.closest('span'))
        message({ message: res.data.message, type: 'success' });
    }).catch(err => {
        message({ message: err.response.data.message, type: 'error' });
    })

}

function getMomentId(event) {
    var momentCardInnerElement = event.target.closest('.moment-card-inner');
    if (momentCardInnerElement) {
        var dataId = momentCardInnerElement.getAttribute('data-id');
        return dataId;
    } else {
        return null;
    }
}

const setNum = (num, e) => {
    if (e.classList.contains('active')) {
        e.classList.remove("active");
    } else {
        e.classList.add("active");
    }
    e.setAttribute('num', num)
}


const previewImages = (item, startIndex) => {
    const images = item['attachment']['image'].map(img => img.url || img.src || img.thumb)
    showImagePreview({
        images,
        startPosition: startIndex,
        closeable: true,
        showIndex: true,
        teleport: 'body'
    })
}


const go = (link) => {
    router.push(link)
}

const getVideoStyle = (video) => {
    var videoRatio = '';
    if (video[0]['height'] && video[0]['width']) {
        if (video[0].width < video[0].height) {
            videoRatio = Math.round((video[0].height / video[0]['width']) * 100000) / 100000;
        }
    }
    if (videoRatio) {
        return "max-width: 274px;";
    } else {
        return '';
    }

}


const getVideoStyle_ = (video) => {
    var videoRatio = '';
    if (video[0]['height'] && video[0]['width']) {
        if (video[0].width < video[0].height) {
            videoRatio = Math.round((video[0].height / video[0]['width']) * 100000) / 100000;
        }
    }
    if (videoRatio) {
        return "padding-bottom:" + (videoRatio * 100) + "%;";
    } else {
        return '';
    }

}


onMounted(() => {
    lazyLoader = new LazyLoad({
        elements_selector: '.lazyload',
    })
    nextTick(() => {
        lazyLoader.update()
    })
})


</script>

<style>
.topic-item.circle {
    /* 限制文字长度一行 */
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    line-clamp: 1;
}

.moment-list-wrap {
    min-height: 500px;
    background: var(--bg-main-color) !important;
}

.circle-moment-list:is(.islide-waterfall) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}
</style>