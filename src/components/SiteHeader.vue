<template>
  <header class="site-header">
    <div class="brand">
      <a href="/" class="logo">SoftAdAstra</a>
    </div>
    <nav class="nav">
      <router-link to="/">Accueil</router-link>
      <router-link to="/about">À propos</router-link>
      <a href="/contact">Contact</a>
    </nav>
  </header>
</template>

<script>
export default {};
</script>

<style scoped>
.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.brand .logo {
  font-weight: 700;
  font-size: 1.1rem;
  color: #07aa7c;
  text-decoration: none;
}
.nav a,
.nav a.router-link-active {
  margin-left: 16px;
  text-decoration: none;
  color: #333;
}
</style>
