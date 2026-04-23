<template>
  <div id="hotest-blog">
    <p class="right-side-header">最热博客</p>
    <ul>
      <li style="margin-bottom: 5px;" v-for="article in this.articles" :key="article.blog_title">
        <router-link :to="article.url" class="article-link">{{ article.blog_title }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import router from "../../router/index";
import { blog_backend } from "@/utils/request";
import authentication_hash_code from "@/utils/authentication";
// import { useMeta } from "vue-meta";

export default {
  name: "HotestBlog",
  components: {
  },

  data() {
    return {
      $router: router,
      articles: [
      ],

    };
  },

  created() {
    let { random_int, hash_code } = authentication_hash_code("");
    let attemptCount = 0; // 初始化尝试次数计数器
    const MAX_ATTEMPTS = 3; // 设置最大尝试次数

    console.log("[HotestBlog][created] start");
    const attemptRequest = () => {
      if (attemptCount >= MAX_ATTEMPTS) {
        console.log("[HotestBlog][created] Maximum attempts reached.");
        return; // 如果已达到最大尝试次数，则不再继续重试
      };

      blog_backend({
        url: "/blog_api/get_hotest_blogs",
        data: {
          random_num: random_int,
          hash_code: hash_code,
        }
      })
      .then((response) => {
        if (response.data.is_ok) {
          this.articles = response.data.detail;
          console.log("[HotestBlog][created]", response.data.detail);

        } else {
          attemptCount++; // 增加尝试次数
          console.log(`[HotestBlog][created] Retrying... Attempt ${attemptCount + 1}`);
          attemptRequest();
        }
      })
      .catch(() => {
        attemptCount++; // 增加尝试次数
        console.log(`[HotestBlog][created] Retrying... Attempt ${attemptCount + 1}`);
        attemptRequest();
      });
    };

    attemptRequest();
  },
};
</script>

<style>
#hotest-blog {
  padding: 10px;
  padding-left: 0;
  position: relative;
  margin-bottom: 15px;
  background-color: #FFFFFF;
}

#hotest-blog > .right-side-header {
  font-weight: bolder;
  font-size: 16px;
  color: #FF6700;
  margin-left: 20px;
}

#hotest-blog > ul > li > .article-link {
  color: #444444;
  font-size: 14px;
}

#hotest-blog > ul > li > .article-link:hover {
  color: #FF6700;
}

@media screen and (max-width: 800px) {
  #hotest-blog {
    display: none;
  }
}
</style>
