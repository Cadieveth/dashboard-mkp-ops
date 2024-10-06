import { isInArray } from "../../constan";
import Vue from "vue";

const form = [
  {
    path: "/sales/invoice-netoff/form",
    name: "sales-invoice-form",
    component: () =>
      import(
        "@/views/sales/invoice-netoff-transactional/input-invoice-nettoff-transcational.vue"
      ),
    meta: {
      layout: "content",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewSalesInvoiceNettOff",
          Vue.prototype.$session.get("accessHumanTask")
        ) ||
        JSON.parse(Vue.prototype.$session.get("userData")).username ==
          "superadmin"
      )
        next();
      else next({ name: "dashboard-analytics" });
    },
  },
];

export default form;
