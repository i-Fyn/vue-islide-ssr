<template>
    <div class="sidebar-menu w-60 relative flex-1">
        <div class="sidebar-menu-inner fixed w-60 left-0  top-18 bg-base-100 z-10 bottom-0 flex flex-col justify-between p-4">
            <div id="channel-menu" class="menu-container">

                <ul class="menu w-full" v-for="(item, index) in channelMenus" :key="index">
                    <template v-if="item.children.length">
                        <li class="menu-sub-title "><span>{{ item.title }}</span></li>
                        <li v-for="(subMenu, subIndex) in item.children" :key="subIndex" class="menu-item"
                            :class="{ 'current-menu-item': route.path === subMenu.url }">
                            <a :href="subMenu.url" @click.prevent="router.push(subMenu.url)"
                               >
                                <span v-html="subMenu.title"></span>
                            </a>
                        </li>
                    </template>
                    <template v-else>
                        <li :class="{ 'current-menu-item': route.path === item.url }" class="menu-item">
                            <a :href="item.url" @click.prevent="router.push(item.url)">
                                <span v-html="item.title"></span>
                            </a>
                        </li>
                    </template>
                </ul>

            </div>
            <div class="login-block card card-border border-base-300 p-4" v-if="!isLogin">
                <button class="login-btn btn btn-soft btn-primary rounded-4xl mb-2" @click="checkIsLogin">登录</button>
                <ul class="login-tips text-sm text-base-content/60 pl-4 flex list-disc gap-0.5 flex-col">
                    <li>搜集最热好物、拔草信息</li>
                    <li>查看收藏、点赞的笔记</li>
                    <li>与他人更好互动，交流</li>
                </ul>
            </div>
            <div class="channel-menu-bottom" v-click-outside="() => show = false">
                <div class="more-menu-container py-2.5 text-sm relative">
                    <div class="more-information flex items-center py-2.5 px-3.5 " @click.stop="show = !show">
                        <i class="ri-menu-line mr-4 text-xl leading-5 opacity-80"  ></i>更多
                    </div>
                    <div class="more-menu-wrap bg-base-100 absolute left-0 bottom-14 right-0" v-show="show">
                        <div class="box p-4">
                            <div class="more-menu-links flex flex-col ">
                                <a :href="item.link" rel="nofollow" @click="router.push(item.link)"
                                    v-for="(item, index) in store.config?.sidebar_menu_more?.links || []" :key="index"
                                    class="no-hover"><span>{{ item.title }}</span> <i
                                        class="ri-arrow-right-s-line"></i></a>
                                <div class="menu-sub-title "><span>设置</span></div>
                                <div class=""><span>切换主题</span>
                                    <div class="menu-theme-switch">
                                        <label class="theme-toggle dark-mode"><input type="checkbox"
                                                :checked="store.theme === 'dark-theme'"
                                                @change="store.theme = store.theme === 'white-theme' ? 'dark-theme' : 'white-theme'">

                                            <span class="slider"></span></label>
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
import { useRouter, useRoute } from 'vue-router';
import { useStore } from '@/store';
import { computed, ref } from 'vue';
import { useLoginStatus } from '@/components/header/composables/useLoginStatus';
const { isLogin, checkIsLogin } = useLoginStatus()
const router = useRouter()
const route = useRoute()
const store = useStore()

const show = ref(false)

const channelMenus = computed(() => {
    return store.config?.menu?.['channel-menu'] || []
})



</script>

<style scoped>

.menu-container li {
    font-size: 14px;
    display: flex
;
    margin-bottom: 8px;
    flex-direction: column;
    height: 48px;
}
.sidebar-menu-inner li a {
    display: flex
;
    align-items: center;
    flex: 1;
    padding: 10px 14px;
    border-radius: 25px;
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 16px;
    color: var(--color-text-primary);
}

.sidebar-menu li i {
    margin-right: 16px;
    font-size: 20px;
    line-height: 20px;
    opacity: 0.8;
}

.more-menu-wrap .box {
    border-radius: 12px;
    box-shadow: 0 4px 32px 0 rgba(0, 0, 0, 0.08), 0 1px 4px 0 rgba(0, 0, 0, 0.04);
}
.more-menu-container .more-menu-links {
    display: flex
;
    flex-direction: column;
    color: var(--color-text-secondary);
    grid-gap: 12px;
    font-size: 14px;
}
.more-menu-container .more-menu-links>* {
    display: flex
;
    align-items: center;
    justify-content: space-between;
}
.more-menu-links .menu-sub-title {
    margin: 0;
    padding: 0;
    color: var(--color-text-placeholder);
    border-top: 1px solid var(--border-color-base);
    padding-top: 6px;
}
</style>