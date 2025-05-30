<template>
    <div class="create-topic-container">
        <div class="colorful-header ">
            <div class="title">{{type === 'edit'? '编辑话题' : '创建话题'}}</div>
        </div>
        <div class="manage-content-wrap">
            <div class="form-container">
                <div class="base-manage">
                    <div class="circle-icon" @click="imgUploadBox">
                        <div class="icon-img" style=" display: contents; ">
                            <van-image lazy-load :src="data.icon" class="w-h" v-if="data.icon"/>
                            <i class="ri-camera-fill" v-else></i>
                        </div>
                    </div>
                </div>
                <form @submit.stop.prevent="createTopic">
                    <label class="form-item">
                        <input type="text" autocomplete="off" v-model="data.name" maxlength="30" placeholder="话题名称"
                            class="input">
                        <span class="icon">
                            <i class="ri-file-text-line"></i>
                        </span>
                    </label>
                    <label class="form-item">
                        <textarea placeholder="话题简介" v-model="data.desc"></textarea>
                        <span class="icon">
                            <i class="ri-file-text-line"></i>
                        </span>
                    </label>
                    <label class="form-item">
                        <input type="text" autocomplete="off" maxlength="10" v-model="data.slug" placeholder="话题连接"
                            class="input">
                        <span class="icon">
                            <i class="ri-link"></i>
                        </span>
                        <p class="desc">链接：/topic/{{ data.slug }}</p>
                    </label>
                    <div class="form-button">
                        <button>确认</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/dist/axios';
import { createVanModal } from '@/dist/createVanModal'
import { createMessage as message } from '@/dist/message';
const props = defineProps({
    name: {
        type: String,
    },
    topic_id: {
        type: [Number, String],
    },
    type: {
        type: String,
        default: 'create'
    },
})
const emit = defineEmits(['close-modal', 'loadinged'])



const data = ref({
    id: 0,
    name: '',
    desc: '',
    icon: '',
    slug: '',
    original_icon: '',
})


const locked = ref(false)

const createTopic = () => {
    if (locked.value) return
    locked.value = true

    let params = {
        ...data.value,
    }

    params.icon = data.value.original_icon ? data.value.original_icon : params.icon;

    axios.post('/createTopic', params).then(res => {
        locked.value = false
        message({ message: '成功', type: 'success' });
        emit('close-modal');
    }).catch(err => {
        locked.value = false
        message({ message: err.response.data.message, type: 'error' });
    })
}


const imgUploadBox = () => {

    import('@/components/other/Uploadimage.vue').then(module => {
        createVanModal(module.default, {
            size: 350,
            props:{
                showTabType: 1,
                maxPicked: 1,
                postType: 'circle',
                callback: (res, type) => {
                    data.value.icon = res[0]?.url
                    data.value.original_icon = ''
                }
            }
        })
    })
}


const getTopicData = () => {
    axios.post('/getTopicData', { topic_id: props.topic_id }).then(res => {
        Object.keys(data.value).forEach(key => {
            if (res.data.hasOwnProperty(key)) {
                data.value[key] = res.data[key]
            }
        })
        data.value.original_icon = data.value.icon;
    }).catch(err => {
    })
}

onMounted(() => {
    props.type === 'create' && props.name && (data.value.name = props.name)
    // emit('loadinged')
    if (props.type === 'edit' && props.topic_id) {
        getTopicData()
    }
    emit('loadinged')
})


</script>