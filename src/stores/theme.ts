import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const isDark = ref(true);
  let callback = (_isLight: boolean) => {};
  // Initialize theme from localStorage or system preference
  const initTheme = (setCallback: any) => {
    const stored = localStorage.getItem("theme");
    if (stored) {
      isDark.value = stored === "dark";
    } else {
      isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    updateTheme();
    if (setCallback) {
      callback = setCallback;
    }
  };

  const updateTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
    callback(!isDark.value);
  };

  const toggleTheme = () => {
    isDark.value = !isDark.value;
    localStorage.setItem("theme", isDark.value ? "dark" : "light");
    updateTheme();
  };

  // Watch for changes and update DOM
  watch(isDark, updateTheme);

  return {
    isDark,
    toggleTheme,
    initTheme,
  };
});
