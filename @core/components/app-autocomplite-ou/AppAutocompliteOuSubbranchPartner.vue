<template>
  <v-autocomplete
    :label="ouSB"
    :value="formValue"
    :items="ouList"
    item-value="ouId"
    item-text="ouName"
    class="mb-0"
    dense
    hide-details
    clearable
    :readonly="readOnly"
    :multiple="multiple"
    @change="$emit('update:formValue', $event)"
    @click:clear="handleClear"
    persistent-placeholder
    :placeholder="phOuSB"
  ></v-autocomplete>
</template>

<script>
import axios from "@axios";
import themeConfig from "@themeConfig";
import { mdiDotsVertical, mdiMicrosoftEdgeLegacy } from "@mdi/js";

export default {
  name: "ChildAutocompliteSubBranch",
  props: {
    formValue: "",
    readOnly: { type: Boolean, default: false },
    ouSubBranchType: { type: String, default: "" },
    multiple: { type: Boolean, default: false },
    partnerId: { type: Number, default: -99 },
    handleClear: { type: Function, default: () => console.log() },
  },
  data() {
    return {
      ouSB: themeConfig.labeling.ouSB,
      ouList: [],
      phOuSB: themeConfig.placeholder.ouSB,
    };
  },
  mounted() {
    if (this.ouSubBranchType == "advanceSettlement") {
      this.$root.$on("appAutocompliteOuSubBranchAdvanceSettlement", (msg) => {
        if (msg != null) {
          this.getOuSubBranchList(msg);
        } else {
          this.partnerList = [];
        }
      });
    } else if (this.ouSubBranchType == "summaryTransaction") {
      this.$root.$on("appAutocompliteOuSubBranchSummaryTransaction", (msg) => {
        if (msg != null) {
          this.getOuSubBranchList(msg);
        } else {
          this.partnerList = [];
        }
      });
    } else if (this.ouSubBranchType == "progressForBank") {
      this.$root.$on("appAutocompliteOuBranchProgressForBank", (msg) => {
        if (msg != null) {
          this.getOuSubBranchList(msg);
        } else {
          this.partnerList = [];
        }
      });
    } else if (this.ouSubBranchType == "progressForPartner") {
      this.$root.$on("appAutocompliteOuBranchProgressForPartner", (msg) => {
        if (msg != null) {
          this.getOuSubBranchList(msg);
        } else {
          this.partnerList = [];
        }
      });
    } else if (this.ouSubBranchType == "paymentHistory") {
      this.$root.$on("appAutocompliteOuBranchPaymentHistory", (msg) => {
        if (msg != null) {
          this.getOuSubBranchList(msg);
        } else {
          this.partnerList = [];
        }
      });
    } else if (this.ouSubBranchType == "ticketingHistory") {
      this.$root.$on("appAutocompliteOuBranchTicketingHistory", (msg) => {
        if (msg != null) {
          this.getOuSubBranchList(msg);
        } else {
          this.partnerList = [];
        }
      });
    } else if (this.ouSubBranchType == "bankReconcile") {
      this.$root.$on("appAutocompliteOuBranchBankReconcile", (msg) => {
        if (msg != null) {
          this.getOuSubBranchList(msg);
        } else {
          this.partnerList = [];
        }
      });
    } else if (this.ouSubBranchType === "cashbankDisbursementCreate") {
      this.$root.$on(
        "appAutocomplitePartnerCashbankDisbursementCreate",
        (msg) => {
          if (msg != null) {
            this.getOuSubBranchListPartner(msg);
          } else {
            this.partnerList = [];
          }
        }
      );
    } else if (this.ouSubBranchType === "cashbankDisbursementLookup") {
      if (this.partnerId === -99 || this.partnerId === null) {
        this.partnerList = [];
        this.ouList = [];
      } else {
        this.getOuSubBranchListPartner(this.partnerId);
      }
      // this.$root.$on(
      //   "appAutocomplitePartnerCashbankDisbursementCreate",
      //   (msg) => {
      //     console.log("msg", msg);
      //     if (msg != null) {
      //       this.getOuSubBranchListPartner(msg);
      //     } else {
      //       this.partnerList = [];
      //       this.ouList = [];
      //       this.partnerId = -99;
      //       console.log("heree", this.partnerId);
      //     }
      //   }
      // );
    } else if (this.ouSubBranchType == "invoicePartnerList") {
      this.$root.$on("appAutocompliteOuBranchInvoiceAPPartner", (msg) => {
        if (msg != null) {
          this.getOuSubBranchList(msg);
        } else {
          this.partnerList = [];
        }
      });
    } else if (this.ouSubBranchType == "ticketingHistoryNonSF") {
      this.$root.$on("appAutocompliteOuBranchTicketingNonSF", (msg) => {
        if (msg != null) {
          this.getOuSubBranchList(msg);
        } else {
          this.partnerList = [];
        }
      });
    } else if (this.ouSubBranchType == "disbursementMutation") {
      this.$root.$on("appAutocomplitePartnerDisbursementMutation", (msg) => {
        if (msg != null) {
          this.getOuSubBranchListPartner(msg);
        } else {
          this.partnerList = [];
        }
      });
    }
  },
  methods: {
    // sendValue(id){
    //   this.$root.$emit('appAutocompliteOuSubBranch', id)
    // },
    getOuSubBranchListPartner(id) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/ou/authorized-ou-sub-branch-by-partner-list?partnerId=${id}`,
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
          this.notif("error", "Gagal", e.response.data.message);
        });
    },
    getOuSubBranchList(id) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/ou/authorized-ou-sub-branch-list?ouId=${id}`,
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
          this.notif("error", "Gagal", e.response.data.message);
        });
    },
  },
};
</script>
