import useRequest from "@/hooks/useRequest";

export const login = (data = {}) => {
  return useRequest<LoginVo>({
    url: "/auth/login",
    method: "post",
    data,
  });
};

export const logout = (data = {}) => {
  return useRequest<any>({
    url: "/auth/logout",
    method: "delete",
    data,
  });
};

export const getUserInfo = (params = {}) => {
  return useRequest<UserInfo>({
    url: "/users/me",
    method: "get",
    params,
  });
};

export const userPage = (params = {}) => {
  return useRequest<UserInfo[]>({
    url: "/users/page",
    method: "get",
    params,
  });
};

export const userAdd = (data = {}) => {
  return useRequest<UserInfo[]>({
    url: "/users",
    method: "post",
    data,
  });
};

export const userUpdate = (id: string, data = {}) => {
  return useRequest<UserInfo[]>({
    url: `/users/${id}`,
    method: "put",
    data,
  });
};

export const userDeletes = (ids: string[]) => {
  return useRequest<UserInfo[]>({
    url: `/users/${ids.join(",")}`,
    method: "delete",
  });
};

export const userExport = (params = {}) => {
  return useRequest<any>({
    url: "users/_export",
    method: "get",
    params,
    config: {
      responseType: "blob",
    },
  });
};
