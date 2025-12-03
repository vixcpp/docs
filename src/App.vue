<template>
  <div id="app">
    <SiteHeader />
    <main class="container">
      <router-view />
    </main>
    <SiteFooter />
  </div>
</template>

<script>
import SiteHeader from "@/components/SiteHeader.vue";
import SiteFooter from "@/components/SiteFooter.vue";

export default {
  components: { SiteHeader, SiteFooter },
};
</script>

<style>
/* styles rapides pour container */
.container {
  max-width: 1024px;
  margin: 24px auto;
  padding: 0 16px;
}
</style>
