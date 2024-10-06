import Vue from "vue";
import VueRouter from "vue-router";
import { canNavigate } from "@/plugins/acl/routeProtection";
import dashboard from "./dashboard";
import master from "./master";
import setting from "./setting";
import approval from "./approval";
import collector from "./collector";
import finance from "./finance";
import sales from "./sales";
import form from "./form";

// import apps from './apps'
// import pages from './pages'
// import userInterface from './user-interface'

Vue.use(VueRouter);

const routes = [
  // ? We are redirecting to different pages based on role.
  // NOTE: Role is just for UI purposes. ACL is based on abilities.
  {
    path: "/",
    redirect: (to) => {
      // console.log(Vue.prototype.$session.get('accessToken'))
      const tokenLogIn =
        Vue.prototype.$session.get("accessToken") !== undefined &&
        Vue.prototype.$session.get("accessToken") !== "";
      if (tokenLogIn) return { name: "dashboard-analytics" };

      return { name: "auth-login", query: to.query };
    },
  },
  {
    path: "/error-404",
    name: "error-404",
    component: () => import("@/views/Error404.vue"),
    meta: {
      layout: "blank",
      resource: "Public",
    },
  },
  {
    path: "/login",
    name: "auth-login",
    component: () => import("@/views/Login.vue"),
    meta: {
      layout: "blank",
      resource: "Public",
      redirectIfLoggedIn: true,
    },
  },
  {
    path: "/register",
    name: "auth-register",
    component: () => import("@/views/Register.vue"),
    meta: {
      layout: "blank",
      resource: "Public",
      redirectIfLoggedIn: true,
    },
  },
  {
    path: "/forgot-password",
    name: "auth-forgot-password",
    component: () => import("@/views/ForgotPassword.vue"),
    meta: {
      layout: "blank",
      resource: "Public",
      redirectIfLoggedIn: true,
    },
  },
  ...dashboard,
  ...collector,
  ...approval,
  ...finance,
  ...sales,
  ...master,
  ...setting,
  ...form,

  // ...userInterface,
  // ...apps,
  // ...pages,
  {
    path: "*",
    redirect: "error-404",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

// ? Router Before Each hook: https://router.vuejs.org/guide/advanced/navigation-guards.html
router.beforeEach((to, _, next) => {
  const userData = Vue.prototype.$session.get("userData");
  const isLoggedIn =
    userData &&
    Vue.prototype.$session.get("accessToken") !== undefined &&
    Vue.prototype.$session.get("accessToken") !== "";
  if (!canNavigate(to)) {
    // Redirect to login if not logged in
    if (!isLoggedIn)
      return next({
        name: "auth-login",
        query: { marketplace: to.query.marketplace },
      });
  }

  return next();
});

export default router;
