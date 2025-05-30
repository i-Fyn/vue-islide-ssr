<template>
    <div id="respond" class="comment-send  flex" ref="respond">
        <div class="comment-user-avatar m-3">
            <avatarVue :data="postDetail.author" style="--avatar-size:42px" />
        </div>
        <div class="comment-textarea-container flex-1" style="--van-cell-background:var(--color-base-200)">
            <!-- 使用 v-model 绑定到 `localComment` -->
            <van-cell-group inset style="--van-cell-group-inset-padding: 10px;--van-cell-horizontal-padding: 10px;">
                <van-field v-model="localComment" rows="2" autosize type="textarea" placeholder="只是一直在等你而已，才不是想被评论呢～"
                    maxlength="100" show-word-limit @keydown.enter="isMobile ? $emit('submit', localComment) : ''"
                    enterkeyhint="发送" />
            </van-cell-group>
            <div class="comment-button flex mt-2.5 items-center justify-between relative text-sm">
                <div class="comment-botton-left  flex gap-2.5 justify-center items-center">
                    <label class="comment-image flex flex-row gap-1 items-center py-0.5 px-2 card card-border border-base-300 text-s text-base-content/60">
                        <input accept="image/jpg,image/jpeg,image/png,image/gif" type="file"
                            @change="handleFileUpload($event)" style=" display: none;" :disabled="locked"
                            ref="imageInput">
                        <i class="ri-image-add-line"></i>图片
                    </label>
                    <span class="comment-emoji flex flex-row gap-1 items-center py-0.5 px-2 card card-border border-base-300 text-s text-base-content/60" @click.stop="toggleEmoji"><i class="ri-emotion-happy-line"></i>表情</span>
                    <!-- 传递本地的响应式变量给 CommentEmoji -->
                    <CommentEmoji v-click-outside="() => localShowEmoji = false" v-model="localShowEmoji"
                        @emoji-click="handleClick">
                    </CommentEmoji>
                </div>
                <button v-if="!isMobile" type="submit" class="comment-submit py-1.5 px-5 btn btn-soft btn-accent btn-sm mr-4" @click="$emit('submit', localComment)">
                    评论
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from "vue";
import CommentEmoji from "./CommentEmoji.vue";
import axios from "@/dist/axios";
import avatarVue from "../../../user/avatarVue.vue";
import { createMessage as message } from "@/dist/message";
import { useIsMobile } from "../../../../dist/mobile";
const emit = defineEmits(['update:newComment', 'update:showEmoji', 'submit'])

const props = defineProps({
    postDetail: {
        type: Object,
        required: true,
    },
    newComment: {
        type: String,
        default: "",
    },
    showEmoji: {
        type: Boolean,
        default: false,
    }
});

const { isMobile } = useIsMobile();
const locked = ref(false); // 锁定状态
const localComment = ref(props.newComment); // 本地响应式状态
const localShowEmoji = ref(false); // 本地的 showEmoji 状态
const respond = ref(null); // 响应式的 respond 元素


// 监听 `localComment` 的变化，并触发父组件的 `update:newComment` 事件
watch(localComment, (newValue) => {
    emit("update:newComment", newValue);
});

// 同步父组件的 `newComment` 到本地状态
watch(
    () => props.newComment,
    (newValue) => {
        localComment.value = newValue;
    }
);

// 监听 `localShowEmoji` 的变化，并触发父组件的 `update:showEmoji` 事件
watch(localShowEmoji, (newValue) => {
    emit("update:showEmoji", newValue);
});

// 同步父组件的 `showEmoji` 到本地状态
watch(
    () => props.showEmoji,
    (newValue) => {
        localShowEmoji.value = newValue;
    }
);

const handleClick = (emoji) => {
    localComment.value += "[" + emoji.name + "]";
    localShowEmoji.value = !localShowEmoji.value;
};

const toggleEmoji = () => {
    console.log(localShowEmoji.value)
    if (!localStorage.getItem('token')) return message({ message: '请先登录', type: 'warning' });
    console.log(localShowEmoji.value)
    localShowEmoji.value = !localShowEmoji.value;
};

function handleFileUpload(event) {
    if (!localStorage.getItem('token')) return message({ message: '请先登录', type: 'warning' });
    if (event.target.files.length <= 0) return
    if (locked.value == true) return
    locked.value = true
    let file = event.target.files[0]
    event.target.value = '';

    if (file.size <= 1 * 1024000) {
        let formData = new FormData()
        formData.append('file', file, file.name)
        formData.append("post_id", props.postDetail.id)
        formData.append("type", 'comment')

        axios.post('/fileUpload', formData).then(res => {
            localComment.value += '[!图片](' + res.data.url + ')';
            locked.value = false
        }).catch(err => {
            let msg = err.response.data.message
            msg = msg ? msg : '上传失败，请重新上传'
            message({ message: msg, type: 'warning' });
            locked.value = false
        })

    } else {
        message({ message: "文件[" + file.name + "]大小超过限制，最大1M，请重新选择", type: 'error' });
        locked.value = false
    }
}

defineExpose({
    respond,
});

</script>
