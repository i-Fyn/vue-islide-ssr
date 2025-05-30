<script setup>
import { ref, watch, onBeforeUnmount, nextTick } from "vue";
const props = defineProps({
  typeList: {
    type: Array,
    default: () => [],
  },
  size: {
    type: String,
    default: "1em",
  },
  // 句子与句子之间的间隔时间
  timeSpace: {
    type: Number,
    default: 0.8,
  },
  // 打印一个字的时间长度
  wordPrintTime: {
    type: Number,
    default: 0.3,
  },
  color: {
    type: String,
    default: "",
  },
  // 是否循环播放
  loop: {
    type: Boolean,
    default: true,
  },
  // 句子完成后等待时间
  pauseTime: {
    type: Number,
    default: 1.5,
  }
});

const loopList = ref([]);
const arr = [],
  interArr = [];

let isRunning = false; // 控制循环状态

const reset = () => {
  arr.length &&
    arr.forEach((a) => {
      a && clearTimeout(a);
    });

  interArr.length &&
    interArr.forEach((a) => {
      a && clearInterval(a);
    });
  
  arr.length = 0;
  interArr.length = 0;
  isRunning = false;
};

// 开始打字效果
const startTypeEffect = () => {
  if (!props.typeList.length || isRunning) return;
  isRunning = true;
  
  loopList.value = [];
  let lastTime = 0;
  
  // 构建打印队列
  props.typeList.forEach((v, index) => {
    if (!v.length) {
      console.error(`第${index + 1}条语句为空，不能打印`);
      return;
    }

    let loop = {
      target: v,
      delay: lastTime,
    };
    loopList.value.push(loop);
    // 计算这一句播放的时间，用于下一句的播放
    lastTime =
      Math.round((lastTime + v.length * props.wordPrintTime + props.timeSpace) * 10) / 10;
  });

  // 计算所有句子完成打印的总时间
  const totalTime = lastTime + props.pauseTime;

  // 执行打印
  loopList.value.forEach((loop) => {
    let timer = setTimeout(() => {
      const writers = document.getElementById("writer");
      if (!writers) return;
      let num = 0,
        str = "";
      let interTimer = setInterval(() => {
        str += loop.target.charAt(num);
        writers.innerHTML = str;
        if (num < loop.target.length) {
          num++;
        } else {
          // 句子打印完成
          clearInterval(interTimer);
          // 如果是最后一个句子，等待一段时间后清空
          const lastIndex = loopList.value.length - 1;
          if (loop === loopList.value[lastIndex]) {
            setTimeout(() => {
              if (props.loop) {
                // 如果需要循环，先清空然后重新开始
                writers.innerHTML = "";
                isRunning = false;
                startTypeEffect();
              }
            }, props.pauseTime * 1000);
          }
        }
      }, props.wordPrintTime * 1000);
      interArr.push(interTimer);
    }, loop.delay * 1000);
    arr.push(timer);
  });
};

watch(
  () => props.typeList,
  () => {
    nextTick(() => {
      reset();
      startTypeEffect();
    });
  },
  {
    deep: true,
    immediate: true,
  }
);

onBeforeUnmount(() => {
  reset();
});
</script>

<template>
  <div :style="{ color: color }" class="type-writer">
    <span id="writer" :style="{ fontSize: size }"></span>
    <span class="space" :style="{ fontSize: size }">|</span>
  </div>
</template>

<style lang="scss" scoped>
.type-writer {
  width: 100%;
  color: var(--color-base-100);
  font-size: 1em;
  cursor: pointer;
  text-align: center;
}

.space {
  vertical-align: text-bottom;
  animation: showInfinite 0.8s infinite both;
}

@keyframes showInfinite {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

</style>
