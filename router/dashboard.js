import { isInArray } from "../../constan";
import Vue from "vue";

const dashboard = [
  {
    path: "/dashboards/crm",
    name: "dashboard-crm",
    component: () => import("@/views/dashboards/crm/Crm.vue"),
    meta: {
      layout: "content",
    },
  },
  {
    path: "/dashboards/analytics",
    name: "dashboard-analytics",
    component: () => import("@/views/dashboards/analytics/Analytics.vue"),
    meta: {
      layout: "content",
    },
  },
  {
    path: "/dashboards/eCommerce",
    name: "dashboard-eCommerce",
    component: () => import("@/views/dashboards/ecommerce/Ecommerce.vue"),
    meta: {
      layout: "content",
    },
  },

  {
    path: "/dashboards/my-document",
    name: "my-document",
    component: () => import("@/views/my-document/MyDocument.vue"),
    meta: {
      layout: "content",
    },
  },
  {
    path: "/cash-bank/for-disbursement",
    name: "cash-bank-for-disbursement",
    component: () =>
      import("@/views/cash-bank-for-disbursement/CashBankForDisburs.vue"),
    meta: {
      layout: "content",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewDisbursement",
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
    path: "/cash-bank/manual-disbursement",
    name: "cash-bank-manual-disbursement",
    component: () =>
      import(
        "@/views/cash-bank-manual-disbursement/CashBankManualDisbursement.vue"
      ),
    meta: {
      layout: "content",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewManualDisbursement",
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
    path: "/cash-bank/daily-disbursement",
    name: "cash-bank-daily-disbursement",
    component: () => import("@/views/daily-disbursement/DailyDisbursement.vue"),
    meta: {
      layout: "content",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewReportDailyCashbank",
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
    path: "/cash-bank/transfer",
    name: "cash-bank-transfer",
    component: () => import("@/views/cash-bank-transfer/CashBankTransfer.vue"),
    meta: {
      layout: "content",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewCashbankTransfer",
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
    path: "/cash-bank/bank-recociliation",
    name: "bank-recociliation",
    component: () => import("@/views/reconcile/BankReconcile.vue"),
    meta: {
      layout: "content",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewBankMerchantTransaction",
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
    path: "/cash-bank/mutasi-bank",
    name: "mutasi-bank",
    component: () => import("@/views/reconcile/DataReconcile.vue"),
    meta: {
      layout: "content",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewBankStatement",
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
    path: "/cash-bank/in-partner-receive",
    name: "cash-bank-in-partner-receive",
    component: () =>
      import(
        "@/views/cash-bank-in-partner-receive/CashBankInPartnerReceive.vue"
      ),
    meta: {
      layout: "content",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewCashBankInPartner",
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
    path: "/cash-bank/inquiry-mutasi-bank",
    name: "inquiry-mutasi-bank",
    component: () => import("@/views/reconcile/InquiryBankMutasi.vue"),
    meta: {
      layout: "content",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewInquiryProgressBank",
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
  //   path: "/cash-bank/bank-settle",
  //   name: "advance-settle",
  //   component: () => import("@/views/settle/advance-settle/AdvanceSettle.vue"),
  //   meta: {
  //     layout: "content",
  //   },
  //   beforeEnter(to, _, next) {
  //     if (
  //       isInArray(
  //         "viewAdvanceSettlement",
  //         Vue.prototype.$session.get("accessHumanTask")
  //       ) ||
  //       JSON.parse(Vue.prototype.$session.get("userData")).username ==
  //         "superadmin"
  //     )
  //       next();
  //     else next({ name: "dashboard-analytics" });
  //   },
  // },
  {
    path: "/cash-bank/summary-bank-settle",
    name: "summary-bank-recociliation",
    component: () => import("@/views/reconcile/SummaryBankReconcile.vue"),
    meta: {
      layout: "content",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewDataTransactionSettlement",
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
    path: "/cash-bank/partner-receive",
    name: "cash-bank-partner-receive",
    component: () =>
      import("@/views/invoice-ar/partner/InvoiceARPartnerReceive.vue"),
    meta: {
      layout: "content",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewConversionCashBankInPartnerReceive",
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
    path: "/cash-bank/bank-settlement",
    name: "detail-bank-settlement",
    component: () => import("@/views/bank-settlement/BankSettlement.vue"),
    meta: {
      layout: "content",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewBankMerchantTransaction",
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
    path: "/cash-bank/disbursement-summary-report",
    name: "disbursement-summary-report",
    component: () =>
      import(
        "@/views/cash-bank-for-disbursement-summary-report/CashbankForDisbursementSummaryReport.vue"
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
  {
    path: "/cash-bank/transfer-bank",
    name: "transfer-cash-bank",
    component: () => import("@/views/transfer-cash-bank/TransferCashbank.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewTransferCashbank",
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

export default dashboard;
