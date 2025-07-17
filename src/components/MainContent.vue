<template>
  <div class="main-content-wrapper">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'MainContent'
};
</script>

<style scoped>
.main-content-wrapper {
  min-height: 100vh;
  width: 100%;
  background-color: white;
}
</style>