<template>
    <div class="home-html relative" :class="{'-mt-4': module.fullscreen == '1'}">
        <div v-if="module.title" class="modules-top">
            <h2 class="module-title">{{ module['title'] }}</h2>
        </div>
        <div class="modules-content">
            <div v-html="module.html"></div>
        </div>
    </div>
</template>

<script setup>

defineOptions({
    name: 'HomeHtml',
});

const props = defineProps({
    module: {
        type: Object,
        default: () => {
            return {}
        }
    }
});

</script>

