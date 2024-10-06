<template>
  <v-autocomplete
    :label="productCategory"
    :value="formValue"
    :items="productCategoryList"
    :type="categoryType"
    item-value="id"
    item-text="ctgrProductName"
    class="mb-0"
    dense
    hide-details
    :clearable="clearable"
    :readonly="readOnly"
    @change="$emit('update:formValue', $event), sendValue($event)"
    persistent-placeholder
    :placeholder="phProductCategory"
  ></v-autocomplete>
</template>

<script>
import axios from "@axios";
import themeConfig from "@themeConfig";
import { mdiDotsVertical } from "@mdi/js";

export default {
  name: "ChildAutocompliteCategoryProduct",
  props: {
    formValue: { type: Number, default: -99 },
    readOnly: { type: Boolean, default: false },
    clearable: { type: Boolean, default: true },
    categoryType: { type: String, default: "" },
  },
  data() {
    return {
      productCategory: themeConfig.labeling.productCategory,
      phProductCategory: themeConfig.placeholder.productCategory,
      productCategoryList: [],
    };
  },
  mounted() {
    // alert(this.categoryType);
    this.getProductCategoryList();
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
    getProductCategoryList() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/category-product/list?keyword=&active=Y&limit=10&offset=0`,
          config
        )
        .then((response) => {
          if (response.data.result !== null)
            return (this.productCategoryList = response.data.result);
          this.productCategoryList = [];
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
