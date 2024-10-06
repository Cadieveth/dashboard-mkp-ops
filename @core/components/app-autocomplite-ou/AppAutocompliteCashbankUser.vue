<template>
  <v-autocomplete
    :label="labelText"
    :value="valueBankOu"
    :items="cashBankList"
    item-text="cashbankCode"
    item-value="cashbankId"
    :dense="dense"
    hide-details
    @change="$emit('update:valueBankOu', $event), sendValue($event)"
    persistent-placeholder
    :placeholder="placeholder"
    :readonly="readOnly"
    :clearable="clearable"
  >
    <template #selection="data">
      <v-avatar left color="#e6e6e6" size="30">
        <v-img
          :src="
            require(`@/assets/images/logos/bank_logo/${data.item.logoImage}_logo.png`)
          "
        ></v-img>
      </v-avatar>
      <span class="font-weight-semibold">
        {{ "&nbsp;" + data.item.cashbankCode }} - {{ data.item.accountNo }} -
        {{ data.item.accountName }}</span
      >
    </template>
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
              {{ data.item.cashbankCode }} - {{ data.item.accountNo }} -
              {{ data.item.accountName }}</span
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
import Form from "vform";

export default {
  name: "ChildAutocompliteCashbankOu",
  props: {
    valueBankOu: { type: Number, default: -99 },
    readOnly: { type: Boolean, default: false },
    dense: { type: Boolean, default: true },
    labelText: { type: String, default: "" },
    placeholder: { type: String, default: "Select Cash Bank" },
    clearable: { type: Boolean, default: true },
  },
  data() {
    return {
      cashBankList: [],
      bankCode: "",
      accountNo: "",
      accountname: "",
      phCashBank: themeConfig.placeholder.cashBank,
      userId: JSON.parse(this.$session.get("userData")).uid,
      form: new Form({
        bankCodeTo: "",
        accountNoTo: "",
        accountNameTo: "",
      }),
    };
  },
  mounted() {
    this.getCashBank();
    this.$root.$on("resetCashbankUser", (msg) => {
      this.valueBankOu = -99;
    });
  },
  methods: {
    async sendValue(id) {
      console.log("idCashbank :", id);
      this.getAccountInfo(this.labelText, id);
      this.$root.$emit("appAutocompliteCashbankInfoAccount", {
        type: this.labelText,
        bankCode: this.bankCode,
        accountNo: this.accountNo,
        accountName: this.accountName,
      });
      if (id !== null) {
        var cashbank = this.cashBankList.find((obj) => obj.cashbankId == id);
        this.form.bankCodeTo = cashbank.bankCode;
        this.form.accountNoTo = cashbank.accountNo;
        this.form.accountNameTo = cashbank.accountName;
        if (this.labelText == "Source Bank") {
          this.$root.$emit("filterTransferCreateSourceBank", cashbank);
        } else if (this.labelText == "Beneficiary Bank") {
          this.$root.$emit("filterTransferCreateBeneficiaryBank", cashbank);
        }
      } else {
        this.form.clear();
        this.form.reset();
        if (this.labelText == "Source Bank") {
          this.$root.$emit("filterTransferCreateSourceBank", this.form);
        } else if (this.labelText == "Beneficiary Bank") {
          this.$root.$emit("filterTransferCreateBeneficiaryBank", this.form);
        }
      }
    },
    getAccountInfo(tipe, id) {
      for (var i = 0; i < this.cashBankList.length; i++) {
        var obj = this.cashBankList[i];
        if (tipe == "Source Bank") {
          if (obj.id == id) {
            this.bankCode = obj.bankCode;
            this.accountNo = obj.accountNo;
            this.accountName = obj.accountName;
            break;
          }
        } else if (tipe == "Beneficiary Bank") {
          if (obj.id == id) {
            this.bankCode = obj.bankCode;
            this.accountNo = obj.accountNo;
            this.accountName = obj.accountName;
            break;
          }
        }
      }
    },
    getCashBank() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/policy/cashbank/list/available/${this.userId}`,
          // {
          //   keyword: "",
          //   bankCode: "",
          //   active: "",
          //   limit: 1000,
          //   offset: 0,
          // },
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
