<template>
  <div class="card bg-base-100 shadow-lg" @click.stop>
    <slot></slot>
    
    <!-- 顶部标签页 -->
    <div class="tabs tabs-boxed bg-base-200/50 p-2 rounded-t-lg">
      <a class="tab tab-lifted transition-all duration-200 hover:bg-base-100" 
         :class="{'tab-active': tabType == 1}" 
         @click="changeTab(1)">
        <i class="ri-image-2-line mr-1"></i>
        我的图片
      </a>
      <a v-if="computedData.showTabType == 2" 
         class="tab tab-lifted transition-all duration-200 hover:bg-base-100" 
         :class="{'tab-active': tabType == 2}" 
         @click="changeTab(2)">
        <i class="ri-link mr-1"></i>
        外链图片
      </a>
    </div>

    <div class="card-body p-4">
      <!-- 图片列表 -->
      <div v-if="tabType == 1" class="grid grid-cols-4 gap-4" ref="imageListRef">
        
        <!-- 上传按钮 -->
        <label class="aspect-square rounded-lg border-2 border-dashed border-base-300 hover:border-primary hover:bg-base-200/50 transition-all duration-200 cursor-pointer flex items-center justify-center group">
          <input type="file" 
                 class="hidden"
                 accept="image/jpg,image/jpeg,image/png,image/gif"
                 @change="fileUpload($event)"
                 ref="fileInput" 
                 multiple
                 :disabled="locked">
          <div class="flex flex-col items-center">
            <i class="ri-add-line text-3xl text-base-300 group-hover:text-primary transition-colors duration-200"></i>
            <span class="text-sm text-base-300 group-hover:text-primary mt-1">上传图片</span>
          </div>
        </label>

        <!-- 图片项 -->
        <div v-for="(item, index) in imageList"
             @click="pickedImg(item)"
             class="aspect-square rounded-lg relative overflow-hidden cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-primary hover:shadow-lg hover:-translate-y-0.5"
             :class="{'ring-2 ring-primary shadow-lg': imagePicked.findIndex(obj => obj.url == item.url) !== -1}">
          
          <img :src="item.thumb" class="w-full h-full object-cover"/>
          
          <!-- 上传进度 -->
          <div v-if="item.progress || item.success" 
               class="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center">
            <div class="text-white mb-2 font-medium">
              {{ item.progress >= 100 ? (item.success ? '上传完成' : '处理中...') : item.progress + '%' }}
            </div>
            <progress class="progress progress-primary w-3/4" 
                      :value="item.progress" 
                      max="100"></progress>
          </div>

          <!-- 选中序号 -->
          <div v-if="imagePicked.findIndex(obj => obj.url == item.url) !== -1"
               class="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-medium shadow-lg">
            {{ imagePicked.findIndex(obj => obj.url == item.url) + 1 }}
          </div>
        </div>
      </div>

      <!-- 外链输入 -->
      <div v-if="tabType == 2 && computedData.showTabType == 2" class="space-y-4">
        <div class="flex items-center gap-2 text-base-content/60">
          <i class="ri-information-line"></i>
          <p>请填写图片地址，支持批量输入，一行一个链接</p>
        </div>
        <textarea class="textarea textarea-bordered w-full h-[31vh] focus:textarea-primary transition-all duration-200" 
                  placeholder="https://example.com/image.jpg"
                  id="imageLink"></textarea>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="card-actions justify-end p-4">
      <button class="btn btn-primary gap-2" @click="insertImg()">
        <i class="ri-check-line"></i>
        确认插入
      </button>
    </div>
  </div>
</template>

<script setup name="UploadImage">
import { ref, computed, onMounted,   nextTick } from 'vue'
import axios from '@/dist/axios'
import { createMessage as message } from '@/dist/message';


const emit = defineEmits(['loadinged', 'close-modal'])
const props = defineProps({
    data: {
        type: Object,
    },
    show: {
        type: Boolean,
    }
})

const imageList = ref([])
const imagePicked = ref([])
const tabType = ref(1)
const locked = ref(false)
const pages = ref(0)
const paged = ref(0)
const uploadCount = ref(1)
const imageListRef = ref(null)
const fileInput = ref(null)

onMounted(() => {
    getAttachments();
    emit('loadinged')
})

const computedData = computed(() => {
    const defaultData = {
        showTabType: 2,
        maxPicked: 20,
        postType: 'post',
        size: 5,
        callback: (data, type) => { }
    };

    if (props.data) {
        return {
            ...defaultData,
            ...props.data,
        };
    }

    return defaultData;
})


const changeTab = (type) => {
    tabType.value = type
}

const getAttachments = () => {
    if (paged.value >= pages.value && paged.value != 0) return;
    if (locked.value == true) return
    locked.value = true
    paged.value++


    axios.post('/getCurrentUserAttachments', 'paged=' + paged.value + '&type=image').then(res => {
        imageList.value.push(...res.data.data)
        pages.value = res.data.pages
        locked.value = false

        nextTick(() => {
            imageListRef.value.addEventListener('scroll', _debounce(handleScroll));
        });

    }).catch(err => {
        message({ message: err.response.data.message, type: 'warning' });
        locked.value = false
    })
}


const handleScroll = () => {
    if ((imageListRef.value.scrollTop + imageListRef.value.offsetHeight) >= (imageListRef.value.scrollHeight - 20)) {
        getAttachments();
    }
}


const fileUpload = (event) => {
    if (event.target.files.length <= 0) return
    if (event.target.files.length > 9) {
        message({ message: `一次性最多只能上传9张图片`, type: 'warning' });
        return
    }

    if (locked.value == true) return
    locked.value = true

    const maxUploadCount = 9 // 最大上传张数

    for (let i = 0; i < event.target.files.length; i++) {
        let file = event.target.files[i]
        let url = URL.createObjectURL(file)

        if (file.size <= computedData.value.size * 1024000) {
            if (uploadCount.value >= maxUploadCount) {
                message({ message: `最多只能上传${maxUploadCount}张图片`, type: 'warning' });
                break
            }

            // 检查是否已经上传过该图片
            if (imageList.value.findIndex(item => item.name === file.name && item.size === file.size) !== -1) {
                setTimeout(() => {
                    message({ message: `文件[${file.name}]已经上传过，请选择其他文件`, type: 'warning' });
                }, 300);

                locked.value = false
                continue
            }

            imageList.value.splice(i, 0, {
                'id': '',
                'url': '',
                'thumb': url,
                'progress': 0,
                'success': false,
                'name': file.name, // 记录文件名和大小
                'size': file.size
            })

            let formData = new FormData()
            formData.append('file', event.target.files[i], event.target.files[i].name)
            formData.append("post_id", 1)
            formData.append("type", computedData.value.postType)

            const config = {
                onUploadProgress: (progress) => {
                    // 格式化成百分数
                    imageList.value[i].progress = Math.floor(progress.loaded / progress.total * 100)
                },
                timeout: 60000,
            }

            axios.post('/fileUpload', formData, config).then(res => {

                imageList.value[i].url = res.data.url
                imageList.value[i].id = res.data.id
                imageList.value[i].success = true
                imageList.value[i].thumb = res.data.url
                pickedImg({ url: res.data.url, id: res.data.id })
                locked.value = false
                uploadCount.value++;

                setTimeout(() => {
                    imageList.value[i].success = false
                    imageList.value[i].progress = 0
                }, 300);

            }).catch(err => {
                let msg = err.response.data
                message({ message: msg ? msg.message : '网络原因上传失败，请重新上传', type: 'warning' });
                //上传失败，删除图片
                imageList.value.splice(i, 1);

                locked.value = false
            })

        } else {
            setTimeout(() => {
                message({ message: "文件[" + file.name + "]大小超过限制，最大" + computedData.value.size + "M，请重新选择", type: 'error' });
                locked.value = false
            }, 300);
        }
    }

    fileInput.value.value = "" // 清空选择的文件
}


const pickedImg = (srcData) => {
    if (!srcData) return;

    var index = imagePicked.value.findIndex(item => item.url === srcData.url);//indexOf(src)

    if (!computedData.value.maxPicked || computedData.value.maxPicked == 1) {
        imagePicked.value = []
    }
    if (index == -1) {
        if (imagePicked.value.length < computedData.value.maxPicked) {
            imagePicked.value.push(srcData)
        }
    } else {
        imagePicked.value.splice(index, 1);
    }

}


const insertImg = () => {

    let imagePickeds = [];

    if (tabType.value == 2) {
        let imageLink = document.querySelector('#imageLink').value

        if (imageLink) {
            imagePickeds = imageLink.split("\n").map(url => ({ url: url.trim() }));
        }
    } else {
        imagePickeds = imagePicked.value
    }

    tabType.value == 1

    if (!imagePickeds.length) return

    //回调
    nextTick(() => {
        console.log(imagePickeds,computedData.value)
        if (typeof computedData.value.callback === 'function') {
            computedData.value.callback(imagePickeds, tabType.value);
        }
    });

    emit('close-modal');
    return
}


const destroy = () => {
    tabType.value = 1
    imageList.value = []
}


//防抖节流
function _debounce(fn, delay) {
    var delay = delay || 200;
    var timer;
    return function () {
        var th = this;
        var args = arguments;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            timer = null;
            fn.apply(th, args);
        }, delay);
    };
}

</script>

<style>
.image-upload-box label.list-item .upload-btn {
    overflow: hidden;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGcAAABnCAYAAAAdQVz5AAADcUlEQVR4Xu2cwWoTcRCHZ3Y9BFKxNlBUyOJCH0BBURAU76IHn0HwAXwM7x58B6HgG+hBUeILKJv8F7QEDEVzCJT8R+Ip9DItzGS64dfrJN8v+30t9BSmLfhp2/ZARN4S0R0i+srML4bD4feuPxp3/QFWnz+l9ImI7q09y+eqqu53/dk6H2c2m12Zz+czIirWYuR+v391MBj86XKgzseZTqfXFovFr9MRer3e9f39/SPECTSAOIHytWnE0QwF3hEnUL42jTiaocA74gTK16YRRzMUeEecQPnaNOJohgLviBMoX5tGHM1Q4B1xAuVr04ijGQq8I06gfG0acTRDgXfECZSvTSOOZijwjjiB8rVpxNEMBd4RJ1C+No04mqHAO+IEytemEUczFHhHnED52jTiaIYC74gTKF+bRhzNUOAdcQLla9OIoxkKvCNOoHxtGnE0Q4F3xAmUr00jjmYo8I44gfK1acTRDAXeESdQvjaNOJqhwDviBMrXphFHMxR4R5xA+do04miGAu+IEyhfm0YczVDgHXEC5WvTWx8npXRDRJ4XRbGnybiA9x0ReXX6czHzayKaX8DPq32k3yLyrqqqnzwejx+XZXkoIpe1d+G+MQPznPNTnkwmI2a+vbFZDJ3VwIhTSidEdOms78DrNmNARE5WfznfmPnWZiaxcg4DI27b9pGIvCeinXO8ES91NMDMf0Xkyf+vkWya5mZRFM+Koth13PRCb9V/aznn45zzYV3XY3zHp9evjAEXcQwkeiEQx8usARdxDCR6IRDHy6wBF3EMJHohEMfLrAEXcQwkeiEQx8usARdxDCR6IRDHy6wBF3EMJHohEMfLrAEXcQwkeiEQx8usARdxDCR6IRDHy6wBF3EMJHohEMfLrAEXcQwkeiEQx8usARdxDCR6IRDHy6wBF3EMJHohEMfLrAEXcQwkeiEQx8usARdxDCR6IRDHy6wBF3EMJHohEMfLrAEXcQwkeiEQx8usARdxDCR6IRDHy6wBF3EMJHohEMfLrAEXcQwkeiEQx8usARdxDCR6IRDHy6wBF3EMJHohEMfLrAEXcQwkeiEQx8usAbfzcZqm2S3LckZE688iy+Vyr67rYwNHYYjOx1mZSyl9JKIHaxY/VFX1MMyq0fBWxGnb9iDn/IaZ74rIF2Z+WVXVDyNHYZh/xqRJ3a2TckoAAAAASUVORK5CYII=);
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: 50% 50%;

}
</style>