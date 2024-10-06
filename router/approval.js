import { isInArray } from "../../constan";
import Vue from "vue";

const approval = [
  {
    path: "/approval/approval-flow",
    name: "approval",
    component: () => import("@/views/approval/Approval.vue"),
    meta: {
      layout: "content",
      resource: "Demo",
    },
    beforeEnter(to, _, next) {
      if (
        isInArray(
          "viewApprovalFlow",
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

export default approval;
