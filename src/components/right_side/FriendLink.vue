<template>
  <div id="friend-link">
    <p class="right-side-header">友情链接</p>
    <ul>
      <li style="margin-bottom: 5px;" v-for="item in this.friend_links" :key="item.title">
        <a :href="item.url" class="friend-item">{{ item.title }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import router from "../../router/index";
// import { blog_backend } from "@/utils/request";
// import authentication_hash_code from "@/utils/authentication";
// import { useMeta } from "vue-meta";

export default {
  name: "FriendLink",
  components: {
  },

  data() {
    return {
      $router: router,
      friend_links: [
        {"title": "苏剑林-科学空间", "url": "https://kexue.fm/"}
      ],

    };
  },

};
</script>

<style>
#friend-link {
  padding: 10px;
  padding-left: 0;
  position: relative;
  margin-bottom: 15px;
  background-color: #FFFFFF;
}

#friend-link > .right-side-header {
  font-weight: bolder;
  font-size: 16px;
  color: #00B050;
  margin-left: 20px;
}

.friend-item {
  color: #444444;
  font-size: 14px;

}

@media screen and (max-width: 800px) {
  #friend-link {
    display: none;
  }
}
</style>
