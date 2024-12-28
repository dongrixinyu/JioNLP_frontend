<template>
  <div>
    <div id="navigation-button">
      <a-button
        type="primary"
        style="width: 62px; height: 40px"
        @click="toggleCollapsed"
      >
        <MenuUnfoldOutlined v-if="collapsed" />
        <MenuFoldOutlined v-else />
      </a-button>
    </div>
    <div id="expand" :key="componentKey">
      <a-layout-sider width="234px" style="background: #fff">
        <a-menu
          mode="inline"
          theme="dark"
          :forceSubMenuRender="true"
          :inline-collapsed="collapsed"
          v-model:openKeys="this.openKeys"
        >
          <a-sub-menu
            v-for="(sub_content, subtitle, i) in this.blog_index"
            :key="i"
            v-model:openKeys="this.openKeys"
          >
            <template #icon>
              <MailOutlined />
            </template>
            <template #title>{{ subtitle }}</template>
            <a-menu-item
              v-for="(chinese_name, j) in sub_content"
              :key="i + '-' + j"
            >
              <router-link :to="'/blog/' + chinese_name['directory_1'] + '/' + chinese_name['blog_id']">{{
                chinese_name['blog_title']
              }}</router-link>
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { blog_backend } from "@/utils/request";
import authentication_hash_code from "@/utils/authentication";
import router from "@/router/index";
import { defineComponent, ref, reactive, toRefs, onMounted } from "vue";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  // PieChartOutlined,
  MailOutlined,
  // DesktopOutlined,
  // InboxOutlined,
  // AppstoreOutlined,
} from "@ant-design/icons-vue";

export default defineComponent({
  data() {
    return {
      $router: router,
      blog_index: {},
      openKeys: ref([0, 1, 2, 3]),
      preOpenKeys: ref([0, 1, 2, 3]),
      componentKey: 0
    };
  },

  props: {
    first_directory: String, // 中文名，用于请求目录
  },

  setup() {
    const state = reactive({
      collapsed: false,  // 这个值控制
      selectedKeys: ["0-1"],
      openKeys: [0, 1, 2, 3],
      preOpenKeys: ["0", "1", "2", "3"],
    });

    onMounted(() => {
      document.addEventListener("click", (event) => {
        const userClick = document.getElementById("navigation-button");
        // console.log("click button: ", userClick.contains(event.target));
        const navigation_expand = document.getElementById("expand");
        // console.log("[BlogNavigation][setup][onMounted] openKeys: ", state.openKeys, state.selectedKeys);
        // console.log("[BlogNavigation][setup][onMounted] navigation_expand: ", navigation_expand);

        const window_width = window.innerWidth;
        // console.log("window_width: ", window_width);
        if (window_width < 801) {
          if (userClick && userClick.contains(event.target)) {
            // 点击了 navigation-button 按钮，则开启导航页
            navigation_expand.style.display = "block";
          } else {
            navigation_expand.style.display = "none";
          }
        }
      });

      window.addEventListener("resize", function () {
        const navigation_expand = document.getElementById("expand");
        if (window.innerWidth > 800) {
          navigation_expand.style.display = "block";
        } else {
          navigation_expand.style.display = "none";
        }
      });
    });

    const toggleCollapsed = () => {
      let collapsed_div = document.getElementById("expand");
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
  },

  created() {
    let { random_int, hash_code } = authentication_hash_code("");
    let attemptCount = 0; // 初始化尝试次数计数器
    const MAX_ATTEMPTS = 3; // 设置最大尝试次数
    console.log("[BlogNavigation][created]", this.$route.params.first_directory);

    const attemptRequest = () => {
      if (attemptCount >= MAX_ATTEMPTS) {
        console.log("[BlogNavigation][created] Maximum attempts reached.");
        return; // 如果已达到最大尝试次数，则不再继续重试
      }

      blog_backend({
        url: "/blog_api/get_directory",
        data: {
          random_num: random_int,
          hash_code: hash_code,
          first_directory: this.$route.params.first_directory,
        },
      })
        .then((response) => {
          if (response.data.is_ok) {
            this.blog_index = response.data.detail;
            console.log("[BlogNavigation]: ", this.blog_index);
            this.$nextTick(() => {
              // execute after the DOM is updated
              let break_flag = false;
              console.log('[BlogNavigation][created] blog_index: ', Object.keys(this.blog_index).length.toString());
              this.selectedKeys = [];
              this.openKeys = [0, 1, 2, 3, 4, 5]
            });
          } else {
            attemptCount++; // 增加尝试次数
            console.log(`[BlogNavigation][created] Retrying get_directory... Attempt ${attemptCount + 1}`);
            attemptRequest(); // 重试请求
          }
        })
        .catch(() => {
          console.log("### Failed to request navigation file.");
          attemptCount++; // 增加尝试次数
          console.log(`[BlogNavigation][created] Retrying get_directory... Attempt ${attemptCount + 1}`);
          attemptRequest(); // 重试请求
        });
    }

    attemptRequest();
  },

  updated() {

    // DOM更新完成后的逻辑
    let { random_int, hash_code } = authentication_hash_code("");
    let attemptCount = 0; // 初始化尝试次数计数器
    const MAX_ATTEMPTS = 3; // 设置最大尝试次数
    console.log("[BlogNavigation][updated]", this.$route.params.first_directory);

    const attemptRequest = () => {
      if (attemptCount >= MAX_ATTEMPTS) {
        console.log("[BlogNavigation][updated] Maximum attempts reached.");
        return; // 如果已达到最大尝试次数，则不再继续重试
      }

      blog_backend({
        url: "/blog_api/get_directory",
        data: {
          random_num: random_int,
          hash_code: hash_code,
          first_directory: this.$route.params.first_directory,
        },
      })
        .then((response) => {
          if (response.data.is_ok) {
            this.blog_index = response.data.detail;
            console.log("[BlogNavigation]: ", this.blog_index);
            this.$nextTick(() => {
              // execute after the DOM is updated
              let break_flag = false;
              console.log('[BlogNavigation][updated] blog_index: ', Object.keys(this.blog_index).length.toString());
              this.selectedKeys = [];
              this.openKeys = [0, 1, 2, 3, 4, 5]
            });
          } else {
            attemptCount++; // 增加尝试次数
            console.log(`[BlogNavigation][updated] Retrying get_directory... Attempt ${attemptCount + 1}`);
            attemptRequest(); // 重试请求
          }
        })
        .catch(() => {
          console.log("# Failed to request navigation file.");
          attemptCount++; // 增加尝试次数
          console.log(`[BlogNavigation][updated] Retrying get_directory... Attempt ${attemptCount + 1}`);
          attemptRequest(); // 重试请求
        });
    }

    attemptRequest();

  },

  // methods: {
  //   updateDOM() {
  //     this.componentKey += 1; // 更新key值，强制重新渲染
  //   }
  // },

  components: {
    // PieChartOutlined,
    MailOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    // DesktopOutlined,
    // InboxOutlined,
    // AppstoreOutlined,
  },
});
</script>

<style lang="less">

// .ant-menu-item {
//   margin: 20px;
// }

.ant-menu-item.ant-menu-item-only-child {
  padding-left: 28px !important;
}

#navigation-button {
  z-index: 20;
  display: block;
  position: fixed;
  top: 10px;
  left: 9px;
}

#expand {
  z-index: 9;
  position: fixed;
  overflow-y: scroll;
  height: 90%;
  // text-overflow: fade;
  // padding-left: 0px;
}

@media screen and (max-width: 800px) {
  #expand {
    position: fixed;
    display: none;
  }
}

@media screen and (min-width: 801px) {
  #navigation-button {
    display: none;
  }
}
</style>
