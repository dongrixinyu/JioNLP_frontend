<template>
  <div class="fixed-width-container">
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

<style>
.fixed-width-container {
  width: 1200px;
  margin: 0 auto;
}

@media screen and (max-width: 1200px) {
  .fixed-width-container {
    width: 100%;
  }
}
</style>
