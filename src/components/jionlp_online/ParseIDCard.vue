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

      <a-breadcrumb-item>解析身份证号</a-breadcrumb-item>
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
        <h2><b>解析身份证号</b></h2>
        <p>
          给定一段文本，从中抽取出身份证号，并解析其中地理、年月、性别信息。
        </p>
        <!--VueMathjax :formula="formula" /-->
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
          <a-table
            style="text-align: center; display: block"
            :columns="table_columns"
            :data-source="response.detail"
            :footer="null"
          >
          </a-table>
        </div>
        <div v-else-if="response.is_ok == false && first_show == false">
          <a-alert message="解析错误！" type="warning" show-icon />
          <a-card style="width: 100%">
            <p>● 请确保所提交的文本包含<b>身份证号字符串</b> (●'◡'●)</p>
            <p>
              ● 如所提交确实包含身份证号字符串，但解析错误，可通过以下 Github
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

const table_columns = [
  {
    title: "身份证号",
    dataIndex: "id_card",
    sorter: false,
    width: "21%",
    slots: { title: "customTitle", customRender: "name" },
  },
  {
    title: "省",
    dataIndex: "province",
    width: "10%",
    key: "province",
  },
  {
    title: "市",
    dataIndex: "city",
    width: "10%",
    key: "city",
  },
  {
    title: "县",
    dataIndex: "county",
    width: "10%",
    key: "county",
  },
  {
    title: "出生日期",
    dataIndex: "birth_day",
    width: "15%",
    key: "birth_day",
  },
  {
    title: "性别",
    dataIndex: "gender",
    width: "7%",
    key: "gender",
  },
  {
    title: "校验码",
    dataIndex: "check_code",
    width: "10%",
    key: "check_code",
  },
];

type IDCardObj = {
  key: string;
  id_card: string;
  province: string;
  city: string;
  county: string;
  birth_day: string;
  gender: string;
  check_code: string;
};

@Options({
  components: {
    CaretRightOutlined,
    HomeOutlined,
    // VueMathjax,
  },
})
class ParseIDCard extends Vue {
  text =
    "户主，张三，男，身份证号210502198203300975；离异，有一女儿，张小朵，\
身份证号是 21040320171205078x，曾经就读于金台小学";
  first_show = true;
  response = { is_ok: false, detail: Array<IDCardObj>() };
  $router = router;
  table_columns = table_columns;
  // formula = '$$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.$$';
  meta = setup(() => useMeta({ title: '解析身份证号 | 在线测试' }));

  mounted() {
    // console.log("ParseIDCard mounted!");
  }
  send() {
    let { random_int, hash_code } = authentication_hash_code(this.text);
    jio_backend({
      url: "/jio_api/parse_id_card",
      data: {
        text: this.text,
        random_num: random_int,
        hash_code: hash_code,
      },
    })
      .then((response) => {
        // console.log(response);
        this.first_show = false;
        this.response.is_ok = response.data.is_ok;
        this.response.detail = Array<IDCardObj>();
        var i;
        for (i in response.data.detail) {
          this.response.detail.push({
            key: i.toString(),
            id_card: response.data.detail[i].id_card,
            province: response.data.detail[i].province,
            city: response.data.detail[i].city,
            county: response.data.detail[i].county,
            birth_day:
              response.data.detail[i].birth_year +
              "-" +
              response.data.detail[i].birth_month +
              "-" +
              response.data.detail[i].birth_day,
            gender: response.data.detail[i].gender,
            check_code: response.data.detail[i].check_code,
          });
        }
        if (response.data.detail.length == 0) {
          this.response.is_ok = false;
        }
        // console.log("response!!!");
        // console.log(this.response.detail);
      })
      .catch((error) => {
        // console.log(error);
        this.first_show = false;
        this.response.is_ok = false;
      });
  }
}

export default ParseIDCard;
</script>

<style lang="less" scoped>
textarea {
  width: 100%;
  height: 80px;
  margin: 20px;
}
</style>
