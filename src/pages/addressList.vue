<template>
    <div>
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
        v-loading="loading"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { createMessage as message } from '@/dist/message';
  import axios from '@/dist/axios'; // 你的封装的 axios
  
  const router = useRouter();
  
  const loading = ref(false);
  const list = ref([]);
  const chosenAddressId = ref('');
  
  const fetchAddressList = async () => {
    loading.value = true;
    try {
      const res = await axios.get('/address/list'); // 后端接口，比如 islide_get_address_list
      const addressList = res.data || [];
  
      list.value = addressList.map(item => ({
        id: item.id.toString(),
        name: item.name,
        tel: item.phone,
        address: `${item.province}${item.city}${item.district}${item.address_detail}`,
        isDefault: item.is_default == 1
      }));
  
      if (!chosenAddressId.value && list.value.length > 0) {
        const defaultAddress = list.value.find(item => item.isDefault);
        chosenAddressId.value = defaultAddress ? defaultAddress.id : list.value[0].id;
      }
  
    } catch (err) {
      message({ message: err.message || '加载地址失败', type: 'error' });
    } finally {
      loading.value = false;
    }
  };
  
  // 新增地址跳转
  const onAdd = () => {
    router.push('/address/edit');
  };
  
  // 编辑地址跳转
  const onEdit = (item) => {
    router.push(`/address/edit?id=${item.id}`);
  };
  
  onMounted(() => {
    fetchAddressList();
  });

  </script>
  <style>
.van-address-list__bottom.van-safe-area-bottom{
 z-index: 1003;
 height: var(--top-menu-height);
}
</style>