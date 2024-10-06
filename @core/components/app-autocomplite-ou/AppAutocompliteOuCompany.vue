<template>
  <v-autocomplete
    :label="ou"
    :value="formValue"
    :items="ouList"
    item-value="id"
    item-text="ouName"
    class="mb-0"
    dense
    hide-details
    :clearable="clearable"
    :readonly="readOnly"
    persistent-placeholder
    :placeholder="phOu"
    @change="$emit('update:formValue', $event), sendValue($event)"
  ></v-autocomplete>
</template>

<script>
import axios from "@axios";
import themeConfig from "@themeConfig";
import Form from "vform";

export default {
  name: "ChildAutocompliteOuCompany",
  props: {
    formValue: { type: Number, default: -99 },
    readOnly: { type: Boolean, default: false },
    companyFirst: { type: Boolean, default: false },
    clearable: { type: Boolean, default: true },
    ouType: { type: String, default: "" },
  },
  data() {
    return {
      ou: themeConfig.labeling.ou,
      phOu: themeConfig.placeholder.ou,
      ouList: [],
    };
  },
  mounted() {
    this.getOuList();
    this.$root.$on("resetOu", (msg) => {
      this.formValue = -99;
    });
  },
  methods: {
    sendValue(id) {
      // this.$root.$emit('appAutocompliteOuCompany', id)
      if (this.ouType == "cashbankTransferCreate") {
        this.$root.$emit("appAutocompliteOuCompanyCashbankTransferCreate", id);
      } else if (this.ouType == "cashbankDisbursementCreate") {
        this.$root.$emit(
          "appAutocompliteOuCompanyCashbankDisbursementCreate",
          id
        );
      } else if (this.ouType == "bankStatementForm") {
        this.$root.$emit("appAutocompliteOuCompanyBankStatementForm", id);
      } else if (this.ouType == "cashbankInPartnerReceiveCreate") {
        this.$root.$emit(
          "appAutocompliteOuCompanyCashbankInPartnerReceiveCreate",
          id
        );
      } else if (this.ouType == "cashbankInPartnerReceiveDraft") {
        this.$root.$emit(
          "appAutocompliteOuCompanyCashbankInPartnerReceiveDraft",
          id
        );
      } else if (this.ouType == "cashbankInPartnerReceiveInProgress") {
        this.$root.$emit(
          "appAutocompliteOuCompanyCashbankInPartnerReceiveInProgress",
          id
        );
      } else if (this.ouType == "cashbankInPartnerReceiveApproved") {
        this.$root.$emit(
          "appAutocompliteOuCompanyCashbankInPartnerReceiveApproved",
          id
        );
      } else if (this.ouType == "cashbankInPartnerReceiveForm") {
        this.$root.$emit(
          "appAutocompliteOuCompanyCashbankInPartnerReceiveForm",
          id
        );
      } else if (this.ouType == "conversionCashBankInPartnerReceiveCreate") {
        this.$root.$emit(
          "appAutocompliteOuCompanyConversionCashBankInPartnerReceive",
          id
        );
      } else if (this.ouType == "conversionCashBankInPartnerReceiveDraft") {
        this.$root.$emit(
          "appAutocompliteOuCompanyConversionCashBankInPartnerReceiveDraft",
          id
        );
      } else if (
        this.ouType == "conversionCashBankInPartnerReceiveInProgress"
      ) {
        this.$root.$emit(
          "appAutocompliteOuCompanyConversionCashBankInPartnerReceiveInProgress",
          id
        );
      } else if (this.ouType == "conversionCashBankInPartnerReceiveApproved") {
        this.$root.$emit(
          "appAutocompliteOuCompanyConversionCashBankInPartnerReceiveApproved",
          id
        );
      } else if (this.ouType == "conversionCashBankInPartnerReceiveForm") {
        this.$root.$emit(
          "appAutocompliteOuCompanyConversionCashBankInPartnerReceiveForm",
          id
        );
      } else if (this.ouType == "invoicingTransactionCreate") {
        this.$root.$emit(
          "appAutocompliteOuCompanyInvoicingTransactionCreate",
          id
        );
      } else if (this.ouType == "invoicingTransactionDraft") {
        this.$root.$emit(
          "appAutocompliteOuCompanyInvoicingTransactionDraft",
          id
        );
      } else if (this.ouType == "invoicingTransactionInProgress") {
        this.$root.$emit(
          "appAutocompliteOuCompanyInvoicingTransactionInProgress",
          id
        );
      } else if (this.ouType == "invoicingTransactionApproved") {
        this.$root.$emit(
          "appAutocompliteOuCompanyInvoicingTransactionApproved",
          id
        );
      } else if (this.ouType == "invoicingTransactionForm") {
        this.$root.$emit(
          "appAutocompliteOuCompanyInvoicingTransactionForm",
          id
        );
      } else if (this.ouType == "progressForPartner") {
        this.$root.$emit("appAutocompliteOuCompanyProgressForPartner", id);
      } else if (this.ouType == "salesInvoiceCreate") {
        this.$root.$emit("appAutocompliteOuCompanySalesInvoiceCreate", id);
      } else if (this.ouType == "salesInvoiceDraft") {
        this.$root.$emit("appAutocompliteOuCompanySalesInvoiceDraft", id);
      } else if (this.ouType == "salesInvoiceInProgress") {
        this.$root.$emit("appAutocompliteOuCompanySalesInvoiceInProgress", id);
      } else if (this.ouType == "salesInvoiceApproved") {
        this.$root.$emit("appAutocompliteOuCompanySalesInvoiceApproved", id);
      } else if (this.ouType == "salesInvoiceForm") {
        this.$root.$emit("appAutocompliteOuCompanySalesInvoiceForm", id);
      } else if (this.ouType == "salesInquiry") {
        this.$root.$emit("appAutocompliteOuCompanySalesInquiry", id);
      } else if (this.ouType == "salesReporting") {
        this.$root.$emit("appAutocompliteOuCompanySalesReporting", id);
      } else if (this.ouType == "orderReporting") {
        this.$root.$emit("appAutocompliteOuCompanyOrderReporting", id);
      } else if (this.ouType == "disbursementMutation") {
        this.$root.$emit("appAutocompliteOuCompanyDisbursementMutation", id);
      } else if (this.ouType == "TransferCashbankCreate") {
        this.$root.$emit("appAutocompliteOuCompanyTransferCashbankCreate", id);
      } else if (this.ouType == "cashbankManualDisbursement") {
        this.$root.$emit("appAutocompliteOuCompanyManualDisbursement", id);
      }
    },
    getOuList() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_master}/ou/authorized-ou-bu-list`, config)
        .then((response) => {
          if (response.data.result !== null)
            return (this.ouList = response.data.result);
          this.ouList = [];
        })
        .catch((e) => {
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
          console.log(e.response.data.message);
        });
    },
  },
};
</script>
