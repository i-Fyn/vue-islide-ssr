<template>
        <div style="height: 100%; overflow: hidden">
            <editor licenseKey='gpl' v-model="myValue" :init="init" :enabled="enabled" :id="tinymceId"></editor>
        </div>
</template>

<script setup>
import { computed, reactive, watch, ref, nextTick, onMounted } from "vue"; //全屏
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/icons/default/icons";
import "tinymce/models/dom"; // 一定要引入
import "tinymce/themes/silver"; // 界面UI主题
import "tinymce/plugins/image";
import "tinymce/plugins/lists"; // 列表插件
import "tinymce/plugins/preview"; // 预览
import "tinymce/plugins/link"; // 链接插件
import "tinymce/plugins/codesample"; //代码示例

import { createVanModal } from '@/dist/createVanModal'


const emits = defineEmits(["update:modelValue", "setHtml"]);
//这里我选择将数据定义在props里面，方便在不同的页面也可以配置出不同的编辑器，当然也可以直接在组件中直接定义
const props = defineProps({
    modelValue: {
        type: String,
        default: "",
    },
    baseUrl: {
        type: String,
        default: "",
    },
    enabled: {
        type: Boolean,
        default: true,
    },
    // 编辑器初始可编辑状态
    editable_root: {
        type: Boolean,
        default: true,
    },
    plugins: {
        type: [String, Array],
        default: "image link codesample  lists  preview",
    },
    knwlgId: {
        type: String,
    },
    toolbar: {
        type: [String, Array, Boolean],
        default: "blocks | bold |lists|blockquoteColor | | forecolor backcolor |  align numlist bullist | link  | removeformat  | codesample|islideImage|islideHide|preview",
    },
    readonly: {
        type: Boolean,
        default: false,
    },
    minHeight: {
        type: Number,
        default: 630,
    },
    height:{
        type: Number,
        default: 600,
    }
});
const tinymceId = ref(
    "vue-tinymce-" + +new Date() + ((Math.random() * 1000).toFixed(0) + "")
);

//定义一个对象 init初始化
const init = reactive({
    selector: "#" + tinymceId.value, //富文本编辑器的id,
    language_url: "/tinymce/skins/langs/zh_CN.js", // 语言包的路径，具体路径看自己的项目
    language: "zh_CN",
    license_key: 'gpl',  // 允许使用 GPL 开源模式
    skin_url: "/tinymce/skins/ui/oxide", // skin路径，具体路径看自己的项目
    editable_root: props.editable_root,
    height: props.height,
    branding: false, // 是否禁用“Powered by TinyMCE”
    promotion: false, //去掉 upgrade
    menubar: false, // 隐藏菜单栏
    paste_data_images: true, //允许粘贴图像
    image_dimensions: false, //去除宽高属性
    plugins: props.plugins, //这里的数据是在props里面就定义好了的
    toolbar: props.toolbar, //这里的数据是在props里面就定义好了的
    // 取消图片资源路径转换
    convert_urls: false,
    // table边框位0是否展示网格线
    // visual: false,
    // 超链接默认打开方式
    link_default_target: "_blank",
    link_context_toolbar: true,
    // 默认快捷菜单
    quickbars_insert_toolbar: "islideImage codesample",
    // 选中图片的快捷提示
    quickbars_image_toolbar: "alignleft aligncenter alignright | rotateleft rotateright | imageoptions",
    editimage_toolbar: "rotateleft rotateright | flipv fliph | editimage imageoptions",
    // 文字样式
    font_family_formats:
        "Arial=arial,helvetica,sans-serif; 宋体=SimSun; 微软雅黑=Microsoft Yahei; Impact=impact,chicago;", //字体
    font_size_formats: "11px 12px 14px 16px 18px 24px 36px 48px 64px 72px", //文字大小
    image_caption: true,
    editimage_cors_hosts: ["picsum.photos"],
    noneditable_class: "mceNonEditable",
    toolbar_mode: "wrap", // 工具栏模式 floating / sliding / scrolling / wrap
    // 默认样式
    content_style:
        "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }p {margin:3px; line-height:24px;}",
    image_advtab: true,
    importcss_append: true,
    paste_webkit_styles: "all",
    paste_merge_formats: true,
    nonbreaking_force_tab: false,
    paste_auto_cleanup_on_paste: false,
    file_picker_types: "file",
    // 选中文字的快捷提示
    quickbars_selection_toolbar:
        "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
    // 编辑器高度自适应
    autoresize_bottom_margin: 20,
    // autoresize_overflow_padding: 16,
    content_css: "/tinymce/skins/content/default/content.css", //以css文件方式自定义可编辑区域的css样式，css文件需自己创建并引入
    setup: function (editor) {
        editor.ui.registry.addButton('islideImage', {
            icon: 'image',
            onAction: function () {
                handleUploadImage();
            }
        });
        editor.ui.registry.addButton('islideHide', {
            text: '隐藏内容',
            onAction: function () {
                handleHideContent();
            }

        });
    }

});

const handleUploadImage = () => {
    import('@/components/other/Uploadimage.vue').then(module => {
        createVanModal(module.default, {
            size: 350,
            props: {
                data: {
                showTabType: 1,
                maxPicked: 1,
                postType: 'circle',
                callback: (res, type) => {
                    if (res && res.length > 0) {
                        const imageUrl = res[0]?.url;
                        if (imageUrl) {
                            insertToEditor(imageUrl);
                        }
                    }
                }
            }
            }
        })
    })
}

const handleHideContent = () => {
    const editor = tinymce.activeEditor;
    //获取当前选中内容
    var selection = editor.selection.getContent();
    if (selection.indexOf('[content_hide]') != -1) {
        //如果选中内容中包含隐藏内容，则去除隐藏内容
        editor.selection.setContent(selection.replace('[content_hide]', '').replace('[/content_hide]', '').replace(/<br>/g, ''));
    } else {
        //如果选中内容中不包含隐藏内容，则添加隐藏内容
        editor.selection.setContent('[content_hide]<br>' + selection + '<br>[/content_hide]');
    }

}


const insertToEditor = (url) => {
    const editor = tinymce.activeEditor;
    editor.undoManager.transact(() => {
        editor.focus();
        editor.execCommand("mceInsertContent", false, `<img src="${url}" alt="图片" />`);
    });
}

// 外部传递进来的数据变化
const myValue = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emits("update:modelValue", val);
    },
});

//监听富文本中的数据变化
watch(
    () => myValue.value,
    () => {
        emits(
            "setHtml",
            tinymce.activeEditor.getContent({ format: "text" }),
            myValue.value
        );
    }
);



// 设置编辑器只读模式
watch(
    () => props.readonly,
    (newValue, oldValue) => {
        nextTick(() => {
            tinymce.activeEditor.mode.set(newValue ? "readonly" : "design");
            let iframeDom = document.querySelector("iframe");
            iframeDom &&
                (iframeDom.contentWindow.document.body.style.margin = newValue
                    ? 0
                    : "16px");
        });
    },
    { immediate: true }
);



//初始化编辑器
onMounted(() => {
    tinymce.init({});
});

// 设置值
const handleSetContent = (content) => {
    tinymce.activeEditor.setContent(content);
};

// 获取值
const handleGetContent = () => {
    return tinymce.activeEditor.getContent();
};

defineExpose({
    handleSetContent,
    handleGetContent,
});
</script>


<style>
:deep(.tox-tinymce) {
    border: 1px solid #dcdfe6;
    border-radius: 4px;

    .tox-statusbar {
        display: none;
    }
}
</style>