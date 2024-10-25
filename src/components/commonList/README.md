### 通用列表组件commonList

#### 1. 介绍

通用列表组件，用于展示列表数据，支持分页/排序/增删改查。依赖antdv 4.0+

#### 2. 引入

```javascript
import commonList from '@/components/commonList';
```

#### 3. 属性

| 属性名 | 类型   | 默认值 | 说明             |
| -------- | ------- | ------ | ---------------- |
| options | Object | ------ | 列表配置项 |
| columns | Object[] | ------ | 表格栏配置项数组，同antd table组件的 |


#### options配置项

```ts
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
    searchLabelWidth?: string,
    labelWidth?: string,
    editText?: string,
    addText?: string,
    deleteText?: string,
    deleteTip?: string,
    exportText?: string,
    submitText?: string,
    cancelText?: string,
    resetText?: string,
    searchText?: string,
    okText?: string,
    placeholderPrefixInput?: string,
    placeholderPrefixSelect?: string,
}
```

#### columns配置项

```ts
interface columnsType {
    dataIndex: string,
    title: string,
    search?: boolean,
    hide?: boolean, //表格列表是否隐藏
    add?: boolean, //表单新增是否显示
    edit?: boolean, //表单编辑是否显示
    formType?: inputFormType,
    extra?: string,
    align?: 'left' | 'center' | 'right',
    width?: number | string,
    dict?: {label: string, value: string}[],
    required?: boolean,
    bind?: any, //表单控件绑定antd属性
    defaultValue?: any, //新增编辑时的默认值
    searchDefaultValue?: any, //搜索时的默认值
    placeholder?: string,
    allowClear?: boolean,
    value?: any, //不用，内部值
}
```


### 通用表单组件commonForm

#### 1. 介绍

通用表单组件，用于展示表单数据，支持增删改查。依赖antdv 4.0+

#### 2. 引入

```javascript
import commonForm from '@/components/commonForm';
```

#### 3. 属性

| 属性名 | 类型   | 默认值 | 说明             |
| -------- | ------- | ------ | ---------------- |
| options | Object | ------ | 列表配置项 |
| columns | Object[] | ------ | 表格栏配置项数组，同antd table组件的 |
| model | Object | ------ | 表单数据 |

#### 4. 事件
| 事件名 | 参数 | 说明             |
| -------- | ------- | ---------------- |
| submit | e:any | 提交表单时触发 |
| reset | e:any | 重置表单时触发 |

#### options配置项

```ts
interface formOptionsType {
    id?: string,
    submitText?: string,
    resetText?: string,
    labelWidth?: string,
    layout? : 'horizontal' | 'vertical' | 'inline',
    placeholderPrefixInput?: string,
    placeholderPrefixSelect?: string,
}
```

#### columns属性
```ts
interface formColumnsType {
    dataIndex: string,
    title: string,
    formType?: inputFormType, //默认text
    extra?: string,
    align?: 'left' | 'center' | 'right',
    width?: number | string,
    rules?: any[],
    bind?: any, //该值将绑定到组件上，如input,select,datepicker等，值为antd组件的属性
    dict?: { label: string, value: string }[], // 字典数据，用于select checkbox radio
    required?: boolean,
    upload: uploadType, // 上传配置
    defaultValue?: any,  //表单默认值
    placeholder?: string,
    allowClear?: boolean,
    value?: any, //不用，内部值
}
```

### inputFormType
```ts
type inputFormType = 
| 'text' 
| 'textarea' 
| 'inputNumber'
| 'password' 
| 'date' 
| 'select' 
| 'datePicker' 
| 'rangePicker' 
| 'upload'
| 'switch'
| 'checkbox'
| 'radio';
```

### uploadType
```ts
interface uploadType {
    action: (e:any) => Promise<any>, 
    name?: string,
    multiple?: boolean, // 仅用于选择上传文件时
    accept?: string,
    maxCount?: number, //限制上传数量
    maxSize?: number, // 单位为M
    uploadBtnText?: string,
    modeValue?: string | string[], // string 单文件上传，新的图片会覆盖旧的图片，string[]多文件上传，会显示列表，显示方式同type控制
    type?: 'image' | 'file', // 上传文件类型
}
```