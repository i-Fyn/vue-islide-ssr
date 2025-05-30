<template>
    <div class="user-avatar" :style="{'--van-image-loading-icon-size': size/1.5 + 'px'}" v-if="Object.keys(data).length">
        <van-image lazy-load :width="size" :height="size" v-if="data['avatar']"  :src="data['avatar']" class="avatar-face w-h" :alt="data['name'] + '的头像'"/>
        <van-image lazy-load v-if="data['pendant'] && icon" :src="data['pendant']" class="avatar-pendant" alt="用户头像框挂件"/>
        <van-image :width="size/3" :height="size/3" lazy-load v-if="data['badge'] && icon" :src="data['badge']" class="avatar-badge" alt="用户头像徽章"/>
    </div>
    <div class="user-avatar" v-else>
        <van-image :width="size" :height="size" lazy-load src="/assets/image/default-avatar.png" class="avatar-face w-h" alt="默认头像"/>
    </div>
</template>

<script setup>

defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    icon:{
        type: Boolean,
        default: true
    },
    size:{
        type: Number,
        default: 32
    }
})


</script>
<style scoped>

.user-avatar {
    position: relative;
    display: inline-block;
    flex-shrink: 0;
    height: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;
}
.user-avatar .avatar-face {
    border-radius: 50%;
    box-sizing: border-box;
    background: #eee;
    overflow: hidden;
}
.avatar-badge {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 1;
}


</style>