<template>
    <section id="islide_widget_download-2" class="widget islide_widget_download mg-b border"  v-if="data">
        <div id="islide-download-box" class="download-widget">
            <div class="scroll-tabs-wrapper" ref="scrollTab" v-if="list.length">
                <ul class="tabs-content">
                    <li :class="['tab-item', { 'active': i === index }]" v-for="(item, i) in list" :key="i"
                        @click="changeTab(i)">
                        <span v-text="item.title"></span>
                    </li>
                </ul>
            </div>
            <div class="islide-download-box box " v-if="data">
                <div class="title">
                    <h2 v-text="data.title"></h2>
                </div>
                <div class="rights" v-if="data">
                    <div @click="show = !show" :class="[{ open: show }]">

                        <div class="current-user" v-if="!data.current_user.can.allow">
                            <span v-if="data.current_user.can.type == 'money'">需支付 <span
                                    style=" color: var(--color-primary); "><i class="ri-coin-line"></i></span> <span
                                    style=" font-size: 20px; color: var(--color-primary); "
                                    v-text="data.current_user.can.value"></span>
                            </span>
                            <span v-if="data.current_user.can.type == 'credit'">需支付 <span
                                    style=" font-size: 20px; color: var(--color-primary); "
                                    v-text="data.current_user.can.value"></span><span
                                    style=" color: var(--color-primary); ">
                                    积分</span>
                            </span>
                            <span v-if="data.current_user.can.type == 'free'">免费下载</span>
                            <span v-if="data.current_user.can.type == 'comment'">评论后下载</span>
                            <span v-if="data.current_user.can.type == 'login'">登录后下载</span>
                            <span v-if="data.current_user.can.type == 'password'">输入密码下载</span>
                            <span v-if="data.current_user.can.type == 'none'">当前为指定权限用户下载</span>
                        </div>
                        <div class="current-user" v-else>
                            <span v-if="data.current_user.can.free_count">今日免费下载剩余 <span
                                    style=" font-size: 20px; color: var(--color-primary); ">{{
                                        data.current_user.can.free_count
                                    }}</span>
                                次 </span>
                            <span v-else>已获得下载权限</span>
                        </div>

                        <i class="ri-arrow-right-s-line"></i>
                    </div>
                    <ul class="list" v-if="show">
                        <li class="item" v-for="(item, index) in data.rights"
                            :class="item.lv == data.current_user.lv.lv.lv || item.lv == data.current_user.lv.vip.lv ? 'current' : ''">
                            <div>
                                <span>{{ item.name }}</span>
                            </div>
                            <div>
                                <span v-if="item.type == 'money'">￥<span v-text="item.value"></span></span>
                                <span v-if="item.type == 'credit'"><span v-text="item.value"></span> 积分</span>
                                <span v-if="item.type == 'free'">免费下载</span>
                                <span v-if="item.type == 'comment'">评论后下载</span>
                                <span v-if="item.type == 'login'">登录后下载</span>
                                <span v-if="item.type == 'password'">输入密码下载</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="download-btn">
                    <button @click="go()">
                        <i class="ri-download-fill"></i>下载
                    </button>
                </div>
                <div class="attrs-list" v-if="data.attrs.length">
                    <div class="attr-item" v-for="(item, index) in data.attrs">
                        <span>{{ item.key }}</span>
                        <span>{{ item.value }}</span>
                    </div>
                </div>
                <div class="bottom" @click="payVip">开通会员免费下载</div>
            </div>
        </div>
    </section>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import { createMessage as message } from '@/dist/message';
import { useStore } from '@/store';
import {useLoginStatus}   from '@/components/header/composables/useLoginStatus.js'
const { isLogin,checkIsLogin } = useLoginStatus()
import { islidepay,passwordVerify } from '@/dist/pay';


const index = ref(0);
const data = ref(null);
const list = ref([]);
const show = ref(false);
const route = useRoute();
const store = useStore();

const changeTab = async (i) => {
    index.value = i;
    data.value = list.value[index.value]
};

const post_id = ref(0);


const getDownloadData = () => {
    store.fetchDownloadData(post_id.value).then(res => {
        list.value = res.data
        data.value = list.value[index.value];
    }).catch(err => {
    })
}

const go = () => {
    if (!isLogin.value && !data.value.current_user.can.allow && !data.value.current_user.not_login_pay && data.value.current_user.can.type == 'money') {
        return checkIsLogin()
    } else if (!data.value.current_user.can.allow) {
        if (data.value.current_user.can.type == 'comment') {
            message({ message: '评论并刷新后免费下载！', type: 'warning' });
        } else if (data.value.current_user.can.type == 'credit' || data.value.current_user.can.type == 'money') {
            islidepay({
                'title': data.value.title,
                'order_price': data.value.current_user.can.value,
                'order_type': 'xiazai',
                'order_key': index.value,
                'post_id': post_id.value,
                'type': data.value.current_user.can.type,
                'tag': '资源下载'
            }, data.value.current_user.can.type)
        } else if (data.value.current_user.can.type == 'password') {
            store.config.password_verify.post_id = post_id.value;
            passwordVerify(store.config.password_verify)
        } else {
            message({ message: '您无权下载，请升级权限！', type: 'warning' });
        }
        return

    } else {
        window.open(data.value.link)
    }
}




onMounted(() => {
    if (route.params?.postId) {
        post_id.value = route.params.postId;
        if (store.article[post_id.value]) {
            if(store.article[post_id.value].download && store.article[post_id.value].download == '1'){
                getDownloadData();
            }
        }
    } else {
        return;
    }
})





</script>