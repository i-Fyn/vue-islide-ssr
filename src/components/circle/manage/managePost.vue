<template>
    <div class="post-manage form-container">
        <form>
            <label class="form-item flex justify-between items-center gap-4">
                <input class="input" v-model="searchText" type="text" autocomplete="off" maxlength="100"
                    placeholder="搜索圈子内帖子" @input="handleInput" @compositionstart="composing = true"
                    @compositionend="composing = false">
                <span class="icon"><i class="ri-search-2-line"></i></span>
            </label>
        </form>
        <div class="circle-tabs-nav" v-if="!searchText">
            <div class="circle-tabs-nav-inner flex justify-between items-center">
                <div class="tabs">
                    <div :class="[{ 'tab-active': tabType == index }]" v-for="(item, index) in tabs" v-text="item"
                         class="tab"
                        :key="index" @click="changeTab(index)"></div>
                </div>
                <div class="orderby-wrap">
                    <div class="orderby">
                        <span>默认排序</span>
                        <i class="ri-arrow-down-s-line"></i>
                    </div>
                    <ul class="orderby-list box">
                        <li class="orderby-item" :class="[{ active: orderby == index }]"
                            v-for="(item, index) in orderbyList" v-text="item" :key="index"
                            @click="changeOrderby(index)"></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="post-list post-2">
            <ul class="islide-grid scroll-y" v-if="postList.length">
                <li class="post-list-item" v-for="(item, index) in postList">
                    <div class="item-in flex">
                        <div class="post-module-thumb" v-if="item.attachment.image[0]">
                            <div class="post-thumbnail" style="padding-top: 65%;">
                                <div class="thumb-link">
                                    <img class="post-thumb w-h card overflow-hidden" :src="item.attachment.image[0].thumb">
                                </div>
                            </div>
                        </div>
                        <div class="post-info w-full  flex-1 flex flex-col text-sm">
                            <h2 class="text-sm">
                                <span class="moment-best" v-if="item.best"></span>
                                <span class="moment-sticky" v-if="item.sticky"></span>
                                <span class="post-status" :class="item.status" v-text="item.status_name"
                                    v-if="item.status == 'pending'"></span>
                                <span class="text-sm" v-html="item.title ? item.title : item.content"></span>
                            </h2>
                            <div class="post-info-buttom flex justify-between mt-auto">
                                <div class="buttom-left">
                                    <span class="post-date" v-html="item.date"></span>
                                    <span class="post-views">
                                        阅读 {{ item.meta.views }}
                                    </span>
                                    <span class="comment">
                                        评论 {{ item.meta.comment }}
                                    </span>
                                    <span class="like">
                                        喜欢 {{ item.meta.like.count }}
                                    </span>
                                    <span class="collect">
                                        收藏 {{ item.meta.collect.count }}
                                    </span>
                                </div>
                                <div class="more-menu-box">
                                    <div class="more-menu-icon">
                                        <i class="ri-more-2-line"></i>
                                    </div>
                                    <ul class="more-menu-list box">
                                        <li v-if="item.status == 'pending'" @click="changeMomentStatus(item)">通过审核</li>
                                        <li @click="setMomentBest(item)">加精</li>
                                        <li @click="setMomentSticky(item)">置顶</li>
                                        <li @click="deleteMoment(item, index)">删除</li>
                                        <li @click="">编辑</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <template v-else-if="isDataEmpty">
                <van-empty image-size="10rem" description="暂无内容" />
            </template>
        </div>
        <div class="islide-pagenav json-nav pt-4">
            <PageNav ref="jsonPageNav" :paged="paged" :pages="pages" navtype="json" type="page" :api="api"
                :param="param" @change="changePosts" v-once></PageNav>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import axios from '@/dist/axios';
import PageNav from '@/components/footer/PageNav.vue';
import { useRoute } from 'vue-router';
import { createMessage as message } from '@/dist/message';


const route = useRoute()
const props = defineProps({
    currentUser: {
        type: Object,
        required: true
    }
})

const locked = ref(false)
const loading = ref(false)
const isDataEmpty = ref(false)
const jsonPageNav = ref(null)

const paged = ref(1)
const pages = ref(1)
const postList = ref([])
const posts = ref([])

const param = ref({
    size: 10,
    circle_id: route.params.circle_id,
    post_status: ''
})
const api = ref('getManageMomentList')

const circle_id = ref(route.params.circle_id)
const composing = ref(false)
const searchText = ref('')
const tabType = ref('all')
const orderby = ref('')
const tabs = ref({
    all: '全部',
    pending: '待审核',
})
const typingTimer = ref(null)
const orderbyList = ref({
    '': '默认排序',
    'date': '发布时间',
    'comment_date': '回复时间',
    'modified': '修改时间',
    'random': '随机排序',
    'comments': '评论数最多',
    'views': '浏览数最多',
    'like': '点赞数最多',
})

onMounted(() => {
    if (jsonPageNav.value) {
        loading.value = true;
        jsonPageNav.value.load(1)
    }
})

const changePosts = (data) => {
    postList.value = posts.value = [];
    posts.value = data.data;
    postList.value = posts.value;
    loading.value = false;
    locked.value = false;
    isDataEmpty.value = !postList.value.length
}

const changeTab = (type, orderby = false) => {

    if (type == tabType.value && !orderby) return;
    tabType.value = type;
    param.value.post_status = ''
    if (tabType.value == 'pending') {
        param.value.post_status = tabType.value
    }

    jsonPageNav.value.pageCount = 1;
    loading.value = true;
    isDataEmpty.value = false;

    nextTick(() => {
        jsonPageNav.value.load(1);
    });
}
const changeOrderby = (type) => {
    param.value.orderby = orderby.value = type
    changeTab(tabType.value, true)
}

const handleInput = () => {
    if (searchText.value.trim()) {
        postList.value = [];
        loading.value = true;
    }
    // 如果不是中文输入状态，则调用getSuggestions方法
    if (!composing.value) {
        clearTimeout(typingTimer.value);
        typingTimer.value = setTimeout(() => {
            circleSearchPosts();
        }, 500);
    }
}

const circleSearchPosts = () => {
    if (!searchText.value.trim()) return;
    loading.value = true;
    let param = {
        search: searchText.value.trim(),
        circle_id: circle_id.value,
    }

    axios.post('/getManageMomentList', param).then(res => {
        postList.value = res.data.data

        isDataEmpty.value = !postList.value.length

        loading.value = false;
    }).catch(err => {
        loading.value = false;
        message({ message: err.response.data.message, type: 'error' });
    })
}


const setMomentBest = (item) => {
    if (locked.value == true) return
    locked.value = true

    axios.post('/setMomentBest', 'post_id=' + item.id).then(res => {
        message({ message: res.data.message, type: 'success' });
        item.best = !item.best
        locked.value = false
    }).catch(err => {
        locked.value = false
        message({ message: err.response.data.message, type: 'error' });
    })
}

const setMomentSticky = (item) => {
    if (locked.value == true) return
    locked.value = true

    axios.post('/setMomentSticky', 'post_id=' + item.id).then(res => {

        message({ message: res.data.message, type: 'success' });
        item.sticky = !item.sticky
        locked.value = false

    }).catch(err => {
        locked.value = false
        message({ message: err.response.data.message, type: 'error' });
    })
}
const deleteMoment = (item, index) => {
    if (!confirm('确定要删除这个帖子吗？')) return
    if (locked.value == true) return
    locked.value = true
    axios.post('/deleteMoment', 'post_id=' + item.id).then(res => {
        message({ message: res.data.message, type: 'success' });
        nextTick(() => {
            postList.value.splice(index, 1);
            posts.value.splice(index, 1);
        })
        locked.value = false
    }).catch(err => {
        locked.value = false
        message({ message: err.response.data.message, type: 'error' });
    })
}

const changeMomentStatus = (item) => {
    if (locked.value == true) return
    locked.value = true

    axios.post('/changeMomentStatus', 'post_id=' + item.id).then(res => {
        message({ message: '审核成功', type: 'success' });
        item.status = 'publish';
        item.status_name = '已发布';
        locked.value = false
    }).catch(err => {
        locked.value = false
        message({ message: err.response.data.message, type: 'error' });
    })
}

watch(searchText, (newVal) => {
    searchText.value = newVal.trim()
    if (!searchText.value) {
        jsonPageNav.value.load(1)
    }
})



</script>

<style scoped>
.post-manage {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.post-manage .circle-tabs-nav {
    position: unset;
    background: none;
    padding: 0;
}

.post-manage .circle-tabs-nav .circle-tabs-nav-inner {
    box-shadow: none;
    padding: 0;
}

.post-manage .circle-tabs-nav .tabs-nav {
    margin: 0;
}

.post-manage .circle-tabs-nav .tabs-nav:after {
    display: none;
}

.post-manage .post-list {
    flex: 1;
    overflow: hidden;
}

.post-manage .post-list .post-list-item+.post-list-item {
    padding-top: 16px;
    border-top: 1px solid var(--color-base-300);
}

.post-manage .islide-grid {
    display: block;
}

.post-manage .item-in,
.post-manage .post-info {
    padding: 0;
}

.post-manage .post-info h2 {
    margin-bottom: 0;
}

.post-manage .item-in>.post-module-thumb {
    width: 100px;
    padding-right: 12px;
}

.post-manage .post-status {
    padding: 4px 8px;
    border-radius: 15px;
    font-size: 12px;
}

.post-manage .post-status.pending {
    color: #2196F3;
    background-color: rgb(33 150 243 / 10%);
}

.post-manage .post-info-buttom .buttom-left {
    display: flex;
    grid-gap: 16px;
    position: relative;
    align-items: center;
}
</style>