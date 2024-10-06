import preset from "@/@core/preset/preset";
import Vue from "vue";
// import Vuetify from "vuetify/lib/framework";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

// Vue.component("v-text-field", {
//   extends: Vuetify.components.VTextField,
//   props: {
//     persistentPlaceholder: {
//       type: Boolean,
//       default: true,
//     },
//   },
// });
export default new Vuetify({
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
      props: {
        "persistent-placeholder": true,
        outlined: true,
      },
    },
  },
});
