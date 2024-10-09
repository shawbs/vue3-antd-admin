<template>
    <div>
        <!-- {{ searchDataArr }} -->
        <a-form
            ref="formRef"
            :model="getFormData()"
            :label-col="{span: 5}"
            layout="horizontal"
            @finish="onFinish"
            
        >
            <a-form-item 
            v-for="item in searchDataArr" 
            :key="item.dataIndex" 
            :name="item.dataIndex" 
            :label="item.title" 
            :extra="item.extra"
            :rules="item.rules"
            :required="item.required"
            >
                <template v-if="$slots[`search-${item.dataIndex}`]">
                    <slot :name="`${item.dataIndex}`" :search-data="item"></slot>
                </template>
                <template v-else>
                    <a-input-number 
                        v-if="item.formType=='inputNumber'" 
                        v-model:value="item.value" 
                        :placeholder="item.placeholder" 
                        style="width: 100%;"
                        v-bind="item.bind">
                        </a-input-number>
                    <a-select 
                        v-else-if="item.formType=='select'" 
                        v-model:value="item.value" 
                        :placeholder="item.placeholder" 
                        style="width: 100%;"
                        v-bind="item.bind">
                        <option v-for="(ik,idx) in item.dict || []" :key="item.dataIndex + idx" :value="ik.value">{{ik.label}}</option>
                        </a-select>

                    <a-checkbox-group 
                        v-else-if="item.formType=='checkbox'"  
                        v-model:value="item.value" 
                        :options="item.dict || []" />

                    <a-radio-group 
                        v-else-if="item.formType=='radio'"  
                        v-model:value="item.value" 
                        :options="item.dict || []" />

                    <a-date-picker 
                        v-else-if="item.formType=='datePicker'" 
                        v-model:value="item.value" 
                        :placeholder="item.placeholder" 
                        style="width: 100%;"
                        :value-format="`YYYY-MM-DD${item.bind.showTime ? ' HH:mm:ss' : ''}`"
                        v-bind="item.bind">
                        </a-date-picker>

                    <a-switch v-else-if="item.formType=='switch'"  v-model:checked="item.value" />

                    <a-range-picker 
                        v-else-if="item.formType=='rangePicker'" 
                        v-model:value="item.value" 
                        :placeholder="item.placeholder"
                        :value-format="`YYYY-MM-DD${item.bind.showTime ? ' HH:mm:ss' : ''}`"
                        style="width: 100%;"
                        v-bind="item.bind">
                        </a-range-picker>

                    <a-input 
                        v-else 
                        v-model:value="item.value" 
                        :placeholder="item.placeholder" 
                        v-bind="item.bind">
                        </a-input>
                </template>
            </a-form-item>
            
            <a-form-item v-if="searchDataArr.length>0" :wrapper-col="{offset: 5}">
                <a-space>
                    <a-button
                        type="primary"
                        html-type="submit"
                    >
                        {{ options.submitText }}
                    </a-button>
                    <a-button
                        type="default"
                        @click="reset"
                    >
                        {{ options.resetText }}
                    </a-button>
                </a-space>
            </a-form-item>
        </a-form>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { inputFormType } from './state';
interface optionsType {
    id?: string,
    submitText?: string,
    resetText?: string,
    labelWidth?: string,
}
interface columnsType {
    dataIndex: string,
    title: string,
    formType: inputFormType,
    extra?: string,
    align?: 'left' | 'center' | 'right',
    width?: number | string,
    rules?: any[],
    bind?: any,
    dict?: {label: string, value: string}[],
    required?: boolean,

}
interface propsType {
    columns: columnsType[],
    options?: optionsType,
}

const props = withDefaults(defineProps<propsType>(), {
    columns: () => []
});
const emits = defineEmits(['finish','reset']);

const defaultOptions = {
    submitText:'确定',
    resetText: '重置',
    labelWidth: '120px',
};

const options = computed(():optionsType => {
    return <optionsType>{
        ...defaultOptions,
        ...props.options
    };
});

const formRef = ref();

// 把columns转成searchData
const columnToSearchData = (columns:columnsType[]):(columnsType & {placeholder: string, value: string})[] => {
    return columns.map(item => {
        const isInput = ['text','inputNumber','textarea','password'].includes(item.formType);
        return {
            ...item,
            placeholder: (isInput ? '请输入' : '请选择') + item.title,
            value: ''
        };
    });
};

const searchDataArr = ref(columnToSearchData(props.columns));

// 把column转成参数
const getFormData = () => {
    const params:Record<string,any> = {};
    searchDataArr.value.forEach(item => {
        params[item.dataIndex] = item.value;
    });
    return params;
};

// const reset = () => {
//     searchDataArr.value.forEach(item => {
//         item.value = '';
//     });
// };

const reset = () => {
    searchDataArr.value.forEach(item => {
        item.value = '';
    });
    formRef.value.resetFields();
    emits('reset');
};

const onFinish = () => {
    const prams = getFormData();
    console.log('submit', prams);
    emits('finish', prams);
};

defineExpose({
    formRef,
    getFormData
});

</script>

<style scoped>

</style>