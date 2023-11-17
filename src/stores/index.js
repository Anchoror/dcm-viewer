import { createPinia, defineStore } from "pinia";
import { ref } from "vue";
import cornerstone from "cornerstone-core";
import dicomParser from "dicom-parser/dist/dicomParser.min";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import cornerstoneTools from "cornerstone-tools";
import cornerstoneMath from "cornerstone-math";
import Hammer from "hammerjs";

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;

const formatNum = (num) => {
  const string = num + "";
  if (string.length < 6) {
    const distance = 5 - string.length;
    const prefixZero = new Array(distance).fill("0").join("");
    return prefixZero + num;
  }
  return num;
};

export const useAppStore = defineStore("app", () => {
  const dcmList = ref([]);
  const toolList = ref([
    {
      type: "BaseView",
      name: "基本操作",
      tools: [
        {
          name: "水平翻转",
          actived: false,
          action: (viewport) => {
            viewport.hflip = !viewport.hflip;
          },
        },
        {
          name: "垂直翻转",
          actived: false,
          action: (viewport) => {
            viewport.vflip = !viewport.vflip;
          },
        },
        {
          name: "反色",
          actived: false,
          action: (viewport) => {
            viewport.invert = !viewport.invert;
          },
        },
        {
          name: "0.5x缩放",
          actived: false,
          icon: "缩放",
          action: (viewport) => {
            viewport.scale = viewport.scale * 0.5;
          },
        },
        {
          name: "2x放大",
          actived: false,
          icon: "放大",
          action: (viewport) => {
            viewport.scale = viewport.scale * 2;
          },
        },
        {
          name: "顺时针90旋转",
          actived: false,
          action: (viewport) => {
            viewport.rotation = viewport.rotation + 90;
          },
        },
        {
          name: "逆时针90旋转",
          actived: false,
          action: (viewport) => {
            viewport.rotation = viewport.rotation - 90;
          },
        },
        {
          name: "图像重置",
          icon: "reset",
          actived: false,
          action: () => {
            cornerstone.reset(viewContainer.value);
            setViewport();
          },
        },
      ],
    },
    {
      type: "BaseTool",
      name: "基本工具",
      tools: [
        {
          name: "Wwwc",
          actived: false,
          desc: "调窗",
          icon: "调窗",
          configuration: {
            orientation: 0, // 0：窗宽横向调整、窗位纵向调整；1：窗宽纵向调整、窗位横向调整
          },
          mouseButtonMask: 1,
        },
        {
          name: "Pan",
          actived: false,
          desc: "移动",
          icon: "移动",
          configuration: {},
          mouseButtonMask: 1,
        },

        {
          name: "Zoom",
          actived: false,
          desc: "放大缩小",
          icon: "搜索",
          configuration: {
            invert: false, //放大缩小方向相反  true 反方向   false正方向
            preventZoomOutsideImage: false, //暂时不知干啥用
            minScale: 0, //最小缩放值  默认 0.25
            maxScale: 20.0, //最大缩放值
          },
          mouseButtonMask: 1,
        },
        {
          name: "Magnify",
          actived: false,
          desc: "放大镜",
          icon: "放大镜",
          configuration: {
            magnifySize: 100, //放大镜大小, 默认是 300
            // magnificationLevel: 2, //方法级别, 默认是2   调用的是 drawImage sx,sy 这两个参数的位置
          },
          mouseButtonMask: 1,
        },
        {
          name: "DragProbe",
          actived: false,
          desc: "探针",
          icon: "目标",
          configuration: {},
          mouseButtonMask: 1,
        },
      ],
    },
    {
      type: "Measure",
      name: "测量工具",
      tools: [
        {
          name: "Length",
          actived: false,
          desc: "长度",
          icon: "ruler",
          configuration: {
            drawHandles: false, //是否显示圆点，移动轨迹
            drawHandlesOnHover: false, //是否显示圆点
            hideHandlesIfMoving: false, //是否显示圆点移动轨迹
            renderDashed: false, //是否虚线渲染
          },
          mouseButtonMask: 1,
        },
        {
          name: "Bidirectional",
          actived: false,
          desc: "双向测量",
          icon: "双向测距",
          configuration: {
            getMeasurementLocationCallback: function (
              measurementData,
              eventData,
              doneCallback
            ) {
              //获取测量位置回调
              return doneCallback();
            },
            changeMeasurementLocationCallback: function (
              measurementData,
              eventData,
              doneCallback
            ) {
              //改变测量位置回调
              return doneCallback();
            },
            textBox: "123", //这里会挂载一个对象，具体用来干啥，暂时不了解
            shadow: "", //如果有值得话会有一个黑色的阴影，暂时改不了,
            drawHandles: false, //是否显示圆点和移动轨迹
            drawHandlesOnHover: false, //是否显示圆点
            hideHandlesIfMoving: false, //是否显示圆点移动轨迹
            renderDashed: false, //是否虚线渲染
            additionalData: [], //暂时没有使用
          },
          mouseButtonMask: 1,
        },
        {
          name: "Angle",
          actived: false,
          desc: "角度测量",
          icon: "角度",
          configuration: {
            drawHandles: false, //是否开启圆点，以及圆点移动轨迹, 当为false时，drawHandlesOnHover和hideHandlesIfMoving无效
            drawHandlesOnHover: false, //是否隐藏圆点
            hideHandlesIfMoving: false, //是否隐藏圆点移动轨迹
            renderDashed: false, //是否渲染实线或虚线
          },
          mouseButtonMask: 1,
        },
        {
          name: "RectangleRoi",
          actived: false,
          desc: "矩形",
          icon: "矩形",
          configuration: {
            drawHandles: false, //是否显示圆点和移动轨迹
            drawHandlesOnHover: false, //是否显示圆点
            hideHandlesIfMoving: false, //是否显示圆点移动轨迹
            renderDashed: false, //是否虚线显示
          },
          mouseButtonMask: 1,
        },
        {
          name: "CircleRoi",
          actived: false,
          desc: "圆形",
          icon: "圆形",
          configuration: {
            renderDashed: false, //是否渲染虚线
            hideHandlesIfMoving: false, //是否显示圆点移动轨迹  true 不显示  false 显示
          },
          mouseButtonMask: 1,
        },
        {
          name: "EllipticalRoi",
          actived: false,
          desc: "椭圆图",
          icon: "椭圆",
          configuration: {
            drawHandlesOnHover: true, //是否显示圆点 好像反了
            hideHandlesIfMoving: false, //是否显示圆点移动轨迹
            renderDashed: false, //是否虚线渲染
          },
          mouseButtonMask: 1,
        },
        {
          name: "ArrowAnnotate",
          actived: false,
          desc: "箭头注释",
          icon: "箭头",
          configuration: {
            getTextCallback: function (cb, eventData) {
              // cb 回调函数     eventData   事件 e.detail数据
              cb(prompt("请输入标注"));
            },
            changeTextCallback: function (data, eventData, cb) {
              /**
               * data   toolState.data
               * eventData  e.detail
               * cb  回调函数
               */
              console.log(data, eventData);
              // console.log(prompt("正在改变标注"));
              cb(prompt("正在改变标注", data.text));
            },
            drawHandlesOnHover: true, //是否显示圆点  好像反了
            hideHandlesIfMoving: true, //是否显示圆点轨迹
            arrowFirst: true, //箭头的方向显示
            renderDashed: false, //是否是虚线显示
            allowEmptyLabel: false, // 是否可以输入空值, 若为空则不渲染
            drawHandles: true, //不显示圆点也不显示圆点移动轨迹
          },
          mouseButtonMask: 1,
        },
        {
          name: "Eraser",
          actived: false,
          desc: "橡皮擦",
          icon: "橡皮",
          configuration: {},
        },
      ],
    },
    {
      type: "Switch",
      name: "图像切换",
      tools: [
        {
          name: "StackScroll",
          actived: false,
          desc: "切换影像-鼠标",
          icon: "上下切换",
          configuration: {
            loop: true, // 是否在序列内循环
            allowSkipping: true, // 是否跳帧
          },
          mouseButtonMask: 1,
        },
        {
          name: "StackScrollMouseWheel",
          actived: false,
          desc: "切换影像-滚轮",
          icon: "选择滚动",
          configuration: {
            loop: true, // 是否在序列内循环
            allowSkipping: true, // 是否跳帧
            invert: false, // 倒转方向
          },
          mouseButtonMask: 4,
        },
      ],
    },
    {
      type: "Reference",
      name: "参考线工具",
      tools: [
        {
          name: "Crosshairs",
          actived: false,
          desc: "十字线",
          icon: "加号",
          configuration: {},
          mouseButtonMask: 1,
        },
      ],
    },
  ]);
  const activedTool = ref({});
  const activedView = ref({});

  const synchronizer = ref({});
  // 启用测试服务器的数据
  const mockList = () => {
    for (let i = 0; i < 360; i++) {
      const imageId = `wadouri:http://127.0.0.1:8080/upload/image-${formatNum(
        i
      )}.dcm`;

      dcmList.value.push({
        id: imageId,
        name: `${formatNum(i)}.dcm`,
        actived: false,
      });
    }
  };

  // 设置dcm影像列表
  const setDcmList = (files) => {
    Array.from(files).forEach((file) => {
      const imageId =
        cornerstoneWADOImageLoader.wadouri.fileManager.add(file);

      dcmList.value.push({
        id: imageId,
        name: `${file.name}.dcm`,
        actived: false,
      });
    });
  };

  // 初始化Tools插件
  const initTools = () => {
    cornerstoneTools.init({
      touchEnabled: false,
      // 显示光标
      showSVGCursors: true,
    });
    cornerstoneTools.toolColors.setToolColor("yellow");
    cornerstoneTools.toolColors.setActiveColor("red");
  };

  // 配置Tools
  const setTools = (element) => {
    // 为启用元素添加 stack 状态管理器
    cornerstoneTools.addStackStateManager(element, ["stack"]);
    const stack = {
      currentImageIdIndex: 0,
      // 需要切换的影像 id 集合
      imageIds: dcmList.value.map((i) => i.id),
    };
    // 为启用元素添加 stack 工具状态
    cornerstoneTools.addToolState(element, "stack", stack);
    // console.log(cornerstoneTools);

    // 添加工具
    toolList.value.forEach((toolsObj) => {
      if (toolsObj.type === "BaseView") {
        toolsObj.tools.forEach((tool) => {
          tool.actived = false;
        });
      }
      if (
        toolsObj.type === "BaseTool" ||
        toolsObj.type === "Measure" ||
        toolsObj.type === "Switch"
      ) {
        toolsObj.tools.forEach((tool) => {
          tool.actived = false;
          cornerstoneTools.addTool(cornerstoneTools[`${tool.name}Tool`], {
            configuration: {
              ...tool.configuration,
              defaultColor: "yellow",
              activeColor: "red",
            },
          });
          // cornerstoneTools[`${tool.name}Tool`].setConfiguration(
          //   tool.configuration
          // );
        });
      }
      if (toolsObj.type === "Reference") {
        // cornerstone.enable(el2);
        // setSynchronizer(element, el2);
        // // 添加状态管理器
        // cornerstoneTools.addStackStateManager(el2, ["stack", "crosshairs"]);
        // // 堆栈的状态
        // const axialStack = {
        //   // 当前横断面图像序列的索引
        //   currentImageIdIndex: 0,
        //   // 横断面图像序列的全部图像id集合
        //   imageIds: [
        //     "wadouri:http://127.0.0.1:8080/upload/image-00000.dcm",
        //     "wadouri:http://127.0.0.1:8080/upload/image-00001.dcm",
        //   ],
        // };

        // // 此为关键：一定要在使用十字线工具前将全部横断面序列的图像加载完成
        // axialStack.imageIds.forEach(async (imageId) => {
        //   await cornerstone.loadAndCacheImage(imageId);
        //   cornerstone.displayImage(el2, imageId);
        // });

        // // 添加堆栈状态
        // cornerstoneTools.addToolState(el2, "stack", axialStack);

        toolsObj.tools.forEach((tool) => {
          tool.actived = false;
          cornerstoneTools.addTool(
            cornerstoneTools[`${tool.name}Tool`],
            tool.configuration
          );
        });
      }
    });

    console.log(cornerstoneTools.store.state.tools);
    // 默认激活
    toolList.value[1].tools[0].actived = true;
    activedTool.value = "Wwwc";
    cornerstoneTools.setToolActive("Wwwc", {
      mouseButtonMask: 1,
    });
  };

  // dcm图像的加载渲染
  const loadImage = async (element, imgId = dcmList.value[0]?.id) => {
    // error判断
    if (!imgId) {
      throw "imgId为空";
    }
    const selectDcm = dcmList.value.filter((dcm) => dcm.id === imgId);
    if (!selectDcm.length) {
      throw "imgId不在list中";
    }

    // 加载图片
    const image = await cornerstone.loadImage(imgId);

    // 修改数据
    // viewContainer.value = element;
    // viewport.value = cornerstone.getViewport(element);
    dcmList.value.forEach((dcm) => (dcm.actived = false));
    selectDcm[0].actived = true;

    // console.log(image, cornerstone);
    // 渲染图片
    cornerstone.enable(element);
    cornerstone.displayImage(element, image);
    setTools(element);
  };
  // 获取viewport
  const getViewport = (element) => {
    return cornerstone.getViewport(element);
    // cornerstone.setViewport(element || viewContainer.value, viewport.value);
  };

  //设置图像
  // const setView = async (imgId) => {
  //   loadImage(viewContainer.value, imgId);
  //   setViewport();
  // };

  // 激活Tool
  const activeTools = (name) => {
    // console.log(viewport.value, voi.value);
    if (!dcmList.value?.length) {
      alert("请先载入dcm文件");
      return;
    }
    let type = null;
    let action = null;
    let mouseButtonMask = null;

    // 取消上一个tools的激活模式
    // cornerstoneTools.setToolDisabled(activedTool.value);
    activedTool.value = "";

    // 改变样式
    toolList.value.forEach((toolsObj) => {
      toolsObj.tools.forEach((tool) => {
        tool.actived = false;
        if (tool.name === name) {
          tool.actived = true;
          type = toolsObj.type;
          action = tool.action;
          mouseButtonMask = tool.mouseButtonMask;
        }
      });
    });

    if (type === "BaseView") {
      const viewport = getViewport(activedView.value);
      action(viewport);
      cornerstone.setViewport(activedView.value, viewport);
    }
    if (type === "BaseTool" || type === "Measure" || type === "Switch") {
      cornerstoneTools.setToolActive(name, {
        mouseButtonMask: mouseButtonMask || 1,
      });
      activedTool.value = name;
    }
    if (type === "Reference") {
      // console.log(synchronizer.value);
      cornerstoneTools.setToolActive(name, {
        mouseButtonMask: mouseButtonMask || 1,
        synchronizationContext: synchronizer.value,
      });
      activedTool.value = name;
    }

    // cornerstoneTools.setToolActive(name, {
    //   mouseButtonMask: 1,
    // });

    console.log(cornerstone, activedView.value, name, cornerstoneTools);
  };

  // 配置同步器
  const setSynchronizer = (el1, el2) => {
    synchronizer.value = new cornerstoneTools.Synchronizer(
      "cornerstonenewimage",
      cornerstoneTools.updateImageSynchronizer
    );
    // 同步器添加需要同步的元素
    synchronizer.value.add(el1);
    synchronizer.value.add(el2);
  };

  // 设置激活的窗口
  const setActivedViewer = (el) => {
    activedView.value = el;
  };

  return {
    dcmList,
    toolList,
    mockList,
    // viewport,
    loadImage,
    // setView,
    getViewport,
    initTools,
    setTools,
    activeTools,
    setSynchronizer,
    setActivedViewer,
    setDcmList,
  };
});

const pinia = createPinia();
export default pinia;
