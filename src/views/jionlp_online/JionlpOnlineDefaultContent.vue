<template>
  <div>
    <a-layout style="padding: 0 24px 24px">
      <a-layout-content
        :style="{
          background: '#fff',
          padding: '24px',
          margin: 0,
          minHeight: '280px',
        }"
      >
        <div id="key_point">
          <h1>
            <b style="color: #00b441; font-size: 30px;">{{ this.title }}</b>
          </h1>
          <p class="description_text">
            发布日期：{{ this.established_time }}&emsp;编辑日期：{{ this.edited_time }}&emsp;阅读量：{{
              this.visitor_count
            }}
          </p>
        </div>
        <div v-html="markdownToHtml"></div>

      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
import { blog_backend } from "@/utils/request";
import authentication_hash_code from "@/utils/authentication";
import { defineComponent } from "vue";
import { useMeta } from "vue-meta";

export default defineComponent({
  components: {
  },

  computed: {
    markdownToHtml() {
      var markdown_content = this.md(this.markdown);
      return markdown_content;
    },
  },

  data() {
    return {
      markdown: "### 正在加载中 ...",
      title: "",
      established_time: "",
      edited_time: "",
      visitor_count: 0,
    };
  },

  setup() {
    useMeta({
      title: "JioNLP 在线解析",
      htmlAttrs: { lang: "en", amp: true },
    });
  },

  created() {
    let { random_int, hash_code } = authentication_hash_code("");
    let attemptCount = 0; // 初始化尝试次数计数器
    const MAX_ATTEMPTS = 3; // 设置最大尝试次数

    console.log("[BlogTemplate][created] temp url: " + this.blog_id);
    const attemptRequest = () => {
      if (attemptCount >= MAX_ATTEMPTS) {
        this.markdown = "### 加载失败.";

        console.log("[JioNLPOnlineDefaultContent] Maximum attempts reached.");
        return; // 如果已达到最大尝试次数，则不再继续重试
      };

      blog_backend({
        url: "/blog_api/get_one_blog",
        data: {
          random_num: random_int,
          hash_code: hash_code,
          blog_id: "20200313",
        }
      })
      .then((response) => {
        if (response.data.is_ok) {
          this.title = response.data.detail['blog_title'];
          this.markdown = response.data.detail['blog_text'];
          this.established_time = response.data.detail['established_time'];
          this.edited_time = response.data.detail['edited_time'];
          this.visitor_count = response.data.detail['visitor_count'];
          console.log("[JioNLPOnlineDefaultContent][created]", response.data.detail, this.blog_id);

          document.title = this.title + " | JioNLP";
        } else {
          attemptCount++; // 增加尝试次数
          console.log(`[JioNLPOnlineDefaultContent] Retrying... Attempt ${attemptCount + 1}`);
          attemptRequest();
        }
      })
      .catch(() => {

        this.visitor_count = 0;
        document.title = this.blog_id + " | JioNLP";
        attemptCount++; // 增加尝试次数
        console.log(`[JioNLPOnlineDefaultContent] Retrying... Attempt ${attemptCount + 1}`);
        attemptRequest();
      });
    };

    attemptRequest();
  },

});
</script>

<style scoped>
#head_line {
  text-align: left;
  font-size: 22px;
  margin-bottom: 8px;
  font-family: "Times New Roman";
  font-weight: bold;
  font-style: normal;
}

.description_text {
  text-align: right;
  font-size: 14px;
  color: #777777;
}

.content-color {
  color: #00b441;
}
</style>
