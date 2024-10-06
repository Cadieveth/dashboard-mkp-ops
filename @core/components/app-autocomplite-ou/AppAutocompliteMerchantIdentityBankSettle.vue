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
      ouBranchId: -99,
      ouSubBranchId: -99,
    };
  },
  computed: {
    itemValue() {
      return (mainData) =>
        `${mainData.subPaymentChannelName} ${mainData.accountNo}`;
    },
  },
  mounted() {
    // this.refreshData();
    this.$root.$on("appAutocompliteMerchIdentityBankSettle", (msg) => {
      if (msg != null) {
        this.mainData.push(...msg);
        var filterData = this.eliminateDuplicates(this.mainData);
        this.mainData = filterData;
      } else {
        this.mainData = [];
      }
    });
    // appAutocompliteOuBranchBankSettlement
    this.$root.$on("appAutocompliteOuBranchBankSettlement", (msg) => {
      this.mainData = [];
      if (msg != null) {
        this.ouBranchId = msg;
      } else {
        this.ouBranchId = -99;
      }
    });
    // appAutocompliteOuSubBranchBankSettlement
    this.$root.$on("appAutocompliteOuSubBranchBankSettlement", (msg) => {
      if (msg != null) {
        this.refreshData(msg);
      } else {
        this.ouSubBranchId = -99;
      }
    });
  },
  methods: {
    isEqual(obj1, obj2) {
      return obj1.id == obj2.id;
    },
    eliminateDuplicates(arr) {
      const uniqueData = [];
      const ids = new Set(); // Set to keep track of seen ids

      arr.forEach((obj) => {
        if (!ids.has(obj.id)) {
          // If id hasn't been seen yet, add to uniqueData and mark as seen
          ids.add(obj.id);
          uniqueData.push(obj);
        }
      });

      return uniqueData;
    },
    sendValue(id) {
      if (this.merchantIdentityType == "bankSettlementList") {
        this.$root.$emit(
          "appAutocompliteMerchantIdentityBankSettlement",
          this.mainData.find((item) => item.id === id)
        );
      }
    },
    refreshData(ouSubBranchId) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/merchant-identity/list-by-ou-advance?ouBranchId=${this.ouBranchId}&ouSubBranchId=${ouSubBranchId}`,
          config
        )
        .then((response) => {
          if (response.data.result !== null) {
            var filteredArray = response.data.result;
            // this.mainData = response.data.result;
            filteredArray.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    filteredArray[index].bankCode +
                    "_logo.png")
                ) {
                  filteredArray[index].logoImage =
                    filteredArray[index].bankCode;
                }
                // do something
              } catch (e) {
                filteredArray[index].logoImage = "NONE";
                // do something else
              }
            });
            filteredArray.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    filteredArray[index].paymentChannelName +
                    "_logo.png")
                ) {
                  filteredArray[index].payImage =
                    filteredArray[index].paymentChannelName;
                }
                // do something
              } catch (e) {
                filteredArray[index].payImage = "NONE";
                // do something else
              }
            });
            filteredArray.filter(
              (item) =>
                // item.flgInbouxnd == "Y" &&
                item.projectName != "DEBIT-GPN-ONUS-BDKI-MKP"
            );
            this.mainData.push(...filteredArray);
            var filterData = this.eliminateDuplicates(this.mainData);
            this.mainData = filterData;
            // this.mainData.filter((obj, index, self) => {
            //   return index === self.findIndex((o) => this.isEqual(o, obj));
            // });
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
