// src/store/useShop.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useShopStore = defineStore('shop', () => {
  const product = ref(null) // 当前商品信息
  const selectedSku = ref({}) // 选中的规格
  const quantity = ref(1) // 数量
  const discountPrice = ref(0) // 当前售价
  const originalPrice = ref(0) // 原价
  const stock = ref(0) // 库存
  const limit = ref(0) // 限购
  const sold = ref(0) // 已售
  const orderType = ref('shop') // 订单类型
  const specLabel = ref('') // 规格标签，生成 tag 用
  const totalPrice = computed(() => {
    return parseFloat((discountPrice.value * quantity.value).toFixed(2))
  })

  function setProductDetail(detail) {
    product.value = detail
    quantity.value = 1
    selectedSku.value = {}
    discountPrice.value = 0
    originalPrice.value = 0
    stock.value = 0
    limit.value = 0
    sold.value = 0
    specLabel.value = ''
  }

  function updateSelectedSku(sku) {
    selectedSku.value = sku
    specLabel.value = Object.values(sku).join(' / ')
  }

  function updateProductInfo(info) {
    discountPrice.value = info.discountPrice
    originalPrice.value = info.originalPrice
    stock.value = info.stock
    limit.value = info.limit
    sold.value = info.sold
  }

  function changeQuantity(val) {
    quantity.value = val
  }

  function reset() {
    product.value = null
    selectedSku.value = {}
    quantity.value = 1
    discountPrice.value = 0
    originalPrice.value = 0
    stock.value = 0
    limit.value = 0
    sold.value = 0
    specLabel.value = ''
  }

  function generateOrderData() {
    return {
      total_price: totalPrice.value,
      order_price: discountPrice.value,
      order_type: orderType.value,
      post_id: product.value?.id,
      title: product.value?.title,
      type: 'money',
      order_commodity: product.value?.shop?.commodity,
      spec: selectedSku.value,
      order_value: quantity.value,
      tag: `${product.value?.title}/${specLabel.value}/¥${discountPrice.value}`
    }
  }

  return {
    product,
    selectedSku,
    quantity,
    discountPrice,
    originalPrice,
    stock,
    limit,
    sold,
    orderType,
    specLabel,
    totalPrice,
    setProductDetail,
    updateSelectedSku,
    updateProductInfo,
    changeQuantity,
    reset,
    generateOrderData
  }
})