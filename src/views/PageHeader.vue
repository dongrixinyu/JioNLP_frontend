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
      <a-layout-sider width="150px" style="background: rgb(10, 31, 47);">
        <a-menu
          mode="inline"
          theme="dark"
          :forceSubMenuRender="true"
          :inline-collapsed="collapsed"
          v-model:openKeys="this.openKeys"
        >
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
        :style="{ lineHeight: '44px', backgroundColor: 'transparent' }"
      >
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
  z-index: 10;
  top: 0; /* 固定在顶部 */
  left: 0; /* 关键：配合 right 和 margin 实现居中 */
  right: 0; /* 关键：配合 left 和 margin 实现居中 */
  margin-left: auto; /* 关键：自动计算外边距 */
  margin-right: auto; /* 关键：自动计算外边距 */
  padding: 10px 0px 0px 0px;
  background-color: rgb(10, 31, 47);
  /* 删掉 min-width: 100%; 这行是罪魁祸首 */
  width: 100%; /* 改为 width: 100% */
  max-width: 1200px; /* 现在 max-width 就能生效了 */
  min-height: 60px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid #f0f0f0;
}

#jionlp_logo {
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
    background: rgb(10, 31, 47);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    border-radius: 0 0 8px 0;
  }
}

.header-links {
  position: absolute; /* 关键修改：从 fixed 改为 absolute */
  right: 20px;        /* 关键修改：从 0px 改为 20px，替代原来的 margin-right */
  top: 10px;          /* 补充：加上 top 定位，保持垂直位置与之前一致 */
  /* 删掉 margin-left: auto; 绝对定位下不需要这个 */
  /* 删掉 margin-right: 20px; 已经用 right: 20px 替代 */
  display: flex;
  align-items: center;
  height: 44px;
}
.header-link-icon-1 {
  width: 32px;
  height: 32px;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 50%;
  transition: opacity 0.3s;
}
.header-link-icon-1:hover {
  opacity: 0.8;
}
.header-link-icon-2 {
  width: 28px;
  height: 28px;
  margin-left: 10px;
  margin-right: 10px;
  transition: opacity 0.3s;
}
.header-link-icon-2:hover {
  opacity: 0.8;
}
</style>
