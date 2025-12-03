import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import BlogPost from "@/views/BlogPost.vue";
import NotFound from "@/views/NotFound.vue";
import AboutPage from "@/views/AboutPage.vue";
import ContactPage from "@/views/ContactPage.vue";
import MarkdownPost from "@/views/MarkdownPost.vue";

const routes = [
  { path: "/", name: "HomePage", component: HomePage },
  { path: "/post/:slug", name: "BlogPost", component: BlogPost },
  { path: "/md/:slug", name: "MarkdownPost", component: MarkdownPost },
  { path: "/about", name: "AboutPage", component: AboutPage },
  { path: "/contact", name: "ContactPage", component: ContactPage },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
