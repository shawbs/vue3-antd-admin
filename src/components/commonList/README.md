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

```
id: string,// 表格唯一标识
pk: string,// 表格主键
pageSize?: number,
operationColumn?: boolean,// 是否显示操作列
operationColumnWidth?: number,
operationColumnText?: string,
operationColumnAlign?: string,
searchColNumber: number,// 搜索栏每行显示列数
api: (e:any) => Promise<any>,// 请求列表数据的接口函数
beforeRequest?:  (e:any) => void,// 请求列表数据前调用
afterRequest?:  (e:any) => any[],// 请求列表数据后调用
add?: { show: boolean, api: (e:any) => Promise<any>, },// 新增按钮配置
edit?: { show: boolean, api: (e:any) => Promise<any>, },// 编辑按钮配置
delete?: { show: boolean, api: (e:any) => Promise<any>, },// 删除按钮配置
export?: { show: boolean, api: (e:any) => Promise<any>, },// 导出按钮配置
searchLabelWidth: string,// 搜索栏label宽度
dict?: {label: string, value: string}[],// 字典数据 select checkbox radio等组件使用
```

#### columns配置项

```
dataIndex: string,// 列标识
title: string,// 列标题
search: boolean,// 是否显示搜索栏
hide: boolean,// 是否隐藏该列
formType: inputFormType, //在表单中显示的组件类型
extra?: string, // 表单组件的额外配置
align?: 'left' | 'center' | 'right', // 列内容对齐方式
width?: number | string, // 列宽度
bind: any,// 表单组件绑定的属性 如input select datepicker等，值为antd组件的属性
dict?: {label: string, value: string}[], //select checkbox radio等组件使用
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

#### 4. 事件
| 事件名 | 参数 | 说明             |
| -------- | ------- | ---------------- |
| submit | e:any | 提交表单时触发 |
| reset | e:any | 重置表单时触发 |

#### options配置项

```
id?: string,
submitText?: string,
resetText?: string,
labelWidth?: string,
```

#### columns属性
```
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