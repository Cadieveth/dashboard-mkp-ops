<template>
  <v-autocomplete
    :label="ouB"
    :value="formValue"
    :items="ouList"
    item-value="ouId"
    item-text="ouName"
    class="mb-0"
    dense
    hide-details
    clearable
    :readonly="readOnly"
    @change="$emit('update:formValue', $event), sendValue($event)"
    persistent-placeholder
    :placeholder="phOuB"
  ></v-autocomplete>
</template>

<script>
import axios from "@axios";
import themeConfig from "@themeConfig";
import { required } from "@/@core/utils/validation";

export default {
  name: "ChildAutocompliteBranch",
  props: {
    formValue: { type: Number, default: -99 },
    readOnly: { type: Boolean, default: false },
    companyFirst: { type: String, default: "N" },
    ouBranchType: { type: String, default: "" },
  },
  data() {
    return {
      ouB: themeConfig.labeling.ouB,
      phOuB: themeConfig.placeholder.ouB,
      ouList: [],
      validators: {
        required,
      },
    };
  },
  mounted() {
    if (this.companyFirst != "Y") {
      this.getOuList(-99);
    }
    // this.$root.$on("appAutocompliteOuCompany", (msg) => {
    //   if (msg != null) {
    //     this.getOuList(msg);
    //   } else {
    //     this.ouList = [];
    //   }
    // })
    if (this.ouBranchType == "cashbankTransferCreate") {
      this.$root.$on(
        "appAutocompliteOuCompanyCashbankTransferCreate",
        (msg) => {
          if (msg != null) {
            this.getOuList(msg);
          } else {
            this.ouList = [];
          }
        }
      );
    }
    // else if (this.ouBranchType == "invoicePartnerList") {
    //   this.$root.$emit(
    //     "appAutocompliteOuBranchInvoicePartnerList",
    //     this.formValue
    //   );
    // }
  },
  methods: {
    sendValue(id) {
      // this.$root.$emit('appAutocompliteOuBranch', id)
      if (this.ouBranchType == "advanceSettlement") {
        this.$root.$emit("appAutocompliteOuBranchAdvanceSettlement", id);
      } else if (this.ouBranchType == "summaryTransaction") {
        this.$root.$emit("appAutocompliteOuBranchSummaryTransaction", id);
      } else if (this.ouBranchType == "progressForBank") {
        this.$root.$emit("appAutocompliteOuBranchProgressForBank", id);
      } else if (this.ouBranchType == "progressForPartner") {
        this.$root.$emit("appAutocompliteOuBranchProgressForPartner", id);
      } else if (this.ouBranchType == "paymentHistory") {
        this.$root.$emit("appAutocompliteOuBranchPaymentHistory", id);
      } else if (this.ouBranchType == "ticketingHistory") {
        this.$root.$emit("appAutocompliteOuBranchTicketingHistory", id);
      } else if (this.ouBranchType == "bankReconcile") {
        this.$root.$emit("appAutocompliteOuBranchBankReconcile", id);
      } else if (this.ouBranchType == "cashbankDisbursementCreate") {
        this.$root.$emit(
          "appAutocompliteOuBranchCashbankDisbursementCreate",
          id
        );
      } else if (this.ouBranchType == "invoicePartnerList") {
        this.$root.$emit("appAutocompliteOuBranchInvoiceAPPartner", id);
      } else if (this.ouBranchType == "ticketingHistoryNonSF") {
        this.$root.$emit("appAutocompliteOuBranchTicketingNonSF", id);
      } else if (this.ouBranchType == "bankSettlement") {
        this.$root.$emit("appAutocompliteOuBranchBankSettlement", id);
      } else if (this.ouBranchType == "cashbankTransferCreate") {
        this.$root.$emit("appAutocompliteOuBranchCashbankTransferCreate", id);
      }
    },
    getOuList(id) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/ou/authorized-ou-branch-list?ouId=${id}`,
          config
        )
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
        });
    },
  },
};
</script>
