import moment from "moment";
import Vuex from "vuex";

export const vuexSalesInvoiceNetoffTransactional = {
  state: {
    salesInvoiceNetoffCreate: {
      ouId: -99,
      partnerId: -99,
      docNo: "",
      startDate: moment().format("YYYY-MM-") + "01",
      endDate: moment().format("YYYY-MM-DD"),
      docDate: moment().format("YYYY-MM-DD"),
    },

    salesInvoiceNetoffData: [],
    salesInvoiceNetoffSelected: [],

    invoiceId: -99,
    invoiceNetoffTabs: 0,
  },
  mutations: {
    updateSalesInvoiceNetoffCreate(state, newData) {
      state.salesInvoiceNetoffCreate = newData;
    },
    updateSalesInvoiceNetoffData(state, newData) {
      state.salesInvoiceNetoffData = newData;
    },
    updateSalesInvoiceNetoffSelected(state, newData) {
      state.salesInvoiceNetoffSelected = newData;
    },
    updateInvoiceId(state, newData) {
      state.invoiceId = newData;
    },
    updateInvoiceNetoffTabs(state, newData) {
      state.invoiceNetoffTabs = newData;
    },
  },
  actions: {
    setSalesInvoiceNetoffCreate({ commit }, newData) {
      commit("updateSalesInvoiceNetoffCreate", newData);
    },
    setSalesInvoiceNetoffData({ commit }, newData) {
      commit("updateSalesInvoiceNetoffData", newData);
    },
    setSalesInvoiceNetoffSelected({ commit }, newData) {
      commit("updateSalesInvoiceNetoffSelected", newData);
    },
    setInvoiceId({ commit }, newData) {
      commit("updateInvoiceId", newData);
    },
    setInvoiceNetoffTabs({ commit }, newData) {
      commit("updateInvoiceNetoffTabs", newData);
    },
  },
  getters: {
    getSalesInvoiceNetoffCreate(state) {
      return state.salesInvoiceNetoffCreate;
    },
    getSalesInvoiceNetoffData(state) {
      return state.salesInvoiceNetoffData;
    },
    getSalesInvoiceNetoffSelected(state) {
      return state.salesInvoiceNetoffSelected;
    },
    getInvoiceId(state) {
      return state.invoiceId;
    },
    getInvoiceNetoffTabs(state) {
      return state.invoiceNetoffTabs;
    },
  },
};
