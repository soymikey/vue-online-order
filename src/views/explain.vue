<template>
  <div class="fillcontain">
    <head-top></head-top>
    <p class="explain_text">后台管理系统</p>
    <p class="explain_text">不爱折腾的前端不是好前端</p>
    <p class="explain_text">qq：335829832 欢迎交流 共同进步</p>


  </div>
</template>

<script>
import headTop from "@/components/adminComponent/headTop";
export default {
  components: {
    headTop
  }
};
</script>

<style lang="scss">
@import "../style/mixin";
.explain_text {
  margin-top: 20px;
  text-align: center;
  font-size: 20px;
  color: #333;
}
</style>
