<template>
  <div id="notification_wrapper" v-show="isShow">
    <h4>
      &emsp;
      <info-circle-outlined />
      公告&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
      <button class="notification_close" @click="close_notification">
        <close-circle-outlined />
      </button>
    </h4>
    <div class="notification_content">
      <h5>&emsp;</h5>
      <h5>🐳 扫码回复【进群】🐳</h5>
      <h5>🍀 加入自然语言处理交流群 🍀</h5>
      <h5>🍓 扫码回复【下载】🍓</h5>
      <h5>🐤 下载算法课件与数据集 🐤</h5>
      <h5>&emsp;</h5>
      <img
        class="qr_code_for_gh"
        src="@/assets/WeChat_Public_Accounts_qr_code.jpg"
        alt="Github"
      />
      <h5>公众号：JioNLP</h5>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
// import { notification } from 'ant-design-vue';

import { InfoCircleOutlined, CloseCircleOutlined } from "@ant-design/icons-vue";

@Options({
  components: {
    InfoCircleOutlined,
    CloseCircleOutlined,
  },
})
class Notification extends Vue {
  isShow = true;
  close_notification() {
    this.isShow = false;
  }
}

export default Notification;
</script>

<style lang="less">
#notification_wrapper {
  position: fixed;
  bottom: 0px;
  top: 104px;
  right: 10px;
  z-index: 19;
  width: 226px;
  box-sizing: border-box;
  border: 4px solid #00b2f6;
  border-radius: 0.25rem;
  // background: var;
  background-color: #181818;
  color: white;
  text-align: center;
}

@media screen and (max-width: 800px) {
  #notification_wrapper {
    display: none;
  }
}

.qr_code_for_gh {
  width: 196px;
  height: 196px;
  margin-bottom: 10px;
}

.notification_close {
  background: none;
  // border-color: #0074af;;
  border: none;
  // text-align: right;
  // align-items: right;
}

h4 {
  font-size: 16px;
  text-align: left;
  color: white;
  background-color: #00b2f6;
  border: none;
}

h5 {
  color: white;
}
</style>
>
