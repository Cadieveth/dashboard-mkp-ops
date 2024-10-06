<template>
  <v-autocomplete
    label="Payment Method"
    :value="formValue"
    :items="paymentMethodList"
    item-text="propKey"
    item-value="code"
    class="mb-0"
    dense
    hide-details
    clearable
    :readonly="readOnly"
    :multiple="multiple"
    @change="$emit('update:formValue', $event)"
    persistent-placeholder
    :placeholder="phPaymentMethod"
  ></v-autocomplete>
</template>

<script>
import axios from "@axios";
import themeConfig from "@themeConfig";
import { mdiDotsVertical } from "@mdi/js";

export default {
  name: "ChildAutocompliteStatus",
  props: {
    formValue: "",
    readOnly: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
  },
  data() {
    return {
      paymentMethodList: [],
      phPaymentMethod: themeConfig.placeholder.paymentMethod,
    };
  },
  mounted() {
    this.getPaymentMethodeList();
  },
  methods: {
    getPaymentMethodeList() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/combo/list?comboId=PAYMENTMETHOD`,
          config
        )
        .then((response) => {
          if (response.data.result !== null)
            return (this.paymentMethodList = response.data.result);
          this.paymentMethodList = [];
        })
        .catch((e) => {
          this.notif("error", "Failed", e.response.data.message);
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
