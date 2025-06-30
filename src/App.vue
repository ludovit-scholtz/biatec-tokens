<template><MeshBackground /><RouterView /></template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useThemeStore } from "./stores/theme";
import MeshBackground from "./components/MeshBackground.vue";

const themeStore = useThemeStore();

onMounted(() => {
  themeStore.initTheme();
});
</script>
