<template>
  <div id="right-column">
    <a-layout style="flex-direction: column">
      <advertisement />
      <latest-blog />
      <hotest-blog />
      <contact-us />
      <friend-link />
    </a-layout>
  </div>
</template>

<script>
import Advertisement from "@/components/right_side/Advertisement.vue";
import LatestBlog from "@/components/right_side/LatestBlog.vue";
import HotestBlog from "@/components/right_side/HotestBlog.vue";
import ContactUs from "@/components/right_side/ContactUs.vue";
import FriendLink from "@/components/right_side/FriendLink.vue";
// import { useMeta } from "vue-meta";

export default {
name: "PageRight",
components: {
    // BlogNavigation,
    LatestBlog,
    HotestBlog,
    Advertisement,
    ContactUs,
    FriendLink,
},

created () {
    console.log("[PageRight], init");
}
};
</script>

<style>

#right-column {
  padding: 15px;
  padding-left: 0;
  position: relative;
  width: 250px;
}

@media screen and (max-width: 800px) {
  #right-column {
    display: none;
  }
}
</style>
