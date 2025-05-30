<template>
    <section class="p-4 card bg-base-100 mb-2 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
        <div class="w-full">
            <!-- 标题栏 带装饰效果 -->
            <div class="relative flex items-center justify-between mb-2 pb-2 border-b border-base-200">
                <div class="flex items-center gap-2">
                    <span class="w-1 h-6 bg-gradient-to-b from-accent to-primary rounded-full"></span>
                    <h2 class="text-base font-bold text-base-content relative">赞助支持
                        <span class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    </h2>
                </div>
            </div>
            
            <!-- 主要赞助商 -->
            <a class="flex items-center gap-4 p-3 rounded-lg bg-base-200/50 hover:bg-accent hover:text-accent-content transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md mb-2 group/sponsor" target="_blank" title="推荐博主">
                <div class="relative">
                    <div class="w-12 h-12 rounded-full bg-cover border-2 border-base-300 group-hover/sponsor:border-accent-content transition-colors duration-300 shadow-sm" 
                        style="background-image: url(https://islide.laziness.cn/wp-content/uploads/2025/01/islide-值得肯定.png);">
                    </div>
                    <div class="absolute bottom-0 right-1 w-2 h-2 rounded-full bg-accent text-accent-content flex items-center justify-center text-xs shadow-sm">
                        <i class="ri-crown-fill"></i>
                    </div>
                </div>
                
                <div class="flex-1 overflow-hidden">
                    <h3 class="font-bold text-sm mb-1 truncate">草东日记</h3>
                    <p class="text-xs line-clamp-2 text-base-content/70 group-hover/sponsor:text-accent-content/90 transition-colors">独立思考，勿乱引导</p>
                </div>
                
                <div class="opacity-0 group-hover/sponsor:opacity-100 transition-opacity">
                    <i class="ri-external-link-line"></i>
                </div>
            </a>
            
            <!-- 赞助商列表 -->
            <div class="mt-2">
                <h3 class="text-sm font-medium text-base-content/70 mb-2 flex items-center gap-1.5">
                    <i class="ri-heart-pulse-line text-error"></i>
                    <span>感谢这些朋友的赞助</span>
                </h3>
                
                <div class="flex flex-wrap gap-2 text-sm">
                    <a v-for="(sponsor, index) in sponsors" :key="index"
                        class="px-3 py-1.5 rounded-full inline-flex items-center gap-1 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-sm"
                        :class="sponsorColorClasses[index % sponsorColorClasses.length]"
                        rel="external nofollow" 
                        target="_blank" 
                        :title="sponsor">
                        <i class="ri-user-smile-line text-xs"></i>
                        <span>{{ sponsor }}</span>
                    </a>
                </div>
            </div>
            
            <!-- 赞助按钮 -->
            <button 
                class="btn btn-sm btn-outline btn-accent w-full mt-2 rounded-full !text-sm"
                @click="go"
            >
                <i class="ri-hand-heart-fill mr-1"></i>
                成为赞助者
            </button>
        </div>
    </section>
</template>

<script setup name="widget-Sponsor">
import { createVanModal } from '@/dist/createVanModal'
import { useLoginStatus } from '@/components/header/composables/useLoginStatus.js'
import { ref } from 'vue'

const { isLogin, checkIsLogin } = useLoginStatus()

// 为赞助者提供多种颜色组合
const sponsorColorClasses = [
    'bg-primary/10 text-primary hover:bg-primary hover:text-primary-content',
    'bg-secondary/10 text-secondary hover:bg-secondary hover:text-secondary-content',
    'bg-accent/10 text-accent hover:bg-accent hover:text-accent-content',
    'bg-info/10 text-info hover:bg-info hover:text-info-content',
    'bg-success/10 text-success hover:bg-success hover:text-success-content',
    'bg-warning/10 text-warning hover:bg-warning hover:text-warning-content',
    'bg-error/10 text-error hover:bg-error hover:text-error-content',
];

// 赞助者列表
const sponsors = ref([
    'Yuzhen', 
    'MysticStars', 
    '草东日记', 
    'JonasTech', 
    '赵同学小站',
    'Kegongteng', 
    '小妖客栈', 
    'Kris Yan'
])

const go = async () => {
    if (!isLogin.value) {
        return checkIsLogin()
    }
    const Sponsor = (await import('@/components/pay/PaySponsor.vue')).default;
    createVanModal(Sponsor, {
        size: 356,
        props: {
            type: 'balance'
        }
    })
}
</script>