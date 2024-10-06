<template>
  <v-select
    :items="productList"
    :value="formValue"
    item-text="productName"
    item-value="id"
    label="Product"
    hide-details="auto"
    class="mb-0"
    dense
    clearable
    :readonly="readOnly"
    @change="$emit('update:formValue', $event)"
    persistent-placeholder
    :placeholder="phProduct"
  ></v-select>
</template>

<script>
import axios from "@axios";
import themeConfig from "@themeConfig";
import router from "@/router";

export default {
  name: "ChildAutocompliteProduct",
  props: {
    formValue: { type: Number, default: -99 },
    readOnly: { type: Boolean, default: false },
  },
  data() {
    return {
      productList: [],
      phProduct: themeConfig.placeholder.product,
    };
  },
  mounted() {
    this.getProductList();
  },
  methods: {
    getProductList() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_master}/product/list`,
          {
            keyword: "",
            active: "",
            limit: 9999,
            offset: 0,
          },
          config
        )
        .then((response) => {
          if (response.data.result !== null)
            return (this.productList = response.data.result);
          this.productList = [];
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
