import { isInArray } from "../../constan";
import Vue from "vue";

const setting = [
  {
    path: "/setting/user",
    name: "user",
    component: () => import("@/views/user/User.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray("viewUser", Vue.prototype.$session.get("accessHumanTask")) ||
        JSON.parse(Vue.prototype.$session.get("userData")).username ==
          "superadmin"
      )
        next();
      else next({ name: "dashboard-analytics" });
    },
  },
  {
    path: "/setting/partner",
    name: "partner",
    component: () => import("@/views/partner/Partner.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewPartner",
          Vue.prototype.$session.get("accessHumanTask")
        ) ||
        JSON.parse(Vue.prototype.$session.get("userData")).username ==
          "superadmin"
      )
        next();
      else next({ name: "dashboard-analytics" });
    },
  },
  // add Warehouse
  {
    path: "/setting/warehouse",
    name: "warehouse",
    component: () => import("@/views/warehouse/Warehouse.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          // "viewWarehouse",
          "viewPartner",
          Vue.prototype.$session.get("accessHumanTask")
        ) ||
        JSON.parse(Vue.prototype.$session.get("userData")).username ==
          "superadmin"
      )
        next();
      else next({ name: "dashboard-analytics" });
    },
  },
  // end of add Warehouse
  // add WarehouseAdd
  {
    path: "/setting/warehouseAdd",
    name: "warehouseAdd",
    component: () => import("@/views/warehouse/WarehouseAdd.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          // "viewWarehouseAdd",
          "viewPartner",
          Vue.prototype.$session.get("accessHumanTask")
        ) ||
        JSON.parse(Vue.prototype.$session.get("userData")).username ==
          "superadmin"
      )
        next();
      else next({ name: "dashboard-analytics" });
    },
  },
  // end of add WarehouseAdd
  // add WarehouseEdit
  {
    path: "/setting/warehouseEdit",
    name: "warehouseEdit",
    component: () => import("@/views/warehouse/WarehouseEdit.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          // "viewWarehouse",
          "viewPartner",
          Vue.prototype.$session.get("accessHumanTask")
        ) ||
        JSON.parse(Vue.prototype.$session.get("userData")).username ==
          "superadmin"
      )
        next();
      else next({ name: "dashboard-analytics" });
    },
  },
  // end of add WarehouseEdit
  // add Uom
  {
    path: "/setting/uom",
    name: "uom",
    component: () => import("@/views/uom/Uom.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          // "viewUom",
          "viewPartner",
          Vue.prototype.$session.get("accessHumanTask")
        ) ||
        JSON.parse(Vue.prototype.$session.get("userData")).username ==
          "superadmin"
      )
        next();
      else next({ name: "dashboard-analytics" });
    },
  },
  // end of add Uom
  // add UomAdd
  {
    path: "/setting/uomAdd",
    name: "uomAdd",
    component: () => import("@/views/uom/UomAdd.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          // "viewUomAdd",
          "viewPartner",
          Vue.prototype.$session.get("accessHumanTask")
        ) ||
        JSON.parse(Vue.prototype.$session.get("userData")).username ==
          "superadmin"
      )
        next();
      else next({ name: "dashboard-analytics" });
    },
  },
  // end of add UomAdd
  // add UomEdit
  {
    path: "/setting/uomEdit",
    name: "uomEdit",
    component: () => import("@/views/uom/UomEdit.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          // "viewUomAdd",
          "viewPartner",
          Vue.prototype.$session.get("accessHumanTask")
        ) ||
        JSON.parse(Vue.prototype.$session.get("userData")).username ==
          "superadmin"
      )
        next();
      else next({ name: "dashboard-analytics" });
    },
  },
  // end of add UomEdit
  {
    path: "/setting/type-partner",
    name: "type-partner",
    component: () => import("@/views/type-partner/TypePartner.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewTypePartner",
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
    path: "/setting/role",
    name: "role",
    component: () => import("@/views/role/Role.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray("viewRole", Vue.prototype.$session.get("accessHumanTask")) ||
        JSON.parse(Vue.prototype.$session.get("userData")).username ==
          "superadmin"
      )
        next();
      else next({ name: "dashboard-analytics" });
    },
  },
  {
    path: "/setting/policy",
    name: "policy",
    component: () => import("@/views/policy/Policy.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewPolicy",
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
    path: "/setting/unit-bisnis",
    name: "unit-bisnis",
    component: () => import("@/views/ou/Ou.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray("viewOu", Vue.prototype.$session.get("accessHumanTask")) ||
        JSON.parse(Vue.prototype.$session.get("userData")).username ==
          "superadmin"
      )
        next();
      else next({ name: "dashboard-analytics" });
    },
  },
  {
    path: "/setting/cash-bank",
    name: "cash-bank",
    component: () => import("@/views/cash-bank/CashBank.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewCashbank",
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

export default setting;
