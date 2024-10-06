<template>
  <v-select
    v-show="productList.length > 0"
    :items="productList"
    :value="formValue"
    item-text="productIdentifier"
    item-value="productIdentifier"
    label="Product Avaiable"
    hide-details="auto"
    class="mb-0"
    dense
    clearable
    :readonly="readOnly"
    @change="$emit('update:formValue', $event)"
    persistent-placeholder
    :placeholder="'Select Product Avaiable'"
  ></v-select>
</template>

<script>
import axios from "@axios";
import themeConfig from "@themeConfig";
import router from "@/router";

export default {
  name: "ChildAutocompliteProduct",
  props: {
    formValue: { type: String, default: "" },
    readOnly: { type: Boolean, default: false },
    type: { type: String, default: "" },
    partnerId: { type: Number, default: -99 },
  },
  data() {
    return {
      productList: [],
      //   phProduct: themeConfig.placeholder.product,
    };
  },
  mounted() {
    // if (type === "cashbankDisbursement") {
    //   this.getProductList();
    // }
    this.$root.$emit("formCashBankDisbursReturn", () => {
      this.getProductList(-99);
    });
    this.getProductList();
  },
  watch: {
    partnerId(newVal) {
      this.getProductList(newVal);
    },
    productList(newVal) {
      this.$root.$emit("disbursementProductAvaiable", newVal);
    },
  },
  methods: {
    getProductList(id = this.partnerId) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const partnerId = id;
      axios
        .get(
          `${themeConfig.app.api_cb}/disbursement/available/product?partnerId=${partnerId}`,
          config
        )
        .then((response) => {
          if (response.data.result !== null) {
            this.productList = response.data.result;
          } else {
            this.productList = [];
          }
        })
        .catch((e) => {
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
  },
};
</script>
