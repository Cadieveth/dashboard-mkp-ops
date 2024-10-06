import { isInArray } from "../../constan";
import Vue from "vue";

const sales = [
  {
    path: "/sales/sales-invoice",
    name: "sales-invoice",
    component: () => import("@/views/sales-invoice/SalesInvoice.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewSalesInvoice",
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
    path: "/sales/invoice-netoff",
    name: "sales-invoice-netoff-transactional",
    component: () =>
      import(
        "@/views/sales/invoice-netoff-transactional/app-invoice-netoff-transactional.vue"
      ),
    meta: {
      layout: "content",
      resource: "Demo",
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
  {
    path: "/sales/sales-report",
    name: "sales-report",
    component: () => import("@/views/sales-reporting/SalesReporting.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewReportPaymentOrderInternal",
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
    path: "/sales/inquiry-report",
    name: "inquiry-report",
    component: () => import("@/views/inquiry-reporting/InquiryReporting.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewReportInvoiceSettlement",
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
    path: "/sales/disbursement-mutation",
    name: "disbursement-mutation",
    component: () =>
      import("@/views/disbursement-mutation/DisbursementMutation.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "downloadReportInvoiceSettlementXlsx",
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
    path: "/sales/order-report",
    name: "order-report",
    component: () => import("@/views/order-reporting/OrderReporting.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewOrderRevenueByPartner",
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
    path: "/cash-bank/disbursement-report",
    name: "disbursement-report",
    component: () =>
      import(
        "@/views/cash-bank-for-disbursement-report/CashbankForDisbursementReport.vue"
      ),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "downloadReportInvoiceSettlementXlsx",
          Vue.prototype.$session.get("accessHumanTask")
        ) ||
        JSON.parse(Vue.prototype.$session.get("userData")).username ==
          "superadmin"
      )
        next();
      else next({ name: "dashboard-analytics" });
    },
  },
  // {
  //   path: "/sales/sales-order",
  //   name: "sales-order",
  //   component: () => import("@/views/sales-order/SalesOrder.vue"),
  //   meta: {
  //     layout: "content",
  //     resource: "Demo",
  //   },
  // beforeEnter(to, _, next) {
  //   if (
  //     isInArray(
  //       "viewOrderRevenueByPartner",
  //       Vue.prototype.$session.get("accessHumanTask")
  //     ) ||
  //     JSON.parse(Vue.prototype.$session.get("userData")).username ==
  //       "superadmin"
  //   )
  //     next();
  //   else next({ name: "dashboard-analytics" });
  // },
  // },
];

export default sales;
