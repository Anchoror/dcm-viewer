<template>
  <div class="viewer-container">
    <div
      class="dcm-viewer"
      :class="{ actived: activedViewer == 1 }"
      @click.prevent="handleActive(1)">
      <div class="viewer-img" ref="viewer1"></div>
      <div class="voi-data">
        W : {{ viewer1Port?.voi?.windowWidth }}, L :
        {{ viewer1Port?.voi?.windowCenter }}
      </div>
      <div class="stack-data" @click="handleClick">
        I : {{ currentIndex1 || 0 }} / {{ appStore.dcmList.length }}
      </div>
    </div>
    <!--    <div
      class="dcm-viewer"
      :class="{ actived: activedViewer == 2 }"
      @click.prevent="handleActive(2)">
      <div class="viewer-img" ref="viewer2"></div>
      <div class="voi-data">
        W : {{ viewer2Port?.voi?.windowWidth }}, L :
        {{ viewer2Port?.voi?.windowCenter }}
      </div>
      <div class="stack-data" @click="handleClick">
        I : {{ currentIndex2 || 0 }} / {{ appStore.dcmList.length }}
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { nextTick, ref, onMounted } from "vue";
import { useAppStore } from "@/stores";
import cornerstone from "cornerstone-core";
import cornerstoneTools from "cornerstone-tools";
const appStore = useAppStore();

const viewer1 = ref(null);
const viewer1Port = ref(null);
const currentIndex1 = ref(0);

const viewer2 = ref(null);
const viewer2Port = ref(null);
const currentIndex2 = ref(0);

const activedViewer = ref(null); //当前激活的窗口
// const voi = ref(null); //窗宽和窗位

const handleActive = (flag) => {
  // console.log(item);
  activedViewer.value = flag;
  if (flag == 1) {
    appStore.setActivedViewer(viewer1.value);
  } else if (flag == 2) {
    appStore.setActivedViewer(viewer2.value);
  }
};

const initViewer = async () => {
  appStore.mockList(); //测试本地数据

  //初始化操作
  appStore.initTools();

  // 窗口1
  await appStore.loadImage(viewer1.value);
  viewer1Port.value = appStore.getViewport(viewer1.value);
  // console.log(appStore.stack.currentImageIdIndex);

  viewer1.value.addEventListener(
    cornerstoneTools.EVENTS.STACK_SCROLL,
    (event) => {
      currentIndex1.value = cornerstoneTools.getToolState(
        viewer1.value,
        "stack"
      ).data[0].currentImageIdIndex;
    }
  );
  viewer1.value.addEventListener(cornerstone.EVENTS.IMAGE_RENDERED, (event) => {
    // 获取窗口宽度和窗口中心
    viewer1Port.value = cornerstone.getViewport(viewer1.value);
  });

  // 窗口2
  // await appStore.loadImage(viewer2.value);
  // viewer2Port.value = appStore.getViewport(viewer2.value);
  // // console.log(appStore.stack.currentImageIdIndex);

  // viewer2.value.addEventListener(
  //   cornerstoneTools.EVENTS.STACK_SCROLL,
  //   (event) => {
  //     currentIndex2.value = cornerstoneTools.getToolState(
  //       viewer2.value,
  //       "stack"
  //     ).data[0].currentImageIdIndex;
  //   }
  // );
  // viewer2.value.addEventListener(cornerstone.EVENTS.IMAGE_RENDERED, (event) => {
  //   // 获取窗口宽度和窗口中心
  //   viewer2Port.value = cornerstone.getViewport(viewer2.value);
  // });

  // 启用同步器
  // appStore.setSynchronizer(viewer1.value, viewer2.value);

  nextTick(() => {
    activedViewer.value = 1;
    appStore.setActivedViewer(viewer1.value);
  });
};
onMounted(() => {
  initViewer();
});
</script>

<style lang="scss" scoped>
.viewer-container {
  width: 100%;
  height: 100%;
  display: flex;
}
.dcm-viewer {
  width: 0;
  flex: 1;
  height: 98%;
  // background-color: #000;
  border-radius: 10px;
  // border: 2px solid #fff;
  &.actived {
    border: 2px solid var(--color-theme);
  }
  // padding: 10px;
  margin: 4px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  .viewer-img {
    width: 99%;
    height: 98%;
  }
}
.voi-data {
  position: absolute;
  top: 20px;
  left: 30px;
  color: #fff;
  font-size: 18px;
}

.stack-data {
  position: absolute;
  top: 20px;
  right: 30px;
  color: #fff;
  font-size: 18px;
}
</style>
