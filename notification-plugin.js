// notification-plugin.js
export default {
  install(Vue) {
    Vue.prototype.$notify = async function (color, message, timeout = 2000) {
      this.$root.$emit("show-notification", { color, message, timeout });
    };
  },
};
