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
    <div id="expand">
      <a-layout-sider width="220px" style="background: #fff">
        <a-menu
          mode="inline"
          theme="dark"
          :forceSubMenuRender="true"
          :inline-collapsed="collapsed"
          v-model:openKeys="this.openKeys"
        >
          <a-sub-menu
            v-for="(sub_content, subtitle, i) in this.lecture_index"
            :key="i"
          >
            <template #icon>
              <MailOutlined />
            </template>
            <template #title>{{ subtitle }}</template>
            <a-menu-item
              v-for="(chinese_name, key_name, j) in sub_content"
              :key="i + '-' + j"
            >
              <router-link :to="'/lecture/' + key_name">{{
                chinese_name
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
import { stat_instance } from "@/utils/request";
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
      lecture_index: {},
      // has_loaded_data: false,
      openKeys: ref(["1", "2", "3"]),
    };
  },

  setup() {
    const state = reactive({
      collapsed: false,
      selectedKeys: ["2-2"],
      openKeys: [],
      // preOpenKeys: [],
    });

    onMounted(() => {
      document.addEventListener("click", (event) => {
        const userClick = document.getElementById("navigation-button");
        // console.log("click button: ", userClick.contains(event.target));
        const navigation_expand = document.getElementById("expand");
        console.log("onMounted navigation_expand: ", navigation_expand);

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
    stat_instance({
      url: "/jio_api/get_directory",
    })
      .then((response) => {
        this.lecture_index = response.data.detail;

        this.$nextTick(() => {
          // execute after the DOM is updated
          let break_flag = false;
          console.log('lecture_index: ', Object.keys(this.lecture_index).length.toString());

          for (let count = 0; count < 15; count++) {
            for (let i = 0; i < Object.keys(response.data.detail).length; i++) {
              let j = i + 1;
              let ul_id;
              if (count == 0) {
                ul_id = "sub_menu_" + j.toString() + "_$$_" + i.toString() + "-popup";
              } else {
                ul_id = "sub_menu_" + count.toString() + j.toString() + "_$$_" + i.toString() + "-popup";
              }

              console.log(ul_id);
              let collapsed_ul = document.getElementById(ul_id);
              console.log(collapsed_ul)
              if (collapsed_ul != null) {
                collapsed_ul.style = "";
                break_flag = true;
              }
            }

            if (break_flag) {
              break;
            }
          }
        });
      })
      .catch(() => {
        console.log("### Failed to request navigation file.");
      });
  },

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
