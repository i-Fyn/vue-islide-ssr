<template>
  <div class="loading-wrapper" :class="{ local }">
    <div id="feeds-replace-loading" class="loading-container" :style="{ height: visible  ? '48px' : '0px','--spinner-opacity': visible ? '1' : '0' }">
      <div style="height: 12px; width: 100%;"></div>
      <svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="24"
        height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12.0001 4.70002C8.58381 4.70002 5.71358 7.04759 4.91874 10.2188C4.7979 10.7009 4.30908 10.9938 3.82694 10.873C3.34479 10.7521 3.0519 10.2633 3.17275 9.78117C4.16351 5.8283 7.73871 2.90002 12.0001 2.90002C16.2615 2.90002 19.8367 5.8283 20.8274 9.78117C20.9483 10.2633 20.6554 10.7521 20.1733 10.873C19.6911 10.9938 19.2023 10.7009 19.0815 10.2188C18.2866 7.04759 15.4164 4.70002 12.0001 4.70002ZM3.82692 13.127C4.30907 13.0061 4.79788 13.299 4.91872 13.7812C5.71353 16.9524 8.58378 19.3 12.0001 19.3C15.4164 19.3 18.2867 16.9524 19.0815 13.7812C19.2023 13.299 19.6911 13.0061 20.1733 13.127C20.6554 13.2478 20.9483 13.7366 20.8275 14.2188C19.8368 18.1717 16.2615 21.1 12.0001 21.1C7.73867 21.1 4.16344 18.1717 3.17272 14.2188C3.05188 13.7366 3.34478 13.2478 3.82692 13.127Z"
          fill="currentColor" fill-opacity="0.3"></path>
      </svg>
      <div style="height: 12px; width: 100%;"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  local: {
    type: Boolean,
    default: false
  }
})

const visible = ref(props.local)

watch(() => props.local, (newVal) => {
  visible.value = newVal
})
</script>

<style scoped>
.loading-container {
  width: 100%;
  transition: height 0.45s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: var(--color-text-secondary);
  overflow: hidden;
  will-change: height;
}

.spinner {
  animation: spin 0.6s linear infinite;
  width: 24px;
  height: 24px;
  margin-top: -16px;
  opacity: var(--spinner-opacity);
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: transform, opacity;
}

@keyframes spin {
  0% {
    transform: rotate(0deg) translateZ(0);
  }
  100% {
    transform: rotate(360deg) translateZ(0);
  }
}
</style>