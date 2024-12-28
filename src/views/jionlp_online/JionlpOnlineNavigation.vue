<template>
  <!--div style="width: 256px; float: left"-->
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
          :inline-collapsed="collapsed"
          v-model:openKeys="openKeys"
        >
          <!-- <a-menu-item key="1">
            <template #icon>
              <PieChartOutlined />
            </template>

            <router-link
              id="extract_keyphrase"
              to="/jionlp_online/extract_keyphrase"
              >关键短语抽取</router-link
            >
          </a-menu-item> -->
          <a-menu-item key="2">
            <template #icon>
              <DesktopOutlined />
            </template>
            <router-link id="parse_time" to="/jionlp_online/parse_time"
              >时间语义解析</router-link
            >
          </a-menu-item>
          <a-menu-item key="3">
            <template #icon>
              <DesktopOutlined />
            </template>
            <router-link id="extract_time" to="/jionlp_online/extract_time"
              >时间实体抽取</router-link
            >
          </a-menu-item>
          <a-menu-item key="4">
            <template #icon>
              <InboxOutlined />
            </template>
            <router-link id="parse_location" to="/jionlp_online/parse_location"
              >地址解析</router-link
            >
          </a-menu-item>
          <!-- <a-menu-item key="5">
            <template #icon>
              <InboxOutlined />
            </template>
            <router-link id="cws_pos" to="/jionlp_online/cws_pos"
              >分词-词性标注</router-link
            >
          </a-menu-item> -->
          <a-sub-menu key="sub1">
            <template #icon>
              <MailOutlined />
            </template>
            <template #title>小工具集</template>
            <a-menu-item key="1-1">
              <router-link id="clean_text" to="/jionlp_online/clean_text"
                >清洗文本</router-link
              >
            </a-menu-item>
            <a-menu-item key="1-2">
              <router-link id="parse_money" to="/jionlp_online/parse_money"
                >货币金额抽取</router-link
              >
            </a-menu-item>
            <a-menu-item key="1-3">
              <router-link id="parse_id_card" to="/jionlp_online/parse_id_card"
                >解析身份证号</router-link
              >
            </a-menu-item>
            <!--a-menu-item key="1-4">More...</a-menu-item-->
          </a-sub-menu>
          <!-- <a-sub-menu key="sub2">
            <template #icon>
              <AppstoreOutlined />
            </template>
            <template #title>数据增强</template>
            <a-menu-item key="2-1">
              <router-link
                id="back_translation"
                to="/jionlp_online/back_translation"
                >回译数据增强</router-link
              >
            </a-menu-item>
            <a-menu-item key="2-2">
              <router-link
                id="homophone_substitution"
                to="/jionlp_online/homophone_substitution"
                >同音词替换</router-link
              >
            </a-menu-item>
          </a-sub-menu> -->
        </a-menu>
      </a-layout-sider>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, watch, onMounted } from "vue";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  // PieChartOutlined,
  MailOutlined,
  DesktopOutlined,
  InboxOutlined,
  // AppstoreOutlined,
} from "@ant-design/icons-vue";

export default defineComponent({
  setup() {
    const state = reactive({
      collapsed: false,
      selectedKeys: ["1"],
      openKeys: ["sub1", "sub2"],
      preOpenKeys: [],
    });
    watch(
      () => state.openKeys,
      (val, oldVal) => {
        state.preOpenKeys = oldVal;
      }
    );

    onMounted(() => {
      document.addEventListener("click", (event) => {
        const userClick = document.getElementById("navigation-button");
        console.log("click menu: ", userClick.contains(event.target));
        const navigation_expand = document.getElementById("expand");

        const window_width = window.innerWidth;
        console.log("window_width: ", window_width);
        if (window_width < 801) {
          if (userClick && userClick.contains(event.target)) {
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
      // state.collapsed_b = !state.collapsed_b;
      // if (toggleCount)
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
    };

    return { ...toRefs(state), toggleCollapsed };
  },

  components: {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    // PieChartOutlined,
    MailOutlined,
    DesktopOutlined,
    InboxOutlined,
    // AppstoreOutlined,
  },
});
</script>

<style lang="less" scoped>
#navigation-button {
  z-index: 20;
  display: block;
  position: fixed;
  top: 10px;
  left: 9px;
}

#expand {
  z-index: 9;
  position: static;
  width: 200;
}

@media screen and (max-width: 800px) {
  #expand {
    position: fixed;
  }
}

@media screen and (min-width: 801px) {
  #navigation-button {
    display: none;
  }
}
</style>
