<template>
  <v-autocomplete
    :label="'Account Payment Channel'"
    :value="formValue"
    :items="mainData"
    item-value="id"
    :item-text="itemValue"
    class="mb-0"
    dense
    hide-details
    clearable
    :readonly="readOnly"
    @change="$emit('update:formValue', $event), sendValue($event)"
    persistent-placeholder
    :placeholder="phOuB"
    style=""
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
      <v-list-item-content style="margin-right: -200px">
        <v-list-item-title class="font-weight-semibold mb-n2 text-sm" style="">
          {{ data.item.cashbankCode }} | {{ data.item.accountName }} -
          {{ data.item.accountNo }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-xs mt-1 text-xs">
          {{ data.item.paymentChannelCode }} -
          {{ data.item.subPaymentChannelName }}
          <span class="font-weight-bold">
            | MDR Fee: {{ data.item.mdrFee }}%</span
          >
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
          <v-list-item-title class="font-weight-semibold mb-n2 text-sm">
            {{ data.item.cashbankCode }} | {{ data.item.accountName }} -
            {{ data.item.accountNo }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-xs mt-1 text-xs">
            {{ data.item.paymentChannelCode }} -
            {{ data.item.subPaymentChannelName }}
            <span class="font-weight-bold">
              | MDR Fee: {{ data.item.mdrFee }}%</span
            >
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
  name: "ChildAutocompliteBranch",
  props: {
    formValue: { type: Number, default: -99 },
    readOnly: { type: Boolean, default: false },
    companyFirst: { type: String, default: "N" },
    merchantIdentityType: { type: String, default: "" },
  },
  data() {
    return {
      ouB: themeConfig.labeling.ouB,
      phOuB: "Select Account Payment Channel",
      ouList: [],
      mainData: [],
    };
  },
  computed: {
    itemValue() {
      return (mainData) =>
        `${mainData.subPaymentChannelName} ${mainData.accountNo}`;
    },
  },
  mounted() {
    this.refreshData();
  },
  methods: {
    sendValue(id) {
      if (this.merchantIdentityType == "bankSettlementList") {
        this.$root.$emit(
          "appAutocompliteMerchantIdentityBankSettlement",
          this.mainData.find((item) => item.id === id)
        );
      }
    },
    refreshData() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/merchant-identity/list-advance?mid=&projectName=&limit=100&offset=0`,
          config
        )
        .then((response) => {
          if (response.data.result !== null) {
            this.mainData = response.data.result;
            this.mainData.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.mainData[index].bankCode +
                    "_logo.png")
                ) {
                  this.mainData[index].logoImage =
                    this.mainData[index].bankCode;
                }
                // do something
              } catch (e) {
                this.mainData[index].logoImage = "NONE";
                // do something else
              }
            });
            this.mainData.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.mainData[index].paymentChannelName +
                    "_logo.png")
                ) {
                  this.mainData[index].payImage =
                    this.mainData[index].paymentChannelName;
                }
                // do something
              } catch (e) {
                this.mainData[index].payImage = "NONE";
                // do something else
              }
            });
            this.mainData = response.data.result.filter(
              (item) =>
                item.flgInbound == "Y" &&
                item.projectName != "DEBIT-GPN-ONUS-BDKI-MKP"
            );
          } else {
            this.mainData = [];
          }
        })
        .catch((e) => {
          this.notif("error", "Gagal", e.response.data.meta.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
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
