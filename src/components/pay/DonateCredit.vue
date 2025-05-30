<template>
    <div class="sc-popup bg-base-100 rounded-lg shadow-lg" style="z-index: 999;">
        <div class="sc-popup-header flex items-center justify-between px-4 py-3 border-b border-base-200">
            <div class="text-lg font-medium w-full text-center">豆豆打赏</div>
        </div>
        <div class="popupBody p-4">
            <div class="pb-tips text-sm text-base-content/70 mb-6">
                请选择打赏豆豆数量（单次打赏不得高于200豆豆）
            </div>
            
            <!-- 预设金额选择 -->
            <div v-if="!showCustomAmount" class="grid grid-cols-4 gap-2 mb-8">
                <div v-for="(item, index) in donateAmountList" 
                     :key="item.amount"
                     class="pb-item cursor-pointer p-4 rounded-lg border-2 transition-all duration-300"
                     :class="[
                         selectItemIndex === index ? 'border-primary bg-primary/5' : 'border-base-200 hover:border-primary/50',
                         'flex flex-col items-center gap-2'
                     ]"
                     @click="changeSelectItemIndex(index)">
                    <div class="w-8 h-8">
                        <img src="https://pic-gsp.gacmotor.com/trumpchi-h5/image/community/gBean.png" 
                             class="w-full h-full object-contain" 
                             alt="豆豆">
                    </div>
                    <div class="text-xs font-medium">
                        {{ item.amount }} {{ typeof item.amount === 'number' ? '' : '' }}
                    </div>
                </div>
            </div>

            <!-- 自定义金额输入 -->
            <div v-if="showCustomAmount" class="mb-8">
                <div class="flex items-center gap-4 mb-4">
                    <div class="w-8 h-8">
                        <img src="https://pic-gsp.gacmotor.com/trumpchi-h5/image/community/gBean.png" 
                             class="w-full h-full object-contain" 
                             alt="豆豆">
                    </div>
                    <div class="flex-1">
                        <input type="number" 
                               v-model="customAmount"
                               class="input input-bordered w-full" 
                               placeholder="请输入打赏豆豆数量"
                               max="200"
                               min="1">
                    </div>
                </div>
                <div class="text-xs text-base-content/60">
                    请输入1-200之间的整数
                    <span class="text-primary cursor-pointer" @click="changeSelectItemIndex(0)">返回</span>
                </div>
            </div>

            <!-- 确认按钮 -->
            <button class="btn btn-primary w-full mb-8 lg:mb-2 rounded-full" 
                    :disabled="!isValidAmount"
                    @click="handleDonate">
                确认打赏
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const donateAmountList = ref([
    { amount: 10 },
    { amount: 30 },
    { amount: 100 },
    { amount: '自定义' }
]);

const showCustomAmount = ref(false);
const selectItemIndex = ref(0);
const customAmount = ref('');

const isValidAmount = computed(() => {
    if (showCustomAmount.value) {
        const amount = Number(customAmount.value);
        return amount > 0 && amount <= 200 && Number.isInteger(amount);
    }
    return true;
});

const changeSelectItemIndex = (index) => {
    selectItemIndex.value = index;
    showCustomAmount.value = index === 3;
    if (!showCustomAmount.value) {
        customAmount.value = '';
    }
};

const handleDonate = () => {
    const amount = showCustomAmount.value ? Number(customAmount.value) : donateAmountList.value[selectItemIndex.value].amount;
    // TODO: 处理打赏逻辑
    console.log('打赏金额:', amount);
};
</script>
