<template>
  <v-autocomplete
    :label="uomClass"
    :value="formValue"
    :items="uomClassList"
    item-value="code"
    item-text="code"
    class="mb-0"
    dense
    hide-details
    :clearable="clearable"
    :readonly="readOnly"
    persistent-placeholder
    :placeholder="phuomClass"
    @change="$emit('update:formValue', $event)"
    @click:clear="clearData"></v-autocomplete>
</template>

<script>
import axios from "@axios";
import themeConfig from "@themeConfig";

export default {
  name: "ChildAutocompliteUomClass",
  props: {
    formValue: { type: String, default: "" },
    readOnly: { type: Boolean, default: false },
    clearable: { type: Boolean, default: true },
  },
  data() {
    return {
      uomClass: themeConfig.labeling.uomClass,
      phuomClass: themeConfig.placeholder.uomClass,
      uomClassList: [],
    };
  },
  mounted() {
    this.getUomClassList();
    this.$root.$on("resetUomClass", (msg) => {
      this.formValue = "";
    });
  },
  methods: {
    getUomClassList() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/combo/list?comboId=UOMCLASS`,
          config
        )
        .then((response) => {
          if (response.data.result !== null)
            return (this.uomClassList = response.data.result);
          this.uomClassList = [];
        })
        .catch((e) => {
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          } else {
            this.$notify("error", error.response.data.meta.message);
          }
        });
    },

    clearData() {
      this.$emit("on-clear", "");
    },
  },
};
</script>
