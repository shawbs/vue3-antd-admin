<template>
  <div>
    <!-- {{ fileList }} -->
    <a-upload
      v-bind="props"
      v-model:file-list="fileList"
      :before-upload="beforeUpload"
      :list-type="listType"
      :show-upload-list="showUploadList"
      @preview="handlePreview"
      @remove="handleRemove"
    >
      <div v-if="props.type == 'image'" class="upload-img-btn">
        <div v-if="fileList[0] && props.isSigle">
          <loading-outlined
            v-if="uploadLoading"
            class="img-loading"
          ></loading-outlined>
          <img :src="fileList[0].url" alt="avatar" />
        </div>
        <div v-else>
          <loading-outlined v-if="uploadLoading"></loading-outlined>
          <plus-outlined v-else />
        </div>
      </div>
      <a-button v-else>
        <loading-outlined v-if="uploadLoading"></loading-outlined>
        <upload-outlined v-else></upload-outlined>
        {{ props.uploadBtnText }}
      </a-button>
    </a-upload>
    <a-modal
      :open="previewVisible"
      :title="previewTitle"
      :footer="null"
      @cancel="handleCancel"
    >
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import type { uploadType } from "./option";
import { message, UploadChangeParam, UploadProps } from "ant-design-vue";
import {
  UploadOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons-vue";

const props = withDefaults(defineProps<uploadType>(), {
  name: "file",
  multiple: false,
  type: "image",
  maxCount: 1,
  maxSize: 100,
  uploadBtnText: "上传文件",
  accept: ".png,.jpg,.jpeg",
  isSigle: true,
});

const modeValue = defineModel<string[] | string>({ default: "" });

const emit = defineEmits(["change"]);

const showUploadList = computed(() => {
  return props.isSigle && props.type === "image" ? false : true;
});

const listType = computed(() => {
  return props.type === "image" ? "picture-card" : "text";
});

type fileType = {
  uid: string;
  name: string;
  status: string;
  url: string;
};
const fileList = ref<fileType[]>([]);

const initValue = () => {
  console.log("initValue", props.isSigle, modeValue.value);
  if (props.isSigle) {
    if (modeValue.value && typeof modeValue.value === "string") {
      fileList.value = [
        {
          uid: modeValue.value,
          name: modeValue.value,
          status: "done",
          url: modeValue.value,
        },
      ];
    } else {
      fileList.value = [];
    }
  } else {
    if (Array.isArray(modeValue.value)) {
      fileList.value = modeValue.value.map((item, index) => {
        return {
          uid: index + item,
          name: item,
          status: "done",
          url: item,
        };
      });
    } else {
      fileList.value = [];
    }
  }
};

initValue();

const previewVisible = ref(false);
const previewImage = ref("");
const previewTitle = ref("");
const uploadLoading = ref(false);

const beforeUpload = async (file: any) => {
  // debugger;
  const isLtSize = file.size / 1024 / 1024 < props.maxSize;
  const type = file.name.split(".").pop();
  if (!isLtSize) {
    message.error(`File size exceeds ${props.maxSize}MB!`);
    setTimeout(() => {
      fileList.value.splice(fileList.value.length - 1, 1);
    }, 0);
    return false;
  }
  if (props.accept && !props.accept.includes(type)) {
    message.error(`File type must be ${props.accept}!`);
    setTimeout(() => {
      fileList.value.splice(fileList.value.length - 1, 1);
    }, 0);
    return false;
  }
  if (
    !props.isSigle &&
    props.maxCount &&
    fileList.value.length >= props.maxCount
  ) {
    message.error(`File count exceeds ${props.maxCount}!`);
    setTimeout(() => {
      fileList.value.splice(fileList.value.length - 1, 1);
    }, 0);
    return false;
  }

  await handleUpload(file);

  return false;
};

const handleRemove = (file: any) => {
  console.log("remove", file);
  setTimeout(() => {
    modeValue.value = props.isSigle
      ? ""
      : fileList.value
          .filter((item) => item.url != file.url)
          .map((item) => item.url);

    emit("change", modeValue.value);
  }, 0);
};

const handleUpload = async (file: any) => {
  uploadLoading.value = true;
  const params = Object.create({});
  params[props.name] = file;
  params.type = file.type;
  await props
    .action(params)
    .then((data) => {
      if (props.isSigle) {
        fileList.value = [
          {
            uid: file.uid,
            name: file.name,
            status: "done",
            url: data.url,
          },
        ];
        modeValue.value = fileList.value[0].url;
      } else {
        const item = {
          uid: file.uid,
          name: file.name,
          status: "done",
          url: data.url,
        };
        fileList.value.push(item);
        modeValue.value = fileList.value.map((item) => item.url);
      }
      emit("change", modeValue.value);
    })
    .finally(() => {
      uploadLoading.value = false;
    });
};

function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const handlePreview = async (file: any) => {
  // console.log('preview',file);
  if (props.type !== "image") return;
  if (!file.url && !file.preview) {
    file.preview = (await getBase64(file.originFileObj)) as string;
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value =
    file.name || file.url.substring(file.url.lastIndexOf("/") + 1);
};

const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = "";
};
</script>

<style lang="less">
.ant-upload {
  .upload-select {
    width: 102px;
    height: 102px;
    margin-inline-end: 8px;
    margin-bottom: 8px;
    // text-align: center;
    // vertical-align: top;
    background-color: rgba(0, 0, 0, 0.02);
    border: 1px dashed #d9d9d9;
    border-radius: 8px;
    cursor: pointer;
    transition: border-color 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .upload-img-btn {
    position: relative;
    .img-loading {
      position: absolute;
      top: 45%;
      left: 45%;
      z-index: 1;
    }
    img {
      width: 100px;
      height: 100px;
      border-radius: 8px;
      vertical-align: bottom;
    }
  }
}
</style>
