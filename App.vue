<template>
  <component
    :is="resolveLayoutVariant"
    :class="`skin-variant--${appSkinVariant}`"
  >
    <app-card-loader :open-loader="isLoading"></app-card-loader>
    <app-notification
      :color="notifColor"
      :text="notifText"
      :open-snackbar="openNotif"
    ></app-notification>
    <transition :name="appRouteTransition" mode="out-in" appear
      ><router-view></router-view>
    </transition>
  </component>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { computed } from "@vue/composition-api";
// eslint-disable-next-line import/no-unresolved
import useAppConfig from "@core/@app-config/useAppConfig";
import { useRouter } from "@core/utils";
import { useLayout } from "@core/layouts/composable/useLayout";

// Layouts
import LayoutContentVerticalNav from "@/layouts/variants/content/vertical-nav/LayoutContentVerticalNav.vue";
import LayoutContentHorizontalNav from "@/layouts/variants/content/horizontal-nav/LayoutContentHorizontalNav.vue";
import LayoutBlank from "@/layouts/variants/blank/LayoutBlank.vue";
import AppNotification from "@/@core/components/app-notification/AppNotification";

// Dynamic vh
import useDynamicVh from "@core/utils/useDynamicVh";
import "./styles/textstyle.css";
import { delay } from "./utils/constan";

import "./numberFormat.js";
import AppCardLoader from "./@core/components/app-card-loader/AppCardLoader.vue";

import { mapGetters } from "vuex";

export default {
  data() {
    return {
      notifColor: "",
      notifText: "",
      openNotif: false,
      isLoading: false,
    };
  },
  mounted() {
    this.$root.$on("show-notification", async (msg) => {
      this.notifColor = msg.color;
      this.notifText = msg.message;
      this.openNotif = true;
      await delay(msg.timeout);
      this.openNotif = false;
    });
    this.$root.$on("show-loading", async (msg) => {
      this.isLoading = msg;
    });
  },
  components: {
    LayoutContentVerticalNav,
    LayoutContentHorizontalNav,
    LayoutBlank,
    AppCardLoader,
    AppNotification,
  },
  computed: {
    ...mapGetters(["getIsLoading", "getOpenNotification"]),
    // isLoading() {
    //   return this.getIsLoading;
    // },
    openNotification() {
      return this.getOpenNotification;
    },
  },
  setup() {
    const { route } = useRouter();
    const { appContentLayoutNav, appSkinVariant, appRouteTransition } =
      useAppConfig();

    const { handleBreakpointLayoutSwitch } = useLayout();
    handleBreakpointLayoutSwitch();

    const resolveLayoutVariant = computed(() => {
      if (route.value.meta.layout === "blank") return "layout-blank";
      if (route.value.meta.layout === "content")
        return `layout-content-${appContentLayoutNav.value}-nav`;

      return null;
    });

    useDynamicVh();

    return {
      resolveLayoutVariant,
      appSkinVariant,
      appRouteTransition,
    };
  },
};
</script>
