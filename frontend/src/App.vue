<template>
  <div id="app" class="container-fluid">
    <Header />
      <router-view />
  </div>
</template>

<script>
import Header from "./components/Header";

export default {
  components: {
    Header
  }
};
</script>

<style lang="scss">

</style>
