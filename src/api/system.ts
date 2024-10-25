import { useUploadRequest } from "@/hooks/useRequest";

export const uploadImg = (data: any) => {
  return useUploadRequest({
    url: "/upload/image",
    data,
  });
};
