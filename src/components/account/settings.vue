<template>
    <div class="flex flex-col gap-4">
        <div class="card bg-base-100 ">
            <div class="card-body flex flex-col items-center">
                <div class="w-24 h-24 mt-4 mb-6 rounded-full overflow-hidden bg-center bg-cover bg-no-repeat relative group" :style="'background-image:url(' + avatar + ')'">
                    <label for="avatar-input" class="absolute inset-0 cursor-pointer flex flex-col items-center justify-center bg-neutral/40 text-neutral-content opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <i class="ri-camera-line text-2xl leading-6"></i>
                        <span class="text-sm mt-1">修改头像</span>
                    </label>
                    <input id="avatar-input" type="file" ref="avatarInput" accept="image/jpg,image/jpeg,image/png,image/gif"
                        class="hidden" @change="handleAvatarUpload">
                </div>
                <div class="w-full max-w-md">
                    <form @submit.stop.prevent="saveUserInfo" class="flex flex-col">
                        <div class="form-control mb-4 w-full">
                            <label for="nickname" class="label">
                                <span class="label-text text-base-content/70">昵称</span>
                            </label>
                            <input type="text" id="nickname" placeholder="请输入姓名" v-model="data.nickname" 
                                class="input input-bordered w-full">
                        </div>
                        <div class="form-control mb-4 w-full">
                            <label for="gender" class="label">
                                <span class="label-text text-base-content/70">性别</span>
                            </label>
                            <select id="gender" v-model="data.sex" class="select select-bordered w-full">
                                <option value="1">男</option>
                                <option value="0">女</option>
                            </select>
                        </div>
                        <div class="form-control mb-6 w-full">
                            <label for="description" class="label">
                                <span class="label-text text-base-content/70">个性签名</span>
                            </label>
                            <textarea id="description" placeholder="请输入个性签名" v-model="data.description"
                                class="textarea textarea-bordered w-full min-h-24"></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary w-full mb-4">
                            <i class="ri-save-line mr-2"></i>保存设置
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup name="AccountSettings">
import { ref, onMounted, onServerPrefetch, nextTick } from 'vue'
import axios from '@/dist/axios'
import { createMessage as message } from '@/dist/message';
import { useStore } from '../../store';

const data = ref({
    nickname: '',
    sex: '',
    description: '',
});
const locked = ref(false);
const avatar = ref('');
const avatarInput = ref(null);
const store = useStore();

const saveAvatar = (url, id) => {
    axios.post('/saveAvatar', {
        url: url,
        id: id,
    }).then(res => {
        message({ message: res.data.msg, type: 'success' });
    })
}

const saveUserInfo = () => {
    if (locked.value) return;
    locked.value = true;
    axios.post('/saveUserInfo', data.value).then(res => {
        locked.value = false;
        message({ message: res.data.msg, type: 'success' });
        //刷新当前页面
        islideCurrentPageReload();
    }).catch(err => {
        locked.value = false;
        message({ message: err.response.data.message, type: 'warning' });
    });
}

const handleAvatarUpload = () => {
    if (avatarInput.value.files.length <= 0) return;
    if (locked.value) return;
    locked.value = true;

    let file = avatarInput.value.files[0];
    avatar.value = URL.createObjectURL(file);
    let formData = new FormData()

    formData.append('file', file, file.name)
    formData.append("post_id", 1)
    formData.append("type", 'avatar')
    axios.post('/fileUpload', formData).then(res => {
        saveAvatar(res.data.url, res.data.id);
        locked.value = false;
        avatarInput.value.value = null;
    }).catch(err => {
        let msg = err.response.data.message
        msg = msg ? msg : '上传失败，请重新上传';
        message({ message: msg, type: 'warning' });
        locked.value = false;
        avatarInput.value.value = null;
    })
}

const getUserSettings = async () => {
    try {
        const res = await axios.post('/getUserSettings');
        data.value.nickname = res.data.display_name;
        data.value.sex = res.data.sex;
        data.value.description = res.data.description;
        avatar.value = res.data.avatar;
    } catch (err) {
    }
}

onMounted(async () => {
    await getUserSettings();
});

onServerPrefetch(async () => {
    await getUserSettings();
});


</script>