<template>
  <v-autocomplete
    :label="status"
    :value="formValue"
    :items="active"
    item-value="active"
    item-text="active"
    class="mb-0"
    dense
    hide-details
    :clearable="clearable"
    :readonly="readOnly"
    persistent-placeholder
    :placeholder="phuomStatus"
    @change="$emit('update:formValue', $event)"
    @click:clear="clearData"></v-autocomplete>
</template>

<script>
import axios from "@axios";
import themeConfig from "@themeConfig";

export default {
  name: "ChildAutocompliteUomStatus",
  props: {
    formValue: { type: String, default: "" },
    readOnly: { type: Boolean, default: false },
    clearable: { type: Boolean, default: true },
  },
  data() {
    return {
      status: themeConfig.labeling.uomStatus,
      phuomStatus: themeConfig.placeholder.uomStatus,
      active: [],
    };
  },
  mounted() {
    this.getUomStatusList();
    this.$root.$on("resetUomStatus", (msg) => {
      this.formValue = "";
    });
  },
  methods: {
    getUomStatusList() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/uom/list?keyword&active&limit=25&offset=0`,
          config
        )
        .then((response) => {
          if (response.data.result !== null)
            return (this.active = response.data.result);
          this.active = [];
        })
        .catch((e) => {
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          } else {
            console.log(error.response.data.message);
            this.$notify("error", error.response.data.meta.message);
          }
        });
    },

    clearData() {
      this.$emit("onClear");
    },
  },
};
</script>
