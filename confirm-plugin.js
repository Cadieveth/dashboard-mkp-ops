// confirm-plugin.js
export default {
  install(Vue) {
    Vue.prototype.$confirm = function () {
      return new Promise((resolve, reject) => {
        this.$dialog
          .confirm("Are you sure you want to delete this item?.", {
            loader: true,
          })
          .then((dialog) => {
            setTimeout(() => {
              dialog.close();
              resolve(true);
            }, 500);
          })
          .catch(() => {
            resolve(false);
          });
      });
    };
  },
};
