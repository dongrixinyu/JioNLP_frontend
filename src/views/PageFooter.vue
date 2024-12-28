<template>
  <div>
    <Notification />
    <a-layout-footer style="text-align: center">
      <p><b>JioNLP </b> ©2021 Created by 山追言成</p>
      <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener">
        <b>备案号：蜀ICP备2022016557号&emsp;</b>
      </a>
      <a
        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=51011202000541"
        target="_blank"
        rel="noopener"
      >
        <b>公安备案号：51011202000541</b>
      </a>
    </a-layout-footer>
  </div>
</template>

<script>
import { defineComponent } from "vue";
// import Notification from "@/views/Notification.vue";

export default defineComponent({
  // components: { Notification },
});
</script>

<style>
#components-layout-demo-top-side-2 .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side-2 .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}
</style>
