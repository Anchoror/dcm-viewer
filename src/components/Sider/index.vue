<template>
  <div class="dcm-list">
    <div class="handler">
      <button @click="addViewer">新增窗口</button>
    </div>
    <div
      class="item"
      :class="{ actived: item.actived }"
      :key="item"
      v-for="item in dcmList"
      @click="handleClick(item.id)">
      {{ item.name }}
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from "@/stores";
const appStore = useAppStore();

const dcmList = appStore.dcmList;

const handleClick = (id) => {
  appStore.setView(id);
};
</script>

<style lang="scss" scoped>
.dcm-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  .handler {
    text-align: left;
    padding: 10px 20px;
  }
  .item {
    text-align: left;
    padding: 10px 20px;
    cursor: pointer;
    &.actived {
      background-color: var(--color-theme);
      color: #fff;
      border-radius: 10px;
    }
  }
}
</style>
