import appConfigStoreModule from "@core/@app-config/appConfigStoreModule";
import Vue from "vue";
import Vuex from "vuex";
import app from "./app";
import { salesInvoiceNetoffBase } from "./baseFormValue";
import moment from "moment";
import { vuexSalesInvoiceNetoffTransactional } from "../views/sales/invoice-netoff-transactional/vuexSalesInvoiceNetoffTransaction";

Vue.use(Vuex);

const initialState = {
  isLoading: false,
  loadingText: "loading",
  openNotification: false,
  textNotification: "Notification",
  colorNotification: "",

  ...vuexSalesInvoiceNetoffTransactional.state,
};

export default new Vuex.Store({
  state: { ...initialState },
  mutations: {
    updateIsLoading(state, newData) {
      state.isLoading = newData;
    },
    updateLoadingText(state, newData) {
      state.loadingText = newData;
    },
    updateOpenNotification(state, newData) {
      state.openNotification = !state.openNotification;
    },
    updateTextNotification(state, newData) {
      state.textNotification = newData;
    },
    updateColorNotification(state, newData) {
      state.colorNotification = newData;
    },

    resetAllState(state) {
      Object.assign(state, initialState);
      state.salesInvoiceNetoffCreate = {
        ouId: -99,
        partnerId: -99,
        docNo: "",
        startDate: moment().format("YYYY-MM-") + "01",
        endDate: moment().format("YYYY-MM-DD"),
        docDate: moment().format("YYYY-MM-DD"),
      };
    },

    ...vuexSalesInvoiceNetoffTransactional.mutations,
  },
  actions: {
    resetVuex({ commit }) {
      commit("resetAllState");
    },
    setIsLoading({ commit }, newData) {
      commit("updateIsLoading", newData);
    },
    setLoadingText({ commit }, newData) {
      commit("updateLoadingText", newData);
    },
    setOpenNotification({ commit }, { color, text }) {
      commit("updateOpenNotification");
      commit("updateTextNotification", text);
      commit("updateColorNotification", color);
    },
    changeLoading({ commit }, { loading, text }) {
      commit("updateIsLoading", loading);
      commit("updateLoadingText", text);
    },

    ...vuexSalesInvoiceNetoffTransactional.actions,
  },
  getters: {
    getIsLoading(state) {
      return state.isLoading;
    },
    getLoadingText(state) {
      return state.loadingText;
    },
    getOpenNotification(state) {
      return state.openNotification;
    },
    getTextNotification(state) {
      return state.textNotification;
    },
    getColorNotification(state) {
      return state.colorNotification;
    },

    ...vuexSalesInvoiceNetoffTransactional.getters,
  },
  modules: {
    appConfig: appConfigStoreModule,
    app,
  },
});
