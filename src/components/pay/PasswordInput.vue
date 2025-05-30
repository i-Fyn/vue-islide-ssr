<template>
    <div class="password-input relative flex gap-2 p-2 bg-base-200/50 rounded-lg" @click="focusInput">
        <div v-for="(item, index) in length" :key="index" 
            class="password-item flex-1 aspect-square flex items-center justify-center bg-base-100 rounded-lg border-2 transition-all duration-200"
            :class="{'border-primary': focused && index === password.length && isFocused}">
            <div v-if="mask && password[index]" class="password-dot w-3 h-3 rounded-full bg-base-content"></div>
            <div v-if="!mask && password[index]" class="text-lg font-medium">{{ password[index] }}</div>
            <div v-if="focused && index === password.length && isFocused" 
                class="password-cursor w-0.5 h-6 bg-primary animate-pulse"></div>
        </div>
        <input ref="input" v-model="inputValue" @input="onInput($event)" @paste="onPaste($event)"
            @keypress="onKeypress($event)" :maxlength="length" 
            class="input absolute opacity-0 w-0 h-0" 
            @focus="isFocused = true" @blur="isFocused = false" />
    </div>
</template>

<script setup>

import { ref,  onMounted,  watch } from 'vue'

const props = defineProps({
    value: {
        type: String,
        default: ''
    },
    length: {
        type: [Number, String],
        default: 6
    },
    mask: {
        type: Boolean,
        default: false
    },
    focused: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue'])


const password = ref(Array.from({ length: props.length }).fill(''));
const inputValue = ref('');
const isFocused = ref(false)
const input = ref(null)


onMounted(() => {
    password.value = props.value.split('').slice(0, props.length);
    inputValue.value = props.value.slice(0, props.length);
})


const onInput = (event) => {
    const value = event.target.value;
    inputValue.value = value;

    if (value.length > props.length) {
        inputValue.value = value.slice(0, props.length);
    }

    password.value = inputValue.value.split('').slice(0, props.length);

    // 处理输入的密码，可以在这里进行一些额外的逻辑
    emit('update:modelValue', inputValue.value);
}


const onPaste = (event) => {
    event.preventDefault(); // 阻止默认粘贴行为
    const value = event.clipboardData.getData('text/plain');
    inputValue.value = value;

    if (value.length > props.length) {
        inputValue.value = value.slice(0, props.length);
    }

    password.value = inputValue.value.split('').slice(0, props.length);

    // 处理粘贴的密码，可以在这里进行一些额外的逻辑
    emit('update:modelValue', inputValue.value);
}


const onKeypress = (event) => {
    const char = String.fromCharCode(event.keyCode);
    const isAlphaNumeric = /^[a-zA-Z0-9]*$/.test(char); // 检查字符是否为英文和数字

    if (!isAlphaNumeric) {
        event.preventDefault(); // 阻止输入非英文和数字字符
    }
}

const focusInput = () => {
    input.value.focus();
}

watch(() => props.value, (value) => {
    password.value = value.split('').slice(0, props.length);
    inputValue.value = value.slice(0, props.length);
})

</script>

<style scoped>
.password-input {
    min-height: 4rem;
}
</style>