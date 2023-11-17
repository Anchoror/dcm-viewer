import { createApp } from "vue";
import pinia from "@/stores";
import "./style.css";
import "boxicons/css/boxicons.min.css";
import SvgIcon from "@/components/SvgIcon/index.vue";
import "virtual:svg-icons-register";
import App from "./App.vue";

createApp(App).use(pinia).component("SvgIcon", SvgIcon).mount("#app");
