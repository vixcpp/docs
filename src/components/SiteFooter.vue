<template>
  <footer class="site-footer">
    <div class="container-sm">
      <small
        >© SoftAdAstra — <span>{{ year }}</span></small
      >
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return { year: new Date().getFullYear() };
  },
};
</script>

<style scoped>
.site-footer {
  margin-top: 48px;
  padding: 16px 0;
  text-align: center;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}
</style>
