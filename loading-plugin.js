// loading-plugin.js
export default {
  install(Vue) {
    Vue.prototype.$loading = function (isLoading) {
      this.$root.$emit("show-loading", isLoading);
    };
  },
};
