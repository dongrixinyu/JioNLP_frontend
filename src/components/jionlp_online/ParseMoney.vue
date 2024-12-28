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
      <a-breadcrumb-item>货币金额抽取</a-breadcrumb-item>
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
        <h2><b>货币金额抽取</b></h2>
        <p>给定一篇中文文本，抽取出其中的货币金额，并将其标准化。</p>
        <a-popover title="" trigger="hover">
          <template #content>
            <p>
              ●
              该货币金额实体抽取依赖<b>规则</b>，而不依赖模型，故存在一些<b>假阳、假阴</b>的错误。
            </p>
            <p>
              ● 若想要货币金额更详细信息，以及代码使用，请参考
              <a
                href="https://github.com/dongrixinyu/JioNLP/wiki/正则抽取与解析-说明文档#user-content-货币金额解析"
                ><b>货币金额解析</b></a
              >与<a
                href="https://github.com/dongrixinyu/JioNLP/wiki/NER-说明文档#user-content-货币金额实体抽取"
                ><b>货币金额实体抽取</b></a
              >。
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
        <div v-if="response.is_ok == false && first_show == false">
          <a-alert message="解析错误！" type="warning" show-icon />
          <a-card style="width: 100%">
            <p>● 请确保所提交的文本包含<b>货币金额字符串</b> (●'◡'●)</p>
            <p>● 如解析错误，可通过以下 Github 链接提交报错信息</p>
            <p>
              ●
              <a href="https://github.com/dongrixinyu/JioNLP/issues"
                ><b>提交报错文本信息</b></a
              >
            </p>
          </a-card>
        </div>
        <div style="background: #fff; padding: 20px">
          <font id="insertion_html" size="3.5"> </font>
          <div v-if="response.is_ok == true && first_show == false">
            <a-table
              style="margin-top: 20px; text-align: center; display: block"
              :columns="table_columns"
              :data-source="response.detail"
              :footer="null"
            >
              <template #name="{ record }">
                <span>
                  <b> {{ record.orig_money }} </b>
                </span>
              </template>
            </a-table>
          </div>
        </div>
      </a-layout>
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts">
import { Options, setup, Vue } from "vue-class-component";
import { CaretRightOutlined, HomeOutlined } from "@ant-design/icons-vue";
import { useMeta } from "vue-meta";
import router from "@/router/index";
import { jio_backend } from "@/utils/request";
import authentication_hash_code from "@/utils/authentication";

const table_columns = [
  {
    title: "货币金额",
    dataIndex: "orig_money",
    sorter: false,
    width: "25%",
    slots: { title: "customTitle", customRender: "name" },
  },
  {
    title: "标准额度",
    dataIndex: "std_money",
    width: "25%",
    key: "std_money",
  },
  {
    title: "货币单位",
    dataIndex: "case",
    width: "15%",
    key: "case",
  },
  {
    title: "精确度",
    dataIndex: "definition",
    width: "15%",
    key: "definition",
  },
];

type MoneyObj = {
  key: string;
  orig_money: string;
  std_money: string;
  case: string;
  definition: string;
  offset_start: string;
  offset_end: string;
};

const entity_mapping = {
  money: '<span class="entity_tag money"><b>',
  end_map: "</b></span>",
  front_p: "<p>",
  end_p: "</p>",
};

function insertString(
  source_text: string,
  position: number,
  new_string: string
) {
  return (
    source_text.slice(0, position) + new_string + source_text.slice(position)
  );
}

@Options({
  components: {
    CaretRightOutlined,
    HomeOutlined,
  },
})
class ParseMoney extends Vue {
  text =
    "张三赔偿李小华人民币车费601,293.11元，工厂费约一万二千三百四十五元,利息9佰多日元，打印费十块钱人民币。";
  rendered_text = "";
  new_string_start = entity_mapping["money"];
  new_string_end = entity_mapping["end_map"];

  first_show = true;
  response = {
    is_ok: false,
    detail: Array<MoneyObj>(),
  };
  $router = router;
  table_columns = table_columns;
  meta = setup(() => useMeta({ title: "货币金额抽取 | 在线测试" }));

  mounted() {
    //console.log("ParseMoney mounted!");
  }
  send() {
    let { random_int, hash_code } = authentication_hash_code(this.text);
    jio_backend({
      url: "/jio_api/parse_money",
      data: {
        text: this.text,
        reverse_ret: true,
        random_num: random_int,
        hash_code: hash_code,
      },
    })
      .then((response) => {
        // console.log(response);
        this.first_show = false;
        this.response.is_ok = response.data.is_ok;
        this.response.detail = Array<MoneyObj>();

        this.rendered_text = this.text;

        let i;
        for (i in response.data.detail) {
          let start_idx: number;
          let end_idx: number;

          start_idx = response.data.detail[i]["offset"][0];
          end_idx = response.data.detail[i]["offset"][1];

          this.rendered_text = insertString(
            this.rendered_text,
            end_idx,
            this.new_string_end
          );

          // new_string_start = "23";
          this.rendered_text = insertString(
            this.rendered_text,
            start_idx,
            this.new_string_start
          );
        }

        // 后处理换行号，加线号等
        this.rendered_text = this.rendered_text.replace(/\n/g, "</p><p>");

        // 开头、末尾添加标签
        this.rendered_text =
          "<HR SIZE=10><p>" + this.rendered_text + "</p><HR SIZE=10>";
        // console.log(this.rendered_text);

        let insertion_html: HTMLElement;
        const temp = document.getElementById("insertion_html");

        if (temp) {
          insertion_html = temp;
        } else {
          throw new TypeError("the insertion_html element does not exist.");
        }

        insertion_html.innerHTML = this.rendered_text;

        for (i in response.data.detail) {
          let std_money_num: string;
          if (typeof response.data.detail[i]["detail"]["num"] == "string") {
            std_money_num = response.data.detail[i]["detail"]["num"];
          } else {
            std_money_num =
              response.data.detail[i]["detail"]["num"][0] +
              "~" +
              response.data.detail[i]["detail"]["num"][1];
          }

          this.response.detail.push({
            key: i.toString(),
            orig_money: response.data.detail[i]["text"],
            std_money: std_money_num,
            case: response.data.detail[i]["detail"]["case"],
            definition: response.data.detail[i]["detail"]["definition"],
            offset_start: response.data.detail[i]["offset"][0],
            offset_end: response.data.detail[i]["offset"][1],
          });
        }
        this.response.detail.reverse();

        if (response.data.detail.length == 0) {
          this.response.is_ok = false;
        }
      })
      .catch(() => {
        this.first_show = false;
        this.response.is_ok = false;
      });
  }
}

export default ParseMoney;
</script>

<style lang="less">
textarea {
  width: 100%;
  height: 120px;
  margin: 20px;
}

.entity_tag {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
  list-style: none;
  font-feature-settings: "tnum";
  display: inline-block;
  height: auto;
  margin-left: 8px;
  margin-right: 8px;
  padding: 0 7px;
  font-size: 14px;
  line-height: 20px;
  white-space: nowrap;
  background: rgb(20, 158, 249);
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  opacity: 1;
  transition: all 0.3s;
}

.entity_tag.money {
  background-color: rgb(3, 126, 175);
}
</style>
