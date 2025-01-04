<template>
  <div id="page_header">
    <div class="logo">
      <a-popover placement="bottomLeft" title="" trigger="hover">
        <template #content>
          <p>
            ● 跨越山海，努力奔赴。
          </p>
        </template>
        <router-link id="default_content" to="/"
          ><img
            id="jionlp_logo"
            alt="jionlp_logo"
            src="@/assets/jionlp_logo.png"
        /></router-link>
      </a-popover>
    </div>
    <div id="horizontal_navigator">
      <a-menu
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '44px', backgroundColor: 'black' }"
      >
        <a-menu-item style="padding-left: 20px !important;" key="0">
          <router-link id="nlp_online" to="/jionlp_online">NLP在线</router-link>
        </a-menu-item>
        <a-menu-item style="padding-left: 20px !important;" v-for="item in blog_first_directory" :key="item.key">
          <router-link :id="item.key" :to="'/blog' + item.path">
            {{ item.label }}
          </router-link>
        </a-menu-item>
      </a-menu>
    </div>
    <div class="links" style="flex: 1; display: inline-block">
      <!--GithubOutlined style="{width: 40px, height: 40px}" /-->
      <a href="https://github.com/dongrixinyu/JioNLP" target="_blank">
        <img
          class="link-icon-1"
          src="@/assets/github_logo.jpg"
          alt="Github"
        />
      </a>
      <a href="https://pypi.org/project/jionlp/" target="_blank">
        <img
          class="link-icon-2"
          src="https://pypi.org/static/images/logo-small.8998e9d1.svg"
          alt="Pypi"
        />
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
// import { MenuOutlined } from "@ant-design/icons-vue";

import { blog_backend } from "@/utils/request";
import authentication_hash_code from "@/utils/authentication";

type DirectoryItem = {
  key: string;
  label: string; // 确保label是一个具体的类型，如string
  path: string;
};

@Options({
  components: {
    // MenuOutlined,
  },
})
class PageHeader extends Vue {
  guest_count = 0;
  opened_horizontal_keys = [
    "nlp_online",
    "nlp_product",
    "nlp_blog",
    "contact_us",
  ];

  blog_first_index = [];
  blog_first_directory: DirectoryItem[] = [];

  created() {
    let { random_int, hash_code } = authentication_hash_code("");
    let attemptCount = 0; // 初始化尝试次数计数器
    const MAX_ATTEMPTS = 3; // 设置最大尝试次数

    const attemptRequest = () => {
      if (attemptCount >= MAX_ATTEMPTS) {
        console.log("[PageHeader] Maximum attempts reached.");
        return; // 如果已达到最大尝试次数，则不再继续重试
      };

      blog_backend({
        url: "/blog_api/get_1st_directory",
        data: {
          random_num: random_int,
          hash_code: hash_code,
        },
      })
        .then((response) => {
          if (response.data.is_ok) {
            this.blog_first_index = response.data.detail;
            // this.blog_first_directory = [];
            this.$nextTick(() => {
              // execute after the DOM is updated
              console.log(
                "[PageHeader] blog_first_index: ",
                this.blog_first_index,
              );
              if (typeof this.blog_first_index === 'object'){
                this.blog_first_directory = Object.keys(this.blog_first_index).map(
                  (category, index) => ({
                    label: category,
                    key: (index + 1).toString(),
                    path: `/${category}/${
                      this.blog_first_index[
                        category as keyof typeof this.blog_first_index
                      ]
                    }`,
                  })
                );
              }
              console.log(
                "[PageHeader] blog_first_directory: ",
                this.blog_first_directory
              );
            });
          } else {
            attemptCount++; // 增加尝试次数
            console.log(`[PageHeader] Retrying... Attempt ${attemptCount + 1}`);
            attemptRequest();
          }
        })
        .catch(() => {
          console.log(
            "[PageHeader] Failed to request /blog_api/get_1st_directory"
          );
          attemptCount++; // 增加尝试次数
          console.log(`[PageHeader] Retrying... Attempt ${attemptCount + 1}`);
          attemptRequest();
        });
    };

    attemptRequest();
  }
}

export default PageHeader;
</script>

<style lang="less" scoped>
#page_header {
  position: fixed;
  // display: block;
  z-index: 10;
  margin-left: 0px;
  padding: 10px 0px 0px 0px;
  background-color: black;
  // float: top;
  // text-align: left;
  min-width: 100%;
  min-height: 60px;
}

#jionlp_logo {
  // display: inline-block;
  width: 125px;
  height: 40px;
  margin-left: 0px;
  margin-top: 0px;
}

.ant-menu {
  font-size: 15px;
}

@media screen and (min-width: 800px) {
  .logo {
    position: fixed;
    margin-left: 30px;
    margin-right: auto;
    // float: left;
  }
}

@media screen and (max-width: 801px) {
  .logo {
    position: fixed;
    margin-left: 90px;
    margin-right: auto;
    // float: left;
  }
}

@media screen and (min-width: 800px) {
  #horizontal_navigator {
    position: fixed;
    margin-left: 180px;
    width: 581px;
    height: 44px;
  }
}

@media screen and (min-width: 800px) {
  .links {
    position: fixed;
    right: 0px;
    margin-left: auto;
    margin-right: 20px;
    // float: right;
  }
  .link-icon-1 {
    width: 43px;
    height: 43px;
    margin-left: 5px;
    margin-right: 5px;
  }
  .link-icon-2 {
    width: 32px;
    height: 32px;
    margin-left: 5px;
    margin-right: 5px;
  }
}

@media screen and (max-width: 801px) {
  #horizontal_navigator {
    position: fixed;
    margin-left: 220px;
    width: 391px;
    height: 44px;
  }
}

@media screen and (max-width: 801px) {
  .links {
    display: none;
  }
  .link-icon-1 {
    display: none;
  }
  .link-icon-2 {
    display: none;
  }
}
</style>
