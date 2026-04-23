<template>
  <div id="page_header">
    <div class="logo">
      <a-popover placement="bottomLeft" title="" trigger="hover">
        <template #content>
          <p>
            ● 跨越山海，春暖花开。
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
    <div id="vertical-navigator-button">
      <a-button
        type="primary"
        style="width: 62px; height: 40px"
        @click="toggleCollapsed"
      >
        <MenuUnfoldOutlined v-if="collapsed" />
        <MenuFoldOutlined v-else />
      </a-button>
    </div>
    <div id="vertical-navigator" :key="componentKey">
      <a-layout-sider width="150px" style="background: #fff">
        <a-menu
          mode="inline"
          theme="dark"
          :forceSubMenuRender="true"
          :inline-collapsed="collapsed"
          v-model:openKeys="this.openKeys"
        >
          <a-menu-item key="10">
            <router-link id="nlp_online" to="/jionlp_online">NLP在线</router-link>
          </a-menu-item>
          <a-menu-item v-for="item in blog_first_directory" :key="10 + item.key">
            <router-link :id="10 + item.key" :to="'/blog' + item.path">
              {{ item.label }}
            </router-link>
          </a-menu-item>

        </a-menu>
      </a-layout-sider>
    </div>
    <div id="horizontal-navigator">
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
    <div class="header-links" style="flex: 1; display: inline-block">
      <!--GithubOutlined style="{width: 40px, height: 40px}" /-->
      <a href="https://github.com/dongrixinyu/JioNLP" target="_blank">
        <img
          class="header-link-icon-1"
          src="@/assets/github_logo.jpg"
          alt="Github"
        />
      </a>
      <a href="https://pypi.org/project/jionlp/" target="_blank">
        <img
          class="header-link-icon-2"
          src="https://pypi.org/static/images/logo-small.8998e9d1.svg"
          alt="Pypi"
        />
      </a>
    </div>
  </div>
</template>

<script>
// import { Options, Vue } from "vue-class-component";
// import { MenuOutlined } from "@ant-design/icons-vue";
import { defineComponent, ref, reactive, toRefs, onMounted } from "vue";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  // MailOutlined,
} from "@ant-design/icons-vue";
import router from "@/router/index";
import { blog_backend } from "@/utils/request";
import authentication_hash_code from "@/utils/authentication";

export default defineComponent({
  components: {
    // MailOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
  },

  props: {
    // first_directory: String, // 中文名，用于请求目录
  },

  data() {
    return {
      $router: router,
      blog_index: {},
      openKeys: ref([0, 1, 2, 3]),
      preOpenKeys: ref([0, 1, 2, 3]),
      componentKey: 100,
      blog_first_index: [],
      blog_first_directory: [],
    };
  },

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
                "[PageHeader] blog_first_index orig: ",
                this.blog_first_index,
              );
              if (typeof this.blog_first_index === 'object'){
                this.blog_first_directory = Object.keys(this.blog_first_index).map(
                  (category, index) => {
                    return {
                      label: category,
                      key: (index + 1).toString(),
                      path: `/${category}/${this.blog_first_index[category]}`
                    };
                  });
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
  },

  setup() {
    const state = reactive({
      collapsed: false,  // 这个值控制
      openKeys: [0, 1, 2, 3],
      preOpenKeys: ["0", "1", "2", "3"],
    });

    onMounted(() => {
      document.addEventListener("click", (event) => {
        const userClick = document.getElementById("vertical-navigator-button");
        // console.log("click button: ", userClick.contains(event.target));
        const vertical_navigator = document.getElementById("vertical-navigator");

        const window_width = window.innerWidth;
        // console.log("window_width: ", window_width);
        if (window_width < 801) {
          if (userClick && userClick.contains(event.target)) {
            // 点击了 navigation-button 按钮，则开启导航页
            vertical_navigator.style.display = "block";
          } else {
            vertical_navigator.style.display = "none";
          }
        }
      });

      window.addEventListener("resize", function () {
        const vertical_navigator = document.getElementById("vertical-navigator");
        vertical_navigator.style.display = "none";
      });
    });

    const toggleCollapsed = () => {
      let collapsed_div = document.getElementById("vertical-navigator");
      if (collapsed_div.style.display == "") {
        // 该匹配必然在初次加载时进行匹配，后续则不需要
        collapsed_div.style.display = "block";
      } else {
        if (collapsed_div.style.display == "none") {
          collapsed_div.style.display = "block";
        } else {
          collapsed_div.style.display = "none";
        }
      }

      // state.openKeys = state.collapsed ? [] : state.preOpenKeys;
    };

    return { ...toRefs(state), toggleCollapsed };
  }
});

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

// 大于 800 像素宽
@media screen and (min-width: 800px) {
  .logo {
    position: fixed;
    margin-left: 30px;
    margin-right: auto;
    // float: left;
  }

  #horizontal-navigator {
    position: fixed;
    margin-left: 180px;
    width: 581px;
    height: 44px;
  }

  #vertical-navigator-button {
    display: none;
  }

  #vertical-navigator {
    position: fixed;
    display: none;
  }
}

// 小于 800 像素宽
@media screen and (max-width: 801px) {
  .logo {
    position: fixed;
    margin-left: 90px;
    margin-right: auto;
    // float: left;
  }

  #horizontal-navigator {
    position: fixed;
    display: none;
  }

  #vertical-navigator-button {
    z-index: 20;
    display: block;
    position: fixed;
    top: 10px;
    left: 9px;
  }

  #vertical-navigator {
    z-index: 9;
    position: fixed;
    overflow-y: scroll;
    height: 90%;
    display: none;
    margin-top: 50px;
  }
}


// @media screen and (min-width: 800px) {
.header-links {
  position: fixed;
  right: 0px;
  margin-left: auto;
  margin-right: 20px;
  // float: right;
}
.header-link-icon-1 {
  width: 43px;
  height: 43px;
  margin-left: 5px;
  margin-right: 5px;
}
.header-link-icon-2 {
  width: 32px;
  height: 32px;
  margin-left: 5px;
  margin-right: 5px;
}

</style>
