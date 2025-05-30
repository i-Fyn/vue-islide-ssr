<template>
  <div class="product-category">
    <div class="container">
      <div class="breadcrumb">
        <router-link to="/">首页</router-link>
        <span class="separator">/</span>
        <span class="current">{{ getCategoryName }}</span>
      </div>

      <div class="category-header">
        <h1 class="category-title">{{ getCategoryName }}</h1>
        <div class="category-filters">
          <div class="sort-filter">
            <label for="sort">排序方式：</label>
            <select id="sort" v-model="sortBy">
              <option value="default">默认排序</option>
              <option value="price-low-high">价格 (低 - 高)</option>
              <option value="price-high-low">价格 (高 - 低)</option>
              <option value="name-a-z">名称 (A - Z)</option>
              <option value="name-z-a">名称 (Z - A)</option>
            </select>
          </div>
        </div>
      </div>

      <div class="category-content">
        <div class="sidebar">
          <div class="filter-section">
            <h3 class="filter-title">价格</h3>
            <div class="price-slider">
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                v-model.number="priceRange"
              />
              <div class="price-values">
                <span>¥0</span>
                <span>¥{{ priceRange }}</span>
              </div>
            </div>
          </div>

          <div class="filter-section">
            <h3 class="filter-title">品牌</h3>
            <div class="filter-options">
              <label class="filter-option" v-for="(brand, index) in brands" :key="index">
                <input
                  type="checkbox"
                  :value="brand.value"
                  v-model="selectedBrands"
                />
                <span class="label-text">{{ brand.label }}</span>
              </label>
            </div>
          </div>

          <div class="filter-actions">
            <button class="btn-filter" @click="applyFilters">应用筛选</button>
            <button class="btn-reset" @click="resetFilters">重置</button>
          </div>
        </div>

        <div class="product-grid">
          <div class="product-card" v-for="product in products" :key="product.id">
            <div class="product-image">
              <span v-if="product.discount" class="discount-badge">限时优惠</span>
              <router-link :to="`/products/${product.id}`">
                <van-image lazy-load :src="product.image" :alt="product.name" />
              </router-link>
            </div>
            <div class="product-info">
              <h3 class="product-title">
                <router-link :to="`/products/${product.id}`">{{ product.name }}</router-link>
              </h3>
              <div class="product-price">
                <span class="current-price">¥{{ product.price }}</span>
                <span class="old-price" v-if="product.oldPrice">¥{{ product.oldPrice }}</span>
              </div>
            </div>
          </div>

          <div class="no-products-found" v-if="filteredProducts.length === 0">
            <p>没有找到符合条件的产品。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCategory',
  data() {
    return {
      sortBy: 'default',
      priceRange: 10000,
      selectedBrands: [],
      brands: [
        { label: 'Apple', value: 'apple' },
        { label: 'Samsung', value: 'samsung' },
        { label: 'Xiaomi', value: 'xiaomi' },
        { label: 'Huawei', value: 'huawei' }
      ],
      products: [
        {
          id: 262,
          name: 'Apple/ 13" MacBook Pro Apple M2',
          price: 5999,
          oldPrice: 9999,
          image: 'https://ext.same-assets.com/584130480/863390669.png',
          category: 'pad',
          brand: 'apple',
          discount: true
        },
        {
          id: 238,
          name: 'Apple/ AirPods Max',
          price: 3299,
          oldPrice: 3999,
          image: 'https://ext.same-assets.com/584130480/2986862810.png',
          category: 'pods',
          brand: 'apple',
          discount: true
        },
        {
          id: 229,
          name: 'Apple/ HomePod mini',
          price: 1319,
          oldPrice: 1349,
          image: 'https://ext.same-assets.com/584130480/3687902354.png',
          category: 'accessories',
          brand: 'apple',
          discount: true
        },
        {
          id: 221,
          name: 'Apple/ 10.9" iPad Air',
          price: 4599,
          oldPrice: 4799,
          image: 'https://ext.same-assets.com/584130480/863390669.png',
          category: 'pad',
          brand: 'apple',
          discount: true
        },
        {
          id: 209,
          name: 'Apple/ 11" iPad Pro',
          price: 6599,
          oldPrice: 6799,
          image: 'https://ext.same-assets.com/584130480/1599315449.png',
          category: 'pad',
          brand: 'apple',
          discount: true
        },
        {
          id: 189,
          name: 'iPhone14',
          price: 5699,
          oldPrice: 5999,
          image: 'https://ext.same-assets.com/584130480/3228185995.png',
          category: 'phone',
          brand: 'apple',
          discount: true
        }
      ]
    }
  },
  computed: {
    getCategoryName() {
      const category = this.$route.params.category;
      const categoryMap = {
        'phone': '智能手机',
        'pad': '平板电脑',
        'pods': '蓝牙耳机',
        'accessories': '智能配件',
        'watch': '智能手表',
        'shumashebei': '数码设备',
        'store': '所有产品'
      };

      return categoryMap[category] || '所有产品';
    },

    filteredProducts() {
      const category = this.$route.params.category;

      let filtered = category === 'store'
        ? [...this.products]
        : this.products.filter(product => product.category === category);

      filtered = filtered.filter(product => parseFloat(product.price) <= this.priceRange);

      if (this.selectedBrands.length > 0) {
        filtered = filtered.filter(product => this.selectedBrands.includes(product.brand));
      }

      if (this.sortBy === 'price-low-high') {
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      } else if (this.sortBy === 'price-high-low') {
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      } else if (this.sortBy === 'name-a-z') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      } else if (this.sortBy === 'name-z-a') {
        filtered.sort((a, b) => b.name.localeCompare(a.name));
      }

      return filtered;
    }
  },
  methods: {
    applyFilters() {
      console.log('Applying filters');
    },

    resetFilters() {
      this.priceRange = 10000;
      this.selectedBrands = [];
      this.sortBy = 'default';
    }
  }
};
</script>

<style scoped>
.product-category {
  padding: 40px 0;
  background-color: #f6f6f9;
}

.breadcrumb {
  margin-bottom: 30px;
  color: #959baa;
  font-size: 14px;
}

.breadcrumb a {
  color: #1d2234;
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb a:hover {
  color: #4361ee;
}

.separator {
  margin: 0 10px;
}

.current {
  color: #959baa;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.category-title {
  font-size: 28px;
  font-weight: 700;
  color: #1d2234;
  margin: 0;
}

.category-filters {
  display: flex;
  align-items: center;
}

.sort-filter {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-filter label {
  font-size: 14px;
  color: #666;
}

.sort-filter select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
}

.category-content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;
}

.sidebar {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  align-self: flex-start;
}

.filter-section {
  margin-bottom: 25px;
}

.filter-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #1d2234;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.price-slider input {
  width: 100%;
  margin-bottom: 10px;
}

.price-values {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-option {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.filter-option input {
  margin-right: 10px;
}

.label-text {
  font-size: 14px;
  color: #666;
}

.filter-actions {
  display: flex;
  gap: 10px;
}

.btn-filter, .btn-reset {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-filter {
  background-color: #4361ee;
  color: white;
  flex: 1;
}

.btn-filter:hover {
  background-color: #2a3050;
}

.btn-reset {
  background-color: #f5f5fa;
  color: #666;
  border: 1px solid #ddd;
}

.btn-reset:hover {
  background-color: #e5e5f0;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.product-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.product-image {
  position: relative;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  overflow: hidden;
}

.product-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.discount-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #ff6b6b;
  color: white;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
}

.product-info {
  padding: 15px;
}

.product-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
  line-height: 1.4;
}

.product-title a {
  color: #1d2234;
  text-decoration: none;
  transition: color 0.3s ease;
}

.product-title a:hover {
  color: #4361ee;
}

.product-price {
  display: flex;
  align-items: center;
}

.current-price {
  font-size: 18px;
  font-weight: 700;
  color: #ff6b6b;
  margin-right: 10px;
}

.old-price {
  font-size: 14px;
  color: #959baa;
  text-decoration: line-through;
}

.no-products-found {
  grid-column: 1 / -1;
  text-align: center;
  padding: 50px 0;
  background-color: white;
  border-radius: 8px;
}

.no-products-found p {
  font-size: 16px;
  color: #666;
}

/* Responsive */
@media (max-width: 992px) {
  .category-content {
    grid-template-columns: 1fr;
  }

  .category-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 576px) {
  .product-grid {
    grid-template-columns: 1fr;
  }

  .sort-filter {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }

  .sort-filter select {
    width: 100%;
  }
}
</style>