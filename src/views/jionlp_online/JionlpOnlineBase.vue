<template>
  <div>
    <a-layout>
      <jionlp-online-navigation />
      <router-view> </router-view>

    </a-layout>
  </div>
</template>

<script>
import JionlpOnlineNavigation from "@/views/jionlp_online/JionlpOnlineNavigation.vue";
// import { useMeta } from "vue-meta";

export default {
  name: "JionlpOnlineBase",
  components: {
    JionlpOnlineNavigation,
  },
};
</script>

<style></style>
