<template>
  <div>
    <a-layout style="flex-direction: row">
      <router-view> </router-view>
    </a-layout>
  </div>
</template>

<script>
// import Advertisement from "@/components/right_side/Advertisement.vue";
// import LatestBlog from "@/components/right_side/LatestBlog.vue";
// import { useMeta } from "vue-meta";

export default {
  name: "PageBase",
  components: {
    // LatestBlog,
    // Advertisement,
  },

  created () {
    console.log("[PageBase], init");
  }
};
</script>

<style></style>
