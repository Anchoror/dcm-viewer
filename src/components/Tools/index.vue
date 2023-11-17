<template>
  <div class="dcm-tools">
    <div class="tools-row" v-for="(toolsRow, index) in toolList" :key="index">
      <div class="title">{{ toolsRow.name }}：</div>
      <div class="sorry" v-if="toolsRow.type === 'Reference'">（施工ing）</div>
      <template class="tools" v-else>
        <div
          class="tool"
          :class="{ actived: item.actived }"
          :title="item.desc || item.name"
          :key="index"
          v-for="(item, index) in toolsRow.tools"
          @click="handleClick(item)">
          <SvgIcon :name="item.icon || item.name" :size="20"></SvgIcon>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from "@/stores";
const appStore = useAppStore();

const toolList = appStore.toolList;

const handleClick = (item) => {
  appStore.activeTools(item.name);
};
</script>

<style lang="scss" scoped>
.dcm-tools {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  .tools-row {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 32px;
    .title {
      margin-right: 10px;
      color: #fff;
    }
    .sorry {
      font-size: 14px;
      color: #fff;
    }
    .tools {
      display: flex;
    }
    .tool {
      width: 30px;
      height: 30px;
      margin-right: 10px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      &.actived {
        background-color: #ea93a5;
        border-radius: 10px;
        .bx {
          color: #26060d;
        }
      }
      &:hover {
        background-color: #ea93a5;
        border-radius: 10px;
      }
    }
  }
}
</style>
