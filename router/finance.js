import { isInArray } from "../../constan";
import Vue from "vue";

const finance = [
  {
    path: "/finance/invoice-ap-bank",
    name: "invoice-ap-bank",
    component: () => import("@/views/invoice-ap/bank/InvoiceBank.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewProgressAPforBank",
          Vue.prototype.$session.get("accessHumanTask")
        ) ||
        JSON.parse(Vue.prototype.$session.get("userData")).username ==
          "superadmin"
      )
        next();
      else next({ name: "dashboard-analytics" });
    },
  },
  {
    path: "/finance/invoice-ap-partner",
    name: "invoice-ap-partner",
    component: () => import("@/views/invoice-ap/partner/InvoivePartner.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewProgressAPforMerchant",
          Vue.prototype.$session.get("accessHumanTask")
        ) ||
        JSON.parse(Vue.prototype.$session.get("userData")).username ==
          "superadmin"
      )
        next();
      else next({ name: "dashboard-analytics" });
    },
  },
  {
    path: "/finance/invoice-ar",
    name: "invoice-ar",
    component: () => import("@/views/invoice-ar/InvoiveAR.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewGenerateInvoicingForecasting",
          Vue.prototype.$session.get("accessHumanTask")
        ) ||
        JSON.parse(Vue.prototype.$session.get("userData")).username ==
          "superadmin"
      )
        next();
      else next({ name: "dashboard-analytics" });
    },
  },
  {
    path: "/finance/invoice-ar-inquiry-summary",
    name: "invoice-ar-inquiry-summary",
    component: () =>
      import(
        "@/views/invoice-ar/generate-outstanding/InquirySummaryInvoiceAR.vue"
      ),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    // beforeEnter(to, _, next) {
    //     if ((isInArray('viewProduct', Vue.prototype.$session.get('accessHumanTask'))) || JSON.parse(Vue.prototype.$session.get('userData')).username == 'superadmin') next()
    //     else next({ name: 'dashboard-analytics' })
    // },
  },
  {
    path: "/finance/create-invoice-ar",
    name: "create-invoice-ar",
    component: () =>
      import(
        "@/views/invoice-ar/create-ar-for-service-fee/CreateInvoiceAR.vue"
      ),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewInvoicingTransactional",
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

export default finance;
