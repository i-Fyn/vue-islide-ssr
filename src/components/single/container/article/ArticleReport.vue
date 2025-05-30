<template>
  <div class="bg-base-100 rounded-lg overflow-hidden border border-base-200 animate-slideIn text-sm">
    <!-- 简约标题栏 -->
    <div class="p-2 border-b border-base-200">
      <div class="flex items-center">
        <i class="ri-alarm-warning-line text-warning mr-1.5"></i>
        <h3 class="text-base-content font-medium text-base">内容举报</h3>
      </div>
    </div>
    
    <!-- 表单区域 -->
    <div class="p-3">
      <form @submit.stop.prevent="report" class="space-y-3">
        <!-- 提示信息 -->
        <div class="bg-base-200 text-base-content/70 p-2 rounded ">
          请选择问题类型并提供详细信息，我们将认真处理您的反馈。
        </div>
        
        <!-- 问题类型选择 -->
        <div>
          <div class=" font-medium mb-1.5 text-base-content/80">选择问题类型</div>
          <div class="flex flex-wrap gap-1.5">
            <label 
              v-for="(item, index) in types" 
              :key="index"
              class="inline-flex items-center px-2.5 py-1 rounded-md  cursor-pointer transition-colors duration-200"
              :class="selectedType === index 
                ? 'bg-warning/15 text-warning-content border border-warning/50' 
                : 'bg-base-200 hover:bg-base-300/50 border border-transparent'"
            >
              <input 
                type="radio" 
                :value="index" 
                v-model="selectedType" 
                class="hidden"
              >
              <span>{{ item }}</span>
            </label>
          </div>
          <p v-if="validationErrors.type" class="mt-1  text-error">
            {{ validationErrors.type }}
          </p>
        </div>
        
        <!-- 问题描述 -->
        <div>
          <label class="block mb-1  font-medium text-base-content/80">
            详细描述问题
          </label>
          <textarea 
            v-model="content" 
            class="w-full px-3 py-2 rounded border bg-base-100 focus:outline-none focus:ring-1 transition-all text-sm"
            :class="validationErrors.content 
              ? 'border-error focus:ring-error' 
              : 'border-base-300 focus:border-warning focus:ring-warning'"
            placeholder="请详细描述您遇到的问题..."
            rows="1"
          ></textarea>
          <p v-if="validationErrors.content" class="mt-0.5  text-error">
            {{ validationErrors.content }}
          </p>
          <p v-else class="mt-0.5  text-base-content/60 text-xs">
            至少需10个字符
          </p>
        </div>
        
        <!-- 按钮区域 -->
        <div class="flex justify-end gap-2 pt-1">
          <button 
            type="button" 
            @click="$emit('close-modal')" 
            class="px-3 py-1.5  border border-base-300 rounded hover:bg-base-200 transition-colors"
          >
            取消
          </button>
          <button 
            type="submit" 
            class="px-3 py-1.5  bg-warning text-warning-content rounded hover:bg-warning/90 transition-colors flex items-center gap-1"
            :disabled="locked"
          >
            <i class="ri-send-plane-fill " v-if="!locked"></i>
            <i class="ri-loader-2-line animate-spin " v-else></i>
            {{ locked ? '提交中' : '提交' }}
          </button>
        </div>
      </form>
    </div>
    
    <!-- 提示区域 -->
    <div class="px-3 py-1.5 bg-base-200/50  text-base-content/60 border-t border-base-200 text-xs">
      平台将对违规内容进行处理，感谢您的监督
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import axios from '@/dist/axios'
import { createMessage as message } from '@/dist/message';

const props = defineProps({
  id: {
    type: [Number, String],
    required: true
  },
  type: {
    type: String,
    default: 'post'
  }
});

const emit = defineEmits(['loadinged', 'close-modal']);
const locked = ref(false);
const types = ref([]);
const selectedType = ref(null);
const content = ref('');
const validationErrors = ref({
  type: '',
  content: ''
});

function getReportTypes() {
  axios.get('/getReportTypes').then(res => {
    types.value = res.data;
    nextTick(() => {
      emit('loadinged');
    });
  });
}

const validateForm = () => {
  let isValid = true;
  validationErrors.value = {
    type: '',
    content: ''
  };

  if (selectedType.value === null) {
    validationErrors.value.type = '请选择一个问题类型';
    isValid = false;
  }

  if (!content.value.trim()) {
    validationErrors.value.content = '请填写问题描述';
    isValid = false;
  } else if (content.value.trim().length < 10) {
    validationErrors.value.content = '内容至少需10个字符';
    isValid = false;
  }

  return isValid;
};

const report = () => {
  if (locked.value) return;
  
  if (!validateForm()) return;
  
  locked.value = true;

  axios.post('/postReport', {
    type: selectedType.value,
    content: content.value,
    reported_id: props.id,
    reported_type: props.type
  }).then(res => {
    locked.value = false;
    message({ message: '感谢您的反馈，我们将尽快处理', type: 'success' });
    emit('close-modal');
  }).catch(err => {
    locked.value = false;
    message({ message: err.response?.data?.message || '提交失败，请稍后再试', type: 'error' });
  });
};

const destroy = () => {
  selectedType.value = null;
  content.value = '';
  validationErrors.value = {
    type: '',
    content: ''
  };
};

onMounted(() => {
  getReportTypes();
});
</script>

<style scoped>
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out forwards;
}

/* 隐藏单选按钮默认样式 */
input[type="radio"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
</style>