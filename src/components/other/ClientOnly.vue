<!-- components/ClientOnly.vue -->
<script setup>
import { ref, onMounted } from 'vue';

const show = ref(false);
onMounted(() => {
  show.value = true;
});
</script>

<template>
  <slot v-if="show"></slot>
</template>