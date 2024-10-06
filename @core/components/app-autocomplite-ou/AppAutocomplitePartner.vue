<template>
  <v-autocomplete
    :label="partner"
    :value="formValue"
    :items="partnerList"
    :type="partnerType"
    item-text="partnerName"
    item-value="id"
    class="mb-0"
    persistent-placeholder
    :placeholder="phPartner"
    dense
    hide-details
    :clearable="clearable"
    :readonly="readOnly"
    @change="$emit('update:formValue', $event), sendValue($event)"
  ></v-autocomplete>
</template>

<script>
import axios from "@axios";
import themeConfig from "@themeConfig";

export default {
  name: "ChildAutocomplite",
  props: {
    formValue: { type: Number, default: -99 },
    readOnly: { type: Boolean, default: false },
    clearable: { type: Boolean, default: true },
    partnerType: { type: String, default: "" },
  },
  data() {
    return {
      partner: themeConfig.labeling.partner,
      partnerList: [],
      phPartner: themeConfig.placeholder.partner,
    };
  },
  mounted() {
    if (this.partnerType == "cashbankDisbursementCreate") {
      this.$root.$on(
        "appAutocompliteOuCompanyCashbankDisbursementCreate",
        (msg) => {
          if (msg != null) {
            this.getPartnerList(msg);
          } else {
            this.partnerList = [];
          }
        }
      );
      this.$root.$on("formCashBankDisbursReturn", (msg) => {
        const storedVForm = sessionStorage.getItem("disbursementCreateForm");
        const storedFilterForm = JSON.parse(storedVForm);
        if (sessionStorage.getItem("disbursementCreateForm") !== null) {
          this.getPartnerList(storedFilterForm.ouId);
        } else {
          this.partnerList = [];
        }
      });
    } else if (this.partnerType == "cashbankInPartnerReceiveCreate") {
      this.$root.$on(
        "appAutocompliteOuCompanyCashbankInPartnerReceiveCreate",
        (msg) => {
          if (msg != null) {
            this.getPartnerList(msg);
          } else {
            this.partnerList = [];
          }
        }
      );
    } else if (this.partnerType == "cashbankInPartnerReceiveDraft") {
      this.$root.$on(
        "appAutocompliteOuCompanyCashbankInPartnerReceiveDraft",
        (msg) => {
          if (msg != null) {
            this.getPartnerList(msg);
          } else {
            this.partnerList = [];
          }
        }
      );
    } else if (this.partnerType == "cashbankInPartnerReceiveInProgress") {
      this.$root.$on(
        "appAutocompliteOuCompanyCashbankInPartnerReceiveInProgress",
        (msg) => {
          if (msg != null) {
            this.getPartnerList(msg);
          } else {
            this.partnerList = [];
          }
        }
      );
    } else if (this.partnerType == "cashbankInPartnerReceiveApproved") {
      this.$root.$on(
        "appAutocompliteOuCompanyCashbankInPartnerReceiveApproved",
        (msg) => {
          if (msg != null) {
            this.getPartnerList(msg);
          } else {
            this.partnerList = [];
          }
        }
      );
    } else if (this.partnerType == "cashbankInPartnerReceiveForm") {
      this.$root.$on(
        "appAutocomplitePartnerCashbankInPartnerReceiveForm",
        (msg) => {
          if (msg != null) {
            this.getPartnerList(msg);
          } else {
            this.partnerList = [];
          }
        }
      );
    } else if (this.partnerType == "conversionCashBankInPartnerReceiveCreate") {
      this.$root.$on(
        "appAutocompliteOuCompanyConversionCashBankInPartnerReceive",
        (msg) => {
          if (msg != null) {
            this.getPartnerList(msg);
          } else {
            this.partnerList = [];
          }
        }
      );
    } else if (this.partnerType == "conversionCashBankInPartnerReceiveDraft") {
      this.$root.$on(
        "appAutocompliteOuCompanyConversionCashBankInPartnerReceiveDraft",
        (msg) => {
          if (msg != null) {
            this.getPartnerList(msg);
          } else {
            this.partnerList = [];
          }
        }
      );
    } else if (
      this.partnerType == "conversionCashBankInPartnerReceiveInProgress"
    ) {
      this.$root.$on(
        "appAutocompliteOuCompanyConversionCashBankInPartnerReceiveInProgress",
        (msg) => {
          if (msg != null) {
            this.getPartnerList(msg);
          } else {
            this.partnerList = [];
          }
        }
      );
    } else if (
      this.partnerType == "conversionCashBankInPartnerReceiveApproved"
    ) {
      this.$root.$on(
        "appAutocompliteOuCompanyConversionCashBankInPartnerReceiveApproved",
        (msg) => {
          if (msg != null) {
            this.getPartnerList(msg);
          } else {
            this.partnerList = [];
          }
        }
      );
    } else if (this.partnerType == "conversionCashBankInPartnerReceiveForm") {
      this.$root.$on(
        "appAutocomplitePartnerConversionCashBankInPartnerReceiveForm",
        (msg) => {
          if (msg != null) {
            this.getPartnerList(msg);
          } else {
            this.partnerList = [];
          }
        }
      );
    } else if (this.partnerType == "invoicingTransactionCreate") {
      this.$root.$on(
        "appAutocompliteOuCompanyInvoicingTransactionCreate",
        (msg) => {
          if (msg != null) {
            this.getPartnerList(msg);
          } else {
            this.partnerList = [];
          }
        }
      );
    } else if (this.partnerType == "invoicingTransactionDraft") {
      this.$root.$on(
        "appAutocompliteOuCompanyInvoicingTransactionDraft",
        (msg) => {
          if (msg != null) {
            this.getPartnerList(msg);
          } else {
            this.partnerList = [];
          }
        }
      );
    } else if (this.partnerType == "invoicingTransactionInProgress") {
      this.$root.$on(
        "appAutocompliteOuCompanyInvoicingTransactionInProgress",
        (msg) => {
          if (msg != null) {
            this.getPartnerList(msg);
          } else {
            this.partnerList = [];
          }
        }
      );
    } else if (this.partnerType == "invoicingTransactionApproved") {
      this.$root.$on(
        "appAutocompliteOuCompanyInvoicingTransactionApproved",
        (msg) => {
          if (msg != null) {
            this.getPartnerList(msg);
          } else {
            this.partnerList = [];
          }
        }
      );
    } else if (this.partnerType == "invoicingTransactionForm") {
      this.$root.$on(
        "appAutocompliteOuCompanyInvoicingTransactionForm",
        (msg) => {
          if (msg != null) {
            this.getPartnerList(msg);
          } else {
            this.partnerList = [];
          }
        }
      );
    } else if (this.partnerType == "generateOutstandingForecast") {
      this.$root.$on(
        "appAutocompliteOuBuMainGenerateOutstandingForecast",
        (msg) => {
          if (msg != null) {
            this.getPartnerList(msg);
          } else {
            this.partnerList = [];
          }
        }
      );
    } else if (this.partnerType == "progressForPartner") {
      this.$root.$on("appAutocompliteOuCompanyProgressForPartner", (msg) => {
        if (msg != null) {
          this.getPartnerList(msg);
        } else {
          this.partnerList = [];
        }
      });
    } else if (this.partnerType == "salesInvoiceCreate") {
      this.$root.$on("appAutocompliteOuCompanySalesInvoiceCreate", (msg) => {
        if (msg != null) {
          this.getPartnerList(msg);
        } else {
          this.partnerList = [];
        }
      });
    } else if (this.partnerType == "salesInvoiceDraft") {
      this.$root.$on("appAutocompliteOuCompanySalesInvoiceDraft", (msg) => {
        if (msg != null) {
          this.getPartnerList(msg);
        } else {
          this.partnerList = [];
        }
      });
    } else if (this.partnerType == "salesInvoiceInProgress") {
      this.$root.$on(
        "appAutocompliteOuCompanySalesInvoiceInProgress",
        (msg) => {
          if (msg != null) {
            this.getPartnerList(msg);
          } else {
            this.partnerList = [];
          }
        }
      );
    } else if (this.partnerType == "salesInvoiceApproved") {
      this.$root.$on("appAutocompliteOuCompanySalesInvoiceApproved", (msg) => {
        if (msg != null) {
          this.getPartnerList(msg);
        } else {
          this.partnerList = [];
        }
      });
    } else if (this.partnerType == "salesInvoiceForm") {
      this.$root.$on("appAutocomplitePartnerSalesInvoiceForm", (msg) => {
        if (msg != null) {
          this.getPartnerList(msg);
        } else {
          this.partnerList = [];
        }
      });
    } else if (this.partnerType == "salesInquiry") {
      this.$root.$on("appAutocompliteOuCompanySalesInquiry", (msg) => {
        if (msg != null) {
          this.getPartnerList(msg);
        } else {
          this.partnerList = [];
        }
      });
    } else if (this.partnerType == "salesReporting") {
      this.$root.$on("appAutocompliteOuCompanySalesReporting", (msg) => {
        if (msg != null) {
          this.getPartnerList(msg);
        } else {
          this.partnerList = [];
        }
      });
    } else if (this.partnerType == "orderReporting") {
      this.$root.$on("appAutocompliteOuCompanyOrderReporting", (msg) => {
        if (msg != null) {
          this.getPartnerList(msg);
        } else {
          this.partnerList = [];
        }
      });
    } else if (this.partnerType == "disbursementMutation") {
      this.$root.$on("appAutocompliteOuCompanyDisbursementMutation", (msg) => {
        if (msg != null) {
          this.getPartnerList(msg);
        } else {
          this.partnerList = [];
        }
      });
    } else if (this.partnerType == "cashbankManualDisbursement") {
      this.$root.$on("appAutocompliteOuCompanyManualDisbursement", (msg) => {
        if (msg != null) {
          this.getPartnerList(msg);
        } else {
          this.partnerList = [];
        }
      });
    } else {
      this.getPartnerList(-99);
    }
  },
  methods: {
    sendValue(id) {
      if (this.partnerType == "cashbankDisbursementCreate") {
        this.$root.$emit(
          "appAutocomplitePartnerCashbankDisbursementCreate",
          id
        );
      }
      if (this.partnerType == "disbursementMutation") {
        this.$root.$emit("appAutocomplitePartnerDisbursementMutation", id);
      } else {
        this.$root.$emit("appAutocomplitePartnerSelect", id);
      }
    },
    getPartnerList(id) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_master}/partner/list`,
          {
            ctgrPartnerId: -99,
            ouId: id == null ? -99 : parseInt(id),
            limit: 1000,
            offset: 0,
          },
          config
        )
        .then((response) => {
          if (response.data.result !== null)
            return (this.partnerList = response.data.result);
          this.partnerList = [];
        })
        .catch((e) => {
          this.notif("error", "Failed", e.response.data.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
  },
};
</script>
