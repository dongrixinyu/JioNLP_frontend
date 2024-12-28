<template>
  <a-layout class="variable_content" style="padding: 0 24px 24px; width: 700px">
    <a-breadcrumb style="margin: 16px 0" :routes="$router">
      <a-breadcrumb-item>
        <router-link to="/">
          <home-outlined />
        </router-link>
      </a-breadcrumb-item>
      <a-breadcrumb-item>
        <router-link to="/jionlp_online"> NLP 在线解析 </router-link>
      </a-breadcrumb-item>
      <a-breadcrumb-item>地址解析</a-breadcrumb-item>
    </a-breadcrumb>
    <a-layout-content
      :style="{
        background: '#fff',
        padding: '24px',
        margin: 0,
        width: '100%',
        minHeight: '280px',
      }"
    >
      <div>
        <h2><b>地址解析</b></h2>
        <p>● 给定一条地址文本，从中抽取出<b>省、市、县、乡、街道、村</b>等。</p>
        <a-popover title="" trigger="hover">
          <template #content>
            <p>
              ● 在线版工具暂时未返回乡、村等信息。须查阅源码详情和说明文档。
            </p>
            <p>
              ●
              该工具支持地址补全，即给出市、县，补全其省、市等信息；且支持旧地名自动解析为新地名，例如“烟台长岛县”（已撤销）可自动识别为“蓬莱区”。
            </p>
            <p>
              ● 参考文档：
              <a
                href="https://github.com/dongrixinyu/JioNLP/wiki/Gadget-说明文档#user-content-地址解析"
                >地址解析说明文档</a
              >
            </p>
          </template>
          <a-button type="dashed">● 说明</a-button>
        </a-popover>
      </div>
      <textarea
        v-model="text"
        style="display: inline-block; margin-left: auto; margin-right: auto; width: 100%;"
      />
      <a-button
        style="
          display: block;
          margin-bottom: 10px;
          margin-left: auto;
          margin-right: 30px;
        "
        type="primary"
        @click="send"
        >提交文本
        <CaretRightOutlined />
      </a-button>

      <a-layout style="display: block">
        <div v-if="response.is_ok == true && first_show == false">
          <a-descriptions bordered title="" :column="{}">
            <a-descriptions-item label="省" span="1" style="width: 105px"
              ><b>{{ province }}</b></a-descriptions-item
            >
            <a-descriptions-item label="市" span="1"
              ><b>{{ city }}</b></a-descriptions-item
            >
            <a-descriptions-item label="县" span="1"
              ><b>{{ county }}</b></a-descriptions-item
            >
          </a-descriptions>
        </div>
        <div v-else-if="response.is_ok == false && first_show == false">
          <a-alert message="解析错误！" type="warning" show-icon />
          <a-card style="width: 100%">
            <p>● 请确保所提交的文本包含<b>地名字符串</b> (●'◡'●)</p>
            <p>
              ● 如所提交确实是地名字符串，但解析错误，可通过以下 Github
              链接提交报错信息。
            </p>
            <p>
              ●
              <a href="https://github.com/dongrixinyu/JioNLP/issues"
                ><b>提交报错信息</b></a
              >
            </p>
          </a-card>
        </div>
      </a-layout>
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts">
/* eslint-disable */
import { Options, setup, Vue } from "vue-class-component";
import { CaretRightOutlined, HomeOutlined } from "@ant-design/icons-vue";
import { useMeta } from 'vue-meta';
import router from "@/router/index";
import { jio_backend } from "@/utils/request";
import authentication_hash_code from "@/utils/authentication";

@Options({
  components: {
    CaretRightOutlined,
    HomeOutlined,
  },
})
class ParseLocation extends Vue {
  text = "喀左旗覃家岗街道梨树湾村芭蕉沟村组临.222号";
  first_show = true;
  response = { is_ok: false, detail: {} };
  $router = router;
  meta = setup(() => useMeta({ title: '地址解析 | 在线测试' }));
  province = null;
  city = null;
  county = null;

  mounted() {
    // console.log("ParseLocation mounted!");
  }
  send() {
    let { random_int, hash_code } = authentication_hash_code(this.text);
    jio_backend({
      url: "/jio_api/parse_location",
      data: {
        text: this.text,
        random_num: random_int,
        hash_code: hash_code,
      },
    })
      .then((response) => {
        // console.log("response");
        // console.log(response);
        this.first_show = false;
        this.response.is_ok = response.data.is_ok;
        this.response.detail = response.data.detail;
        this.province = response.data.detail.province;
        this.city = response.data.detail.city;
        this.county = response.data.detail.county;
        // console.log(this.province);
        // console.log(
        //   this.province == null && this.city == null && this.county == null
        // );
        if (this.province == null && this.city == null && this.county == null) {
          this.response.is_ok = false;
        }
      })
      .catch((error) => {
        // console.log(error);
        this.first_show = false;
        this.response.is_ok = false;
      });
  }
}

export default ParseLocation;
</script>

<style lang="less" scoped>
textarea {
  width: 100%;
  height: 80px;
  margin: 20px;
}
</style>
