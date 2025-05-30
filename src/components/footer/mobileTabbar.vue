<template>
    <van-tabbar v-model="active" :fixed="false" route
        :border="false"
        style="--van-tabbar-height: var(--top-menu-height); z-index: 1001;--van-tabbar-background:var(--color-base-100)"
        v-if="isMobile" class="mobile-tabbar toolbar-inner shadow-sm" :class="['fixed-footer', headerState.footerClass]">
        <van-tabbar-item v-for="(item, index) in tabbarList" :key="index" :to="getTabLink(item)" replace
            @click="onTabClick(item, index)">
            <template #icon="props">
                <template v-if="item.icon_html || item.icon_html_current">
                    <span v-html="props.active ? item.icon_html_current : item.icon_html"></span>
                </template>
                <template v-else-if="item.icon && item.icon_current">
                    <i :class="props.active ? item.icon_current : item.icon"></i>
                </template>
            </template>
            {{ item.name }}
        </van-tabbar-item>

        <van-popup v-model:show="showPublish" round position="bottom" :style="{ height: 'auto' }" teleport="body">
            <div class="item-public bg-base-100">
                <div class="publish-menu-wrap">
                    <div class="publish-menu-container p-4 bg-base-100">
                        <div class="publish-list flex flex-col gap-4">
                            <a :href="menu.link" 
                               @click.prevent="showPublish = false;router.push(menu.link)"
                               v-for="menu in store.config['top_menu_publish_links']"
                               class="publish-item flex items-center gap-2 p-3 rounded-lg hover:bg-base-200 transition-colors w-full" 
                               rel="nofollow">
                                <div class="img-icon flex items-center justify-center">
                                    <van-image lazy-load 
                                             :height="48" 
                                             :width="48" 
                                             :src="menu.icon" 
                                             :alt="menu.title" />
                                </div>
                                <div class="link-title">
                                    <p class="type-text font-medium">{{ menu.title }}</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </van-popup>

    </van-tabbar>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from '../../store';
import { useIsMobile } from '../../dist/mobile';
import { useRouter, useRoute } from 'vue-router';
import { useScrollFixed } from '../header/composables/usrScrollFixed';
import { useScrollProgress } from '@/dist/scrollUtils';


const store = useStore();
const { isMobile } = useIsMobile();
const router = useRouter();
const route = useRoute();
const { scrollProgress } = useScrollProgress();
const tabbarList = store.config?.footer_mobile_tabbar || [];
const active = ref(0);
const showPublish = ref(false);
const { headerState } = useScrollFixed();



// 处理 tabbar 的跳转链接
const getTabLink = (item) => {
    if (item.type === 'custom') {
        return item.link || '/';
    } else if (item.type === 'message') {
        return '/message';
    } else {
        return ''; // public 类型，不跳
    }
};

// 点击 Tabbar 项目的处理逻辑
const onTabClick = (item, index) => {
    if (item.type === 'public') {
        showPublish.value = !showPublish.value;
    }
};
</script>

<style scoped>
.toolbar-inner .publish-menu-wrap {
    position: fixed;
    bottom: var(--top-menu-height);
    bottom: calc(constant(safe-area-inset-bottom) + var(--top-menu-height));
    bottom: calc(env(safe-area-inset-bottom) + var(--top-menu-height));
}

.link-title {
    font-size: 1rem;
}

.fixed-footer {
    position: fixed;
    inset: auto .5em .5em;
    animation-name: footer;
    animation-duration: 0.8s;
    animation-fill-mode: forwards;
    width: calc(100% - 1em);
    border-radius: 2em;
    height: calc(var(--top-menu-height) - .5em);
}

.hide-footer {
    animation-name: hideFooter;
    animation-duration: 0.8s;
    animation-fill-mode: forwards;
}


@keyframes footer {
    0% {
        transform: translateY(var(--top-menu-height));
    }

    100% {
        transform: translateY(0px);
    }
}

@keyframes hideFooter {
    0% {
        transform: translateY(0px);
    }

    100% {
        transform: translateY(var(--top-menu-height));
    }
}
</style>
