<template>
    <div>
        <div class="common-list-search">
            <!-- {{ searchDataArr }} -->
            <a-form
                ref="searchRef"
                layout="inline"
            >
                <a-form-item v-for="item in searchDataArr" :key="item.dataIndex" :name="item.dataIndex" :label="item.title">
                    
                    <template v-if="$slots[`search-${item.dataIndex}`]">
                        <slot :name="`search-${item.dataIndex}`" :search-data="item"></slot>
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
                        <a-date-picker 
                            v-else-if="item.formType=='datePicker'" 
                            v-model:value="item.value" 
                            :placeholder="item.placeholder" 
                            style="width: 100%;"
                            :value-format="`YYYY-MM-DD${item.bind.showTime ? ' HH:mm:ss' : ''}`"
                            v-bind="item.bind">
                            </a-date-picker>

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
                
                <a-form-item v-if="searchDataArr.length>0">
                    <a-space>
                        <a-button
                            type="primary"
                            html-type="submit"
                            @click="init"
                        >
                            搜索
                        </a-button>
                        <a-button
                            type="default"
                            @click="reset"
                        >
                            重置
                        </a-button>
                    </a-space>
                </a-form-item>
            </a-form>
        </div>
        <div class="common-list-header">
            <slot name="table-before"/>
        </div>
        <div class="common-list-tool">
            <div>
                <!-- {{ options }} -->
                <a-space>
                    <a-button v-if="options.add?.show" type="primary" @click="openHandle(0)">
                        <template #icon>
                            <PlusOutlined />
                        </template>
                        新增</a-button>
                    <a-button v-if="options.delete?.show" type="primary" danger>
                        <template #icon>
                        <DeleteOutlined />
                        </template>
                        删除</a-button>
                    <a-button v-if="options.export?.show">
                        <template #icon>
                        <ExportOutlined />
                        </template>
                        导出</a-button>
                </a-space>
            </div>
            <div>
                <a-space>
                    <a-button>
                        <template #icon>
                            <ReloadOutlined />
                        </template>
                    </a-button>
                </a-space>
            </div>
        </div>
        <a-table
            ref="tableRef"
            :columns="headerColumns"
            :row-key="options.pk"
            :data-source="dataSource"
            :pagination="pagination"
            :loading="loading"
            bordered
            @change="handleTableChange"
            >
            <template #headerCell="{  }">
                <template v-if="options.operationColumn" >
                    {{options.operationColumnText}}
                </template>
            </template>
            <template #bodyCell="{ column, record }">
                <template v-if="!column.hide">
                    <slot v-if="$slots[column.dataIndex]"  :name="column.dataIndex" :column="column" :record="record" />
                    <span v-else>{{record[column.dataIndex]}}</span>
                </template>
                <template v-if="options.operationColumn" >
                    <a-button v-if="options.edit?.show" type="text" @click="openHandle(1)" >编辑</a-button>
                    
                    <a-popconfirm
                        title="Are you sure delete this task?"
                        ok-text="确定"
                        cancel-text="取消"
                        @confirm="deleteHandle(record)"
                    >
                        <a-button v-if="options.delete?.show" type="text" danger >删除</a-button>
                    </a-popconfirm>
                    <slot name="operationColumn" :column="column" :record="record" />
                </template>
            </template>
        </a-table>
        <div>
            <slot name="table-after"/>
        </div>


        <a-drawer
            v-model:open="open"
            :title="openType === 1 ? '编辑' : '新增'"
            width="520"
            :closable="false"
            :footer-style="{ textAlign: 'center' }"
            @close="onClose"
        >
            <CommonForm :columns="formColumns" @finish="submitHandle" />
        </a-drawer>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { ReloadOutlined,DeleteOutlined,PlusOutlined,ExportOutlined } from '@ant-design/icons-vue';
import CommonForm from './form.vue';
import type { inputFormType } from './state';

interface optionsType {
    id: string,
    pk: string,
    pageSize?: number,
    operationColumn?: boolean,
    operationColumnWidth?: number,
    operationColumnText?: string,
    operationColumnAlign?: string,
    api: (e:any) => Promise<any>,
    beforeRequest?:  (e:any) => void,
    afterRequest?:  (e:any) => any[],
    add?: { show: boolean, api: (e:any) => Promise<any>,  },
    edit?: { show: boolean, api: (e:any) => Promise<any>,  },
    delete?: { show: boolean, api: (e:any) => Promise<any>,  },
    export?: { show: boolean, api: (e:any) => Promise<any>,  },
    searchLabelWidth: string,
}
interface columnsType {
    dataIndex: string,
    title: string,
    search: boolean,
    hide: boolean, //表格列表是否隐藏
    add?: boolean, //表单新增是否显示
    edit?: boolean, //表单编辑是否显示
    formType: inputFormType,
    extra?: string,
    align?: 'left' | 'center' | 'right',
    width?: number | string,
    dict?: {label: string, value: string}[],
    required?: boolean,
    bind?: any, //表单控件绑定antd属性

}
interface propsType {
    columns: columnsType[],
    options: optionsType,
}

const props = withDefaults(defineProps<propsType>(), {
    columns: () => []
});

const defaultOptions = {
    pk: 'id',
    pageSize: 10,
    operationColumn: true,
    operationColumnWidth: 120,
    operationColumnText: '操作',
    operationColumnAlign: 'center',
    searchLabelWidth: '120px',
    api: (e:any) => Promise.resolve({data: [], total: 0}),
};

const options = computed(():optionsType => {
    return <optionsType>{
        ...defaultOptions,
        ...props.options
    };
});

const page = ref(1);
const pageSize = ref(options.value.pageSize || 10);
const total = ref(0);
const dataSource = ref<any[]>([]);
const loading = ref(true);

const pagination = computed(() => ({
  total: total.value,
  current: page.value,
  pageSize: pageSize.value,
}));

// 把columns转成searchData
const columnToSearchData = (columns:columnsType[]):(columnsType & {placeholder: string, value: string})[] => {
    return columns.filter(item => item.search).map(item => {
        const isInput = ['text','inputNumber','textarea','password'].includes(item.formType);
        return {
            ...item,
            placeholder: (isInput ? '请输入' : '请选择') + item.title,
            value: ''
        };
    });
};

const headerColumns = computed(() => {
    return props.columns.filter(item => !item.hide);
});

const searchDataArr = ref(columnToSearchData(props.columns));

// 把column转成参数
const getParams = () => {
    const params:Record<string,any> = {};
    searchDataArr.value.forEach(item => {
        params[item.dataIndex] = item.value;
    });
    return params;
};

const init = async () => {
    console.log(getParams());
    if(!props.options.api) return;
    const params = getParams();
    props.options?.beforeRequest && await props.options.beforeRequest(params);
    const res = await props.options.api(params).then(res => {
        dataSource.value = res.data;
        total.value = res.total;
    }).finally(() =>{
        loading.value = false;
    });
    if(props.options.afterRequest) {
        dataSource.value = await props.options.afterRequest(res);
    }
};
const handleTableChange = (e:any) => {
    console.log(e);
    page.value = Number(e.current);
    pageSize.value = Number(e.pageSize);
    total.value = Number(e.total);
    init();
};


const reset = () => {
    page.value = 1;
    total.value = 0;
    searchDataArr.value.forEach(item => {
        item.value = '';
    });
    init();
};

onMounted(() => {
    init();
});

const deleteHandle = (record:any) => {
    options.value.delete?.api(record).then(res => {
        init();
    });
};

const open = ref(false);
const formColumns = ref<any[]>([]);
const openType = ref(0);

const getAddColumns = () => {
    return props.columns.filter(item => item.add);
};

const getEditColumns = () => {
    return props.columns.filter(item => item.edit);
};

const openHandle = (type:number) => {
    open.value = true;
    openType.value = type;
    formColumns.value = [getAddColumns,getEditColumns][type]();
};

const submitHandle = (formData:any) => {
    if(openType.value === 0) {
        options.value.add?.api(formData).then(res => {
            onClose();
            init();
        });
    } 
    if(openType.value === 1) {
        options.value.edit?.api(formData).then(res => {
            onClose();
            init();
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
    getParams
});

</script>

<style scoped>
.common-list-header{
    margin-bottom: 10px;
}
.common-list-tool{
    margin-bottom: 10px;
}
.common-list-tool{
    display: flex;
    justify-content: space-between;
}
</style>