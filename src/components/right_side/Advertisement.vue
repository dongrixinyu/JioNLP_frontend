<template>
  <div id="advertisement">

    <a :href="this.advertisement_url_link">
      <img
        class="ad-image"
        alt=""
        :src="this.advertisement_image_path"
      />
    </a>

  </div>
</template>

<script>
import { blog_backend } from "@/utils/request";
import authentication_hash_code from "@/utils/authentication";

export default {
  name: "Advertisement",
  props: {},
  components: {},
  
  data() {
    return {
      advertisement_image_path: "",
      advertisement_url_link: "",
    };
  },

  created() {
    let { random_int, hash_code } = authentication_hash_code("");
    let attemptCount = 0; // 初始化尝试次数计数器
    const MAX_ATTEMPTS = 3; // 设置最大尝试次数

    console.log("[Advertisement][created]");
    const attemptRequest = () => {
      if (attemptCount >= MAX_ATTEMPTS) {
        this.advertisement_image_path = "";

        console.log("[Advertisement] Maximum attempts reached.");
        return; // 如果已达到最大尝试次数，则不再继续重试
      };

      blog_backend({
        url: "/trivials/get_advertisement",
        data: {
          random_num: random_int,
          hash_code: hash_code,
        }
      })
      .then((response) => {
        if (response.data.is_ok) {
          this.advertisement_image_path = response.data.detail["image_path"];
          this.advertisement_url_link = response.data.detail["url_link"];
          console.log("[Advertisement][created]", response.data.detail);

        } else {
          attemptCount++; // 增加尝试次数
          console.log(`[Advertisement] Retrying... Attempt ${attemptCount + 1}`);
          attemptRequest();
        }
      })
      .catch(() => {
        attemptCount++; // 增加尝试次数
        console.log(`[Advertisement] Retrying... Attempt ${attemptCount + 1}`);
        attemptRequest();
      });
    };

    attemptRequest();
  },

};
</script>

<style lang="less" scoped>
.ad-image {
  font-weight: bold;
  width: 190px;
  // margin: 15px auto;
  margin-bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

#advertisement {
  margin-bottom: 15px;
  padding: 12px 10px;
  background-color: #FFFFFF;
}
</style>
