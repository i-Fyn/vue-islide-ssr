<template>
    <div class="w-full max-w-md mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl overflow-hidden">
        <div class="w-full space-y-6 bg-base-100/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20">
            <!-- 标题部分 -->
            <div class="text-center">
                <h2 class="text-3xl font-extrabold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">{{ loginTitle }}</h2>
                <p v-if="loginType == 2 && login.invite_type != 0 && !invitePass" class="mt-2 text-sm text-base-content/60">
                    没有邀请码？<a href="获取邀请码地址" class="text-primary hover:text-primary/80 font-medium transition-colors duration-200">获取邀请码</a>
                </p>
                <p v-if="loginType == 3" class="mt-2 text-sm text-base-content/60">请输入您账号绑定的手机号码或邮箱地址</p>
            </div>

            <!-- 表单部分 -->
            <form @submit.stop.prevent="loginSubmit" class="space-y-4">
                <!-- 邀请码部分 -->
                <div v-if="loginType == 2 && login.invite_type != 0 && !invitePass" class="space-y-4">
                    <div class="relative">
                        <input type="text" 
                               name="invite_code" 
                               v-model="data.invite_code" 
                               class="appearance-none rounded-xl relative block w-full px-4 py-2.5 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-base-100/50 backdrop-blur-sm"
                               placeholder="请输入邀请码">
                    </div>
                    <div>
                        <button type="submit" 
                                class="btn btn-primary w-full rounded-4xl">
                            提交
                        </button>
                    </div>
                    <div v-if="login.invite_type == 2" class="text-center">
                        <span @click.stop.prevent="invitePass = true" 
                              class="text-sm text-primary hover:text-primary/80 cursor-pointer font-medium transition-colors duration-200">
                            跳过
                        </span>
                    </div>
                </div>

                <!-- 登录/注册表单 -->
                <div v-else-if="loginType == 1 || loginType == 2" class="space-y-4">
                    <!-- 昵称输入框 -->
                    <div v-show="loginType == 2" class="relative">
                        <input type="text" 
                               name="nickname" 
                               v-model="data.nickname" 
                               class="appearance-none rounded-xl relative block w-full px-4 py-2.5 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-base-100/50 backdrop-blur-sm"
                               placeholder="请输入昵称">
                    </div>

                    <!-- 用户名输入框 -->
                    <div class="relative">
                        <input type="text" 
                               name="username" 
                               v-model="data.username" 
                               class="appearance-none rounded-xl relative block w-full px-4 py-2.5 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-base-100/50 backdrop-blur-sm"
                               :placeholder="'请输入' + login_text">
                    </div>

                    <!-- 验证码输入框 -->
                    <div v-show="loginType == 2 && data.username" v-if="login.check_type" class="relative">
                        <input type="text" 
                               name="code" 
                               v-model="data.code" 
                               class="appearance-none rounded-xl relative block w-full px-4 py-2.5 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-base-100/50 backdrop-blur-sm"
                               placeholder="请输入验证码">
                        <div @click.stop.prevent="countdown == 60 ? getCode() : null" 
                             class="absolute right-4 top-2.5 text-sm text-primary hover:text-primary/80 cursor-pointer font-medium transition-colors duration-200">
                            {{ countdown < 60 ? countdown + '秒后可重发' : '发送验证码' }}
                        </div>
                    </div>

                    <!-- 密码输入框 -->
                    <div class="relative">
                        <input type="password" 
                               name="password" 
                               v-model="data.password" 
                               class="appearance-none rounded-xl relative block w-full px-4 py-2.5 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-base-100/50 backdrop-blur-sm"
                               placeholder="请输入密码">
                    </div>

                    <!-- 提示文本 -->
                    <div class="flex items-center justify-between text-sm">
                        <div class="text-base-content/60">
                            <span v-if="loginType == 1 && login.allow_register == 1">
                                还没有账号? <span @click="loginType = 2" class="text-primary hover:text-primary/80 cursor-pointer font-medium transition-colors duration-200">前往注册</span>
                            </span>
                            <span v-if="loginType == 2">
                                已有帐号? <span @click="loginType = 1" class="text-primary hover:text-primary/80 cursor-pointer font-medium transition-colors duration-200">立即登录</span>
                            </span>
                        </div>
                        <a v-if="loginType == 1" 
                           @click.stop.prevent="forgotPassword" 
                           class="text-primary hover:text-primary/80 cursor-pointer font-medium transition-colors duration-200">
                            忘记密码？
                        </a>
                    </div>

                    <!-- 提交按钮 -->
                    <div>
                        <button type="submit" 
                                class="btn btn-primary w-full rounded-4xl">
                            {{ buttonText }}
                        </button>
                    </div>
                </div>

                <!-- 找回密码表单 -->
                <div v-else-if="loginType == 3" class="space-y-4">
                    <div class="relative">
                        <input type="text" 
                               v-model="data.username" 
                               class="appearance-none rounded-xl relative block w-full px-4 py-2.5 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-base-100/50 backdrop-blur-sm"
                               placeholder="请输入绑定的手机号或邮箱">
                    </div>

                    <div class="relative">
                        <input type="text" 
                               v-model="data.code" 
                               class="appearance-none rounded-xl relative block w-full px-4 py-2.5 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-base-100/50 backdrop-blur-sm"
                               placeholder="请输入验证码">
                        <div @click.stop.prevent="countdown == 60 ? getCode() : null" 
                             class="absolute right-4 top-2.5 text-sm text-primary hover:text-primary/80 cursor-pointer font-medium transition-colors duration-200">
                            {{ countdown < 60 ? countdown + '秒后可重发' : '发送验证码' }}
                        </div>
                    </div>

                    <div class="relative">
                        <input type="password" 
                               v-model="data.password" 
                               class="appearance-none rounded-xl relative block w-full px-4 py-2.5 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-base-100/50 backdrop-blur-sm"
                               placeholder="新密码">
                    </div>

                    <div class="relative">
                        <input type="password" 
                               v-model="data.confirmPassword" 
                               class="appearance-none rounded-xl relative block w-full px-4 py-2.5 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-base-100/50 backdrop-blur-sm"
                               placeholder="确认密码">
                    </div>

                    <!-- 提示文本 -->
                    <div class="flex items-center justify-between text-sm">
                        <div class="text-base-content/60">
                            <span @click="loginType = 1" class="text-primary hover:text-primary/80 cursor-pointer font-medium transition-colors duration-200">返回登录</span>
                        </div>
                    </div>

                    <!-- 提交按钮 -->
                    <div>
                        <button type="submit" 
                                class="btn btn-primary w-full rounded-4xl">
                            重置密码
                        </button>
                    </div>
                </div>
            </form>

            <!-- 社交登录部分 -->
            <div v-if="!(loginType == 2 && login.invite_type != 0 && !invitePass) && loginType != 3" class="mt-6">
                <div v-if="Object.keys(oauths).length" class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-200"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-4 bg-base-100/80 text-base-content/60">或</span>
                    </div>
                </div>

                <!-- 社交登录按钮 -->
                <div v-if="Object.keys(oauths).length" class="mt-6 grid grid-cols-3 gap-3">
                    <a v-for="(item, index) in oauths" 
                       :key="item.type"
                       @click="socialLogin(index)"
                       class="w-full inline-flex justify-center py-2.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-base-100/50 backdrop-blur-sm text-sm font-medium  text-base-content/60 hover:text-gray-900 hover:bg-base-100/80 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
                        <i :class="item.icon + ' text-lg'"></i>
                    </a>
                </div>

                <!-- 协议文本 -->
                <div v-show="loginType == 1" class="mt-6 text-center text-sm text-base-content/60">
                    登录表示您已阅读并同意
                    <a :href="agreement['agreement']" target="_blank" class="text-primary hover:text-primary/80 font-medium transition-colors duration-200">用户协议</a>
                    和
                    <a :href="agreement['privacy']" target="_blank" class="text-primary hover:text-primary/80 font-medium transition-colors duration-200">隐私政策</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import axios from '@/dist/axios';
import { useStore } from "@/store";
import { createMessage as message } from '@/dist/message';
import { islideSetCookie } from '@/dist/theme'
import { createVanModal } from '@/dist/createVanModal'
import { useRouter } from 'vue-router';

const emit = defineEmits(['close-modal']);

const router = useRouter();
const store = useStore();
const data = ref({
    nickname: '',
    username: '',
    password: '',
    code: '', //验证码
    invite_code: '', //邀请码
    confirmPassword: '',
    loginType: '',
    captcha: '' // 图形验证
});
const loginType = ref(1);
const locked = ref(false); // 锁定提交按钮
const oauths = ref([]);
const login = ref('');
const invitePass = ref('');
const countdown = ref(60); // 倒计时
const qrcode = ref(''); // 二维码
const agreement = ref([]);
const login_text = ref('');
const showCaptcha = ref(false);



const getLoginSettings = () => {
    store.fetchLoginSettings().then(res => {
        login.value = res;
        oauths.value = res.oauths;
        agreement.value = res.agreement;
        login_text.value = res.login_text;
    }).catch(err => {
        message({ message: err.response.message, type: 'error' });
    })
}

const forgotPassword = () => {
    loginType.value = 3;
}


const loginTitle = computed(() => {
    if (loginType.value == 1) {
        return '欢迎回来';
    } else if (loginType.value == 2) {
        if (login.value.invite_type != 0 && !invitePass.value) {
            return '填写邀请码';
        }
        return '注册新账号';
    } else if (loginType.value == 3) {
        return '找回账号密码';
    } else if (loginType.value == 4) {
        return '扫码登录';
    }
});

const buttonText = computed(() => {
    if (loginType.value == 1) {
        return '登录';
    } else if (loginType.value == 2) {
        return '注册';
    } else if (loginType.value == 3) {
        return '重置密码';
    }
});



const loginSubmit = async (e) => {
    e.preventDefault()
    if (login.value.allow_slider_captcha) {
        import('./SlideCaptcha.vue').then((module) => {
            createVanModal(module.default, {
                size: 356,
                props: {
                    callback: (captcha) => {
                        data.value.captcha = captcha
                        _submit()
                    }
                }
            })
        })
    } else {
        _submit()
    }
}



const _submit = () => {
    if (locked.value == true) return
    locked.value = true

    if (loginType.value == 2 && login.value.invite_type != 0 && !invitePass.value) {
        locked.value = false;
        checkInviteCode();
    }

    //登录
    else if (loginType.value == 1) {

        axios.post('/token', data.value).then(res => {
            localStorage.setItem('token', res.data.token);
            islideSetCookie('islide_token', res.data.token);
            message({ message: '登录成功', type: 'success' });
            emit('close-modal');
            destroy();
            window.location.reload();
        }).catch(err => {
            message({ message: err.response.data.message, type: 'warning' });
            locked.value = false
        })

        //注册
    } else if (loginType.value == 2) {
        if (store.ref) {
            data.value.ref = store.ref;
        }
        axios.post('/regeister', data.value).then(res => {
            message({ message: '注册成功', type: 'success' });
            loginType.value = 1;
            locked.value = false;
        }).catch(err => {
            message({ message: err.response.data.message, type: 'warning' });
            locked.value = false
        })
    }
    //找回密码
    else if (loginType.value == 3) {
        if (!data.value.username.trim()) return message({ message: '请输入绑定的手机号或邮箱', type: 'error' });
        if (!data.value.code.trim()) return message({ message: '请输入验证码', type: 'error' });
        if (!data.value.password.trim() || !data.value.confirmPassword.trim()) return message({ message: '请输入新密码或确认密码', type: 'error' });
        if (data.value.password !== data.value.confirmPassword) return message({ message: '请确保两次密码相同', type: 'error' });

        axios.post('/resetPassword', data.value).then(res => {
            message({ message: '密码重设成功！请牢记新密码', type: 'success' });
            loginType.value = 1;
            locked.value = false;
            destroy();
        }).catch(err => {
            message({ message: err.response.data.message, type: 'warning' });
            locked.value = false
        })
    }
}

const getCode = () => {
    if (loginType.value == 3 && !data.value.username.trim()) {
        return message({ message: '请输入绑定的手机号或邮箱', type: 'error' });
    }
    axios.post('/sendCode', data.value).then(res => {
        message({ message: res.data.msg, type: 'success' });
        startCountdown()
    }).catch(err => {
        message({ message: err.response.data.message, type: 'warning' });
    })
}


const checkInviteCode = () => {
    if (!data.value.invite_code.trim()) return message({ message: '请输入邀请码', type: 'error' });

    if (!(/^[0-9a-zA-Z]{4}(-[0-9a-zA-Z]{4}){4}$/.test(data.value.invite_code.trim()))) return message({ message: '请输入正确格式：xxxx-xxxx-xxxx-xxxx-xxxx', type: 'error' });

    axios.post('/checkInviteCode', { invite_code: data.value.invite_code }).then(res => {
        invitePass.value = true;
        locked.value = false;
    }).catch(err => {
        locked.value = false;
        message({ message: err.response.data.message, type: 'error' });
    })
}





const socialLogin = (type) => {

    //设置来路地址
    islideSetCookie('islide_referer_url', window.location.href);

    if (oauths.value[type].url) {
        window.location.href = oauths.value[type].url;
        return
    }

    message({ message: '拉取数据中，请稍后...', type: 'success' });

    axios.post('/socialLogin', { type: type }).then(res => {

        if (res.data.qrcode) {
            loginType.value == 4
            qrcode.value = res.data.qrcode
        } else {
            if (res.data.url) {
                window.location.href = res.data.url;
            }
        }
    }).catch(err => {
        message({ message: err.response.data.message, type: 'error' });
    })
}

const startCountdown = () => {
    let intervalId = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
            clearInterval(intervalId);
            countdown.value = 60;
        }
    }, 1000)
}

const destroy = () => {
    loginType.value = 1;
    locked.value = false;
    invitePass.value = false;
    data.value = {
        nickname: '',
        username: '',
        password: '',
        code: '', //验证码
        invite_code: '', //邀请码
        confirmPassword: '',
        loginType: '',
        captcha: ''
    }
}

watch(invitePass, (newVal, oldVal) => {
    if (newVal && login.value.invite_type == 2) {
        login.value.invite_code = '';
    }
});


onMounted(() => {
    getLoginSettings();
});



</script>