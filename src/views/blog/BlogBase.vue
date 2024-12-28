<template>
  <div>
    <a-layout>
      <BlogNavigation :first_directory="this.first_directory"/>
      <BlogTemplate :blog_id="this.blog_id" />
    </a-layout>
  </div>
</template>

<script>
import { ref } from "vue";
import router from "@/router/index";

import BlogNavigation from "@/views/blog/BlogNavigation.vue";
import BlogTemplate from "@/views/blog/BlogTemplate.vue";

export default {
  name: "BlogBase",
  components: {
    BlogNavigation,
    BlogTemplate,
  },

  // props: {
  //     blog_id: String, // 中文标题
  // },

  data() {
    return {
      $router: router,
      blog_id: ref(this.$route.params.blog_id),
      first_directory: ref(this.$route.params.first_directory),
    };
  },

  watch: {
    $route(to) {
      console.log("[BlogBase] to url: " + to.path);
      console.log("[BlogBase]: ", this.$route.params.first_directory, this.$route.params.blog_name);
      
      this.first_directory = this.$route.params.first_directory;
      this.blog_id = this.$route.params.blog_id;
      // console.log("[BlogBase] to url: " + this.blod_id);
      this.$forceUpdate();
    },
  },

  created() {
    console.log("[BlogBase] url: " + this.$route.params.blog_name);
  },
};
</script>

<style></style>
