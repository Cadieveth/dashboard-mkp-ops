<template>
  <v-autocomplete
    :label="ou"
    :value="formValue"
    :items="ouList"
    item-value="ouId"
    item-text="ouName"
    class="mb-0"
    dense
    hide-details
    :clearable="clearable"
    :readonly="readOnly"
    @change="$emit('update:formValue', $event), sendValue($event)"
    persistent-placeholder
    :placeholder="phOu"
  ></v-autocomplete>
</template>

<script>
import axios from "@axios";
import themeConfig from "@themeConfig";
import { mdiDotsVertical } from "@mdi/js";

export default {
  name: "ChildAutocompliteBuMain",
  props: {
    formValue: { type: Number, default: -99 },
    readOnly: { type: Boolean, default: false },
    clearable: { type: Boolean, default: true },
    ouType: { type: String, default: "" },
  },
  data() {
    return {
      ou: themeConfig.labeling.ou,
      ouList: [],
      phOu: themeConfig.placeholder.ou,
    };
  },
  mounted() {
    this.getOuList();
  },
  methods: {
    sendValue(id) {
      // this.$root.$emit("appAutocompliteOuBuMain", id);
      if (this.ouType == "generateOutstandingForecast") {
        this.$root.$emit(
          "appAutocompliteOuBuMainGenerateOutstandingForecast",
          id
        );
      } else if (this.ouType == "temporaryInvoicingTransactional") {
        this.$root.$emit(
          "appAutocompliteOuBuMainTemporaryInvoicingTransactional",
          id
        );
      }
    },
    getOuList() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/ou/authorized-ou-bu-main-list`,
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
