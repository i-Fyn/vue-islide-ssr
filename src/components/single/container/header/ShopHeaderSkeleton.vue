<template>
  <div class="wrapper bg-base-100">
    <div class="product-detail-slider flex flex-col lg:flex-row content-center justify-between p-4 lg:pt-20 pb-5 gap-4 rounded-md">
      <!-- 商品预览区域骨架 -->
      <div class="product-detail-preview w-full lg:w-1/4 lg:sticky top-[var(--top-menu-height)]">
        <div class="preview-main">
          <div class="skeleton aspect-square rounded-lg"></div>
        </div>
        <div class="preview-thumbs mt-4 grid grid-cols-4 gap-2">
          <div class="skeleton aspect-square rounded-lg"></div>
        </div>
      </div>

      <!-- 商品信息区域骨架 -->
      <div class="product-detail-heading w-full lg:w-7/10">
        <div class="row flex flex-col gap-6">
          <!-- 标题和描述 -->
          <div class="col-12">
            <div class="skeleton h-8 w-3/4 mb-4"></div>
            <div class="skeleton h-4 w-full mb-2"></div>
            <div class="skeleton h-4 w-5/6"></div>
          </div>

          <!-- SKU选择区域骨架 -->
          <div class="shop-sku-item-group">
            <div class="sku-item-group mb-4">
              <div class="skeleton h-6 w-24 mb-3"></div>
              <div class="flex flex-wrap gap-3">
                <div class="skeleton h-10 w-20 rounded-lg"></div>
                <div class="skeleton h-10 w-20 rounded-lg"></div>
                <div class="skeleton h-10 w-20 rounded-lg"></div>
              </div>
            </div>
          </div>

          <!-- 价格区域骨架 -->
          <div>
            <div class="product-price flex items-center gap-4">
              <div class="skeleton h-8 w-32"></div>
              <div class="skeleton h-6 w-24"></div>
            </div>
          </div>

          <!-- 保障信息骨架 -->
          <div>
            <ul class="product-copyright flex flex-wrap gap-6 py-4 border-t border-base-200">
              <li class="flex items-center gap-2">
                <div class="skeleton h-4 w-24"></div>
              </li>
              <li class="flex items-center gap-2">
                <div class="skeleton h-4 w-24"></div>
              </li>
            </ul>
          </div>

          <!-- 购买操作区域骨架 -->
          <div>
            <div class="product-action flex flex-row flex-wrap justify-between gap-4">
              <div class="quantity-container flex items-center gap-6 flex-wrap">
                <div class="skeleton h-6 w-12"></div>
                <div class="skeleton h-10 w-32"></div>
                <div class="skeleton h-4 w-24"></div>
              </div>
              <div class="skeleton h-12 w-32 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 移动端底部购买栏骨架 -->
  <div class="mobile-show lg:hidden fixed bottom-0 left-0 right-0 z-[1003] bg-base-100 p-4 border-t border-base-200">
    <div class="flex items-center justify-between">
      <div class="skeleton h-4 w-32"></div>
      <div class="skeleton h-10 w-24 rounded-lg"></div>
    </div>
  </div>
</template>

<script setup>
// 骨架屏组件不需要任何逻辑
</script> 