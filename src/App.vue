<template>
  <div>
    <!-- <h2>Minio配置信息</h2> -->
    <!-- <UploadFile/> -->
    <!-- <MinioConfig/> -->
    <RouterLink replace to="/config" active-class="active">配置信息   </RouterLink>   
    <RouterLink replace to="/uploadfile" active-class="active">上传文件</RouterLink>
    <!-- 展示区 -->
    <div class="main-content">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script lang="ts" setup name="APP">
    import {RouterView,RouterLink} from 'vue-router'
  import UploadFile from './components/UploadFile.vue';
  import MinioConfig from './components/MinioConfig.vue';
</script>

<style scoped>
  .main-content {
    margin: 0 auto;
    margin-top: 20px;
    /* border-radius: 10px; */
    /* border: 1px solid; */
  }
</style>

