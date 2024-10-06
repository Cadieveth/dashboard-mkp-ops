<template>
  <v-autocomplete
    :label="subProductCategory"
    :value="formValue"
    :items="subCtgrProductList"
    :type="subType"
    item-text="subCtgrProductName"
    item-value="id"
    class="mb-0"
    dense
    hide-details
    :readonly="readOnly"
    :clearable="clearable"
    @change="$emit('update:formValue', $event)"
    persistent-placeholder
    :placeholder="phSubCategoryProduct"
  >
  </v-autocomplete>
</template>

<script>
import axios from "@axios";
import themeConfig from "@themeConfig";

export default {
  name: "ChildAutocompliteSubCategoryProduct",
  props: {
    formValue: { type: Number, default: -99 },
    readOnly: { type: Boolean, default: false },
    labelText: { type: String, default: "" },
    clearable: { type: Boolean, default: true },
    subType: { type: String, default: "" },
  },
  data() {
    return {
      subCtgrProductList: [],
      bankCode: "",
      accountNo: "",
      accountname: "",
      subProductCategory: themeConfig.labeling.subCtgrProduct,
      phSubCategoryProduct: themeConfig.placeholder.subCtgrProduct,
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
    // alert(this.subType);
    if (this.subType == "addProductForm") {
      this.$root.$on("appAutocompliteAddProductForm", (msg) => {
        if (msg != null) {
          this.getSubCtgrProduct(msg);
        } else {
          this.subCtgrProductList = [];
        }
      });
    }
    // else if (this.cashbankType == "cashbankInPartnerReceiveCreate") {
    //   this.$root.$on(
    //     "appAutocompliteOuCompanyCashbankInPartnerReceiveCreate",
    //     (msg) => {
    //       if (msg != null) {
    //         this.getCashBank(msg);
    //       } else {
    //         this.cashBankList = [];
    //       }
    //     }
    //   );
    // }
  },
  methods: {
    getSubCtgrProduct(id) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/sub-category-product/list?ctgrProductId=${id}`,
          config
        )
        .then((response) => {
          if (response.data.result !== null)
            return (this.subCtgrProductList = response.data.result);
          this.subCtgrProductList = [];
        })
        .catch((e) => {
          console.log(e);
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
  },
};
</script>
