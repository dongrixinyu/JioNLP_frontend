<template>
  <div class="spin-container">
    <div v-if="blog_list_data.length == 0" class="placeholder">
      <a-spin size="large" />
    </div>
    <ul class="list-items" >
      <li class="list-item" v-for="(item, index) in blog_list_data" :key="index">
        <div class="list-item-extra">
          <img class="list-item-image"
            alt="logo"
            :src="item.blog_image_url"
          />
        </div>
        <div class="list-item-main">
          <div class="list-item-meta">
            <div class="list-item-meta-avatar">
              <div style="box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <p id="list-item-meta-avatar-top-p">
                  {{ item.blog_edited_year }}
                </p>
                <p id="list-item-meta-avatar-bottom-p">
                  {{ item.blog_edited_month }}月{{ item.blog_edited_day }}日
                </p>
              </div>
            </div>
            <div class="list-item-meta-content">
              <h4 class="list-item-meta-title">
                <a :href="item.blog_url">{{ item.blog_title }}</a>
              </h4>
              <div class="list-item-meta-description">
                {{ item.blog_description }}
              </div>
            </div>

          </div>
          <div v-html="markdownToHtml(item.blog_content)">
          </div>
        </div>
      </li>
    </ul>
  </div>

</template>

<script>
import router from "../router/index";
import { blog_backend } from "@/utils/request";
import authentication_hash_code from "@/utils/authentication";


export default {
  name: "HomePageContent",

  components: {
    // HomeOutlined,
  },

  props: {
    blog_id: String, // blog_id
  },

  data() {
    console.log("[HomePageContent][data]");
    return {
      $router: router,
      title_color: "#00b2f6",
      blog_list_data: [],
    };
  },

  methods: {
    markdownToHtml(blog_content) {
      var markdown_content = this.markdown_renderer(blog_content);
      return markdown_content;
    },

    getColor() {
      const prob = Math.random();

      if (prob > 0.95) {
        return "#ff0000";  // red
      } else if (prob > 0.90) {
        return "#eeaa00";  // orange
      } else if (prob > 0.85) {
        return "#ffe500";  // yellow
      } else if (prob > 0.55) {
        return "#00b441";  // green
      } else if (prob > 0.4) {
        return "#00b2f6";  // blue
      } else {
        return "#92D050";  // lightgreen
      }
    },

    get_title_color() {
      return `background-color: ${this.title_color}`;
    }

  },

  created() {
    let { random_int, hash_code } = authentication_hash_code("");
    let attemptCount = 0; // 初始化尝试次数计数器
    const MAX_ATTEMPTS = 3; // 设置最大尝试次数

    document.title = "首页 | JioNLP";
    this.title_color = this.getColor();

    console.log("[HomePageContent][created] start");
    const attemptRequest = () => {
      if (attemptCount >= MAX_ATTEMPTS) {
        console.log("[HomePageContent] Maximum attempts reached.");
        return; // 如果已达到最大尝试次数，则不再继续重试
      };

      blog_backend({
        url: "/blog_api/get_homepage_blogs",
        data: {
          random_num: random_int,
          hash_code: hash_code,
        }
      })
      .then((response) => {
        if (response.data.is_ok) {
          console.log("[HomePageContent][created]", response.data.detail);
          this.blog_list_data = response.data.detail;

        } else {
          attemptCount++; // 增加尝试次数
          console.log(`[HomePageContent] Retrying... Attempt ${attemptCount + 1}`);
          attemptRequest();
        }
      })
      .catch(() => {
        attemptCount++; // 增加尝试次数
        console.log(`[HomePageContent] Retrying... Attempt ${attemptCount + 1}`);
        attemptRequest();
      });
    };

    attemptRequest();
  },

};

</script>

<style lang="less">

.placeholder {
  font-size: 24px;
  padding: 120px calc(50vw - 127px); /* 让占位符撑满容器宽度 */
}

.list-items {
  margin: 0;
  padding: 0;
  list-style: none;
  box-sizing: border-box;
}

.list-vertical.list-item {
  align-items: initial;
}

.list-item {
  display: flex;
  flex-direction: row;
  padding-left: 24px;
  padding-top: 16px;
  padding-bottom: 0px;
  padding-right: 16px;
}

.list-item-main {
  display: block;
  flex: 1;
  box-sizing: border-box;
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 30px;
  padding-right: 30px;
  background-color: #FFFFFF;
}

.list-item-image {
  max-width: 220px;  /* 设置最大宽度为250px */
  min-width: 220px;  /* 设置最大宽度为250px */
  height: auto;      /* 保持原始宽高比 */
  width: 100%;
  // background-image: url('@/assets/loading_error_image.jpg'); /* 设置占位图 */
  // background-size: cover; /* 确保占位图覆盖整个区域 */
  // background-position: center;
}

.list-item-extra {
  margin-left: 0px;
  margin-right: 16px;
  box-sizing: border-box;
}

@media screen and (max-width: 800px) {
  .list-item-extra {
    position: fixed;
    display: none;
  }
}

.list-item-meta {
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
  max-width: 100%;
  box-sizing: border-box;
}

.list-item-meta-content {
  max-width: calc(100% - 82px);
  min-width: calc(100% - 82px);
  box-sizing: border-box;
}

.list-item-meta-avatar {
  margin-right: 16px;
  box-sizing: border-box;
}

#list-item-meta-avatar-top-p {
  max-width: 66px;
  min-width: 66px;
  text-align: center;
  border-radius: 10px 10px 0px 0px;
  background-color: #92D050;
  font-weight: bold;
  font-size: 14px;
  color: white;
  box-sizing: border-box;
  padding-top: 6px !important;
  padding-bottom: 2px !important;
  padding-left: 0px !important;
  margin-top: 0px !important;
  margin-bottom: 0px !important;
}

#list-item-meta-avatar-bottom-p {
  max-width: 66px;
  min-width: 66px;
  text-align: center;
  border-radius: 0px 0px 10px 10px;
  background-color: #00b441;
  font-weight: bold;
  font-size: 12px;
  color: white;
  box-sizing: border-box;
  padding-top: 3px !important;
  padding-bottom: 5px !important;
  padding-left: 3px !important;
  padding-right: 3px !important;
  margin-top: 0px !important;
  margin-bottom: 0px !important;
}

.list-item-meta-title {
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.5; /* 推荐使用相对单位，比固定 32px 更灵活 */
  box-sizing: border-box;
}

.list-item-meta-title > a {
  /* 1. 撑满宽度：改为 block，并设置 100% 宽度 */
  display: block;
  width: 100%;

  /* 2. 固定底色：设置一个柔和的浅灰色背景 */
  background-color: #e7e8ea;

  /* 3. 内边距与圆角：让文字有呼吸感，四周圆润 */
  padding: 10px 16px;
  border-radius: 8px;

  /* 4. 增加美感：左侧加一条 4px 的强调线，如果 get_title_color() 设置了 color，这里可以用 currentColor 继承颜色 */
  border-left: 4px solid currentColor;

  /* 移除之前的 margin-left: -8px，因为现在是 block 元素了 */
  box-sizing: border-box;
  text-decoration: none;
  color: #1d2129; /* 默认颜色，会被 Vue 的内联样式覆盖 */

  /* 5. 过渡动画：让悬浮效果更平滑 */
  transition: all 0.25s ease;

  /* 防止超长文本破坏布局 */
  word-break: break-all;
}

.list-item-meta-title > a:hover {
  /* 悬浮时的固定底色变深 */
  background-color: #eef0f3;

  /* 增加一点立体感：阴影和微微上移 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);

  /* 文字颜色加深或改变 (注意：如果 Vue 内联样式优先级太高，可在此加 !important) */
  color: #165dff !important;
}

.list-item-meta-description {
  color: #888888;
  font-size: 14px;
  line-height: 1.5715;
  box-sizing: border-box;
}
</style>
