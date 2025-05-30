<template>
    <div v-if="module.title" class="modules-top">
        <h2 class="module-title">{{ module['title'] }}</h2>
    </div>
    <div class=" grid-container slider_1" :style="getSwiperStyle">
        <div class="slider-container" :style="getSwiperStyle_">
            <div class="slider-body">
                <div class="carousel-area">
                    <a v-for="(v, index) in carousel_list" :key="index" class="carousel__slide">
                        <van-image lazy-load  :src="v.thumb.default" class="slider-img w-h " :alt="v['title']"/>
                    </a>
                </div>

                <div class="carousel-footer">
                    <div v-if="module['slider_show_mask'] == '1'" class="carousel-mask"></div>
                    <div class="carousel-tool" v-if="module['slider_show_title'] == '1'">
                        <a v-for="(v, index) in carousel_list" :key="index" :title="v['title']" >
                            <span>{{ v['title'] }}</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onServerPrefetch } from 'vue'
import { useStore } from '@/store';
import { sliderCarousel } from '@/dist/swiper'


defineOptions({
    name: 'HomeSwiper',
})

const props = defineProps({
    module: {
        type: Object,
        default: () => {
            return {}
        }
    }
});
const carousel_list = ref([])
const lastArr = ref([])
const isClient = ref(true)

const store = useStore();
const config = computed(() => store.config);

const slider_num = (props.module['slider_grid_column_end'] - props.module['slider_grid_column_start']) * (props.module['slider_grid_row_end'] - props.module['slider_grid_row_start']);
const item_num = Math.round(((props.module['slider_grid_column'] * props.module['slider_grid_row']) - slider_num) * 1000000) / 1000000;

const pageWidth = props.module['slider_width'] ? props.module['slider_width'] : config.value.wrapper_width;
// 计算小部件的宽度
const widget_width = (
    (pageWidth - props.module.slider_column_gap * (props.module.slider_grid_column - 1)) /
    props.module.slider_grid_column
).toFixed(6);

// 计算大幻灯片的宽度
const slider_width = (
    (widget_width * (props.module.slider_grid_column_end - props.module.slider_grid_column_start)) +
    (props.module.slider_column_gap * (props.module.slider_grid_column_end - props.module.slider_grid_column_start - 1))
).toFixed(6);

// 计算小幻灯片的高度
const height = (
    (props.module.slider_height - props.module.slider_row_gap * (props.module.slider_grid_row - 1)) /
    props.module.slider_grid_row
).toFixed(6);

// 计算大幻灯片的高度
const slider_height = (
    (height * (props.module.slider_grid_row_end - props.module.slider_grid_row_start)) +
    (props.module.slider_row_gap * (props.module.slider_grid_row_end - props.module.slider_grid_row_start - 1))
).toFixed(6);


const paddingTop = ((parseFloat(slider_height) / parseFloat(slider_width)) * 100).toFixed(6) + "%";




const getSwiperStyle = computed(() => {
    return {
        'grid-gap': `${props.module['slider_row_gap']}px ${props.module['slider_column_gap']}px`,
        'grid-template-columns': `repeat(${props.module['slider_grid_column']}, 1fr) !important`,
    }
})

const getSwiperStyle_ = computed(() => {
    return {
        'grid-column': `${Number(props.module['slider_grid_column_start'])}/${Number(props.module['slider_grid_column_end'])}`,
        'grid-row': `${props.module['slider_grid_row_start']}/${props.module['slider_grid_row_end']}`,
        'padding-top': `${paddingTop}`,
    }
})



const listArray = (str) => {
    str = str.trim(); // 去除前后空白字符
    let lines = str.split(/\r?\n/); // 按换行符拆分

    let result = lines.map(line => {
        let parts = line.split('|'); // 以 '|' 作为分隔符
        return {
            id: parts[0] ? parts[0].trim() : '',
            thumb: {
                "default": parts[1] ? parts[1].trim() : ''
            },
            title: parts[2] ? parts[2].trim() : ''
        };
    });

    return result;
}



const getSliderPosts = () => {
    store.getList({
        "cat_id": props.module['slider_post_cat'],
        "size": props.module['slider_post_count'],
        "type": "post",
        "sort": props.module['slider_post_order'],
    }).then(res => {
        lastArr.value = res.data.slice(-item_num);
        carousel_list.value = res.data;
        if(!isClient.value) return;
        nextTick(() => {
            sliderCarousel()
        })
    })
}

onServerPrefetch(async () => {
    isClient.value = false
    carousel_list.value = await listArray(props.module['slider_list'])
})


onMounted(() => {
    isClient.value = true
    if (props.module['slider_type'] == 'slider_list') {
        carousel_list.value = listArray(props.module['slider_list'])
        nextTick(() => {
            sliderCarousel()
        })
    } else {
        getSliderPosts()
    }
})


</script>
