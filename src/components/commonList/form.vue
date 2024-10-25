<template>
  <div>
    -------------- {{ formData }}
    <a-form
      ref="formRef"
      :model="formData"
      :label-col="{ style: { width: options.labelWidth } }"
      :layout="options.layout"
      @finish="onFinish"
      @finish-failed="onFinishFailed"
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
        <template v-if="$slots[`${item.dataIndex}`]">
          <slot
            :name="`${item.dataIndex}`"
            :form-source="formData"
            :data-index="item.dataIndex"
          ></slot>
        </template>
        <template v-else>
          <a-input-number
            v-if="item.formType == 'inputNumber'"
            v-model:value="formData[item.dataIndex]"
            :placeholder="item.placeholder"
            :disabled="item.disabled"
            :readonly="item.readonly"
            style="width: 100%"
            v-bind="item.bind"
            @change="changeHandle(item.dataIndex, formData[item.dataIndex])"
          ></a-input-number>
          <a-select
            v-else-if="item.formType == 'select'"
            v-model:value="formData[item.dataIndex]"
            :placeholder="item.placeholder"
            :disabled="item.disabled"
            :readonly="item.readonly"
            style="width: 100%"
            v-bind="item.bind"
            @change="changeHandle(item.dataIndex, formData[item.dataIndex])"
          >
            <a-select-option
              v-for="(ik, idx) in item.dict?.data || []"
              :key="item.dataIndex + idx"
              :value="ik.value"
            >
              {{ ik.label }}
            </a-select-option>
          </a-select>

          <a-checkbox-group
            v-else-if="item.formType == 'checkbox'"
            v-model:value="formData[item.dataIndex]"
            :disabled="item.disabled"
            :readonly="item.readonly"
            :options="item.dict?.data || []"
            @change="changeHandle(item.dataIndex, formData[item.dataIndex])"
          />

          <a-radio-group
            v-else-if="item.formType == 'radio'"
            v-model:value="formData[item.dataIndex]"
            :disabled="item.disabled"
            :readonly="item.readonly"
            :options="item.dict?.data || []"
            @change="changeHandle(item.dataIndex, formData[item.dataIndex])"
          />

          <a-date-picker
            v-else-if="item.formType == 'datePicker'"
            v-model:value="formData[item.dataIndex]"
            style="width: 100%"
            :value-format="`YYYY-MM-DD${item.bind.showTime ? ' HH:mm:ss' : ''}`"
            :disabled="item.disabled"
            :readonly="item.readonly"
            v-bind="item.bind"
            @change="changeHandle(item.dataIndex, formData[item.dataIndex])"
          ></a-date-picker>

          <a-switch
            v-else-if="item.formType == 'switch'"
            v-model:checked="formData[item.dataIndex]"
            @change="changeHandle(item.dataIndex, formData[item.dataIndex])"
          />

          <a-range-picker
            v-else-if="item.formType == 'rangePicker'"
            v-model:value="formData[item.dataIndex]"
            :value-format="`YYYY-MM-DD${item.bind.showTime ? ' HH:mm:ss' : ''}`"
            :disabled="item.disabled"
            :readonly="item.readonly"
            style="width: 100%"
            v-bind="item.bind"
            @change="changeHandle(item.dataIndex, formData[item.dataIndex])"
          ></a-range-picker>

          <common-upload
            v-else-if="item.formType == 'upload'"
            v-bind="item.upload"
            v-model="formData[item.dataIndex]"
            @change="changeHandle(item.dataIndex, formData[item.dataIndex])"
          ></common-upload>

          <common-editor
            v-else-if="item.formType == 'editor'"
            v-model="formData[item.dataIndex]"
            @change="changeHandle(item.dataIndex, formData[item.dataIndex])"
          />

          <a-input
            v-else
            v-model:value="formData[item.dataIndex]"
            :disabled="item.disabled"
            :readonly="item.readonly"
            :placeholder="item.placeholder"
            v-bind="item.bind"
            @change="changeHandle(item.dataIndex, formData[item.dataIndex])"
          ></a-input>
        </template>
      </a-form-item>

      <a-form-item
        v-if="searchDataArr.length > 0"
        :wrapper-col="{ style: { marginLeft: options.labelWidth } }"
      >
        <a-space>
          <a-button type="primary" html-type="submit" :loading="submitLoading">
            {{ options.submitText }}
          </a-button>
          <a-button type="default" @click="reset">
            {{ options.resetText }}
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import type { formOptionsType, formColumnsType } from "./option";
import CommonUpload from "./upload.vue";
import CommonEditor from "./editor.vue";

interface propsType {
  columns: formColumnsType[];
  options?: formOptionsType;
  model: Record<string, any>; //用于回显
}

const props = withDefaults(defineProps<propsType>(), {
  columns: () => [],
  model: Object.create({}),
  options: () => ({}),
});
const emits = defineEmits(["finish", "reset"]);

const defaultOptions = {
  submitText: "确定",
  resetText: "重置",
  labelWidth: "150px",
  layout: "horizontal",
  placeholderPrefixInput: "请输入",
  placeholderPrefixSelect: "请选择",
};

const options = computed((): formOptionsType => {
  return <formOptionsType>{
    ...defaultOptions,
    ...props.options,
  };
});

// 初始化表单数据
const getDefaultValue = (columns: formColumnsType[]): Record<string, any> => {
  const data: Record<string, any> = {};
  columns.forEach((item) => {
    data[item.dataIndex] =
      props.model[item.dataIndex] || item.defaultValue || undefined;
  });
  return data;
};

const formData = reactive<any>(getDefaultValue(props.columns));

const formRef = ref();

// 把columns转成searchData
const columnToSearchData = (columns: formColumnsType[]): formColumnsType[] => {
  return columns
    .filter((item) => !item.hide)
    .map((item) => {
      const isInput = ["text", "inputNumber", "textarea", "password"].includes(
        item.formType || "text"
      );

      return {
        ...item,
        placeholder:
          (isInput
            ? options.value.placeholderPrefixInput
            : options.value.placeholderPrefixSelect) + item.title,
      };
    });
};

const searchDataArrSource = ref<formColumnsType[]>(
  columnToSearchData(props.columns)
);

const searchDataArr = computed((): formColumnsType[] => {
  return searchDataArrSource.value.filter((item) => !item.hide);
});

// 把column转成参数
const getFormData = () => {
  const params: Record<string, any> = {};
  searchDataArr.value.forEach((item) => {
    params[item.dataIndex] = formData[item.dataIndex];
  });
  return params;
};

const reset = () => {
  formRef.value.resetFields();
  searchDataArr.value.forEach((item) => {
    formData[item.dataIndex] = undefined;
  });
  emits("reset");
};

const submitLoading = ref(false);

const onFinish = () => {
  const params = { ...props.model, ...formData };
  emits("finish", params);
};

const onFinishFailed = (e: any) => {
  // console.log(e);
};

// 修复表单项
const setColumn = (
  dataIndex: string,
  key: "hide" | "disabled" | "readonly",
  value: true
) => {
  searchDataArrSource.value.forEach((item) => {
    if (item.dataIndex === dataIndex) {
      item[key] = value;
    }
  });
};

const changeHandle = (dataIndex: string, newValue: any) => {
  const column = searchDataArr.value.find(
    (item) => item.dataIndex == dataIndex
  );
  column?.onChange && column?.onChange(newValue);
};

defineExpose({
  getFormData,
  submitLoading,
  setColumn,
});
</script>

<style scoped></style>
