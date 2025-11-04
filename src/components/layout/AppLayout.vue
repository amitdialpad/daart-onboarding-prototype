<template>
  <div class="app-layout">
    <AppSidebar />
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import AppSidebar from './AppSidebar.vue'
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  background: #fff;
  font-family: apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif;
}

.main-content {
  flex: 1;
  overflow: auto;
}
</style>

<style>
/* Global style to hide sidebar when wizard mode is active */
body.wizard-mode-active .sidebar {
  display: none !important;
}

body.wizard-mode-active .app-layout {
  display: block;
}

body.wizard-mode-active .main-content {
  width: 100%;
  max-width: 100%;
}
</style>
