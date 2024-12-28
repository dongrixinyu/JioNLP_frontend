<template>
  <a-layout style="padding: 0 24px 24px; width: 700px">
    <a-breadcrumb style="margin: 16px 0" :routes="$router">
      <a-breadcrumb-item>
        <router-link to="/">
          <home-outlined />
        </router-link>
      </a-breadcrumb-item>
      <a-breadcrumb-item>
        <router-link to="/jionlp_online"> NLP 在线解析 </router-link>
      </a-breadcrumb-item>
      <a-breadcrumb-item>时间语义解析</a-breadcrumb-item>
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
        <h2><b>时间语义解析</b></h2>
        <p>给定时间短语，解析其表达的时间语义。</p>
        <a-popover title="" trigger="hover">
          <template #content>
            <p>
              ● 该工具需要配合
              <b>时间实体抽取</b
              >，从文本中抽取到时间实体，进而对每一个时间实体短语做语义解析。
            </p>
            <p>
              ●
              根据多个语料集的测试，该功能的准确率大致在91%~96%之间，并会进一步优化和维护。
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
        style="display: inline-block; margin-left: auto; margin-right: auto; width: 100%;">
      </textarea>
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

      <a-layout style="display: block; width: 100%">
        <div v-if="response.is_ok == true && first_show == false">
          <div v-if="time_type == 'time_point' || time_type == 'time_span'">
            <a-descriptions bordered title="" :column="{}">
              <a-descriptions-item
                label="时间类型"
                span="3"
                style="width: 105px"
                ><b>{{ time_type }}</b>
              </a-descriptions-item>
              <a-descriptions-item label="时间精度" span="3"
                ><b>{{ time_definition }}</b></a-descriptions-item
              >

              <a-descriptions-item
                label="起始时间"
                span="3"
                style="width: 105px"
                ><b>{{ response.detail.time[0] }}</b>
              </a-descriptions-item>
              <a-descriptions-item label="终止时间" span="3"
                ><b>{{ response.detail.time[1] }}</b></a-descriptions-item
              >
            </a-descriptions>
          </div>

          <div v-else-if="time_type == 'time_delta'">
            <a-descriptions bordered title="" :column="{}">
              <a-descriptions-item
                label="时间类型"
                span="3"
                style="width: 105px"
                ><b>{{ time_type }}</b>
              </a-descriptions-item>
              <a-descriptions-item label="时间精度" span="3"
                ><b>{{ time_definition }}</b></a-descriptions-item
              >

              <a-descriptions-item
                v-if="response.detail.time.year"
                label="年数"
                span="1"
                style="width: 105px"
                ><b>{{ response.detail.time.year }}</b></a-descriptions-item
              >
              <a-descriptions-item
                v-if="response.detail.time.month"
                label="月数"
                span="1"
                style="width: 105px"
                ><b>{{ response.detail.time.month }}</b></a-descriptions-item
              >
              <a-descriptions-item
                v-if="response.detail.time.day"
                label="天数"
                span="1"
                style="width: 105px"
                ><b>{{ response.detail.time.day }}</b></a-descriptions-item
              >
              <a-descriptions-item
                v-if="response.detail.time.hour"
                label="小时数"
                span="1"
                style="width: 105px"
                ><b>{{ response.detail.time.hour }}</b></a-descriptions-item
              >
              <a-descriptions-item
                v-if="response.detail.time.minute"
                label="分钟数"
                span="1"
                style="width: 105px"
                ><b>{{ response.detail.time.minute }}</b></a-descriptions-item
              >
              <a-descriptions-item
                v-if="response.detail.time.second"
                label="秒钟数"
                span="1"
                style="width: 105px"
                ><b>{{ response.detail.time.second }}</b></a-descriptions-item
              >
            </a-descriptions>
          </div>
          <div v-else-if="time_type == 'time_period'">
            <a-descriptions bordered title="" :column="{}">
              <a-descriptions-item
                label="时间类型"
                span="3"
                style="width: 105px"
                ><b>{{ time_type }}</b>
              </a-descriptions-item>
              <a-descriptions-item label="时间精度" span="3"
                ><b>{{ time_definition }}</b></a-descriptions-item
              >

              <a-descriptions-item label="时间周期" span="3"
                ><b></b
              ></a-descriptions-item>

              <a-descriptions-item
                v-if="response.detail.time.delta.year"
                label="年"
                span="3"
                style="width: 105px"
                ><b>{{
                  response.detail.time.delta.year
                }}</b></a-descriptions-item
              >
              <a-descriptions-item
                v-if="response.detail.time.delta.month"
                label="月"
                span="3"
                style="width: 105px"
                ><b>{{
                  response.detail.time.delta.month
                }}</b></a-descriptions-item
              >
              <a-descriptions-item
                v-if="response.detail.time.delta.day"
                label="天"
                span="3"
                style="width: 105px"
                ><b>{{
                  response.detail.time.delta.day
                }}</b></a-descriptions-item
              >
              <a-descriptions-item
                v-if="response.detail.time.delta.hour"
                label="小时"
                span="3"
                style="width: 105px"
                ><b>{{
                  response.detail.time.delta.hour
                }}</b></a-descriptions-item
              >
              <a-descriptions-item
                v-if="response.detail.time.delta.minute"
                label="分钟"
                span="3"
                style="width: 105px"
              >
                <b>{{
                  response.detail.time.delta.minute
                }}</b></a-descriptions-item
              >
              <a-descriptions-item
                v-if="response.detail.time.delta.second"
                label="秒钟"
                span="3"
                style="width: 105px"
              >
                <b>{{
                  response.detail.time.delta.second
                }}</b></a-descriptions-item
              >
              <a-descriptions-item
                v-if="response.detail.time.point != null"
                label="示例-起始时间"
                span="3"
                style="width: 105px"
                ><b>{{
                  response.detail.time.point.time[0]
                }}</b></a-descriptions-item
              >
              <a-descriptions-item
                v-if="response.detail.time.point != null"
                label="示例-终止时间"
                span="3"
                style="width: 105px"
                ><b>{{
                  response.detail.time.point.time[1]
                }}</b></a-descriptions-item
              >
            </a-descriptions>
          </div>
          <!--div v-else-if=""></div>
          <div v-else-if=""></div-->
        </div>
        <div v-else-if="response.is_ok == false && first_show == false">
          <a-alert message="解析错误！" type="warning" show-icon />
          <a-card style="width: 100%">
            <p>● 请确保所提交的文本是<b>时间字符串</b> (●'◡'●)</p>
            <p>
              ● 如所提交确实是时间字符串，但解析错误，可通过以下 Github
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
class ParseTime extends Vue {
  text = "零三年元宵节晚上8点半";

  first_show = true;
  response = { is_ok: false, detail: {} };
  time_type = "time_point";
  time_definition = "accurate";
  $router = router;
  meta = setup(() => useMeta({ title: '时间语义解析 | 在线测试' }));

  mounted() {
    // console.log("ParseTime mounted!");
  }
  send() {
    let { random_int, hash_code } = authentication_hash_code(this.text);
    jio_backend({
      url: "/jio_api/parse_time",
      data: {
        text: this.text,
        hash_code: hash_code,
        random_num: random_int,
      },
    })
      .then((response) => {
        // console.log("response");
        this.first_show = false;
        this.response.is_ok = response.data.is_ok;
        this.response.detail = response.data.detail;
        this.time_type = response.data.detail.type;
        this.time_definition = response.data.detail.definition;
      })
      .catch((error) => {
        // console.log(error);
        this.first_show = false;
        this.response.is_ok = false;
      });
  }
}

export default ParseTime;
</script>

<style lang="less" scoped>
textarea {
  width: 100%;
  height: 80px;
  margin: 20px;
}

.ant-layout-content {
  width: 100%;
}
</style>
