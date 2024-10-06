<template>
  <v-autocomplete
    :label="ou"
    :value="formValue"
    :items="ouList"
    item-value="id"
    item-text="ouName"
    class="mb-0"
    dense
    hide-details
    :clearable="clearable"
    :readonly="readOnly"
    persistent-placeholder
    :placeholder="phOu"
    @change="$emit('update:formValue', $event)"
    @click:clear="clearData"></v-autocomplete>
</template>

<script>
import axios from "@axios";
import themeConfig from "@themeConfig";

export default {
  name: "ChildAutocompliteOuCompany",
  props: {
    formValue: { type: Number, default: -99 },
    readOnly: { type: Boolean, default: false },
    clearable: { type: Boolean, default: true },
  },
  data() {
    return {
      ou: themeConfig.labeling.ou,
      phOu: themeConfig.placeholder.ou,
      ouList: [],
    };
  },
  mounted() {
    this.getOuList();
    this.$root.$on("resetOu", (msg) => {
      this.formValue = -99;
    });
  },
  methods: {
    clearData() {
      this.$emit("onClear");
    },
    getOuList() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_master}/ou/authorized-ou-bu-list`, config)
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
