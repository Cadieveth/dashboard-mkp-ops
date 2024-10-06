<template>
  <v-autocomplete
    :label="'Partner Bank'"
    :value="formValue"
    :items="partnerBankList"
    item-text="accountName"
    item-value="id"
    dense
    hide-details
    @change="$emit('update:formValue', $event)"
    :readonly="readOnly"
    :clearable="clearable"
    persistent-placeholder
    :placeholder="phPartnerBank"
  >
    <template #selection="data">
      <v-list-item-avatar left color="#e6e6e6" size="30">
        <v-avatar left color="#e6e6e6" size="30">
          <v-img
            :src="
              require(`@/assets/images/logos/bank_logo/${data.item.logoImage}_logo.png`)
            "
          ></v-img>
        </v-avatar>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="font-weight-semibold mb-n2 text-xs">
          {{ data.item.accountNo }} - {{ data.item.accountName }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-xs mt-2">
          Remark: {{ data.item.remark }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </template>
    <template #item="data">
      <template>
        <v-list-item-avatar left color="#e6e6e6" size="30">
          <v-avatar left color="#e6e6e6" size="30">
            <v-img
              :src="
                require(`@/assets/images/logos/bank_logo/${data.item.logoImage}_logo.png`)
              "
            ></v-img>
          </v-avatar>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="font-weight-semibold mb-n2">
            {{ data.item.accountNo }} - {{ data.item.accountName }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-xs mt-2">
            Remark: {{ data.item.remark }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>
</template>

<script>
import axios from "@axios";
import themeConfig from "@themeConfig";

export default {
  name: "ChildAutocompliteCashbankOu",
  props: {
    formValue: { type: Number, default: -99 },
    readOnly: { type: Boolean, default: false },
    labelText: { type: String, default: "" },
    clearable: { type: Boolean, default: true },
    partnerBankType: { type: String, default: "" },
  },
  data() {
    return {
      partnerBankList: [],
      bankCode: "",
      accountNo: "",
      accountname: "",
      phPartnerBank: themeConfig.placeholder.partnerBank,
    };
  },
  mounted() {
    if (this.partnerBankType == "cashbankDisbursementCreate") {
      this.$root.$on(
        "appAutocomplitePartnerCashbankDisbursementCreate",
        (msg) => {
          if (msg != null) {
            this.getPartnerBank(msg);
          } else {
            this.partnerBankList = [];
          }
        }
      );
      this.$root.$on(
        "appAutocompliteOuCompanyCashbankDisbursementCreate",
        (msg) => {
          this.partnerBankList = [];
        }
      );
      this.$root.$on("formCashBankDisbursReturn", (msg) => {
        const storedVForm = sessionStorage.getItem("disbursementCreateForm");
        const storedFilterForm = JSON.parse(storedVForm);
        if (sessionStorage.getItem("disbursementCreateForm") !== null) {
          this.getPartnerBank(storedFilterForm.partnerId);
        } else {
          this.partnerList = [];
        }
      });
    }
    //  else if (this.partnerBankType == "cashbankInPartnerReceiveCreate") {
    //   this.$root.$on(
    //     "appAutocompliteOuCompanyCashbankInPartnerReceiveCreate",
    //     (msg) => {
    //       if (msg != null) {
    //         this.getPartnerBank(msg);
    //       } else {
    //         this.partnerBankList = [];
    //       }
    //     }
    //   );
    // }
  },
  methods: {
    sendValue(id) {
      console.log(id);
      this.getAccountInfo(this.labelText, id);
      this.$root.$emit("appAutocompliteCashbankOu", {
        type: this.labelText,
        bankCode: this.bankCode,
        accountNo: this.accountNo,
        accountName: this.accountName,
      });
    },
    getAccountInfo(tipe, id) {
      for (var i = 0; i < this.partnerBankList.length; i++) {
        var obj = this.partnerBankList[i];
        if (tipe == "Source Bank") {
          if (obj.cashbankId == id) {
            this.bankCode = obj.bankCode;
            this.accountNo = obj.accountNo;
            this.accountName = obj.accountName;
            break;
          }
        } else if (tipe == "Beneficiary Bank") {
          if (obj.cashbankId == id) {
            this.bankCode = obj.bankCode;
            this.accountNo = obj.accountNo;
            this.accountName = obj.accountName;
            break;
          }
        } else {
          if (obj.cashbankId == id) {
            this.bankCode = obj.bankCode;
            this.accountNo = obj.accountNo;
            this.accountName = obj.accountName;
            break;
          }
        }
      }
    },
    getPartnerBank(id) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/partner/partner-bank-list/${id}`,
          config
        )
        .then((response) => {
          if (response.data.result !== null) {
            this.partnerBankList = response.data.result;
            this.partnerBankList.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.partnerBankList[index].bankCode +
                    "_logo.png")
                ) {
                  this.partnerBankList[index].logoImage =
                    this.partnerBankList[index].bankCode;
                }
              } catch (e) {
                this.partnerBankList[index].logoImage = "NONE";
              }
            });
          } else {
            this.partnerBankList = [];
          }
        })
        .catch((e) => {
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
  },
};
</script>
