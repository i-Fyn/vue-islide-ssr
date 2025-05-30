<template>
  <div class="wrapper ">
    <div
      class="bg-base-100  product-detail-slider swiper-container  flex flex-col lg:flex-row  content-center justify-between p-4 lg:pt-20 gap-4 "
      v-cloak>
      <!-- 商品预览区域 -->
      <div class="flex flex-col w-full lg:w-1/4  lg:sticky top-[var(--top-menu-height)]">
        <div class=" relative group">
          <div ref="carouselRef" class="carousel product-detail-preview slide-nextprev">
            <div v-for="(image, index) in postDetail.shop.gallery" :key="index"
              class="carousel-item relative inline-block w-full shrink-0 snap-center content-center bg-base-200 rounded-lg overflow-hidden "
              @click="previewImages(index)">
              <img :src="image"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div
              class="absolute opacity-0  left-0 right-0 top-1/2 z-10 flex justify-between px-4 -translate-y-1/2 pointer-events-none group-hover:opacity-60 transition-opacity"
              :hidden="postDetail.shop.gallery.length < 2">
              <button class="btn btn-circle pointer-events-auto" @click="scrollTo('prev')"
                :disabled="currentIndex === 0">
                ❮
              </button>
              <button class="btn btn-circle pointer-events-auto" @click="scrollTo('next')"
                :disabled="currentIndex === postDetail.shop.gallery.length - 1">
                ❯
              </button>
            </div>

          </div>
        </div>
        <div class="preview-thumbs" style="margin-top: 10px;">
          <div class="grid grid-cols-3 gap-2 scroll-x">
            <div class="swiper-slide" v-for="(image_url, index) in postDetail.shop.gallery" :key="index"
              :class="{ 'active border p-1 rounded-lg border-primary': index === currentIndex }"
              @click="scrollToIndex(index)">
              <div class="media relative aspect-square rounded-lg overflow-hidden group">
                <div class="media-content">
                  <img alt="product-image" :src="image_url"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div
                  class="absolute inset-0 border border-base-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                </div>
              </div>
            </div>
          </div>
          <span class="swiper-notification"></span>
        </div>
      </div>

      <!-- 商品信息区域 -->
      <div class="product-detail-heading w-full lg:w-7/10">
        <div class="row flex flex-col gap-6">
          <div class="col-12">
            <h1 class="product-title text-xl lg:text-3xl font-medium mb-5">{{ postDetail.title }}</h1>
            <div class="product-desc text-base-content/70 text-base">{{ postDetail.excerpt }}</div>
          </div>

          <!-- SKU选择区域 -->
          <div class="shop-sku-item-group" v-if="postDetail.shop.type === 'multi'">
            <div class="sku-item-group" v-for="item in postDetail.shop.spec_groups" :key="item.name">
              <div class="sku-item-title text-lg font-bold">{{ item.name }}</div>
              <div class="sku-box flex flex-wrap gap-3 mt-2">
                <div class="sku-item" v-for="sku in item.values" :key="sku">
                  <a class="sku-item-btn btn btn-primary btn-md  py-2 px-4  transition-all duration-300" :class="[
                    isActive(item.name, sku)
                      ? 'bg-primary text-primary-content border-primary hover:bg-primary-focus'
                      : 'bg-base-100 hover:bg-base-200 hover:border-primary hover:text-primary'
                  ]" @click="selectSku(item.name, sku)">
                    <span class="v-btn__content truncate">{{ sku }}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- 价格区域 -->
          <div>
            <div class="product-price flex items-center gap-4">
              <div class="price-box-left flex items-center gap-2">
                <small class="text-lg"><i class="ri-coin-line text-primary text-xl"></i></small>
                <span class="font-number text-2xl font-medium">{{ total_price }}</span>
                <sup v-if="total_original_price > total_price"
                  class="badge badge-primary rounded-tl-lg rounded-br-none -ml-1 -mt-4">
                  限时优惠
                </sup>
                <span v-if="total_original_price > total_price" class="original-price flex items-center gap-2">
                  <small class="text-lg"><i class="ri-coin-line text-base-content/50"></i></small>
                  <del class="font-number text-xl text-base-content/50">{{ total_original_price }}</del>
                </span>
              </div>
            </div>
          </div>

          <!-- 保障信息 -->
          <div>
            <ul class="product-copyright flex flex-wrap gap-6 py-4 border-t border-base-200">
              <li v-if="postDetail.shop.guarantees" v-for="guarantee in postDetail.shop.guarantees" :key="guarantee"
                class="flex items-center gap-2">
                <i class="ri-checkbox-line text-primary"></i>
                <span class="text-base">{{ guarantee }}</span>
              </li>
            </ul>
          </div>

          <!-- 购买操作区域 -->
          <div>
            <div class="product-action flex flex-row flex-wrap justify-between gap-4">
              <div class="quantity-container flex items-center gap-6 flex-wrap">
                <label for="quantity-input" class="quantity-label text-lg font-bold">数量</label>
                <div class="quantity-controls join">
                  <button class="quantity-btn decrease join-item btn btn-sm h-10 w-10" aria-label="减少"
                    :disabled="quantity <= 1" @click="decreaseQuantity">
                    <i class="ri-subtract-line"></i>
                  </button>
                  <div
                    class="quantity-input join-item btn btn-sm h-10 w-12 text-center flex items-center justify-center">
                    {{ quantity }}
                  </div>
                  <button class="quantity-btn increase join-item btn btn-sm h-10 w-10" aria-label="增加"
                    :disabled="quantity >= selectedLimit || quantity >= selectedStock" @click="increaseQuantity">
                    <i class="ri-add-line"></i>
                  </button>
                </div>
                <span class="quantity-limit text-error">仅限购{{ selectedLimit }}件</span>
                <span class="text-base-content/70">库存:{{ selectedStock }}</span>
                <span class="text-base-content/70">已售:{{ selectedSold }}</span>
              </div>
              <button  @click="buyNow" class="buy-button btn btn-primary w-full lg:w-auto hidden lg:block rounded-4xl"
                :class="{ 'btn-disabled': quantity <= 0 || quantity > selectedLimit || quantity > selectedStock }">
                立即购买
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 移动端底部购买栏 -->
  <van-submit-bar :price="total_price * 100" button-text="提交订单" @submit="buyNow"
    class="lg:hidden fixed  bottom-0 left-0 right-0" style="--van-submit-bar-z-index: 1003;" >
    <template #tip>
      <span @click="router.push('/address/list')" class="text-sm text-base-content/70">
        点击填写/修改地址哦～
      </span>
    </template>
  </van-submit-bar>
</template>


<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { showImagePreview } from 'vant'
import { islidepay } from '@/dist/pay';
import { useRouter } from 'vue-router';

const props = defineProps({
  postDetail: {
    type: Object,
    default: () => ({})
  }
});

const router = useRouter();
const selectedSku = ref({});
const selectedPrice = ref(0);
const selectedStock = ref(0);
const selectedLimit = ref(0);
const selectedSold = ref(0);
const discountPrice = ref(0);
const originalPrice = ref(0);
const quantity = ref(1);
const order_type = 'shop';

const currentIndex = ref(0);
const carouselRef = ref(null);
const isScrolling = ref(false);

const total_price = computed(() => {
  return discountPrice.value * quantity.value;
});
const total_original_price = computed(() => {
  return originalPrice.value * quantity.value;
});


const selectSku = (groupName, value) => {
  selectedSku.value[groupName] = value;
  updateProductDetails();
};

const isActive = (groupName, value) => {
  return selectedSku.value[groupName] === value;
};

const increaseQuantity = () => {
  if (quantity.value < selectedLimit.value && quantity.value < selectedStock.value) {
    quantity.value++;
  }
};

const decreaseQuantity = () => {
  if (quantity.value > 1) quantity.value--;
};

const updateProductDetails = () => {
  const shop = props.postDetail.shop;
  if (shop.type === 'multi') {
    const selectedSpec = Object.entries(selectedSku.value)
      .map(([k, v]) => `${k}:${v}`)
      .join(' / ');
    const match = shop.specs.find(s => s.name === selectedSpec);
    if (match) {
      selectedPrice.value = match.price;
      selectedStock.value = match.stock;
      selectedLimit.value = match.limit;
      selectedSold.value = match.sold;
      originalPrice.value = match.oldPrice;
      discountPrice.value = match.price;
      return;
    }
  }

  // 单品或未选中规格
  selectedPrice.value = props.postDetail.shop.price;
  selectedStock.value = props.postDetail.shop.stock;
  selectedLimit.value = props.postDetail.shop.limit;
  selectedSold.value = props.postDetail.shop.sold || 0;
  originalPrice.value = props.postDetail.shop.oldPrice;
  discountPrice.value = props.postDetail.shop.price;
};

const buyNow = () => {
  const selectedLabel = Object.values(selectedSku.value).join(' / ');
  const tag = `${props.postDetail.title}/${selectedLabel}/¥${selectedPrice.value}`;

  islidepay({
    total_price: parseFloat((discountPrice.value * quantity.value).toFixed(2)),
    order_price: discountPrice.value,
    order_type,
    post_id: props.postDetail.id,
    title: props.postDetail.title,
    type: 'money',
    order_commodity: props.postDetail.shop.commodity,
    spec: selectedSku.value,
    order_value: quantity.value,
    tag
  });
};

// 滚动到目标项
const scrollTo = (direction) => {
  if (!carouselRef.value || isScrolling.value) return;
  isScrolling.value = true;

  const total = props.postDetail.shop.gallery.length;
  if (direction === 'prev') {
    currentIndex.value = Math.max(0, currentIndex.value - 1);
  } else if (direction === 'next') {
    currentIndex.value = Math.min(total - 1, currentIndex.value + 1);
  }

  const el = carouselRef.value.children[currentIndex.value];
  el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

  // 滚动结束后重置标志
  setTimeout(() => {
    isScrolling.value = false;
  }, 500); // 等待滚动动画完成
};

const previewImages = (startIndex) => {
    const images = props.postDetail.shop.gallery;
    showImagePreview({
        images,
        startPosition: startIndex,
        closeable: true,
        showIndex: true,
        teleport: 'body'
    })
}

const scrollToIndex = (index) => {
  if (!carouselRef.value || isScrolling.value) return;
  isScrolling.value = true;
  currentIndex.value = index;
  const el = carouselRef.value.children[index];
  el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

  setTimeout(() => {
    isScrolling.value = false;
  }, 500);
};

const debounce = (fn, delay = 100) => {
  let timer;
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

const handleScroll = () => {
  if (!carouselRef.value || isScrolling.value) return;
  const scrollLeft = carouselRef.value.scrollLeft;
  const width = carouselRef.value.offsetWidth;
  const index = Math.round(scrollLeft / width);
  currentIndex.value = index;
};

// ✅ 正确使用 debounce
const debouncedHandleScroll = debounce(handleScroll, 0);



onMounted(() => {
  const shop = props.postDetail.shop;
  if (shop.type === 'multi') {
    shop.spec_groups.forEach(group => {
      if (group.values?.length > 0) {
        selectedSku.value[group.name] = group.values[0];
      }
    })
  }

  if (carouselRef.value) {
      carouselRef.value.addEventListener('scroll', debouncedHandleScroll, { passive: true });
    }

  updateProductDetails();
});

onBeforeUnmount(() => {
  if (carouselRef.value) {
    carouselRef.value.removeEventListener('scroll', debouncedHandleScroll);
  }
});


</script>