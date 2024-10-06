import moment from "moment";

export const salesInvoiceNetoffBase = {
  ouId: -99,
  partnerId: -99,
  docNo: "",
  startDate: moment().format("YYYY-07-") + "01",
  endDate: moment().format("YYYY-MM-DD"),
  docDate: moment().format("YYYY-MM-DD"),
};
