
<template>
    <div class="report-container">
        <div class="colorful-header ">
            <div class="title">投诉举报</div>
        </div>
        <div class="content-wrap">
            <div class="form-container">
                <form @submit.stop.prevent="report">
                    <div class="report-types">
                        <label class="type-item" v-for="(item, index) in types" :key="index">
                            <input type="radio" :value="index" v-model="selectedType">
                            <div>{{ item }}</div>
                        </label>
                    </div>
                    <label class="form-item">
                        <textarea placeholder="请详细描述举报原因，便于平台判断违规情况" v-model="content"></textarea>
                    </label>
                    <div class="form-button">
                        <button>提交</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref,  nextTick,  onMounted } from 'vue'
import axios from '@/dist/axios'
import { createMessage as message } from '@/dist/message';

const props = defineProps({
    post_id: {
        type: Number,
        required: true
    }
})
const emit = defineEmits(['loadinged', 'close-modal'])
const locked = ref(false)
const types = ref([])
const selectedType = ref(null)
const content = ref('')


function getReportTypes() {
    axios.get('/getReportTypes').then(res => {
        types.value = res.data
        nextTick(() => {
            emit('loadinged')
        })
    })

}

const report = () => {
    if (locked.value) return;
    locked.value = true;

    axios.post('/postReport', {
        type: selectedType.value,
        content: content.value,
        reported_id: props.post_id
    }).then(res => {
        locked.value = false;
        message({ message: '您的反馈已收到，我们将尽快受理', type: 'success' });
        emit('close-modal');
    }).catch(err => {
        locked.value = false;
        message({ message: err.response.data.message, type: 'error' });
    })
}


const destroy = () => {
    selectedType.value = null;
    content.value = '';
}



onMounted(() => {
    getReportTypes()
})


</script>