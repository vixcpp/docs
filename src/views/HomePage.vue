<template>
  <section class="home">
    <h1 class="title">Le blog SoftAdAstra</h1>
    <p class="lead">
      Actualités, tutos et retours d'expérience sur la tech en Afrique.
    </p>

    <div v-if="loading" class="loading">Chargement…</div>
    <div v-else class="posts">
      <article v-for="post in posts" :key="post.id" class="post-card">
        <h2>
          <router-link :to="`/post/${post.slug}`">{{ post.title }}</router-link>
        </h2>
        <p class="meta">{{ formattedDate(post.date) }}</p>
        <p class="excerpt">{{ post.excerpt }}</p>
        <router-link :to="`/post/${post.slug}`" class="read-more"
          >Lire</router-link
        >
      </article>

      <div v-if="posts.length === 0" class="empty">
        Aucun article pour l'instant.
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      posts: [],
      loading: true,
      error: null,
    };
  },
  created() {
    // fetch depuis public/posts.json
    fetch("/posts.json")
      .then((res) => {
        if (!res.ok) throw new Error("Impossible de charger les articles");
        return res.json();
      })
      .then((json) => {
        this.posts = json;
        this.loading = false;
      })
      .catch((err) => {
        this.error = err.message;
        this.loading = false;
      });
  },
  methods: {
    formattedDate(d) {
      try {
        return new Date(d).toLocaleDateString();
      } catch {
        return d;
      }
    },
  },
};
</script>

<style scoped>
.title {
  margin: 8px 0 0;
  font-size: 2rem;
}
.lead {
  color: #555;
  margin-bottom: 18px;
}
.post-card {
  border: 1px solid rgba(0, 0, 0, 0.04);
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
}
.post-card h2 {
  margin: 0 0 6px;
}
.meta {
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 8px;
}
.excerpt {
  color: #333;
  margin-bottom: 8px;
}
.read-more {
  font-size: 0.9rem;
  text-decoration: none;
  color: #07aa7c;
}
.loading {
  color: #666;
}
.empty {
  color: #999;
}
</style>
