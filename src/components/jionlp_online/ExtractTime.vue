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

      <a-breadcrumb-item>时间实体抽取与解析</a-breadcrumb-item>

      <!--a-breadcrumb-item>App</a-breadcrumb-item-->
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
        <h2><b>时间实体抽取与解析</b></h2>
        <p>给定一篇中文，解析其中的时间短语实体。</p>

        <a-popover title="" trigger="hover">
          <template #content>
            <p>
              ●
              该时间实体抽取依赖<b>规则</b>，而不依赖模型，故存在一些<b>假阳、假阴</b>的错误。例如，“这一点要注意”，其中“<b>一点</b>”会被抽取为时间。
            </p>
            <p>
              ● 若想要时间短语更详细信息，请使用<b>时间语义解析</b>
              单独解析时间实体。
            </p>
            <p>
              ● 参考文档：
              <a
                href="https://github.com/dongrixinyu/JioNLP/wiki/时间语义解析-说明文档"
                >时间语义解析说明文档</a
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
          <!--div v-else-if=""></div>
          <div v-else-if=""></div-->
          <div style="background: #fff; padding: 10px; padding-bottom: 10px">
            <a-tag color="white">
              <font size="3" color="black"><b>标签说明：</b></font>
            </a-tag>
            <a-tag color="#149ef9">
              <font size="2.5"><b>时间点</b>(time_point)</font>
            </a-tag>
            <a-tag color="#0f6ec9">
              <font size="2.5"><b>时间范围</b>(time_span)</font>
            </a-tag>
            <a-tag color="#57a028">
              <font size="2.5"><b>时间段</b>(time_delta)</font>
            </a-tag>
            <a-tag color="#f14f50">
              <font size="2.5"><b>时间周期</b>(time_period)</font>
            </a-tag>
          </div>
        </div>
        <div v-else-if="response.is_ok == false && first_show == false">
          <a-alert message="解析错误！" type="warning" show-icon />
          <a-card style="width: 100%">
            <p>● 请确保所提交的文本是<b>包含了时间字符串</b> (●'◡'●)</p>
            <p>
              ● 如所提交确实无误，但解析错误，可通过以下 Github
              链接提交报错信息。
            </p>
            <p>
              ●
              <a href="https://github.com/dongrixinyu/JioNLP/issues"
                >提交报错信息</a
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
                  <b> {{ record.time_entity }} </b>
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
    title: "时间实体",
    dataIndex: "time_entity",
    sorter: false,
    width: "25%",
    slots: { customRender: "name" },
  },
  {
    title: "起始时间",
    dataIndex: "offset_start",
    width: "17%",
    key: "offset_start",
  },
  {
    title: "终止时间",
    dataIndex: "offset_end",
    width: "17%",
    key: "offset_end",
  },
  {
    title: "类型",
    dataIndex: "time_type",
    width: "20%",
    key: "time_type",
  },
];

type TimeEntity = {
  key: string;
  time_entity: string;
  offset_start: string;
  offset_end: string;
  time_type: string;
};

const entity_mapping = {
  time_point: '<span class="entity_tag time_point"><b>',
  time_span: '<span class="entity_tag time_span"><b>',
  time_delta: '<span class="entity_tag time_delta"><b>',
  time_period: '<span class="entity_tag time_period"><b>',
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
class ExtractTime extends Vue {
  text =
    "据央视新闻消息，10月12日，福建省莆田市政府召开疫情防控情况新闻发布会，介绍最新情况。据通报，从本月10日至12日16时，大约两天时间内，累计报告新冠病毒核酸阳性64例，平均每日新增病例30例，其中确诊病例32例、无症状感染者32例。";

  rendered_text = "";
  new_string_end = entity_mapping["end_map"];

  first_show = true;
  response = { is_ok: false, detail: Array<TimeEntity>() };
  table_columns = table_columns;
  // entity_mapping = entity_mapping;
  $router = router;
  meta = setup(() => useMeta({ title: "时间实体抽取与解析 | 在线测试" }));

  mounted() {
    //console.log("ParseLocation mounted!");
  }
  send() {
    let { random_int, hash_code } = authentication_hash_code(this.text);
    jio_backend({
      url: "/jio_api/extract_time",
      data: {
        text: this.text,
        reverse_ret: true,
        random_num: random_int,
        hash_code: hash_code,
      },
    })
      .then((response) => {
        //console.log("response");
        // console.log(response);
        this.first_show = false;
        this.response.is_ok = response.data.is_ok;
        this.response.detail = Array<TimeEntity>();

        // console.log(response.data.detail);
        // add entity to rendered_text
        this.rendered_text = this.text;

        let i;
        for (i in response.data.detail) {
          let time_type: string;
          let start_idx: number;
          let end_idx: number;
          let new_string_start: string;
          start_idx = response.data.detail[i]["offset"][0];
          end_idx = response.data.detail[i]["offset"][1];

          // console.log(this.new_string_end);

          this.rendered_text = insertString(
            this.rendered_text,
            end_idx,
            this.new_string_end
          );

          // time_type = JSON.stringify(response.data.detail[i]["type"]);
          time_type = response.data.detail[i]["type"];
          new_string_start = (entity_mapping as any)[time_type];
          // new_string_start = "23";
          this.rendered_text = insertString(
            this.rendered_text,
            start_idx,
            new_string_start
          );
        }
        // console.log("rendered_text");
        console.log(this.rendered_text);

        // 后处理换行号，加线号等
        this.rendered_text = this.rendered_text.replace(/\n/g, "</p><p>");

        // 开头、末尾添加标签
        this.rendered_text =
          "<HR SIZE=10><p>" + this.rendered_text + "</p><HR SIZE=10>";

        console.log(this.rendered_text);
        let insertion_html: HTMLElement;
        const temp = document.getElementById("insertion_html");
        // console.log(temp);
        if (temp) {
          insertion_html = temp;
        } else {
          throw new TypeError("the insertion_html element does not exist.");
        }

        insertion_html.innerHTML = this.rendered_text;

        for (i in response.data.detail) {
          let time_type: string;
          if (response.data.detail[i]["type"] == "time_point") {
            time_type = "时间点(time_point)";
          } else if (response.data.detail[i]["type"] == "time_span") {
            time_type = "时间范围(time_span)";
          } else if (response.data.detail[i]["type"] == "time_delta") {
            time_type = "时间段(长度)(time_delta)";
          } else if (response.data.detail[i]["type"] == "time_period") {
            time_type = "时间周期(time_period)";
          } else {
            time_type = response.data.detail[i]["type"];
          }
          this.response.detail.push({
            key: i.toString(),
            time_entity: response.data.detail[i]["text"],
            offset_start: response.data.detail[i]["detail"]["time"][0],
            offset_end: response.data.detail[i]["detail"]["time"][1],
            time_type: time_type,
          });
        }
        this.response.detail.reverse();
      })
      .catch(() => {
        this.first_show = false;
        this.response.is_ok = false;
      });
  }
}

export default ExtractTime;
</script>

<style lang="less">
//scoped
textarea {
  width: 100%;
  height: 140px;
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
  // background-color: rgb(20, 158, 249);
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  opacity: 1;
  transition: all 0.3s;
}

.entity_tag.time_point {
  background-color: rgb(20, 158, 249);
}

.entity_tag.time_span {
  background-color: rgb(15, 110, 201);
}

.entity_tag.time_delta {
  background-color: rgb(87, 160, 40);
}

.entity_tag.time_period {
  background-color: rgb(241, 79, 80);
}
</style>
