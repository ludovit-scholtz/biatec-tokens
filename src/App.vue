<template>
  <AlgorandAuthentication @notification="onNotification" arc14Realm="BiatecTokens#ARC14">
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <MeshBackground />
      <Navbar />

      <div class="flex">
        <Sidebar />
        <main class="flex-1 lg:pl-64">
          <div class="py-6">
            <router-view />
          </div>
        </main>
      </div>
    </div>
  </AlgorandAuthentication>
</template>

<script setup lang="ts">
import { AlgorandAuthentication, type INotification } from "algorand-authentication-component-vue";
import { onMounted } from "vue";
import { useThemeStore } from "./stores/theme";
import MeshBackground from "./components/MeshBackground.vue";
import Navbar from "./components/layout/Navbar.vue";
import Sidebar from "./components/layout/Sidebar.vue";

const themeStore = useThemeStore();

const onNotification = (notification: INotification) => {
  console.log('Notification received:', notification);
};

onMounted(() => {
  themeStore.initTheme();
});
</script>
