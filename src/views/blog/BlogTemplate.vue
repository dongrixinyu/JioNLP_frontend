<template>
  <div id="blog-template">
    <a-layout class="variable_content" style="padding: 15px">
      <a-layout-content
        :style="{
          background: '#fff',
          padding: '20px',
          margin: 0,
          width: '100%',
          minHeight: '280px',
        }"
      >
        <div>
          <h1>
            <b style="color: #00b441;">{{ this.title }}</b>
          </h1>
          <p class="description_text">
            发布日期：{{ this.established_time }}&emsp;编辑日期：{{ this.edited_time }}&emsp;阅读量：{{
              this.visitor_count
            }}
          </p>

          <div v-html="markdownToHtml"></div>

          <hr>
          <div v-if="this.visitor_count > 0">
            <div class="flex-postscript">
              <p class="bold-text">转载到请包括本文地址：</p>
              <p class="italic-text">http://www.jionlp.com/{{ this.$route.params.first_directory }}/{{ this.blog_id }}</p>
            </div>
            <p class="bold-text">如果您觉得本文还不错，欢迎分享/打赏本文。打赏并非要从中获得收益，而是希望知道 JioNLP 获得了多少读者的真心关注。
              当然，如果你无视它，也不会影响你的阅读。再次表示欢迎和感谢！</p>
            <div style="display: flex; justify-content: center; align-items: center;">
              <a-button type="primary" @click="this.change_qr_code_shown">打赏</a-button>
            </div>
            <div style="display: flex; justify-content: center; align-items: center;">
              <div v-if="this.show_qr_code == true" class="image-container">
                <div class="image-box">
                  <img src="@/assets/WeChat_Public_Accounts_qr_code.jpg" width="150" height="150" alt="Image 1">
                  <div class="caption">公众号JioNLP</div>
                </div>
                <div class="image-box">
                  <img width="150" height="150" src="@/assets/wechatpay_qr_code.jpg" alt="Image 2">
                  <div class="caption">微信打赏</div>
                </div>
                <div class="image-box">
                  <img width="150" height="150" src="@/assets/alipay_qr_code.jpg" alt="Image 3">
                  <div class="caption">支付宝打赏</div>
                </div>
              </div>

            </div>
            <div style="display: flex; justify-content: center; align-items: center;">
              <p v-if="this.show_qr_code == true" class="bold-text">因为网站后台对打赏并无记录，因此欢迎在打赏时候备注留言。</p>
            </div>
          </div>
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
// import { useMeta } from 'vue-meta';
import router from "../../router/index";
import { blog_backend } from "@/utils/request";
import authentication_hash_code from "@/utils/authentication";

export default {
  name: "BlogTemplate",

  components: {
  },

  props: {
    blog_id: String, // blog_id
  },

  data() {
    return {
      $router: router,
      title: "",
      established_time: "",
      edited_time: "",
      visitor_count: 0,
      markdown: "### 正在加载中 ...",
      show_qr_code: false,
    };
  },

  computed: {
    markdownToHtml() {
      var markdown_content = this.markdown_renderer(this.markdown);
      return markdown_content;
    },
  },

  created() {
    let { random_int, hash_code } = authentication_hash_code("");
    let attemptCount = 0; // 初始化尝试次数计数器
    const MAX_ATTEMPTS = 3; // 设置最大尝试次数

    console.log("[BlogTemplate][created] temp url: " + this.blog_id);
    const attemptRequest = () => {
      if (attemptCount >= MAX_ATTEMPTS) {
        this.markdown = "### 加载失败.";

        console.log("[PageHeader] Maximum attempts reached.");
        return; // 如果已达到最大尝试次数，则不再继续重试
      };

      blog_backend({
        url: "/blog_api/get_one_blog",
        data: {
          random_num: random_int,
          hash_code: hash_code,
          blog_id: this.blog_id,
        }
      })
      .then((response) => {
        if (response.data.is_ok) {
          this.markdown = response.data.detail['blog_text'];
          console.log("[BlogTemplate][created]", response.data.detail, this.blog_id);

          this.visitor_count = response.data.detail.visitor_count;
          this.title = response.data.detail.blog_title;
          document.title = this.title + " | JioNLP";
          this.established_time = response.data.detail.established_time.slice(0, 10);
          this.edited_time = response.data.detail.edited_time.slice(0, 10);

        } else {
          attemptCount++; // 增加尝试次数
          console.log(`[PageHeader] Retrying... Attempt ${attemptCount + 1}`);
          attemptRequest();
        }
      })
      .catch(() => {

        this.visitor_count = 0;
        document.title = this.blog_id + " | JioNLP";
        attemptCount++; // 增加尝试次数
        console.log(`[PageHeader] Retrying... Attempt ${attemptCount + 1}`);
        attemptRequest();
      });
    };

    attemptRequest();
  },

  updated() {
    let { random_int, hash_code } = authentication_hash_code("");
    let attemptCount = 0; // 初始化尝试次数计数器
    const MAX_ATTEMPTS = 3; // 设置最大尝试次数

    console.log("[BlogTemplate][created] temp url: " + this.blog_id);
    const attemptRequest = () => {
      if (attemptCount >= MAX_ATTEMPTS) {
        console.log("[BlogTemplate] Maximum attempts reached.");
        return; // 如果已达到最大尝试次数，则不再继续重试
      };

      blog_backend({
        url: "/blog_api/get_one_blog",
        data: {
          random_num: random_int,
          hash_code: hash_code,
          blog_id: this.blog_id,
        }
      })
      .then((response) => {
        if (response.data.is_ok) {
          this.markdown = response.data.detail['blog_text'];
          console.log("[BlogTemplate][created]", response.data.detail, this.blog_id);

          this.visitor_count = response.data.detail.visitor_count;
          this.title = response.data.detail.blog_title;
          document.title = this.title + " | JioNLP";
          this.established_time = response.data.detail.established_time.slice(0, 10);
          this.edited_time = response.data.detail.edited_time.slice(0, 10);

        } else {
          attemptCount++; // 增加尝试次数
          console.log(`[BlogTemplate] Retrying... Attempt ${attemptCount + 1}`);
          attemptRequest();
        }
      })
      .catch(() => {
        this.markdown = "### Failed to request markdown file.";

        this.visitor_count = 0;
        document.title = this.blog_id + " | JioNLP";
        attemptCount++; // 增加尝试次数
        console.log(`[BlogTemplate] Retrying... Attempt ${attemptCount + 1}`);
        attemptRequest();
      });
    };

    attemptRequest();
  },

  methods: {
    change_qr_code_shown () {
      this.show_qr_code = !this.show_qr_code;
    }
  }
};
</script>

<style lang="less" scoped>
#blog-template {
  margin-left: 250px;
  min-width: calc(98vw - 500px);
}

@media screen and (max-width: 800px) {
  #blog-template {
    margin-left: 0px;
    min-width: 98vw;
  }
}

h1 {
  width: 100%;
  // height: 80px;
  font-size: 28px;
  padding-top: 5px;
  margin: 10px;
}

.description_text {
  text-align: right;
  font-size: 10px;
  color: #777777;
}

.flex-postscript {
  display: flex;
  align-items: center;
}

.bold-text {
  font-weight: bold;
  font-size: 16px;
  color: #00B2F6;
}

.italic-text {
  font-style: italic; /* 设置文字为斜体 */
  font-size: 16px;
}

.image-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    margin: 20px;
}

.image-box {
    flex: 1 1 auto;
    text-align: center;
    margin: 10px;
}

img {
    max-width: 100%;
    height: auto;
}

.caption {
    font-size: 16px;
    margin-top: 5px;
    font-weight: bold;
}
</style>
