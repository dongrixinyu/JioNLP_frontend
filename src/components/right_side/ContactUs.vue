<template>
  <div id="contact-us">
    <p class="right-side-header">关于站长</p>
    <div style="display: flex; justify-content: center; align-items: center;">
      <img
        class="contact-image"
        alt="站长头像"
        width="75"
        height="75"
        src="@/assets/jionlp_profile.jpg"
      />
    </div>

    <p class="contact-us-description"><b>崔诚煜</b>、网名<b>山追言成/冬日新雨</b>，JioNLP、jiojio、ffio
开源软件作者，喜欢【程序、AI、数学、机器人、小说、跳舞机、养花】，目前在成都</p>
    <router-link to="/blog/杂文/20240101" class="contact-us-description">关于我的经历</router-link>
    <p class="contact-us-description">
      <b>邮箱</b>：dongrixinyu.66@gmail.com<br>
      <b>微信</b>：shanzhuiyancheng<br>
      <b>B站</b>：<a class="contact-link" href="https://space.bilibili.com/248611999">山追言成</a><br>
      <b>知乎</b>：<a class="contact-link" href="https://www.zhihu.com/people/shan-zhui-yan-cheng-10">JioNLP</a><br>
      <b>公众号</b>：JioNLP<br>
      
    </p>
    <div style="display: flex; justify-content: center; align-items: center;">
      <img src="@/assets/WeChat_Public_Accounts_qr_code.jpg" width="100" height="100" alt="公众号">
    </div>

  </div>
</template>

<script>
// import { useMeta } from "vue-meta";
/* eslint-disable */
import router from "../../router/index";

export default {
    name: 'ContactUs',

    components: {
        // HomeOutlined,
    },
    // setup() {
    //     useMeta({ title: '联系我们' })
    // },
    data() {
        return {
            $router: router,
        }
    },

}
</script>

<style lang="less" scoped>
#contact-us {
  padding: 10px;
  padding-left: 0;
  position: relative;
  margin-bottom: 15px;
  background-color: #FFFFFF;
}

#contact-us > .right-side-header {
  font-weight: bolder;
  font-size: 16px;
  color: #92D050;
  margin-left: 20px;
}

.contact-image {
  border-radius: 20%
}

.contact-link {
  color: #333333;
}

.contact-link:hover {
  color: #92D050;
}

.contact-us-description {
  font-size: 12px;
  padding-left: 18px;
  padding-top: 12px;
  color: #444444;
}

@media screen and (max-width: 800px) {
  #contact-us {
    display: none;
  }
}
</style>
