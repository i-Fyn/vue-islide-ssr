<template>
    <van-address-edit :area-list="areaList" show-delete show-set-default show-search-result
        :search-result="searchResult" :area-columns-placeholder="['请选择', '请选择', '请选择']" :address-info="formData"
        @save="onSave" @delete="onDelete" @focus="onFocus" @change="onChange" @click-area="onClickArea"
        @change-area="onChangeArea" @change-detail="onChangeDetail" @change-default="onChangeDefault"
        @select-search="onSelectSearch" v-loading="loading" />
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { areaList } from '@vant/area-data';
import { useRoute, useRouter } from 'vue-router';
import { createMessage as message } from '@/dist/message';
import axios from '@/dist/axios'; // 你自己的 axios 封装

const searchResult = ref([]);
const loading = ref(false);

const route = useRoute();
const router = useRouter();

// 表单数据（字段一定要按 van-address-edit 要求命名）
const formData = reactive({
    id: route.query.id || null,  // 新建没有id，编辑有
    name: '',
    tel: '',
    province: '',
    city: '',
    county: '',
    addressDetail: '',
    postalCode: '',
    isDefault: false
});

// 👉 页面挂载时，如果是编辑模式，自动加载已有地址
onMounted(async () => {
    if (formData.id) {
        loading.value = true;
        try {
            const res = await axios.get(`/address/detail?id=${formData.id}`);
            fillFormData(res.data.data);
        } catch (err) {
            message({ message: err.message || '加载地址失败', type: 'error' });
        } finally {
            loading.value = false;
        }
    }
});

// 🚀 重新初始化 formData 的安全写法
function fillFormData(address) {
    formData.name = address.name || ''
    formData.tel = address.phone || ''
    formData.province = address.province || ''
    formData.city = address.city || ''
    formData.county = address.district || ''
    formData.addressDetail = address.address_detail || ''
    formData.postalCode = address.postal_code || ''
    formData.isDefault = address.is_default == 1;
    console.log('formData:', formData);
}

// 保存
const onSave = async (info) => {
    loading.value = true;
    try {
        const payload = {
            id: formData.id,
            name: info.name,
            phone: info.tel,
            province: formData.province,
            city: formData.city,
            district: formData.county,
            address_detail: info.addressDetail,
            postal_code: info.postalCode || '',
            is_default: info.isDefault ? 1 : 0,
        };
        await axios.post('/address/save', payload);
        if (formData.id) {
            message({ message: '地址更新成功', type: 'success' });
        } else {
            message({ message: '地址添加成功', type: 'success' });
        }
        router.back();
    } catch (err) {
        message({ message: err.message || '保存失败', type: 'error' });
    } finally {
        loading.value = false;
    }
};

// 删除
const onDelete = async () => {
    if (!formData.id) {
        message({ message: '无效的地址ID', type: 'error' });
        return;
    }
    loading.value = true;
    try {
        await axios.delete(`/address/delete?id=${formData.id}`);
        message({ message: '删除成功', type: 'success' });
        router.back();
    } catch (err) {
        message({ message: err.message || '删除失败', type: 'error' });
    } finally {
        loading.value = false;
    }
};

// 输入框聚焦
const onFocus = (key) => {
    console.log('输入框聚焦:', key);
};

// 输入框变更
const onChange = ({ key, value }) => {
    formData[key] = value;
};

// 点击选择地区
const onClickArea = () => {
    console.log('点击地区选择');
};

// 地区变化
const onChangeArea = (selectedOptions) => {
    if (!selectedOptions || selectedOptions.length < 3) return;
    formData.province = selectedOptions[0]?.text || '';
    formData.city = selectedOptions[1]?.text || '';
    formData.county = selectedOptions[2]?.text || '';
};

// 修改详细地址
const onChangeDetail = (value) => {
    formData.addressDetail = value;
};

// 修改默认地址
const onChangeDefault = (checked) => {
    formData.isDefault = checked;
};

// 选择搜索建议
const onSelectSearch = (value) => {
    formData.addressDetail = value;
};
</script>