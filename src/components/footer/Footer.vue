<template>
    <div class="footer-wrapper w-full relative flex overflow-hidden z-[1000] transition-all duration-300 mb-4 mt-4 bg-base-100">
        <footer class="footer-container flex flex-col gap-8 items-center w-full  wrapper">
            <div class="footer-content text-base w-full">
                <div class="footer-main flex flex-col lg:flex-row justify-between w-full mx-auto flex-wrap items-center leading-none">
                    <div class="footer-left flex flex-wrap min-h-8 items-center justify-center w-full lg:w-auto mb-4 lg:mb-0">
                        <div class="footer-info flex gap-2 flex-col items-center lg:items-start mt-4">
                            <div class="footer-site flex flex-row items-center">
                                <a target="_blank" href="/" rel="external nofollow" 
                                   class="site-name mx-1 text-sm font-bold whitespace-nowrap px-2 py-2 rounded-3xl leading-none flex items-center gap-1">
                                    {{ blog_name }}
                                </a>
                            </div>
                            <div class="footer-beian flex gap-2 flex-wrap justify-center lg:justify-start">
                                <a :href="'https://www.beian.gov.cn/portal/registerSystemInfo?recordcode='+gongan_code"
                                   rel="external nofollow"
                                   class="beian-gongan text-sm font-normal text-base-content/60 p-0 m-0 flex items-center gap-1">
                                    <img src="https://www.crash.work/themes/web/www/static/picture/gongan.png"
                                         alt="公安备案"
                                         class="beian-icon h-3.5 min-w-[13px] min-h-[14px]">
                                    <span class="transition-all duration-300">{{ gongan }}</span>
                                </a>
                                <a href="https://beian.miit.gov.cn/#/Integrated/index"
                                   class="beian-icp text-sm font-normal text-base-content/60 p-0 m-0 flex items-center gap-1">
                                    {{ beian }}
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="footer-right flex flex-row flex-wrap items-center justify-center w-full lg:w-auto">
                        <a href="/" class="footer-link message-link mx-1 text-sm font-bold whitespace-nowrap px-2 py-2 rounded-3xl leading-none flex items-center gap-1 hover:bg-primary hover:text-white">留言</a>
                        <a href="/" rel="external nofollow" target="_blank" class="footer-link donate-link mx-1 text-sm font-bold whitespace-nowrap px-2 py-2 rounded-3xl leading-none flex items-center gap-1 hover:bg-primary hover:text-white">打赏</a>
                        <a href="/" class="footer-link theme-link mx-1 text-sm font-bold whitespace-nowrap px-2 py-2 rounded-3xl leading-none flex items-center gap-1 hover:bg-primary hover:text-white">主题</a>
                        <a @click="report" rel="external nofollow" target="_blank" class="footer-link report-link mx-1 text-sm font-bold whitespace-nowrap px-2 py-2 rounded-3xl leading-none flex items-center gap-1 hover:bg-primary hover:text-white">举报与反馈</a>
                        <a href="/" title="cc协议" class="footer-link cc-link mx-1 text-sm font-bold whitespace-nowrap px-2 py-2 rounded-3xl leading-none flex items-center gap-1 hover:bg-primary hover:text-white">
                            <i class="cc-icon ri-copyright-line"></i>
                            <i class="cc-icon ri-creative-commons-by-line"></i>
                            <i class="cc-icon ri-creative-commons-nc-line"></i>
                            <i class="cc-icon ri-creative-commons-nd-line"></i>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup name="Footer">
import {useStore} from '@/store';
import { createVanModal } from '@/dist/createVanModal'
import { computed } from 'vue';

const store = useStore();


const report = async () => {
    const singleReport = (await import('@/components/post/postReport.vue')).default;
    createVanModal(singleReport,{
        size:356,
        props:{
            post_id: 0
        }
    })
}


const footerList =  computed(() => {
    return store.config.is_footer_1_css || [];
})

const gongan = computed(() => {
    return store.config.footer_gongan || '';
})

const beian = computed(() => {
    return store.config.footer_beian || '';
})


//提取公安号
const gongan_code = computed(() => {
    const gongan_code = gongan.value.match(/\d+/g);
    return gongan_code ? gongan_code[0] : '';
})

const blog_name = computed(() => {
    return store.config.blog_name || '';
})

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

</script>


<style>
div#islide-footer-wrap {
    position: relative;
    z-index: 1000;
}
</style>