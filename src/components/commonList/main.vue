<template>
  <div>
    <div class="common-list-search">
      <!-- {{ searchDataArr }} -->
      <a-form
        ref="searchRef"
        :model="searchForm"
        :label-col="{ style: { width: options.searchLabelWidth } }"
      >
        <a-row :gutter="24">
          <a-col
            v-for="item in searchDataArr"
            :key="item.dataIndex"
            :span="Math.floor(24 / options.searchColNumber)"
          >
            <a-form-item :name="item.dataIndex" :label="item.title">
              <template v-if="$slots[`search-${item.dataIndex}`]">
                <slot
                  :name="`search-${item.dataIndex}`"
                  :form-source="formData"
                  :data-index="item.dataIndex"
                ></slot>
              </template>
              <template v-else>
                <a-input-number
                  v-if="item.formType == 'inputNumber'"
                  v-model:value="searchForm[item.dataIndex]"
                  :placeholder="item.placeholder"
                  style="width: 100%"
                  v-bind="item.bind"
                ></a-input-number>
                <a-select
                  v-else-if="
                    ['select', 'checkbox', 'radio', 'switch'].includes(
                      item.formType as string
                    )
                  "
                  v-model:value="searchForm[item.dataIndex]"
                  :placeholder="item.placeholder"
                  :allow-clear="item.allowClear"
                  style="width: 100%"
                  v-bind="item.bind"
                >
                  <a-select-option
                    v-for="(ik, idx) in item.dict?.data || []"
                    :key="item.dataIndex + idx"
                    :value="ik.value"
                  >
                    {{ ik.label }}
                  </a-select-option>
                </a-select>

                <a-date-picker
                  v-else-if="item.formType == 'datePicker'"
                  v-model:value="searchForm[item.dataIndex]"
                  style="width: 100%"
                  :value-format="`YYYY-MM-DD${item.bind.showTime ? ' HH:mm:ss' : ''}`"
                  v-bind="item.bind"
                ></a-date-picker>

                <a-range-picker
                  v-else-if="item.formType == 'rangePicker'"
                  v-model:value="searchForm[item.dataIndex]"
                  :value-format="`YYYY-MM-DD${item.bind.showTime ? ' HH:mm:ss' : ''}`"
                  style="width: 100%"
                  v-bind="item.bind"
                ></a-range-picker>

                <a-input
                  v-else
                  v-model:value="searchForm[item.dataIndex]"
                  :placeholder="item.placeholder"
                  v-bind="item.bind"
                ></a-input>
              </template>
            </a-form-item>
          </a-col>
          <a-col
            :span="
              options.btnBoxInline
                ? Math.floor(24 / options.searchColNumber)
                : 24
            "
          >
            <div :class="options.btnBoxInline ? '' : 'text-center'">
              <a-space>
                <a-button type="primary" html-type="submit" @click="init">
                  {{ options.searchText }}
                </a-button>
                <a-button type="default" @click="reset">
                  {{ options.resetText }}
                </a-button>
              </a-space>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="common-list-header">
      <slot name="table-before" />
    </div>
    <div class="common-list-tool">
      <div>
        <a-space>
          <a-button
            v-if="options.add?.show"
            type="primary"
            @click="openHandle(0)"
          >
            <template #icon>
              <PlusOutlined />
            </template>
            {{ options.addText }}
          </a-button>
          <a-popconfirm
            :title="options.deleteSelectTip"
            :ok-text="options.okText"
            :cancel-text="options.cancelText"
            @confirm="deleteHandle()"
          >
            <a-button v-if="options.delete?.show" type="primary" danger>
              <template #icon>
                <DeleteOutlined />
              </template>
              {{ options.deleteText }}
            </a-button>
          </a-popconfirm>

          <a-popconfirm
            :title="options.exportTip"
            :ok-text="options.okText"
            :cancel-text="options.cancelText"
            @confirm="exportHandle()"
          >
            <a-button v-if="options.export?.show">
              <template #icon>
                <ExportOutlined />
              </template>
              {{ options.exportText }}
            </a-button>
          </a-popconfirm>

          <slot name="table-tool-left" />
        </a-space>
      </div>
      <div>
        <a-space>
          <slot name="table-tool-right" />
          <a-button @click="init">
            <template #icon>
              <ReloadOutlined />
            </template>
          </a-button>
        </a-space>
      </div>
    </div>
    <!-- {{ headerColumns.map(item=>item.width) }} -->
    <!-- {{ options.scroll }} -->
    <a-table
      ref="tableRef"
      :columns="headerColumns"
      :row-key="options.pk"
      :data-source="dataSource"
      :pagination="options.needPagination ? pagination : false"
      :loading="loading"
      bordered
      :row-selection="rowSelection"
      :scroll="options.scroll"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <slot
          v-if="$slots[column.dataIndex]"
          :name="column.dataIndex"
          :column="column"
          :record="record"
        />
        <div v-else>
          <template v-if="column.formType === 'upload'">
            <a-button @click="openLink(record[column.dataIndex])">
              <template #icon>
                <SearchOutlined />
              </template>
            </a-button>
          </template>
          <template v-else-if="column.dict?.data && column.dict?.transition">
            <a-tag
              v-for="item in column.dict?.data.filter(
                (item: any) => item.value === record[column.dataIndex]
              ) || []"
              :key="item.value"
              :color="
                column.dict?.tagColors ? column.dict?.tagColors[item.value] : ''
              "
              :bordered="false"
            >
              {{ item.label }}
            </a-tag>
          </template>
          <template v-else>
            {{ record[column.dataIndex] }}
          </template>
        </div>

        <template v-if="column.dataIndex === 'operation'">
          <a-space class="operation" align="center">
            <a-button
              v-if="options.edit?.show"
              type="primary"
              @click="openHandle(1, record)"
            >
              {{ options.editText }}
            </a-button>
            <a-popconfirm
              :title="options.deleteTip"
              :ok-text="options.okText"
              :cancel-text="options.cancelText"
              @confirm="deleteHandle(record)"
            >
              <a-button v-if="options.delete?.show" type="primary" danger>
                {{ options.deleteText }}
              </a-button>
            </a-popconfirm>
            <slot
              v-if="$slots['operationAfterExtend']"
              name="operationAfterExtend"
              :column="column"
              :record="record"
            />
          </a-space>
        </template>
      </template>
    </a-table>
    <div>
      <slot name="table-after" />
    </div>

    <a-drawer
      v-model:open="open"
      :title="openType === 1 ? options.editText : options.addText"
      width="520"
      :footer-style="{ textAlign: 'center' }"
      @close="onClose"
    >
      <CommonForm
        v-if="open"
        ref="formRef"
        :columns="formColumns"
        :options="formOptions"
        :model="formData"
        @finish="submitHandle"
      />
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import {
  ReloadOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExportOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
import CommonForm from "./form.vue";
import type { columnsType, optionsType, pageResponseType } from "./option";
import { message } from "ant-design-vue";

interface propsType {
  columns: columnsType[];
  options: optionsType;
}

const props = withDefaults(defineProps<propsType>(), {
  columns: () => [],
});

const defaultOptions = {
  pk: "id",
  pageSize: 10,
  operationColumn: false,
  operationColumnWidth: 300,
  operationColumnText: "操作",
  operationColumnAlign: "center",
  operationColumnFixed: "right",
  labelWidth: "120px",
  api: (e: any): Promise<pageResponseType | undefined> =>
    Promise.resolve(undefined),
  editText: "编辑",
  addText: "新增",
  deleteText: "删除",
  deleteTip: "确定要删除此条记录吗？",
  deleteSelectTip: "确定要删除选中记录吗？",
  exportText: "导出",
  exportTip: "确定要导出查询到的记录吗？",
  submitText: "提交",
  cancelText: "取消",
  resetText: "重置",
  searchText: "搜索",
  okText: "确定",
  placeholderPrefixInput: "请输入",
  placeholderPrefixSelect: "请选择",
  height: "500px",
  searchLabelWidth: "100px", //搜索表单label宽度
  searchLabelAlign: "right", //搜索表单label对齐方式
  searchColNumber: 4, //搜索表单每行显示的列数
  btnBoxInline: false,
  needPagination: true,
  pageListKey: "list",
  pageTotalKey: "total",
  dict: {
    translation: true,
    data: [],
  },
};

const options = computed((): any => {
  return <optionsType>{
    ...defaultOptions,
    ...props.options,
  };
});

const page = ref(1);
const pageSize = ref(options.value.pageSize || 10);
const total = ref(0);
const sorter = ref({});
const dataSource = ref<any[]>([]);
const loading = ref(true);

const pagination = computed(() => ({
  total: total.value,
  current: page.value,
  pageSize: pageSize.value,
}));

const formRef = ref();

const open = ref(false);
const openType = ref(1);
const formData = reactive<any>({});
const formColumns = ref<any[]>([]);

const searchForm = reactive<any>({});

// 把columns转成searchData
const columnToSearchData = (columns: columnsType[]): columnsType[] => {
  return columns
    .filter((item) => item.search)
    .map((item) => {
      const isInput = [
        "text",
        "inputNumber",
        "textarea",
        "password",
        "email",
      ].includes(item.formType || "text");
      searchForm[item.dataIndex] = item.searchDefaultValue || undefined;
      return {
        ...item,
        placeholder:
          (isInput
            ? options.value.placeholderPrefixInput
            : options.value.placeholderPrefixSelect) + item.title,
      };
    });
};

const headerColumns = computed(() => {
  const arr = props.columns.filter((item) => !item.hide);
  if (options.value.operationColumn) {
    arr.push({
      title: options.value.operationColumnText,
      dataIndex: "operation",
      width: options.value.operationColumnWidth,
      align: options.value.operationColumnAlign,
      fixed: options.value.operationColumnFixed,
    } as columnsType);
  }
  return arr;
});

const searchDataArr = ref(columnToSearchData(props.columns));

const init = async () => {
  if (!options.value.api) return;

  const params = {
    ...searchForm,
    page: page.value,
    pageSize: pageSize.value,
    ...sorter.value,
  };
  if (!options.value.needPagination) {
    delete params.page;
    delete params.pageSize;
  }

  options.value?.beforeRequest && (await options.value.beforeRequest(params));
  const res = await options.value
    .api(params)
    .then((res: pageResponseType | any) => {
      if (!res) return;
      dataSource.value = options.value.needPagination
        ? res[options.value.pageListKey] || []
        : res;
      if (options.value.needPagination) {
        total.value = res[options.value.pageTotalKey] || 0;
      }
    })
    .finally(() => {
      loading.value = false;
    });
  if (options.value.afterRequest) {
    dataSource.value = await options.value.afterRequest(res);
  }
};
const handleTableChange = (
  pag: { pageSize: number; current: number; total: number },
  filters: any,
  sorter: any
) => {
  page.value = Number(pag.current);
  pageSize.value = Number(pag.pageSize);
  sorter.value = sorter;
  init();
};

const dictToText = (arr: any[], value: any) => {
  const item = arr.find((item) => item.value === value);
  return item?.label || value;
};

const openLink = (url: string, target: string = "_blank") => {
  window.open(url, target);
};

const reset = () => {
  page.value = 1;
  pageSize.value = 10;
  total.value = 0;
  searchDataArr.value.forEach((item) => {
    searchForm[item.dataIndex] = undefined;
  });
  init();
};

onMounted(() => {
  init();
});
const ids = ref([]);
const deleteHandle = (record?: any) => {
  let _ids = record ? [record.id] : ids.value;
  if (!_ids.length) {
    message.error("请选择要删除的数据");
    return;
  }
  options.value.delete?.api(_ids).then(() => {
    init();
  });
};

const rowSelection = {
  onChange: (selectedRowKeys: any, selectedRows: any) => {
    ids.value = selectedRowKeys;
    options.value.selectChange &&
      options.value.selectChange(selectedRowKeys, selectedRows);
  },
  ...options.value.rowSelection,
};

const exportHandle = () => {
  const params = {
    ...searchForm,
  };
  options.value.export?.api(params);
};

const formOptions = computed(() => {
  return {
    submitText: options.value.submitText,
    resetText: options.value.resetText,
    labelWidth: options.value.labelWidth,
  };
});

const getAddColumns = () => {
  return props.columns.map((item) => ({
    ...item,
    hide: !item.addDisplay,
    disabled: item.addDisabled,
    readonly: item.addReadonly,
  }));
};

const getEditColumns = () => {
  return props.columns.map((item) => ({
    ...item,
    hide: !item.editDisplay,
    disabled: item.editDisabled,
    readonly: item.editReadonly,
  }));
};

/**
 *
 * @param type 0:新增 1:编辑
 * @param record
 */
const openHandle = (type: number, record?: any) => {
  // debugger;
  const columns = (formColumns.value = [getAddColumns, getEditColumns][type]());
  if (type === 1) {
    Object.assign(formData, record);
  } else {
    columns.forEach((item) => {
      formData[item.dataIndex] = undefined;
    });
  }
  openType.value = type;
  open.value = true;
};

const submitHandle = (formData: any) => {
  if (!formRef.value) return;
  if (openType.value === 0) {
    formRef.value.submitLoading = true;
    options.value.add
      ?.api(formData)
      .then(() => {
        message.success("新增成功");
        setTimeout(onClose, 500);
        init();
      })
      .finally(() => {
        formRef.value.submitLoading = false;
      });
  }
  if (openType.value === 1) {
    formRef.value.submitLoading = true;
    options.value.edit
      ?.api(formData.id, formData)
      .then(() => {
        message.success("编辑成功");
        setTimeout(onClose, 500);
        init();
      })
      .finally(() => {
        formRef.value.submitLoading = false;
      });
  }
};
const onClose = () => {
  open.value = false;
};

const searchRef = ref(null);
const tableRef = ref(null);

defineExpose({
  searchRef,
  tableRef,
  searchForm,
});
</script>

<style scoped>
.common-list-header {
  margin-bottom: 10px;
}
.common-list-tool {
  margin-bottom: 10px;
}
.common-list-tool {
  display: flex;
  justify-content: space-between;
}
</style>
