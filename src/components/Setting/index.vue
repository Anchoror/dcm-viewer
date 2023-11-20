<template>
  <div class="setting">
    <div class="setting-item" title="新增窗口">
      <div class="icon" @click="addViewer">
        <SvgIcon name="窗口" :size="30"></SvgIcon>
      </div>
    </div>
    <a
      class="setting-item"
      title="项目地址"
      href="https://github.com/Anchoror/dcm-viewer">
      <SvgIcon name="github" :size="30"></SvgIcon>
    </a>
  </div>
</template>

<script setup>
import { useAppStore } from "@/stores";
const appStore = useAppStore();

const addViewer = () => {
  appStore.addViewer(1);
};
</script>

<style lang="scss" scoped>
.setting {
  // margin: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  .setting-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #fff;
    text-decoration: underline;
    // padding: 5px 0;
    width: 40px;
    cursor: pointer;
    &:active,
    &:hover {
      background-color: #ea93a5;
    }
  }
}
</style>
