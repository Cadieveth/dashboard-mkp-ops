import { isInArray } from "../../constan";
import Vue from "vue";

const collector = [
  {
    path: "/pembayaran/riwayat-transaksi",
    name: "payment",
    component: () => import("@/views/collector/payment/Payment.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewPaymentTransaction",
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
    path: "/e-ticketing/riwayat-transaksi",
    name: "pos",
    component: () => import("@/views/collector/pos/Pos.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewETicketingTransaction",
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
    path: "/Reconciliation",
    name: "summary-daily-collector",
    component: () => import("@/views/reconcile/SummaryReconcile.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewClosingMerchantTransaction",
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

export default collector;
