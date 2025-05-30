<template>
    <div class="single-page">
    <div class="wrapper">
        <div class="container">
            <div class="flex flex-col lg:flex-row gap-6">
                <!-- 左侧编辑区 -->
                <div class="flex-1 w-full">
                    <div class="card bg-base-100  lg:shadow-sm">
                        <div class="card-body p-0 lg:p-4 ">
                            <!-- 标题输入 -->
                            <div class="form-control group p-4">
                                <input type="text" v-model="title" placeholder="请输入标题" 
                                    class="input  w-full text-lg sm:text-xl font-medium" />
                                <div class="h-[1px] bg-primary w-0 transition-all duration-300 group-hover:w-full"></div>
                            </div>

                            <!-- 编辑器 -->
                            <div class="mt-4 card border lg:border-base-200 overflow-hidden min-h-[300px] sm:min-h-157">
                                <ClientOnly>
                                    <TinyEditor ref="editorRef" v-model="content" />
                                </ClientOnly>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 右侧设置区 -->
                <div class="space-y-6 w-full lg:w-72 bg-base-100 p-4 sm:p-6 rounded-lg shadow-sm">
                    <!-- 封面设置 -->
                    <div class="relative">
                        <h3 class="text-sm font-medium mb-3 tracking-wide">文章封面</h3>
                        <div>
                            <div v-if="!thumb" @click="showImgUploadBox"
                                class="border border-dashed border-base-300 rounded-lg p-4 sm:p-6 text-center cursor-pointer hover:border-primary transition-colors">
                                <i class="ri-image-add-line text-xl sm:text-2xl mb-2 text-base-content/60"></i>
                                <p class="text-sm text-base-content/60">点击添加封面图</p>
                            </div>
                            <div v-else class="relative">
                                <img :src="thumb" class="w-full h-32 sm:h-40 object-cover rounded-lg" />
                                <div class="absolute bottom-0 left-0 right-0 p-2 bg-black/40 backdrop-blur-sm rounded-b-lg flex justify-end gap-2">
                                    <button class="btn btn-ghost btn-xs text-white" @click="showImgUploadBox">更换</button>
                                    <button class="btn btn-ghost btn-xs text-white" @click="thumb = ''">删除</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 分类设置 -->
                    <div class="relative">
                        <h3 class="text-sm font-medium mb-3 tracking-wide">文章分类</h3>
                        <div class="form-control">
                            <select class="select select-bordered w-full text-sm h-10" v-model="edit_cats">
                                <option v-for="item in catsOptions" :key="item.term_id" :value="item.term_id">
                                    {{ item.name }}
                                </option>
                            </select>
                        </div>

                        <h3 class="text-sm font-medium mt-5 mb-3 tracking-wide">文章标签</h3>
                        <div class="form-control">
                            <select class="select select-bordered w-full text-sm h-10" v-model="edit_tags">
                                <option v-for="item in tagsOptions" :key="item.term_id" :value="item.name">
                                    {{ item.name }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <!-- 权限设置 -->
                    <div class="relative">
                        <h3 class="text-sm font-medium mb-3 tracking-wide">内容权限</h3>
                        <select class="select select-bordered w-full text-sm h-10" v-model="edit_role.key">
                            <option v-for="item in roleOptions" :key="item.value" :value="item.value">
                                {{ item.label }}
                            </option>
                        </select>

                        <div class="my-4 flex items-center gap-2 flex-wrap" v-if="edit_role.key == 'credit' || edit_role.key == 'money'" v-cloak>
                            <span class="text-sm">需要支付的{{ edit_role.key == 'credit' ? '积分' : '费用' }}：</span>
                            <input type="number" v-model="edit_role.num" class="input input-bordered input-sm w-24 h-9" min="1" />
                        </div>
                        <div class="my-4" v-if="edit_role.key == 'roles'" v-cloak>
                            <div class="flex flex-wrap gap-2">
                                <label v-for="(lv, key) in roles" :key="key" class="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" v-model="edit_role.roles" :value="key" class="checkbox checkbox-xs" />
                                    <span class="text-sm" v-text="lv"></span>
                                </label>
                            </div>
                        </div>
                        <div class="my-4" v-if="edit_role.key == 'password'" v-cloak>
                            <input type="number" placeholder="(数字) 设置密码" maxlength="20" class="input input-bordered input-sm w-full h-9" />
                        </div>
                    </div>

                    <!-- 提交按钮 -->
                    <div class="flex justify-between gap-3 mt-6">
                        <button class="btn btn-outline btn-sm flex-1 h-9" @click="submit('draft')">保存草稿</button>
                        <button class="btn btn-primary btn-sm flex-1 h-9" @click="submit('publish')">发布文章</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script setup>
import axios from '@/dist/axios'
import { ref, onMounted, reactive, toRefs, computed, defineAsyncComponent, nextTick, onErrorCaptured } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "@/store";
import { createMessage as message } from "@/dist/message";
import { createVanModal } from '@/dist/createVanModal'
import ClientOnly from "../components/other/ClientOnly.vue";

// 错误处理
onErrorCaptured((err, instance, info) => {
  console.error('组件错误:', err, info);
  message({ message: '页面加载出错，请刷新重试', type: 'error' });
  return false;
});

// 异步加载编辑器组件
const TinyEditor = defineAsyncComponent({
  loader: () => import.meta.env.SSR
    ? Promise.resolve({ render: () => null })
    : import('@/components/tinymce/TinyEditor.vue'),
  loadingComponent: { render: () => null },
  errorComponent: { render: () => null },
  delay: 200,
  timeout: 5000
});

const store = useStore();
const router = useRouter();
const route = useRoute();

// 状态管理
const editorRef = ref(null);
const config = computed(() => store.config || {});
const content = ref('');
const edit_cats = ref([]);
const edit_tags = ref([]);
const postId = ref('');
const roles = ref([]);

// 表单数据
const edit_role = ref({
  key: 'none',
  num: '',
  roles: []
});

const postData = reactive({
  thumb: "",
  title: "",
});

const { thumb, title } = toRefs(postData);

// 工具函数
const handleTaxArray = (arr, remainKeyArr = ['term_id', 'name']) => {
  try {
    if (!Array.isArray(arr)) return [];
    return arr.map(item => {
      const newItem = {};
      remainKeyArr.forEach(key => {
        newItem[key] = item[key];
      });
      return newItem;
    });
  } catch (error) {
    console.error('处理分类数组失败:', error);
    return [];
  }
};

const handleTaxArray2 = (arr, remainKey) => {
  try {
    if (!Array.isArray(arr)) return [];
    return arr.map(item => item[remainKey]).filter(Boolean);
  } catch (error) {
    console.error('处理标签数组失败:', error);
    return [];
  }
};

// 计算属性
const catsOptions = computed(() => {
  try {
    const cats = config.value?.write_cats || [];
    const allCats = config.value?.tax?.cats || [];
    return handleTaxArray(
      cats.length
        ? allCats.filter(item => cats.includes(item.id?.toString()))
        : allCats
    );
  } catch (error) {
    console.error('计算分类选项失败:', error);
    return [];
  }
});

const tagsOptions = computed(() => {
  try {
    return handleTaxArray(config.value?.tax?.tags || []);
  } catch (error) {
    console.error('计算标签选项失败:', error);
    return [];
  }
});

const roleOptions = ref([
  { value: 'none', label: '无限制' },
  { value: 'money', label: '支付费用' },
  { value: 'credit', label: '支付积分' },
  { value: 'roles', label: '限制等级' },
  { value: 'login', label: '登录可见' },
  { value: 'comment', label: '评论可见' },
  { value: 'password', label: '密码可见' }
]);

// API 请求函数
const getUserPostCapabilities = async () => {
  try {
    const res = await axios.get('/getUserPostCapabilities');
    roles.value = res.data?.roles || [];
  } catch (error) {
    console.error('获取用户权限失败:', error);
    message({ message: '获取用户权限失败', type: 'error' });
  }
};

const getPostData = async (id) => {
  try {
    const res = await axios.get('/edit/post?id=' + id);
    const { cats, tags, role, thumb: postThumb, title: postTitle, content: postContent } = res.data;

    edit_cats.value = handleTaxArray2(cats || [], 'term_id');
    edit_tags.value = handleTaxArray2(tags || [], 'name');
    edit_role.value = role || { key: 'none', num: '', roles: [] };
    thumb.value = postThumb?.full?.[0] || '';
    title.value = postTitle || '';

    let ct = postContent?.content || '';
    if (postContent?.content_hide) {
      ct += '\n[content_hide]\n' + postContent.content_hide.content + '\n[/content_hide]';
    }
    content.value = ct;
  } catch (error) {
    console.error('获取文章数据失败:', error);
    message({ message: '获取文章数据失败', type: 'error' });
  }
};

// 图片上传
const showImgUploadBox = () => {
  try {
    import('@/components/other/Uploadimage.vue').then(module => {
      createVanModal(module.default, {
        size: 400,
        props: {
          data: {
            showTabType: 1,
            maxPicked: 1,
            postType: 'circle',
            callback: (res, type) => {
              if (res?.[0]?.url) {
                thumb.value = res[0].url;
              }
            }
          }
        }
      });
    }).catch(error => {
      console.error('加载上传组件失败:', error);
      message({ message: '加载上传组件失败', type: 'error' });
    });
  } catch (error) {
    console.error('显示上传框失败:', error);
    message({ message: '显示上传框失败', type: 'error' });
  }
};

// 提交文章
const submit = async (type) => {
  try {
    // 数据验证
    if (!title.value?.trim()) {
      message({ message: '请输入文章标题', type: 'warning' });
      return;
    }

    if (!content.value?.trim()) {
      message({ message: '请输入文章内容', type: 'warning' });
      return;
    }

    const data = {
      title: title.value.trim(),
      cats: edit_cats.value,
      thumb: thumb.value,
      content: content.value.trim(),
      role: edit_role.value,
      tags: edit_tags.value,
      type,
      post_id: postId.value,
    };

    const res = await axios.post('/insertPost', data);
    message({ message: res.data.msg, type: 'success' });
    
    // 延迟跳转，确保消息显示
    setTimeout(() => {
      router.push(res.data.url);
    }, 1000);
  } catch (error) {
    console.error('提交文章失败:', error);
    message({ 
      message: error.response?.data?.message || '提交文章失败，请重试', 
      type: 'error' 
    });
  }
};

// 生命周期钩子
onMounted(async () => {
  try {
    const { id } = route.query;
    if (id) {
      postId.value = id;
      await getPostData(id);
    }
    await getUserPostCapabilities();
  } catch (error) {
    console.error('初始化失败:', error);
    message({ message: '页面加载失败，请刷新重试', type: 'error' });
  }
});
</script>
