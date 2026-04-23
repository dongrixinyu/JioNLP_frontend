<template>
  <div id="login-wrapper" v-show="this.isShow == true">
    <h4>
      &emsp;
      输入口令

    </h4>
    <div class="login-content">
      <input type="password" v-model="this.password"
        id="passwordInput" placeholder="输入口令">
      <button style="color: #000000;" @click="this.getValue">提交</button>
    </div>
  </div>
  <div v-if="this.isShow == true" class="placeholder">
  </div>
  <div v-if="this.isShow == false">
    <a-layout>
      <EditBlogNavigation :first_directory="this.first_directory"/>
      <EditBlogTemplate :blog_id="this.blog_id" />
    </a-layout>
  </div>
</template>

<script>
import { ref } from "vue";
import router from "@/router/index";
import { Md5 } from "ts-md5/dist/md5";

import EditBlogNavigation from "@/views/editblog/EditBlogNavigation.vue";
import EditBlogTemplate from "@/views/editblog/EditBlogTemplate.vue";

//
export default {
  name: "EditBlogBase",
  components: {
    EditBlogNavigation,
    EditBlogTemplate,
  },

  // props: {
  //     page_name: String, // 中文标题
  // },

  data() {
    // console.log("[EditBlogBase] first directory: " + this.$route.params.first_directory);
    return {
      $router: router,
      blog_id: ref(this.$route.params.blog_id),
      // first_directory: ref(this.$route.params.first_directory),
      // showModal: false,
      isShow: true,
      username: '',
      password: '',


    };
  },

  watch: {
    $route(to) {
      console.log("[EditBlogBase] to url: " + to.path);
      console.log("[EditBlogBase]: ", this.$route.params.blog_id);

      // this.first_directory = this.$route.params.first_directory;
      this.blog_id = this.$route.params.blog_id;
      // console.log("[EditBlogBase] to url: " + this.blog_id);
      this.$forceUpdate();
    },
  },

  created() {
    console.log("[EditBlogBase] blog_id: " + this.$route.params.blog_id);
  },

  methods: {
    getValue() {
      const hash_code = Md5.hashStr(this.password).slice(0, 8);
      console.log("[EditBlogBase][getValue]: ", hash_code);
      if (hash_code === "3f1cdbb2"){
        alert(`Your password is: ${this.password}`); // 显示密码
        this.isShow = false;
      } else {
        alert(`Your password is wrong.`); // 显示密码
      }
    }
  }
};
</script>

<style>
.placeholder {
  font-size: 24px;
  padding: 120px calc(49vw - 127px); /* 让占位符撑满容器宽度 */
}

#login-wrapper {
  position: fixed;
  bottom: auto;
  top: 120px;
  z-index: 19;
  left: 45%;
  right: 45%;
  margin: auto;
  width: 226px;
  box-sizing: border-box;
  border: 4px solid #00b2f6;
  border-radius: 0.25rem;
  background-color: #181818;
  color: white;
  text-align: center;
}
</style>
