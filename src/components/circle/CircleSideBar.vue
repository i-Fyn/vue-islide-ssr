<template>
    <aside id="secondary-left" class="widget-area widget-area-left" v-if="showSideTabs && tabs.length">
        <section class="widget-channel-menu">
            <div class="circle-channel-menu-widget circle-sidebar-menu" ref="channelMenu" :data-index="default_index">
                <div class="circle-channel-inner box  mg-b">
                    <ul class="menu-list">
                        <li v-for="(value, index) in tabs" class="menu-item" :class="{ active: index == default_index }"
                            @click="changeTab(index, value)">
                            <span class="menu-icon">
                                <i :class="value['icon']"></i>
                            </span>
                            <span>{{ value['name'] }}</span>
                        </li>
                    </ul>
                </div>
                <div class="circle-create box" @click="createCircle">
                    <i class="ri-add-fill"></i>
                </div>
            </div>
        </section>
    </aside>
</template>

<script setup>
import { useStore } from '@/store';
import { ref, onMounted, computed, onServerPrefetch } from 'vue'
import { createVanModal } from '@/dist/createVanModal'

defineOptions({
    name: 'CircleSideBar',
})

const props = defineProps({
    type: {
        type: String,
    },
})
const store = useStore();
const emit = defineEmits(['cangeTabs'])
const tabs = ref([])
const default_index = ref(0)
const showSideTabs = ref(false)
const showCircleCreate = ref(false)
const config = computed(() => {
    return store.config;
})

const changeTab = (index, selector) => {
    default_index.value = index;
    emit('cangeTabs', index, selector)
}

const createCircle = () => {
    import('@/components/circle/CircleManage.vue').then(module => {
        createVanModal(module.default, {
            position: 'right',
            props: { type: 'create' },
            size: 784,
            height: '100%'
        });

    })
}

const initData = () => {
    if (props.type === 'home') {
        tabs.value = config.value.circle_home_tabbar;
        default_index.value = config.value.circle_home_tabbar_index;
        showSideTabs.value = config.value.circle_home_left_sidebar;
    } else if (props.type === 'circle') {
        tabs.value = config.value.circle_tabbar;
        default_index.value = config.value.circle_tabbar_index;
        showSideTabs.value = config.value.circle_left_sidebar;
    } else if (props.type === 'topic') {
        tabs.value = config.value.topic_tabbar;
        default_index.value = config.value.topic_tabbar_index;
        showSideTabs.value = config.value.topic_left_sidebar;
    }
}

onServerPrefetch(() => {
    initData()
})

onMounted(() => {
    initData()
})

</script>