<template>
  <v-autocomplete
    :label="labelText"
    :value="valueBankOu"
    :items="cashBankList"
    item-text="cashbankName"
    item-value="cashbankId"
    dense
    hide-details
    @change="$emit('update:valueBankOu', $event), sendValue($event)"
    :readonly="readOnly"
    :clearable="clearable"
    persistent-placeholder
    :placeholder="phCashBank"
  >
    <!-- <template #selection="data">
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
        <v-list-item-title class="font-weight-semibold">
          {{ data.item.accountNo }} - {{ data.item.accountName }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-xs mt-2">
          Remark: {{ data.item.remark }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </template> -->
    <template #selection="data">
      <v-avatar left color="#e6e6e6" size="30">
        <v-img
          :src="
            require(`@/assets/images/logos/bank_logo/${data.item.logoImage}_logo.png`)
          "
        ></v-img>
      </v-avatar>
      <span :style="{ maxWidth: '20' }" class="font-weight-semibold">
        {{ "&nbsp;" + data.item.accountNo }} - {{ data.item.accountName }}</span
      >
    </template>
    <!-- <template #item="data">
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
          <v-list-item-title class="font-weight-semibold">
            {{ data.item.accountNo }} - {{ data.item.accountName }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-xs mt-2">
            Remark: {{ data.item.remark }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </template> -->

    <template #item="data">
      <template>
        <v-list-item-content>
          <v-list-item-title>
            <v-avatar left color="#e6e6e6" size="30">
              <v-img
                :src="
                  require(`@/assets/images/logos/bank_logo/${data.item.logoImage}_logo.png`)
                "
              ></v-img>
            </v-avatar>
            <span class="font-weight-semibold">
              {{ data.item.accountNo }} - {{ data.item.accountName }}</span
            >
          </v-list-item-title>
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
    valueBankOu: { type: Number, default: -99 },
    readOnly: { type: Boolean, default: false },
    labelText: { type: String, default: "" },
    clearable: { type: Boolean, default: true },
    cashbankType: { type: String, default: "" },
  },
  data() {
    return {
      cashBankList: [],
      bankCode: "",
      accountNo: "",
      accountname: "",
      phCashBank: themeConfig.placeholder.cashBank,
    };
  },
  mounted() {
    // this.$root.$on('appAutocompliteOuCashbank', msg => {
    //   if(msg != null){
    //     this.getCashBank(msg)
    //   }else{
    //     this.partnerList = []
    //   }
    // })
    if (this.cashbankType == "bankStatementForm") {
      this.$root.$on("appAutocompliteOuCashbankBankStatementForm", (msg) => {
        if (msg != null) {
          this.getCashBank(msg);
        } else {
          this.cashBankList = [];
        }
      });
    } else if (this.cashbankType == "cashbankInPartnerReceiveCreate") {
      this.$root.$on(
        "appAutocompliteOuCompanyCashbankInPartnerReceiveCreate",
        (msg) => {
          if (msg != null) {
            this.getCashBank(msg);
          } else {
            this.cashBankList = [];
          }
        }
      );
    } else if (this.cashbankType == "cashbankInPartnerReceiveForm") {
      this.$root.$on(
        "appAutocompliteOuCashbankCashbankInPartnerReceiveForm",
        (msg) => {
          if (msg != null) {
            this.getCashBank(msg);
          } else {
            this.cashBankList = [];
          }
        }
      );
    } else if (this.cashbankType == "bankStatementForm") {
      this.$root.$on("appAutocompliteOuCashbankBankStatementForm", (msg) => {
        if (msg != null) {
          this.getCashBank(msg);
        } else {
          this.cashBankList = [];
        }
      });
    } else if (this.cashbankType == "cashbankTransfer") {
      this.$root.$on(
        "appAutocompliteOuCashbankTransferWithoutDeposit",
        (msg) => {
          if (msg != null) {
            this.getCashBank(msg);
          } else {
            this.cashBankList = [];
          }
        }
      );
    } else if (this.cashbankType == "conversionCashBankInPartnerReceiveForm") {
      this.$root.$on(
        "appAutocompliteOuCashbankConversionCashBankInPartnerReceiveForm",
        (msg) => {
          if (msg != null) {
            this.getCashBank(msg);
          } else {
            this.cashBankList = [];
          }
        }
      );
    } else if (this.cashbankType == "cashbankDailyDisbursement") {
      this.$root.$on("appAutocompliteOuCashbankDailyDisbursement", (msg) => {
        if (msg != null) {
          this.getCashBank(msg);
        } else {
          this.cashBankList = [];
        }
      });
    }
  },
  methods: {
    sendValue(id) {
      this.getAccountInfo(this.labelText, id);
      this.$root.$emit("appAutocompliteCashbankOu", {
        type: this.labelText,
        bankCode: this.bankCode,
        accountNo: this.accountNo,
        accountName: this.accountName,
      });
    },
    getAccountInfo(tipe, id) {
      for (var i = 0; i < this.cashBankList.length; i++) {
        var obj = this.cashBankList[i];
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
    getCashBank(id) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/policy/cashbank/list/default`,
          config
        )
        .then((response) => {
          if (response.data.result !== null) {
            this.cashBankList = response.data.result;
            this.cashBankList.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.cashBankList[index].bankCode +
                    "_logo.png")
                ) {
                  this.cashBankList[index].logoImage =
                    this.cashBankList[index].bankCode;
                }
              } catch (e) {
                this.cashBankList[index].logoImage = "NONE";
              }
            });
          } else {
            this.cashBankList = [];
          }
        })
        .catch((e) => {
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
  },
};
</script>
