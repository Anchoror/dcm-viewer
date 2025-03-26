<template>
  <div class="viewer-container">
    <div
      v-for="item in appStore.viewList"
      :key="item.id"
      class="dcm-viewer"
      :class="{ actived: activedViewer == item.id }"
      @click="handleActive(item.id)">
      <div class="viewer-img" ref="viewer"></div>
      <div v-if="!item.dcmList?.length" class="input-file">
        <input
          type="file"
          id="selectFile"
          @change="getFileData($event, item.id)"
          multiple />
      </div>
      <div class="voi-data" v-if="item.dcmList?.length">
        W : {{ item.WW }}, L :
        {{ item.WC }}
      </div>
      <div class="stack-data" v-if="item.dcmList?.length" @click="handleClick">
        I : {{ item.currentIndex || 0 }} / {{ item.dcmList.length }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref, onMounted, getCurrentInstance } from "vue";
import { useAppStore } from "@/stores";
import cornerstone from "cornerstone-core";
import cornerstoneTools from "cornerstone-tools";
const appStore = useAppStore();
const { proxy } = getCurrentInstance();
// const dcmList = appStore.dcmList;

// const viewer1 = ref(null);
const viewerPort = ref(null);
// const currentIndex1 = ref(0);

const activedViewer = ref(null); //当前激活的窗口
// const voi = ref(null); //窗宽和窗位

const handleActive = (id) => {
  // console.log("handleactive");
  activedViewer.value = id;

  // console.log(proxy.$refs);
  appStore.setActivedViewer(
    proxy.$refs.viewer ? proxy.$refs.viewer[id] : null,
    id
  );
};

const initViewer = async (id) => {
  // appStore.mockList(); //测试本地数据

  //初始化操作
  appStore.initTools();
  // console.log(proxy.$refs.viewer[id]);

  // 窗口1
  await appStore.loadImage(proxy.$refs.viewer[id]);
  viewerPort.value = appStore.getViewport(proxy.$refs.viewer[id]);
  // console.log(appStore.stack.currentImageIdIndex);

  proxy.$refs.viewer[id].addEventListener(
    cornerstoneTools.EVENTS.STACK_SCROLL,
    (event) => {
      const currentIndex = cornerstoneTools.getToolState(
        proxy.$refs.viewer[id],
        "stack"
      ).data[0].currentImageIdIndex;
      // console.log(currentIndex);
      appStore.setCurrentIndex(currentIndex, id);
    }
  );
  proxy.$refs.viewer[id].addEventListener(
    cornerstone.EVENTS.IMAGE_RENDERED,
    (event) => {
      // 获取窗口宽度和窗口中心
      const viewerPort = cornerstone.getViewport(proxy.$refs.viewer[id]);
      appStore.setWC(viewerPort?.voi?.windowCenter, id);
      appStore.setWW(viewerPort?.voi?.windowWidth, id);
      // appStore.setViewport(viewerPort, id);
    }
  );

  nextTick(() => {
    activedViewer.value = id;
    appStore.setActivedViewer(proxy.$refs.viewer[id], id);
  });
};

const getFileData = async (e, id) => {
  console.log(e.target.files);
  // console.log(proxy.$refs.viewer);
  if (
    e.target.files.length &&
    Array.from(e.target.files).some((item) => item.name.indexOf(".dcm") == -1)
  ) {
    alert("请上传 dcm 文件");
    return;
  }
  await appStore.setDcmList(e.target.files, id);
  initViewer(id);
};
onMounted(async () => {
  // initViewer();

  // 使用 import.meta.glob 获取本地 assets/dcmImg/* 文件
  const files = import.meta.glob("@/assets/dcmImg/*.dcm", { as: "url" });

  // 获取文件 URL 列表
  const fileList = [];
  await Promise.all(
    Object.values(files).map(async (file) => {
      const url = await file();
      const response = await fetch(url);
      const blob = await response.blob();

      fileList.push(
        new File([blob], url.split("/").pop(), {
          type: "application/dicom",
        })
      );
    })
  ).then(async (res) => {
    // 调用 getFileData 方法处理文件
    alert("加载测试数据。。。");
    getFileData({ target: { files: fileList } }, 0);
  });
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
.input-file {
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
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
