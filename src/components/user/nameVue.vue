<template>
    <div class="user-info-name font-normal" v-if="data?.id && data?.id > 0" >
        <a target="_blank" class="user-name no-hover" :href="'/user/' + data.id" @click.prevent=" go(data.id)">
            {{data.name }}
        </a>
        <span class="user-lv" v-if="icon" >
            <img v-if="data.lv && data.lv['icon']" :src="data.lv['icon']" class="lv-img-icon" :alt="data.lv['lv']" />
            <span v-else class="lv-text-icon">{{ data.lv['name'] }}</span>
        </span>
        <span class="user-vip" v-if="data.vip && data.vip['name'] && icon" >
            <img v-if="data.vip['image']" :src="data.vip['image']" class="vip-img-icon" :alt="data.vip['name']" />
        </span>
        <slot></slot>
    </div>
    <span v-else class="user-none">游客</span>
</template>

<script setup>
import { useRouter } from 'vue-router';

defineProps({
    data: {
        type: Object,
        required: true
    },
    icon: {
        type: Boolean,
        default: true
    }
})

const router = useRouter();

const go = (id) => {
    router.push({ name: 'user', params: { user_id: id } });
}

</script>

<style scoped>
.user-info-name {
    display: inline-flex
;
    align-items: center;
    width: max-content;
}
.user-info-name .user-name {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    flex: 1;
    text-decoration: none;
}
.user-info-name .user-lv {
    margin-right: 8px;
    overflow: hidden;
}

.user-info-name>span {
    height: 16px;
    line-height: 16px;
    border-radius: 4px;
    font-size: 12px;
}
.user-info-name>* {
    margin-right: 8px;
}
.user-info-name .lv-img-icon, .user-info-name .vip-img-icon {
    height: 100%;
}
</style>