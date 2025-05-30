<template>
    <div
        class="content-hidden card bg-base-100 card-border border-base-300 py-[8px] px-[20px] min-h-[140px] my-[16px] scroll-x">
        <div class="content-hidden-info mt-4">
            <div class="content-show-roles" v-if="roles['allow'] == false">
                <div
                    class="pay-tag absolute left-0 top-0 z-10 text-xs px-2 py-0.5 bg-gradient-to-r from-[#ff74cd] to-[#ec7d0b] text-white rounded-tl-lg rounded-br-lg">
                    <i class="fa fa-book mr-1"></i>{{ getPayTag() }}
                </div>

                <!-- 1登录-->
                <div class="content-show-roles-inner roles-login" v-if="!isLogin && roles['authority'] == 'login'">
                    <div class="top-wrap flex flex-col gap-2">
                        <div
                            class="role-title text-sm lg:text-base font-semibold text-base-content flex items-center gap-1.5">
                            <i class="ri-lock-2-line text-primary text-lg"></i>
                            <span>内容已隐藏，请登录后查看</span>
                        </div>
                    </div>
                    <div class="bottom-wrap flex gap-2 justify-end">
                        <button class="btn btn-primary btn-sm rounded-4xl"
                            @click="checkIsLogin">登录</button>
                        <button class="btn btn-outline btn-primary btn-sm rounded-4xl"
                            @click="checkIsLogin">注册</button>
                    </div>
                </div>

                <!-- 2密码验证-->
                <div class="content-show-roles-inner roles-password" v-if="roles['authority'] == 'password'">
                    <div class="top-wrap flex flex-col gap-2">
                        <div
                            class="role-title text-sm lg:text-base font-semibold text-base-content flex items-center gap-1.5">
                            <i class="ri-lock-2-line text-primary text-lg"></i>
                            <span>内容已隐藏，请输入密码查看</span>
                        </div>
                    </div>
                    <div class="bottom-wrap flex gap-2 justify-end">
                        <button class="btn btn-primary btn-sm rounded-4xl"
                            @click="_passwordVerify">输入密码</button>
                    </div>
                </div>

                <!-- 3评论查看-->
                <div class="content-show-roles-inner roles-comment" v-if="roles['authority'] == 'comment'">
                    <div class="top-wrap flex flex-col gap-2">
                        <div
                            class="role-title text-sm lg:text-base font-semibold text-base-content flex items-center gap-1.5">
                            <i class="ri-lock-2-line text-primary text-lg"></i>
                            <span>内容已隐藏，请评论后查看</span>
                        </div>
                    </div>
                    <div class="bottom-wrap flex gap-2 justify-end">
                        <div class="login-btn flex gap-2">
                            <button class="btn btn-primary btn-sm rounded-4xl" @click="checkIsLogin">登录</button>
                            <button class="btn btn-outline btn-primary btn-sm rounded-4xl" @click="checkIsLogin">注册</button>
                        </div>
                    </div>
                </div>

                <!-- 4限制等级-->
                <div class="content-show-roles-inner roles-roles" v-if="roles['authority'] == 'roles'">
                    <div class="top-wrap flex flex-col gap-2">
                        <div
                            class="role-title text-sm lg:text-base font-semibold text-base-content flex items-center gap-1.5">
                            <i class="ri-lock-2-line text-primary text-lg"></i>
                            <span>内容已隐藏，以下等级可查看</span>
                        </div>
                        <div class="post-roles">
                            <ul class="roles-list flex gap-1.5">
                                <li v-for="role in roles['roles']" :key="role.lv" class="list-none">
                                    <div v-if="role.image !== ''" class="lv-icon">
                                        <img class="w-7 h-7 rounded-full" :src="role.image" :alt="role.name" />
                                    </div>
                                    <div v-else
                                        class="lv-name text-xs text-base-content/60 bg-base-200 rounded-full px-2.5 py-0.5">
                                        {{ role.name }}</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="bottom-wrap flex gap-2 justify-end">
                        <div class="login-btn flex gap-2">
                            <button class="btn btn-soft btn-primary btn-sm rounded-4xl"
                                @click="checkIsLogin">登录</button>
                            <button class="btn btn-outline btn-primary btn-sm rounded-4xl" @click="checkIsLogin">注册</button>
                        </div>
                    </div>
                </div>

                <!--5支付-->
                <div class="content-show-roles-inner roles-pay"
                    v-if="roles['authority'] == 'money' || roles['authority'] == 'credit'">
                    <div class="top-wrap flex flex-col gap-2">
                        <div
                            class="role-title text-sm lg:text-base font-semibold text-base-content flex items-center gap-1.5">
                            <i class="ri-lock-2-line text-primary text-lg"></i>
                            <span>内容已隐藏，请付费后查看</span>
                        </div>
                        <div class="role-price text-2xl lg:text-3xl font-semibold text-primary-content">
                            <i  class="ri-coin-line text-base"></i>
                            <span class="text-primary">{{ roles['value'] }}</span>
                        </div>
                        <div class="bottom-wrap flex gap-2 justify-end">
                            <div class="login-btn flex gap-2" v-if="!isLogin">
                                <button class="btn btn-soft btn-primary rounded-4xl btn-sm " @click="checkIsLogin">登录</button>
                                <button class="btn btn-soft btn-warning rounded-4xl btn-sm" @click="checkIsLogin">注册</button>
                            </div>
                            <button v-else
                                class="btn bg-gradient-to-r from-[#ff74cd] to-[#ec7d0b] text-white border-none rounded-4xl text-xs"
                                @click="islidepay(body, body.type)">立即购买</button>
                        </div>
                    </div>
                </div>

                <!-- 7圈子隐私-->
                <div class="content-show-roles-inner roles-circle" v-if="roles['authority'] == 'privacy'">
                    <div class="left">
                        <div
                            class="role-title text-sm lg:text-base font-semibold text-base-content flex items-center gap-1.5">
                            <i class="ri-lock-2-line text-primary text-lg"></i>
                            <span>内容已隐藏，请加入圈子后查看</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 6公开-->
            <div v-else>
                <ClientOnly>
                    <div
                        class="pay-tag absolute left-0 top-0 z-10 text-xs px-2 py-0.5 bg-gradient-to-r from-[#ff74cd] to-[#ec7d0b] text-white rounded-tl-lg rounded-br-lg">
                        <i class="fa fa-book mr-1"></i>隐藏内容
                    </div>
                    <div ref="contentRef" class="grid grid-cols-3 gap-3" v-html="roles.content"
                        v-lazy-container="{ selector: 'img' }"></div>
                </ClientOnly>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useStore } from '@/store';
import ClientOnly from '../../../other/ClientOnly.vue';
import { useLoginStatus } from '@/components/header/composables/useLoginStatus.js'
const { isLogin, checkIsLogin } = useLoginStatus()
import { islidepay, passwordVerify } from '@/dist/pay';
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css' // 任选一种主题
const contentRef = ref(null)

const props = defineProps({
    roles: {
        type: Object,
        default: () => ({})
    }
})
const store = useStore();
const content = ref(props.roles.content)

const getPayTag = () => {
    if (props.roles.authority === 'money') {
        return '付费阅读'
    }
    if (props.roles.authority === 'credit') {
        return '积分阅读'
    }
    if (props.roles.authority === 'roles') {
        return '等级阅读'
    }
    if (props.roles.authority === 'privacy') {
        return '加入阅读'
    }
    if (props.roles.authority === 'comment') {
        return '评论阅读'
    }
    if (props.roles.authority === 'login') {
        return '登录阅读'
    }
    if (props.roles.authority === 'password') {
        return '密码阅读'
    }

    return '隐藏内容'
}

const config = computed(() => {
    return store.config;
})




function _passwordVerify() {
    config.value.password_verify.post_id = props.roles.post_id;
    console.log(config.value.password_verify)
    passwordVerify(config.value.password_verify)

}


const body = ref({
    'order_price': props.roles.value,
    'order_type': 'post_neigou',
    'post_id': props.roles.post_id,
    'title': props.roles.title,
    'type': props.roles['authority'],
    'tag': '隐藏内容'
})


onMounted(() => {
    nextTick(() => {
        setTimeout(() => {
            if (contentRef.value) {
                contentRef.value.querySelectorAll('pre code').forEach((el) => {
                    hljs.highlightElement(el)
                })
            }
        }, 2000)
    })
})


</script>
