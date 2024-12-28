<template>
  <div id="latest-blog">
    <p class="right-side-header">最新博客</p>
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
  name: "LatestBlog",
  components: {
  },

  data() {
    return {
      $router: router,
      articles: [
        // { title: '生成扩散模型漫谈(二十八):分步理解一致性', link: '/generative-diffusion-28' },
        // { title: 'Muon优化器赏析:从向量到矩阵的本质跨越', link: '/moon-optimizer' },
        // // ... 其他文章
      ],

    };
  },

  created() {
    let { random_int, hash_code } = authentication_hash_code("");
    let attemptCount = 0; // 初始化尝试次数计数器
    const MAX_ATTEMPTS = 3; // 设置最大尝试次数

    console.log("[LatestBlog][created] start");
    const attemptRequest = () => {
      if (attemptCount >= MAX_ATTEMPTS) {
        console.log("[LatestBlog][created] Maximum attempts reached.");
        return; // 如果已达到最大尝试次数，则不再继续重试
      };

      blog_backend({
        url: "/blog_api/get_latest_blogs",
        data: {
          random_num: random_int,
          hash_code: hash_code,
        }
      })
      .then((response) => {
        if (response.data.is_ok) {
          this.articles = response.data.detail;
          console.log("[LatestBlog][created]", response.data.detail);

        } else {
          attemptCount++; // 增加尝试次数
          console.log(`[LatestBlog][created] Retrying... Attempt ${attemptCount + 1}`);
          attemptRequest();
        }
      })
      .catch(() => {
        attemptCount++; // 增加尝试次数
        console.log(`[LatestBlog][created] Retrying... Attempt ${attemptCount + 1}`);
        attemptRequest();
      });
    };

    attemptRequest();
  },
};
</script>

<style>
#latest-blog {
  padding: 10px;
  padding-left: 0;
  position: relative;
  margin-bottom: 15px;
  background-color: #FFFFFF;
}

#latest-blog > .right-side-header {
  font-weight: bolder;
  font-size: 16px;
  color: #FF0000;
  margin-left: 20px;
}

.article-link {
  color: #444444;
  font-size: 14px;
}

@media screen and (max-width: 800px) {
  #latest-blog {
    display: none;
  }
}
</style>
