<template>
    <div class="captcha-container">
        <div class="slider-captcha">
            <canvas ref="canvas" class="canvas" :height="options.height" :width="options.width"></canvas>
            <canvas ref="block" class="block" :height="options.height"></canvas>
            <div class="refresh-icon" @click="reset">
                <i class="ri-refresh-line"></i>
            </div>
            <div ref="sliderContainer" class="slider-container">
                <div class="slider-mask" ref="sliderMask"></div>
                <div ref="slider" class="slider" @mousedown="handleDragStart" @touchstart="handleDragStart">
                    <i class="ri-arrow-right-s-line"></i>
                </div>
                <div class="slider-text">{{ sliderText }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const emit = defineEmits(['close-modal', 'loadinged']);
const props = defineProps({
    callback: Function,
});

const canvas = ref(null);
const block = ref(null);
const slider = ref(null);
const sliderContainer = ref(null);
const sliderMask = ref(null);

const img = ref(null);
const x = ref(0);
const y = ref(0);
const sliderText = ref("向右滑动填充拼图");
const isMouseDown = ref(false);
const originX = ref(0);
const originY = ref(0);
const trail = ref([]);
const options = {
    width: 308,
    height: 170,
    PI: Math.PI,
    sliderL: 42,
    sliderR: 9,
    offset: 5,
};

const init = () => {
    const L = options.sliderL + options.sliderR * 2 + 3;
    img.value = new Image();
    img.value.crossOrigin = "Anonymous";
    img.value.onload = () => {
        x.value = getRandomNumberByRange(L + 10, options.width - (L + 10));
        y.value = getRandomNumberByRange(10 + options.sliderR * 2, options.height - (L + 10));
        drawImg(canvas.value.getContext("2d", { willReadFrequently: true }), "fill");
        drawImg(block.value.getContext("2d", { willReadFrequently: true }), "clip");

        const ctx = canvas.value.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img.value, 0, 0, options.width, options.height);
        const blockCtx = block.value.getContext("2d", { willReadFrequently: true });
        blockCtx.drawImage(img.value, 0, 0, options.width - 2, options.height);
        const yValue = y.value - options.sliderR * 2 - 1;
        const imageData = blockCtx.getImageData(x.value - 3, yValue, L, L);
        block.value.width = L;
        blockCtx.putImageData(imageData, 0, yValue + 1);
        sliderText.value = "向右滑动填充拼图";
    };

    img.value.onerror = () => {
        sliderText.value = "加载失败，请刷新页面后重试";
    };

    sliderText.value = "正在加载中...";
    img.value.src = getImageSrc();

    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("touchmove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("touchend", handleDragEnd);

    document.addEventListener("mousedown", () => false);
    document.addEventListener("touchstart", () => false);
    document.addEventListener("swipe", () => false);
};

const drawImg = (ctx, operation) => {
    const l = options.sliderL;
    const r = options.sliderR;
    const PI = options.PI;
    const xValue = x.value;
    const yValue = y.value;
    ctx.beginPath();
    ctx.moveTo(xValue, yValue);
    ctx.arc(xValue + l / 2, yValue - r + 2, r, 0.72 * PI, 2.26 * PI);
    ctx.lineTo(xValue + l, yValue);
    ctx.arc(xValue + l + r - 2, yValue + l / 2, r, 1.21 * PI, 2.78 * PI);
    ctx.lineTo(xValue + l, yValue + l);
    ctx.lineTo(xValue, yValue + l);
    ctx.arc(xValue + r - 2, yValue + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true);
    ctx.lineTo(xValue, yValue);
    ctx.lineWidth = 2;
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.stroke();
    ctx[operation]();
    ctx.globalCompositeOperation = "destination-over";
};

const handleDragStart = (e) => {
    if (sliderText.value === "验证通过" || sliderText.value.includes("加载失败")) return;
    originX.value = e.clientX || e.touches[0].clientX;
    originY.value = e.clientY || e.touches[0].clientY;
    isMouseDown.value = true;
};

const handleDragMove = (e) => {
    if (!isMouseDown.value) return false;
    const eventX = e.clientX || e.touches[0].clientX;
    const eventY = e.clientY || e.touches[0].clientY;
    const moveX = eventX - originX.value;
    const moveY = eventY - originY.value;
    if (moveX < 0 || moveX + 40 > options.width) return false;
    
    slider.value.style.left = (moveX - 1) + "px";
    const blockLeft = (options.width - 40 - 20) / (options.width - 40) * moveX;
    block.value.style.left = blockLeft + "px";
    
    sliderContainer.value.classList.add("slider-container-active");
    sliderMask.value.style.width = (moveX + 4) + "px";
    trail.value.push(Math.round(eventY));
};

const handleDragEnd = (e) => {
    if (!isMouseDown.value) return false;
    isMouseDown.value = false;
    const eventX = e.clientX || e.changedTouches[0].clientX;
    if (eventX === originX.value) return false;
    
    sliderContainer.value.classList.remove("slider-container-active");
    const data = verify();

    if (data.spliced && data.verified) {
        sliderContainer.value.classList.add("slider-container-success");
        sliderText.value = "验证通过";
        props.callback && props.callback(trail.value);
        emit("close-modal");
    } else {
        sliderContainer.value.classList.add("slider-container-fail");
        sliderText.value = "再试一次";
        setTimeout(reset, 1000);
    }
};

const verify = () => {
    const arr = trail.value;
    const left = parseInt(block.value.style.left);
    let verified = false;
    const sum = (x, y) => x + y;
    const square = (x) => x * x;
    const average = arr.reduce(sum) / arr.length;
    const deviations = arr.map((x) => x - average);
    const stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length);
    verified = stddev !== 0;
    return {
        spliced: Math.abs(left - x.value) < options.offset,
        verified: verified
    };
};

const clean = () => {
    canvas.value.getContext("2d").clearRect(0, 0, options.width, options.height);
    block.value.getContext("2d").clearRect(0, 0, options.width, options.height);
    block.value.width = options.width;
};

const reset = () => {
    sliderContainer.value.classList.remove("slider-container-fail", "slider-container-success");
    slider.value.style.left = "0";
    block.value.style.left = "0";
    sliderMask.value.style.width = "0";
    clean();
    img.value.src = getImageSrc();
};

const getImageSrc = () => {
    return `/assets/image/captcha/${Math.round(Math.random() * 20)}.jpg`;
};

const getRandomNumberByRange = (start, end) =>
    Math.round(Math.random() * (end - start) + start);

onMounted(() => {
    init();
    emit("loadinged");
});

onBeforeUnmount(() => {
    document.removeEventListener("mousemove", handleDragMove);
    document.removeEventListener("touchmove", handleDragMove);
    document.removeEventListener("mouseup", handleDragEnd);
    document.removeEventListener("touchend", handleDragEnd);
});
</script>

<style scoped>
.captcha-container {
    padding: 24px;
    width: 100%;
    font-size: 15px;
    overflow: hidden;
    height: 100%;
}

.captcha-container .slider-captcha {
    margin-top: 8px;
    width: 100%;
    position: relative;
}

.captcha-container .canvas {
    border-radius: 4px;
}

.captcha-container .block {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
}

.captcha-container .slider-container {
    text-align: center;
    background: #f8f8f8;
    color: #999;
    border-radius: 4px;
    margin-top: 6px;
    position: relative;
    line-height: 40px;
    height: 40px;
    user-select: none;
}

.captcha-container .refresh-icon {
    position: absolute;
    right: 0;
    opacity: .6;
    top: 0;
    padding: 10px;
    color: #fff;
    text-shadow: 0 0 5px #000;
    cursor: pointer;
}

.captcha-container .slider {
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    background: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, .2);
    cursor: pointer;
    border-radius: 4px;
    transition: .3s;
}

.captcha-container .slider-mask {
    position: absolute;
    border-radius: 4px;
    height: 40px;
    transition: .3s;
}

.captcha-container .slider-container-active .slider-mask {
    background: rgba(5, 224, 96, .1);
    border: 1px solid rgba(94, 182, 89, .6);
    transition: unset
}

.captcha-container .slider-container-success .slider-mask {
    background: rgba(0, 153, 255, .2);
    border: 1px solid #43b5fc
}

.captcha-container .slider-container-fail .slider-mask {
    background: rgba(255, 0, 0, .2);
    border: 1px solid #ff4842
}

.captcha-container .slider-container-active .slider {
    transition: unset
}

.captcha-container .slider-container-success .slider {
    background: #3ca4f9;
    color: #fff
}

.captcha-container .slider-container-fail .slider {
    background: #f7564a;
    color: #fff
}
</style>