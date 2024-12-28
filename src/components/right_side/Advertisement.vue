<template>
  <div id="advertisement">
    <a-col :span="8.5" >
      <a-card hoverable style="width: 226px" type="inner">
        <template #cover>
          <img
            class="ad-image"
            alt="Benice安睡饮，助您安稳入眠"
            src="@/assets/advertisement/benice_sleeping_beverage.jpg"
          />
        </template>
        <a-card-meta
          title="【Benice六黑固元饮】"
          style="font-weight: bold; font-size: 14px; text-align: center; height: 20px; color: #444444"
        >
        </a-card-meta>
      </a-card>
    </a-col>

  </div>
</template>

<script>
export default {
  name: "Advertisement",
  props: {},
  components: {},

};
</script>

<style lang="less" scoped>
.ad-image {
  font-weight: bold;
  width: 200px;
  height: 350px;
  margin: 15px auto;
  margin-bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

#advertisement {
    margin-bottom: 15px;
}
</style>
