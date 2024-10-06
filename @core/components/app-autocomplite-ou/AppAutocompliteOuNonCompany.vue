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
    clearable
    :readonly="readOnly"
    @change="$emit('update:formValue', $event), sendValue($event)"
    persistent-placeholder
    :placeholder="phOu"
  ></v-autocomplete>
</template>

<script>
import axios from "@axios";
import themeConfig from "@themeConfig";
import Form from "vform";

export default {
  name: "ChildAutocompliteOuCompany",
  props: {
    formValue: { type: Number, default: -99 },
    readOnly: { type: Boolean, default: false },
    companyFirst: { type: Boolean, default: false },
  },
  data() {
    return {
      ouList: [],
      ou: themeConfig.labeling.ou,
      phOu: themeConfig.placeholder.ou,
    };
  },
  mounted() {
    this.getOuList();
  },
  methods: {
    sendValue(id) {
      this.$root.$emit("appAutocompliteOuCompany", id);
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
          `${themeConfig.app.api_master}/ou/authorized-ou-branch-sub-branch-list`,
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
          console.log(e.response.data.message);
        });
    },
  },
};
</script>
