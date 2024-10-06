import Vue from "vue";

Vue.directive("format-number", {
  bind: function (el, binding, vnode) {
    el.addEventListener("keyup", function () {
      var value = el.value.replace(/,/g, "");
      el.value = Number(value).toLocaleString();
      vnode.componentInstance.$emit("input", el.value);
    });
  },
});
