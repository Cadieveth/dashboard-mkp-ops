import "@/@fake-db/db";
import { i18n } from "@/plugins/i18n";
import "@/plugins/vue-composition-api";
import "@/styles/styles.scss";
// eslint-disable-next-line import/order
import Vue from "vue";
import Vuetify from "vuetify";
import { VTextField } from "vuetify/lib";
// import Vuetify, { VTextField } from "vuetify/lib";
import App from "./App.vue";
import "./plugins/acl";
// import vuetify from "./plugins/vuetify";
// import Notifications from "vue-notification";
import router from "./router";
import sessionStorage from "vue-sessionstorage";
import store from "./store";
import VuejsDialog from "vuejs-dialog";
import VueForm from "vue-form";
import VuetifyMoney from "vuetify-money";
import VueNativeNotification from "vue-native-notification";
import "./directives/v-active-text-field";
import preset from "@/@core/preset/preset";
import PersistentPlaceholderPlugin from "./plugins/persistent-placeholder.js";

import NotificationPlugin from "./notification-plugin";
import LoadingPlugin from "./loading-plugin";
import confirmPlugin from "./confirm-plugin";
import { VueMaskDirective } from "v-mask";
import "vuejs-dialog/dist/vuejs-dialog.min.css";

import VueScrollTo from "vue-scrollto";
Vue.use(VueScrollTo);

Vue.directive("mask", VueMaskDirective);
Vue.use(NotificationPlugin); // Use the notification plugin
Vue.use(LoadingPlugin);
Vue.use(confirmPlugin);

Vue.use(PersistentPlaceholderPlugin); // register your custom plugin
Vue.use(VuejsDialog);
Vue.use(sessionStorage);

// Vue.use(Notifications);
Vue.use(VueForm);
Vue.use(VuetifyMoney);
Vue.use(VueNativeNotification, {
  requestOnNotify: true,
});

Vue.use(Vuetify);

const vuetify = new Vuetify({
  preset,
  icons: {
    iconfont: "mdiSvg",
  },
  theme: {
    options: {
      customProperties: true,
      variations: false,
    },
  },
  components: {
    VTextField: {
      outlined: true,
      dense: true,
    },
    // ... other Vuetify components and their global configurations
  },
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
