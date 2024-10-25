// src/stores/counter.ts
import { defineStore } from "pinia";

interface ISetting {
  locale: string;
  theme: string;
  colorPrimary: string;
}

export const useAppStore = defineStore("appStore", {
  state: () => ({
    setting: localStorage.getItem("setting")
      ? JSON.parse(localStorage.getItem("setting") as string)
      : <ISetting>{
          locale: "zh", //语言文件名 zh, en
          theme: "light", //light dark
          colorPrimary: "#4e54c8", //UI库的主题色
        },
    locales: [
      {
        label: "中文",
        value: "zh",
      },
      {
        label: "English",
        value: "en",
      },
      {
        label: "한국인",
        value: "korea",
      },
    ],
    themes: [
      {
        label: "亮色",
        value: "light",
        colorPrimary: "4e54c8",
      },
      {
        label: "暗黑",
        value: "dark",
        colorPrimary: "4e54c8",
      },
    ],
  }),
  actions: {
    setSetting(key: keyof ISetting, value: ISetting[keyof ISetting]) {
      this.setting[key] = value;
      localStorage.setItem("setting", JSON.stringify(this.setting));
    },
    setColorPrimary(value: string) {
      this.setSetting("colorPrimary", value);
    },
    setlocale(value: string) {
      this.setSetting("locale", value || "zh");
    },
    setTheme(theme: any) {
      this.setSetting("theme", theme.value);
      this.setColorPrimary(theme.colorPrimary);
      if (typeof window !== "undefined") {
        document.documentElement.setAttribute("data-theme", theme.value);
      }
    },
  },
});
