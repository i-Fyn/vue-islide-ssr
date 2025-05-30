<template>
    <div class="single-page -mt-4 lg:mt-0">
        <div class="mx-auto lg:pt-4 h-full lg:h-[calc(100vh-var(--top-menu-height)-96px)]">
            <div class="bg-base-100  rounded-none max-h-full overflow-hidden
    md:static md:rounded-[12px] md:max-h-[calc(100vh-var(--top-menu-height)-100px )]
    md:max-w-[1000px] md:mx-auto
    h-full w-full flex
    lg:border-1 lg:border-base-300">

                <!-- 左侧消息列表 -->
                <div class="w-full md:w-[280px] border-r border-base-200 flex flex-col h-full "
                    v-if="((clientWidth < 768 && index === '' && data.length) || clientWidth > 768)">
                    <div class="hidden lg:block p-4 border-b border-base-200 flex-shrink-0">
                        <h2 class="text-lg font-bold">消息列表</h2>
                    </div>

                    <div class="flex-1 scroll-y">
                        <div class="chat-list-wrapper">
                            <div v-for="(item, i) in data" @click="indexChange(i)"
                                class="flex items-center p-4 gap-3 cursor-pointer hover:bg-base-200 transition-colors h-full"
                                :class="{ 'bg-base-200': index === i }">

                                <div class="relative">
                                    <div class="avatar">
                                        <div class="w-12 h-12 rounded-full">
                                            <van-image lazy-load :src="item.from.avatar" />
                                        </div>
                                    </div>
                                    <div v-if="item.unread" class="badge badge-error badge-sm absolute -top-1 -right-1">
                                        {{ item.unread }}
                                    </div>
                                </div>

                                <div class="flex-1 min-w-0">
                                    <div class="flex justify-between">
                                        <span class="font-medium truncate">{{ item.from.name }}</span>
                                        <span class="text-sm text-base-content/60" v-html="item.date"></span>
                                    </div>
                                    <div class="text-sm text-base-content/70 truncate" v-html="item.content"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 右侧聊天区域 -->
                <div class="flex-1 h-screen lg:h-full overflow-hidden"
                    v-if="(clientWidth < 768 && index !== '') || clientWidth > 768">
                    <div class="flex flex-col h-full relative" v-if="index !== ''">
                        <!-- 聊天头部 -->
                        <div
                            class="fixed top-0 left-0 right-0 lg:relative flex items-center justify-center p-4 border-b border-base-200 z-1003 bg-base-100 h-[var(--top-menu-height)] flex-shrink-0">
                            <button class="btn btn-ghost btn-circle md:hidden absolute left-4" @click="backClick">
                                <i class="ri-arrow-left-s-line text-xl"></i>
                            </button>
                            <h3 class="text-lg font-bold" v-html="data[index].from.name"></h3>
                        </div>

                        <!-- 聊天内容区域 -->
                        <div class="message-list flex-1 p-4 scroll-y" ref="messageList">
                            <div class="space-y-4">
                                <template v-for="(item, idx) in list" :key="idx">
                                    <!-- 时间分割线 -->
                                    <div v-if="item.showDate" class="text-center">
                                        <span class="px-2 py-1 rounded text-sm bg-base-100" v-html="item.date"></span>
                                    </div>


                                    <!-- 互动消息 -->
                                    <div class="chat" :class="item.is_self ? 'chat-end' : 'chat-start'"
                                        v-if="!item.title">
                                        <div class="chat-image avatar">
                                            <div class="user-avatar w-10 rounded-full"><img
                                                    alt="Tailwind CSS chat bubble component" :src="item.from.avatar">
                                            </div>
                                        </div>
                                        <div class="chat-header">{{ item.from.name }} <time class="text-sm opacity-50"
                                                v-html="item.date"></time></div>
                                        <div class="chat-bubble">
                                            <div v-if="item.mark.type == 'image'">
                                                <van-image lazy-load :style="containerStyle(item.mark)"
                                                    :src="item.mark.url" />
                                            </div>

                                            <!-- 文本消息 -->
                                            <div v-else-if="item.content" v-html="item.content">
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 系统通知 -->
                                    <div v-else class="card bg-base-100">
                                        <div class="card-body p-4">
                                            <h4 class="card-title text-base">{{ item.title }}</h4>
                                            <p v-html="item.content"></p>
                                            <div class="flex flex-wrap gap-2 mt-2">
                                                <div v-for="meta in item.mark.meta" class="badge badge-outline">
                                                    {{ meta.key }}: {{ meta.value }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>

                        <!-- 输入框区域 -->
                        <div v-if="data[index].type == 'chat'"
                            class="border-t border-base-200 p-4 lg:relative fixed bottom-0 w-full bg-base-100 z-1002 flex h-[var(--top-menu-height)] flex-shrink-0">
                            <div class="flex items-center gap-2 ">
                                <label class="btn btn-circle btn-ghost">
                                    <input type="file" class="hidden" accept="image/*" @change="handleFileUpload"
                                        :disabled="locked">
                                    <i class="ri-image-add-line text-xl"></i>
                                </label>

                                <div class="relative">
                                    <button class="btn btn-circle btn-ghost" @click.stop="showEmoji = !showEmoji">
                                        <i class="ri-emotion-line text-xl"></i>
                                    </button>
                                    <CommentEmoji v-click-outside="() => showEmoji = false" v-model="showEmoji"
                                        @emoji-click="handleClick" />
                                </div>
                            </div>

                            <div class="join w-full gap-4 flex justify-between">
                                <input type="text" v-model="messageContent" ref="textarea" placeholder="说点什么..."
                                    class="input flex-1 rounded-full" />
                                <button class="btn btn-primary rounded-full btn-soft" @click="sendMessage">发送</button>
                            </div>
                        </div>
                    </div>

                    <!-- 空状态 -->
                    <div v-else class="h-full flex flex-col items-center justify-center text-base-content/60">
                        <van-empty image-size="10rem" description="快找小伙伴聊天吧 ( ゜- ゜)つロ" />
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup name="PageMessage">
import { ref, onMounted, nextTick, watch, onActivated, onDeactivated } from 'vue'
import axios from '@/dist/axios'
import CommentEmoji from '@/components/single/container/comment/CommentEmoji.vue';
import { useRoute, useRouter } from 'vue-router';
import { createMessage as message } from '@/dist/message';
import { useHead } from '@unhead/vue';
import LazyLoad from 'vanilla-lazyload'
import { useIsMobile } from '@/dist/mobile'
import { islideSetQueryParams } from '@/dist/theme'
const { cWidth } = useIsMobile()
import { useStore } from '../store';
import { io } from 'socket.io-client';

const store = useStore();
const data = ref('');
const index = ref('');
const list = ref([]);
const paged = ref(0);
const pages = ref(0);
const locked = ref(false);
const loadingMore = ref(false);
const messageContent = ref('');
const selectedImage = ref(null); // 图片
const imageId = ref(0); // 图片ID
const paramValue = ref('');
const timeThreshold = ref(600); // 时间间隔的阈值，单位为秒，默认为10分钟
const scrollHeightBeforeLoad = ref(0); // 加载更多之前的高度
const noMore = ref(false);
const showEmoji = ref(false);
const emoji = ref([]);
const clientWidth = ref(0);
const messageList = ref(null);
const textarea = ref(null);
const user_id = ref(null);
const route = useRoute();
const router = useRouter();
const socket = ref(null);
//懒加载
var lazyLoadInstance = null;


watch(cWidth, (newVal, oldVal) => {
    clientWidth.value = newVal
})

// 新增防抖函数
const debounce = (fn, delay = 100) => {
    let timer;
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => fn(...args), delay)
    }
}

// 初始化 WebSocket 连接
const initSocket = (id) => {
    socket.value = io(window.location.origin, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    });

    socket.value.on('connect', () => {
        console.log('WebSocket 连接成功');
        // 加入自己的房间
        if (id) {
            socket.value.emit('join', Number(id));
            console.log('已加入房间:', id);
        } else {
            console.log('没有用户信息')
        }
    });

    socket.value.on('disconnect', () => {
        console.log('WebSocket 连接断开');
    });

    socket.value.on('newMessage', (msg) => {
        console.log('收到新消息:', msg);
        // 如果不在消息页面，显示 toast 提醒
        if (route.name !== 'message') {
            message({ 
                message: `收到来自 ${msg.from.name} 的新消息`, 
                type: 'info',
                duration: 3000
            });
        }
        handleNewMessage(msg);
    });

    socket.value.on('error', (error) => {
        console.error('WebSocket 错误:', error);
    });
};

// 处理新消息
const handleNewMessage = (msg) => {
    if (!msg || !msg.from) {
        console.warn('收到无效消息:', msg);
        return;
    }

    // 如果当前正在查看的是发送消息的聊天
    if (index.value !== '' && Number(data.value[index.value]?.from?.id) === Number(msg.from.id)) {
        console.log('当前聊天窗口收到新消息');
        // 将新消息添加到列表
        list.value.push({
            id: msg.id,
            from: msg.from,
            date: msg.date,
            title: msg.title,
            content: msg.content,
            type: msg.type,
            mark: msg.mark || {},
            is_self: false,
            time: parseInt(msg.time),
            showDate: shouldShowDate(parseInt(msg.time))
        });

        // 更新最后一条消息
        if (data.value[index.value]) {
            data.value[index.value].content = msg.content;
            data.value[index.value].date = msg.date;
        }

        // 滚动到底部
        nextTick(() => {
            scrollToBottom();
            lazyLoadInstance.update();
        });
    } else {
        console.log('其他聊天窗口收到新消息');
        // 更新未读消息数
        const chatIndex = data.value.findIndex(item => Number(item?.from?.id) === Number(msg.from.id));
        if (chatIndex !== -1 && data.value[chatIndex]) {
            data.value[chatIndex].unread = (data.value[chatIndex].unread || 0) + 1;
            data.value[chatIndex].content = msg.content;
            data.value[chatIndex].date = msg.date;
        } else {
            // 如果是新对话，添加到消息列表
            data.value.unshift({
                from: msg.from,
                content: msg.content,
                date: msg.date,
                type: msg.type,
                unread: 1
            });
        }
    }
};

// 判断是否显示日期
const shouldShowDate = (currentTime) => {
    if (!currentTime) return true;
    if (list.value.length === 0) return true;
    const lastMessage = list.value[list.value.length - 1];
    return !lastMessage?.time || (currentTime - lastMessage.time > timeThreshold.value);
};

onMounted(() => {
    store.fetchUserInfo().then(res => {
        console.log(res)
        if (res.id) {
            user_id.value = res.id;
            initSocket(res.id); // 初始化 WebSocket
        }
    })
    lazyLoadInstance = new LazyLoad({
        elements_selector: ".lazyload",
        threshold: 0,
    });
    paramValue.value = route.query.whisper || route.query.type;
    clientWidth.value = cWidth.value;

    (/iphone|ipod|ipad/i.test(navigator.appVersion)) && document.addEventListener(
        'blur',
        event => {
            // 当页面没出现滚动条时才执行，因为有滚动条时，不会出现这问题
            // input textarea 标签才执行，因为 a 等标签也会触发 blur 事件
            if (
                document.documentElement.offsetHeight <=
                document.documentElement.clientHeight &&
                ['input', 'textarea'].includes(event.target.localName)
            ) {
                document.body.scrollIntoView() // 回顶部
            }
        },
        true
    )
    fetchData()
})

const fetchData = () => {
    axios.post('/getContactList').then(res => {
        data.value = res.data
        var ind = data.value.findIndex(item => item.type === paramValue.value || item.from?.id === paramValue.value);
        if (ind != -1 && paramValue.value) {
            indexChange(ind)
        } else if (!isNaN(paramValue.value) && paramValue.value) {
            axios.post('/getContact', { user_id: paramValue.value }).then(res => {
                data.value.unshift(res.data); // 将指定元素添加到数组的开头
                index.value = 0
            }).catch(err => {
                router.push({ name: 'message' })
                message({ message: err.response.data.message, type: 'error' });
            })
        }
    }).catch(err => {
        message({ message: err.response.data.message, type: 'warning' });
    });
}


function sendMessage() {
    if (messageContent.value.trim() === '' && !selectedImage.value) {
        return;
    }

    axios.post('/sendMessage', {
        user_id: data.value[index.value].from.id,
        content: messageContent.value,
        image_id: imageId.value
    }).then(res => {
        // 将发送的消息追加到消息列表中
        res.data.is_self = true;
        list.value.push(res.data);

        // 更新联系人列表中的最后一条消息
        data.value[index.value].content = res.data.content;
        data.value[index.value].date = res.data.date;

        nextTick(() => {
            lazyLoadInstance.update()
        })

        // 滚动到底部
        scrollToBottom();
    }).catch(err => {
        message({ message: err.response.data.message, type: 'warning' });
    });

    // 清空输入框内容
    messageContent.value = '';
    selectedImage.value = null;
    imageId.value = 0
}


// 优化后的滚动处理
const handleScroll = debounce(() => {
    const ml = messageList.value
    const threshold = 100 // 距离顶部阈值

    if (ml.scrollTop < threshold &&
        !loadingMore.value &&
        !noMore.value) {
        loadMore()
    }
})


function loadMore() {
    // 获取新消息前的滚动高度
    scrollHeightBeforeLoad.value = messageList.value.scrollHeight;
    loadingMore.value = true;
    getMessageList();
}

function indexChange(ind) {
    if (ind === index.value) return;
    list.value = []
    index.value = ind
    paged.value = 0
    pages.value = 0
    loadingMore.value = false
    noMore.value = false
    locked.value = false;

    if (data.value[index.value].from.id) {
        islideSetQueryParams({
            whisper: data.value[index.value].from.id
        });
    } else {
        islideSetQueryParams({
            type: data.value[index.value].type
        });
    }

    nextTick(() => {
        messageList.value.removeEventListener('scroll', handleScroll);
    });

    getMessageList()
}
function backClick() {
    list.value = []
    index.value = ''
    paged.value = 0
    pages.value = 0
    loadingMore.value = false
    noMore.value = false
    locked.value = false;
    // 获取当前地址栏的URL
    var url = new URL(window.location.href);
    // 清空URLSearchParams对象
    url.search = '';
    history.replaceState(history.state, '', url);
}


function getMessageList() {
    paged.value++
    if (paged.value > pages.value && paged.value != 1) return;
    locked.value = true;

    var requestData = {
        type: data.value[index.value].type,
        id: data.value[index.value].id,
        sender_id: data.value[index.value].type == 'chat' ? data.value[index.value].from.id : 0,
        unread: data.value[index.value].unread,
        paged: paged.value
    }

    axios.post('/getMessageList', requestData).then(res => {

        if (data.value[index.value].type == 'chat' || data.value[index.value].type == 'vip' || data.value[index.value].type == 'circle' || data.value[index.value].type == 'distribution') {
            list.value.unshift(...filteredList(res.data.data))
        } else {
            list.value.push(...res.data.data)
        }



        if (paged.value > 1 && res.data.data.length > 0 && (data.value[index.value].type == 'chat' || data.value[index.value].type == 'vip' || data.value[index.value].type == 'circle' || data.value[index.value].type == 'distribution')) {
            nextTick(() => {
                messageList.value.scrollTop = scrollHeightBeforeLoad.value;

            });
        }

        pages.value = res.data.pages;
        locked.value = false;
        loadingMore.value = false;
        if (pages.value <= paged.value) {
            noMore.value = true
        } else {
            nextTick(() => {
                messageList.value.addEventListener('scroll', handleScroll);
            });
        }

        if (paged.value == 1 && (data.value[index.value].type == 'chat' || data.value[index.value].type == 'vip' || data.value[index.value].type == 'circle' || data.value[index.value].type == 'distribution')) {
            addLoadEvent(scrollToBottom())
        }

        nextTick(() => {
            lazyLoadInstance.update()
        })

        //  imgFancybox('.img-msg img')
    })
}

function handleFileUpload(event) {
    if (event.target.files.length <= 0) return
    if (locked.value == true) return
    locked.value = true
    let file = event.target.files[0]
    event.target.value = '';

    if (file.size <= 1 * 1024000) {
        let formData = new FormData()
        formData.append('file', file, file.name)
        formData.append("post_id", 1)
        formData.append("type", 'post')

        axios.post('/fileUpload', formData).then(res => {
            imageId.value = res.data.id
            selectedImage.value = res.data.url
            locked.value = false
            sendMessage()


        }).catch(err => {
            let msg = err.response.data.message
            msg = msg ? msg : '上传失败，请重新上传'

            message({ message: msg, type: 'warning' });
            selectedImage.value = null
            imageId.value = 0
            locked.value = false
        })

    } else {
        message({ message: "文件[" + file.name + "]大小超过限制，最大1M，请重新选择", type: 'error' });
        locked.value = false
    }
}

function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function () {
            oldonload();
            func();
        }
    }
}


function handleClick(_emoji) {
    messageContent.value += "[" + _emoji.name + "]";
    emoji.value.push({ [_emoji.name]: '<img class="emoticon-image ' + _emoji.size + '" src="' + _emoji.icon + '">' });
    textarea.value.focus()
}

function scrollToBottom() {
    nextTick(() => {
        var messageLists = document.querySelector('.message-list');
        if (messageLists) {
            messageList.value.scrollTop = messageLists.scrollHeight;
        }
    });
}

function filteredList(list) {

    let filteredList = [];
    let prevTime = null;

    for (let i = 0; i < list.length; i++) {
        let item = list[i];
        let currentTime = item.time;

        if (!prevTime || currentTime - prevTime > timeThreshold.value) {
            // 时间间隔大于阈值，显示时间
            item.showDate = true;
        } else {
            item.showDate = false;
        }

        filteredList.push(item);
        prevTime = currentTime;
    }

    return filteredList;
}

function containerStyle(mark) {
    const maxWidth = 320;
    const maxHeight = 320;
    const scale = Math.min(maxWidth / mark.width, maxHeight / mark.height);
    const width = mark.width * scale;
    const height = mark.height * scale;

    return {
        width: `${width}px`,
        height: `${height}px`
    };
}

onDeactivated(() => {
    // 不再断开 WebSocket 连接
    console.log('组件失活，保持 WebSocket 连接');
});

</script>

<style>
.route-message .footer-wrapper {
    display: none;
}

.chat-list-wrapper {
    padding-bottom: env(safe-area-inset-bottom);
}
</style>
