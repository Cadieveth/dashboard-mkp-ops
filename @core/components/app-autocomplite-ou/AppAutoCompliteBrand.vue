<template>
  <v-autocomplete
    :label="brand"
    :value="formValue"
    :items="brandList"
    item-value="id"
    item-text="brandName"
    class="mb-0"
    dense
    hide-details
    :clearable="clearable"
    :readonly="readOnly"
    @change="$emit('update:formValue', $event)"
    persistent-placeholder
    :placeholder="phBrand"
  ></v-autocomplete>
</template>

<script>
import axios from "@axios";
import themeConfig from "@themeConfig";
import { mdiDotsVertical } from "@mdi/js";

export default {
  name: "ChildAutocompliteBrand",
  props: {
    formValue: { type: Number, default: -99 },
    readOnly: { type: Boolean, default: false },
    clearable: { type: Boolean, default: true },
    brandType: { type: String, default: "" },
  },
  data() {
    return {
      brand: themeConfig.labeling.brand,
      phBrand: themeConfig.placeholder.brand,
      brandList: [],
    };
  },
  mounted() {
    this.getBrandList();
  },
  methods: {
    sendValue(id) {
      // this.$root.$emit('appAutocompliteOu', id)
      if (this.categoryType == "addProductForm") {
        this.$root.$emit("appAutocompliteAddProductForm", id);
      }
      //   else if (this.productCategoryType == "cashbankTransferWithoutDeposit") {
      //     this.$root.$emit("appAutocompliteOuCashbankTransferWithoutDeposit", id);
      //   }
    },
    getBrandList() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/brand/list?keyword=&active=&limit=100&offset=0`,
          config
        )
        .then((response) => {
          if (response.data.result !== null)
            return (this.brandList = response.data.result);
          this.brandList = [];
        })
        .catch((e) => {
          this.notif("error", "Gagal", e.response.data.message);
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
