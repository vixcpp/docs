<template>
  <article class="post" v-if="post">
    <h1>{{ post.title }}</h1>
    <p class="meta">{{ formattedDate(post.date) }}</p>
    <div class="content">
      <p>{{ post.excerpt }}</p>
      <p>
        — contenu d'exemple. Remplace par ton Markdown ou HTML depuis une API.
      </p>
    </div>
  </article>
  <div v-else class="not-found">Article introuvable.</div>
</template>

<script>
export default {
  data() {
    return { post: null };
  },
  created() {
    const slug = this.$route.params.slug;
    fetch("/posts.json")
      .then((r) => r.json())
      .then((list) => {
        this.post = list.find((p) => p.slug === slug) || null;
      });
  },
  methods: {
    formattedDate(d) {
      return new Date(d).toLocaleDateString();
    },
  },
};
</script>

<style scoped>
.post {
  padding: 8px 0;
}
.meta {
  color: #888;
  margin-bottom: 12px;
}
</style>
