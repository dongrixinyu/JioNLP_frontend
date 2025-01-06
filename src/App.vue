<template>
  <div>
    <a-layout>
      <metainfo>
        <template v-slot:title="{ content }">{{
          content ? `${content} | JioNLP` : `JioNLP`
        }}</template>
      </metainfo>
      <page-header />
      <div style="display: flex; flex-direction: column;">
        <a-layout id="page-content" style="flex-direction: row">
          <router-view> </router-view>
          <page-right />
        </a-layout>
        <a-layout>
          <page-footer />
        </a-layout>
      </div>
    </a-layout>
  </div>
</template>

<script>
// import Navigation from "@/components/Navigation.vue";
import PageHeader from "@/views/PageHeader.vue";
import PageFooter from "@/views/PageFooter.vue";
import PageRight from "@/views/PageRight.vue";
import { useMeta } from "vue-meta";

export default {
  name: "App",
  components: {
    PageHeader,
    PageFooter,
    PageRight,
  },
  setup() {
    useMeta({
      title: "",
      htmlAttrs: { lang: "cn", amp: true },
    });
  },
};
</script>

<style>
#app {
  display: "inline-block";
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 0px;
}

#page-content {
  margin-top: 60px;
}
</style>
