import { isInArray } from "../../constan";
import Vue from "vue";

const master = [
  {
    path: "/master/product",
    name: "product",
    component: () => import("@/views/product/Product.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewProduct",
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
    path: "/master/product-tax",
    name: "product-tax",
    component: () => import("@/views/product-tax/ProductTax.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewProductTax",
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
    path: "/master/outlet",
    name: "outlet",
    component: () => import("@/views/outlet/Outlet.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewOutlet",
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
    path: "/setting/merchant-identity",
    name: "merchant-identity",
    component: () => import("@/views/merchant-identity/MerchantIdentity.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewMerchantIdentity",
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
    path: "/master/coa",
    name: "coa",
    component: () => import("@/views/coa/Coa.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewChartOfAccount",
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
    path: "/master/group-coa",
    name: "group-coa",
    component: () => import("@/views/coa-group/CoaGroup.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewGroupChartOfAccount",
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
    path: "/master/activity-gl",
    name: "activity-gl",
    component: () => import("@/views/activity-general-ledger/ActivityGl.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewActivityGL",
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
    path: "/master/policy-cash-bank",
    name: "policy-cash-bank",
    component: () => import("@/views/policy-cash-bank/PolicyCashBank.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewPolicyCashBank",
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
    path: "/master/policy-product",
    name: "policy-product",
    component: () => import("@/views/policy-product/PolicyProduct.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewPolicyProduct",
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
    path: "/master/policy-payment-channel",
    name: "policy-payment-channel",
    component: () =>
      import("@/views/policy-payment-channel/PolicyPaymentChannel.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewPolicyPaymentChannel",
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

export default master;
