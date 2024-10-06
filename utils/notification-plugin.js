export default {
  install(Vue) {
    Vue.prototype.$notify = function (color, text, timeout = 5000) {
      alert("notifyyy");
      this.$root.$emit("show-notification", { color, text, timeout });
    };
  },
};
