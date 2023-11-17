<template>
  <div class="container">
    <div class="header">
      <div class="logo">dcm-Viewer</div>
      <Tools class="tools"></Tools>
      <Setting></Setting>
    </div>
    <div class="main">
      <!-- <div class="sider">
        <Sider @addViewer="handleAddViewer"></Sider>
      </div> -->
      <div class="view">
        <Viewer></Viewer>
      </div>
    </div>
  </div>
</template>
<script setup>
import Tools from "@/components/Tools";
import Setting from "@/components/Setting";
import Sider from "@/components/Sider";
import Viewer from "@/components/Viewer";
import { ref } from "vue";
const viewerList = ref([
  {
    id: 0,
    ref: "view0",
  },
]);
const handleAddViewer = () => {
  viewerList.value.push({
    id: viewerList.value.length,
    ref: "view" + viewerList.value.length,
  });
};
</script>

<style lang="scss" scoped>
.container {
  --color-theme: #691d2d;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f6f7;
  .header {
    width: 100%;
    height: 64px;
    display: flex;
    background-color: var(--color-theme);
    .logo {
      font-size: 36px;
      color: #fff;
      line-height: 64px;
      padding: 0 10px;
    }
    .tools {
      flex: 1;
    }
  }
  .main {
    width: 100%;
    height: 0;
    flex-grow: 1;
    flex-shrink: 0;
    display: flex;
    .sider {
      width: 240px;
      height: 100%;
      overflow: hidden;
      // background-color: red;
    }
    .view {
      width: 0;
      height: 100%;
      flex-grow: 1;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      // background-color: yellowgreen;
    }
  }
}
</style>
