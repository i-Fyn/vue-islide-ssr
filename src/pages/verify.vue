<template>
    <div class="single-page text-sm">
    <div class="min-h-screen wrapper">
        <div id="verify" class="content-area verify-page bg-base-100 card p-4">
            <main id="main" class="flex flex-col min-h-screen gap-12 md:gap-[70px]">
                <div class="mt-8 md:mt-10">
                    <h1 class="font-semibold text-3xl md:text-4xl text-primary text-center">
                        <i class="ri-verified-badge-fill mr-2 md:mr-3"></i>{{ config.islide_vip_page['title'] }}
                    </h1>
                    <div class="mt-3 md:mt-4  text-base  text-center">{{ config.islide_vip_page['desc'] }}</div>
                </div>
                <div class="flex-1 flex flex-col p-4 md:p-8 bg-white rounded-box">
                    <div class="steps mb-10 md:mb-14">
                        <div v-for="(item, index) in 4" :key="index" 
                             :class="['step', { 'step-primary': step >= index + 1 }]">
                            <span class="text-sm">{{ ['选择类型', '填写信息', '审核信息', '认证结果'][index] }}</span>
                        </div>
                    </div>
                    <!--第一步-->
                    <div class="step-one-wrap" v-if="step == 1" v-cloak>
                        <div class="verify-type-wrap">
                            <div class="flex flex-wrap justify-center gap-4 md:gap-6">
                                <div v-for="(item, index) in data" :key="index" 
                                     class="flex-1 p-4 min-w-[280px] md:min-w-[288px] flex flex-col">
                                    <div class="mb-3 text-center">
                                        <van-image lazy-load :src="item.image" class="w-24 md:w-32 h-24 md:h-32" />
                                        <h2 class="text-xl md:text-2xl mt-2">{{ item.name }}</h2>
                                        <p class="text-sm text-base-content/70 mt-1">{{ item.desc }}</p>
                                    </div>
                                    <div class="rounded-xl bg-base-100 p-3 md:p-4 flex-1">
                                        <div class="border-b border-base-300 pb-3 mb-3">
                                            <div class="text-base font-bold">基础条件</div>
                                            <div class="text-sm text-base-content/70 mt-1" v-if="unsatisfiedCount[item.type] > 0">
                                                你已满足 <b class="text-success">{{ item.conditions.length - unsatisfiedCount[item.type] }}</b> 个基本条件要求，还差 <b class="text-error">{{ unsatisfiedCount[item.type] }}</b> 个要求
                                            </div>
                                            <div class="text-sm text-base-content/70 mt-1" v-else>
                                                你已满足我们认证的基本条件，开启认证之旅吧！
                                            </div>
                                        </div>
                                        <div class="flex flex-col gap-2">
                                            <div v-for="(v, k) in item.conditions" :key="k">
                                                <div v-if="!v.allow && (v.key == 'money' || v.key == 'credit')" 
                                                     class="bg-base-200 p-3 rounded-lg">
                                                    <div class="flex items-center gap-3">
                                                        <i class="ri-money-cny-circle-fill text-xl md:text-2xl text-base-content/70"></i>
                                                        <div class="flex-1">
                                                            <span class="font-bold text-sm">认证费用</span>
                                                            <p class="text-sm text-base-content/60">需要{{ v.name }}</p>
                                                        </div>
                                                        <button class="text-sm leading-4 px-3 py-1.5 rounded-lg bg-primary/10 text-primary" 
                                                                @click="pay(v, index)">去支付</button>
                                                    </div>
                                                </div>
                                                <div v-else class="flex items-center justify-between gap-3">
                                                    <span class="text-sm text-base-content/70">{{ v.name }}</span>
                                                    <span class="text-lg md:text-xl font-bold" :class="v.allow ? 'text-success' : 'text-error'">
                                                        <i :class="v.allow ? 'ri-check-fill' : 'ri-close-fill'"></i>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mt-6 md:mt-9">
                                        <button class="h-10 md:h-11 w-full btn btn-primary btn-soft text-sm" 
                                                :disabled="unsatisfiedCount[item.type] > 0"
                                                @click="onNext(item, index)">申请认证</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--第二步-->
                    <div class="p-4 min-h-[calc(100vh-500px)] max-w-3xl mx-auto" v-else-if="step == 2" v-cloak>
                        <div class="max-w-2xl">
                            <form>
                                <div class="w-full mt-5 mb-9 flex flex-wrap">
                                    <label class="w-1/4 flex-none text-left py-2 pr-5">
                                        <span class="text-error">*</span>认证称号
                                    </label>
                                    <div class="flex-1">
                                        <input type="text" autocomplete="off" maxlength="25" 
                                               placeholder="请输入认证信息" 
                                               class="h-10 rounded w-full"
                                               v-model="formData.title">
                                        <p class="text-sm mt-2 text-base-content/60">
                                            认证信息最多25个字，审核通过后不可修改。<br>
                                            不能使用修饰性词汇，不能包含联系方式与推广信息。<br>
                                            能够清晰地表达你的身份、领域或品牌的简洁认证信息
                                        </p>
                                    </div>
                                </div>
                                <!--企业机构-->
                                <div v-if="currentVerifyData.verify_info_types && currentVerifyData.verify_info_types.includes('official')">
                                    <div class="w-full mt-5 mb-9 flex flex-wrap">
                                        <label class="w-1/4 flex-none text-left py-2 pr-5">
                                            <span class="text-error">*</span>企业全称
                                        </label>
                                        <div class="flex-1">
                                            <input type="text" autocomplete="off" maxlength="100" 
                                                   placeholder="请输入认证信息" 
                                                   class="h-10 rounded w-full"
                                                   v-model="formData.company">
                                            <p class="text-sm mt-2 text-base-content/60">
                                                与组织机构代码证/营业执照名称一致。
                                            </p>
                                        </div>
                                    </div>
                                    <div class="w-full mt-5 mb-9 flex flex-wrap">
                                        <label class="w-1/4 flex-none text-left py-2 pr-5">
                                            <span class="text-error">*</span>统一社会信用代码
                                        </label>
                                        <div class="flex-1">
                                            <input type="text" autocomplete="off" maxlength="100" 
                                                   placeholder="请输入信用代码" 
                                                   class="h-10 rounded w-full"
                                                   v-model="formData.credit_code">
                                            <p class="text-sm mt-2 text-base-content/60">
                                                与组织机构代码证/营业执照统一社会信用代码一致。
                                            </p>
                                        </div>
                                    </div>
                                    <div class="w-full mt-5 mb-9 flex flex-wrap">
                                        <label class="w-1/4 flex-none text-left py-2 pr-5">
                                            <span class="text-error">*</span>营业执照
                                        </label>
                                        <div class="flex-1">
                                            <label class="upload-wrap" for="license-upload-input"
                                                :style="'background-image:url(' + formData.business_license + ')'">
                                                <div v-if="!formData.business_license">
                                                    <i class="ri-add-fill"></i>
                                                    <span>营业执照</span>
                                                </div>
                                            </label>
                                            <p class="text-sm mt-2 text-base-content/60">
                                                上传资料要求：请上传最新版三证合一高清彩色版企业营业执照/事业单位法人证明，或加盖红色公章的复印件（非电子公章），请确保材料完整清晰，便于识别。<a
                                                    class="active">查看示例</a></p>
                                            <input id="license-upload-input" type="file" ref="uploadInput"
                                                accept="image/jpg,image/jpeg,image/png,image/gif" style="display: none;"
                                                @change="handleUpload($event, 'business_license')">
                                        </div>
                                    </div>
                                    <div class="w-full mt-5 mb-9 flex flex-wrap">
                                        <label class="w-1/4 flex-none text-left py-2 pr-5">
                                            <span class="text-error">*</span>认证申请公函
                                        </label>
                                        <div class="flex-1">
                                            <label class="upload-wrap" for="auth-upload-input"
                                                :style="'background-image:url(' + formData.business_auth + ')'">
                                                <div v-if="!formData.supplement">
                                                    <i class="ri-add-fill"></i>
                                                    <span>认证申请公函</span>
                                                </div>
                                            </label>
                                            <p class="text-sm mt-2 text-base-content/60">
                                                请下载官方模板<a
                                                    href="//activity.hdslb.com/blackboard/static/20220815/4264715f749e9494cc2bd09303a11a7e/vaVeJB5BJr.docx"
                                                    class="active">《机构认证申请公函》</a>，并加盖企业公章（合同章、财务章无效）和运营人手写签名后扫描或者拍照上传。<a
                                                    class="active">查看示例</a></p>
                                            <input id="auth-upload-input" type="file" ref="uploadInput"
                                                accept="image/jpg,image/jpeg,image/png,image/gif" style="display: none;"
                                                @change="handleUpload($event, 'business_auth')">
                                        </div>
                                    </div>
                                    <div class="w-full mt-5 mb-9 flex flex-wrap">
                                        <label class="w-1/4 flex-none text-left py-2 pr-5">
                                            <span class="text-error">*</span>官网地址
                                        </label>
                                        <div class="flex-1">
                                            <input type="text" autocomplete="off" maxlength="100" 
                                                   placeholder="请输入官网地址" 
                                                   class="h-10 rounded w-full"
                                                   v-model="formData.official_site">
                                        </div>
                                    </div>
                                    <div class="w-full mt-5 mb-9 flex flex-wrap">
                                        <label class="w-1/4 flex-none text-left py-2 pr-5">
                                            <span class="text-error">*</span>补充文件
                                        </label>
                                        <div class="flex-1">
                                            <label class="upload-wrap" for="supplement-upload-input"
                                                :style="'background-image:url(' + formData.supplement + ')'">
                                                <div v-if="!formData.supplement">
                                                    <i class="ri-add-fill"></i>
                                                    <span>补充文件</span>
                                                </div>
                                            </label>
                                            <input id="supplement-upload-input" type="file" ref="uploadInput"
                                                accept="image/jpg,image/jpeg,image/png,image/gif" style="display: none;"
                                                @change="handleUpload($event, 'supplement')">
                                        </div>
                                    </div>
                                </div>
                                <!--个人-->
                                <div v-if="currentVerifyData.verify_info_types && currentVerifyData.verify_info_types.includes('personal')">
                                    <div class="w-full mt-5 mb-9 flex flex-wrap">
                                        <label class="w-1/4 flex-none text-left py-2 pr-5">
                                            <span class="text-error">*</span>运营者姓名
                                        </label>
                                        <div class="flex-1">
                                            <input type="text" autocomplete="off" maxlength="100" 
                                                   placeholder="请输入运营者姓名" 
                                                   class="h-10 rounded w-full"
                                                   v-model="formData.operator">
                                            <p class="text-sm mt-2 text-base-content/60">
                                                账号实际运营者需和运营授权函上一致，并在授权函上手写签字。
                                            </p>
                                        </div>
                                    </div>
                                    <div class="w-full mt-5 mb-9 flex flex-wrap">
                                        <label class="w-1/4 flex-none text-left py-2 pr-5">
                                            <span class="text-error">*</span>运营者身份证号
                                        </label>    
                                        <div class="flex-1">
                                            <input type="text" autocomplete="off" maxlength="100" 
                                                   placeholder="请输入运营者身份证号" 
                                                   class="h-10 rounded w-full"
                                                   v-model="formData.id_card">
                                            <p class="text-sm mt-2 text-base-content/60">
                                                账号实际运营者需和运营授权函上一致，并在授权函上手写签字
                                            </p>
                                        </div>
                                    </div>
                                    <div class="w-full mt-5 mb-9 flex flex-wrap">
                                        <label class="w-1/4 flex-none text-left py-2 pr-5">
                                            <span class="text-error">*</span>运营者人员身份证件
                                        </label>
                                        <div class="flex-1">
                                            <div>
                                                <label class="upload-wrap" for="front-upload-input"
                                                    :style="'background-image:url(' + (formData.idcard_front ? formData.idcard_front : '/assets/image/idcard-front.png') + ')'">
                                                    <div v-if="!formData.idcard_front">
                                                        <i class="ri-add-fill"></i>
                                                        <span>身份证正面照</span>
                                                    </div>
                                                </label>
                                                <label class="upload-wrap" for="verso-upload-input"
                                                    :style="'background-image:url(' + (formData.idcard_verso ? formData.idcard_verso : '/assets/image/idcard-verso.png') + ')'">
                                                    <div v-if="!formData.idcard_verso">
                                                        <i class="ri-add-fill"></i>
                                                        <span>身份证反面照</span>
                                                    </div>
                                                </label>
                                                <input id="front-upload-input" type="file" ref="uploadInput"
                                                    accept="image/jpg,image/jpeg,image/png,image/gif"
                                                    style="display: none;"
                                                    @change="handleUpload($event, 'idcard_front')">
                                                <input id="verso-upload-input" type="file" ref="uploadInput"
                                                    accept="image/jpg,image/jpeg,image/png,image/gif"
                                                    style="display: none;"
                                                    @change="handleUpload($event, 'idcard_verso')">
                                            </div>
                                            <p class="text-sm mt-2 text-base-content/60">
                                                本人身份证件：身份证或个人护照，彩色照片，个人信息清晰无遮挡。
                                            </p>
                                        </div>
                                    </div>
                                    <div class="w-full mt-5 mb-9 flex flex-wrap">
                                        <label class="w-1/4 flex-none text-left py-2 pr-5">
                                            <span class="text-error">*</span>手持身份证照片
                                        </label>
                                        <div class="flex-1">
                                            <label class="upload-wrap" for="hand-upload-input"
                                                :style="'background-image:url(' + (formData.idcard_hand ? formData.idcard_hand : '/assets/image/idcard-hand.png') + ')'">
                                                <div v-if="!formData.idcard_hand">
                                                    <i class="ri-add-fill"></i>
                                                    <span>上传照片</span>
                                                </div>
                                            </label>
                                            <p class="text-sm mt-2 text-base-content/60">
                                                请提交运营者手持身份证照片。<br>
                                                要求本人、身份证在同一照片中，且照片放大能看清身份<br>
                                                证上的文字和身份证号码。
                                            </p>
                                            <input id="hand-upload-input" type="file" ref="uploadInput"
                                                accept="image/jpg,image/jpeg,image/png,image/gif" style="display: none;"
                                                @change="handleUpload($event, 'idcard_hand')">
                                        </div>
                                    </div>
                                    <div class="w-full mt-5 mb-9 flex flex-wrap">
                                        <label class="w-1/4 flex-none text-left py-2 pr-5">
                                            <span class="text-error">*</span>运营者手机号码
                                        </label>
                                        <div class="flex-1">
                                            <input type="text" autocomplete="off" maxlength="100" 
                                                   placeholder="请输入运营者手机号码" 
                                                   class="h-10 rounded w-full"
                                                   v-model="formData.telephone">
                                            <p class="text-sm mt-2 text-base-content/60">
                                                填写运营者正在使用的手机号码，认证审核过程中审核人员将通过该号码与你联系，请保持电话畅通。
                                            </p>
                                        </div>
                                    </div>
                                    <div class="w-full mt-5 mb-9 flex flex-wrap">
                                        <label class="w-1/4 flex-none text-left py-2 pr-5">
                                            <span class="text-error">*</span>运营者联系邮箱
                                        </label>
                                        <div class="flex-1">
                                            <input type="text" autocomplete="off" maxlength="100" 
                                                   placeholder="请输入运营者联系邮箱" 
                                                   class="h-10 rounded w-full"
                                                   v-model="formData.email">
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="text-center mb-5 mt-14 flex flex-col items-center gap-4">
                            <button class="max-w-[320px] h-10 w-full btn btn-primary rounded-full" 
                                    @click="submitVerify" 
                                    :disabled="!protocol">申请认证</button>
                            <button class="max-w-[320px] h-10 w-full btn btn-primary btn-soft rounded-full" @click="onPrev">上一步</button>
                            <label class="flex gap-1">
                                <input type="checkbox" v-model="protocol">
                                我已同意 <a target="_blank" class="text-primary">《官方认证服务协议》</a>
                            </label>
                        </div>
                    </div>
                    <!--第三步-->
                    <div v-else-if="step == 3 || step == 4" class="flex justify-center">
                        <div class="flex flex-col items-center gap-1.5 text-center max-w-[548px]">
                            <div v-if="status == 0 || status == 3" 
                                 class="w-[86px] h-[86px] flex items-center justify-center bg-base-200 rounded-full text-warning mb-4">
                                <i class="ri-time-line text-5xl leading-[48px]"></i>
                            </div>
                            <div v-if="status == 1" 
                                 class="w-[86px] h-[86px] flex items-center justify-center bg-base-200 rounded-full text-success mb-4">
                                <i class="ri-check-fill text-5xl leading-[48px]"></i>
                            </div>
                            <div v-if="status == 2" 
                                 class="w-[86px] h-[86px] flex items-center justify-center bg-base-200 rounded-full text-error mb-4">
                                <i class="ri-close-line text-5xl leading-[48px]"></i>
                            </div>
                            <h2 class="text-2xl font-semibold">
                                {{ status == 0 || status == 3 ? '认证审核中' : 
                                   status == 1 ? '认证成功' : '认证未通过' }}
                            </h2>
                            <p class="text-sm text-base-content/60">
                                {{ status == 0 || status == 3 ? '我们将会对你的申请进行审核，7个工作日内会通过站内信将结果推送给你，请耐心等待' :
                                   status == 1 ? '恭喜认证成功，已为你添加认证V标识以及认证信息' : opinion }}
                            </p>
                            <div v-if="status == 2" 
                                 class="mt-4 px-3 py-2 max-w-[320px] w-full btn btn-primary btn-soft rounded-full"
                                 @click="onPrev">修改信息</div>
                        </div>
                    </div>
                </div>

                <div class="mb-4">
                    <div class="py-12 md:py-[60px] relative">
                        <h2 class="text-lg mb-6 text-center">常见问题</h2>
                        <div class="collapse-wrap my-auto">
                            <div v-for="item in config.islide_vip_page['faqs']"
                                class="collapse collapse-arrow bg-base-100 shadow-sm mt-2 collapse-sm" >
                                <input type="radio" name="my-accordion-2" checked="checked" />
                                <div class="collapse-title font-semibold text-sm">{{ item.key }}</div>
                                <div class="collapse-content text-sm text-base-content/60">{{ item.value }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onServerPrefetch, onBeforeUnmount } from 'vue'
import axios from '@/dist/axios'
import { createMessage as message } from '@/dist/message';
import { useHead } from '@unhead/vue';
import { useStore } from '../store';
import { useLoginStatus } from '@/components/header/composables/useLoginStatus.js'
const { isLogin, checkIsLogin } = useLoginStatus()
import { islidepay } from '@/dist/pay';


const store = useStore();
const config = computed(() => store.config);
const data = ref([]);
const step = ref(0);
const currentVerifyData = ref({});
// const currentIndex = ref(0);
const status = ref(0);
const opinion = ref('');
const locked = ref(false);
const protocol = ref(false); //协议
const formData = ref({
    index: 0,
    type: '', //认证类型
    title: '', //认证信息
    company: '', //公司名称
    credit_code: '', //信用代码
    business_license: '', //营业执照
    business_auth: '', //认证申请公函
    official_site: '', //官方网站
    supplement: '', //补充资料
    // name: '',
    operator: '', //运营者
    email: '',
    telephone: '', //运营者手机号
    id_card: '', //身份正在号
    idcard_hand: '', //手持身份证
    idcard_front: '', //身份证正面
    idcard_verso: '', //身份证背面
});
const uploadInput = ref(null);






const unsatisfiedCount = computed(() => {
    const countByType = {};
    data.value.forEach(item => {
        const unsatisfiedCount = item.conditions.filter(condition => !condition.allow).length;
        if (!countByType[item.type]) {
            countByType[item.type] = unsatisfiedCount;
        } else {
            countByType[item.type] += unsatisfiedCount;
        }
    });
    return countByType;
});

const getVerifyInfo = async () => {
    try {
        const res = await store.fetchVerifyInfo();
        data.value = res;
        // 对conditions按照allow属性进行排序
        data.value.forEach(item => {
            item.conditions.sort((a, b) => {
                return a.allow === b.allow ? 0 : a.allow ? -1 : 1;
            });
        });

        // 查找符合条件的元素的索引
        formData.value.index = data.value.findIndex(item => item.type === formData.value.type);

        await nextTick();
        currentVerifyData.value = data.value[formData.value.index];
    } catch (error) {
    }
}
const getUserVerifyInfo = async () => {
    try {
        const res = await store.fetchUserVerifyInfo();
        step.value = res.step;
        status.value = res.status;
        opinion.value = res.opinion;
        formData.value = { ...formData.value, ...res.data };
        formData.value.type = res.type;
        formData.value.title = res.title;
        await getVerifyInfo();
    } catch (error) {
    }
}
function onNext(val, index) {
    currentVerifyData.value = val
    step.value = 2
    formData.value.type = val.type
    formData.value.index = index
}
function onPrev() {
    step.value -= step.value == 4 ? 2 : 1
    status.value = 0
}


function pay(data, index) {
    islidepay({
        'title': this.data[index].name,
        'order_price': data.value,
        'order_type': 'verify',
        'order_key': index,
        'order_value': this.data[index].type,
        'type': data.key,
        'tag': '认证付费'
    }, data.key)
}


function handleUpload(event, type) {
    if (locked.value) return;
    locked.value = true;

    let file = event.target.files[0];
    formData.value[type] = URL.createObjectURL(file);
    let _formData = new FormData()

    _formData.append('file', file, file.name)
    _formData.append("post_id", 1)
    _formData.append("type", 'verify')

    axios.post('/fileUpload', _formData).then(res => {
        locked.value = false;
        formData.value[type] = res.data.url;
    }).catch(err => {
        formData.value[type] = ''

        let msg = err.response.data.message
        msg = msg ? msg : '上传失败，请重新上传';
        message({ message: msg, type: 'warning' });
        locked.value = false;
    })

    uploadInput.value = null;
}


function submitVerify() {
    if (!isLogin.value) return checkIsLogin()
    if (locked.value == true) return
    locked.value = true
    axios.post('/submitVerify', formData.value).then(res => {
        step.value = 3
        message({ message: '申请已提交，等待认证审核', type: 'success' });
        locked.value = false
    }).catch(err => {
        locked.value = false
        message({ message: err.response.data.message, type: 'error' });
    })
}





useHead({
    link: [
        {
            href: '/assets/verify.css',
            rel: 'stylesheet',
        },
    ],
})



onMounted(async () => {
    await getUserVerifyInfo();
})

onServerPrefetch(async () => {
    await getUserVerifyInfo()
})

</script>
