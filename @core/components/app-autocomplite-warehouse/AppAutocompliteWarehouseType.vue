<template>
  <v-autocomplete
    :label="warehouseType"
    :value="formValue"
    :items="warehouseTypeList"
    item-value="code"
    item-text="code"
    class="mb-0"
    dense
    hide-details
    :clearable="clearable"
    :readonly="readOnly"
    persistent-placeholder
    :placeholder="phWarehouseType"
    @change="$emit('update:formValue', $event)"
    @click:clear="clearData"></v-autocomplete>
</template>

<script>
import axios from "@axios";
import themeConfig from "@themeConfig";

export default {
  name: "ChildAutocompliteWarehouseType",
  props: {
    formValue: { type: String, default: "" },
    readOnly: { type: Boolean, default: false },
    clearable: { type: Boolean, default: true },
  },
  data() {
    return {
      warehouseType: themeConfig.labeling.warehouseType,
      phWarehouseType: themeConfig.placeholder.warehouseType,
      warehouseTypeList: [],
    };
  },
  mounted() {
    this.getWarehouseTypeList();
    this.$root.$on("resetWarehouseType", (msg) => {
      this.formValue = "";
    });
  },
  methods: {
    clearData() {
      this.$emit("onClear");
    },

    getWarehouseTypeList() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/combo/list?comboId=WAREHOUSETYPE`,
          config
        )
        .then((response) => {
          if (response.data.result !== null)
            return (this.warehouseTypeList = response.data.result);
          this.warehouseTypeList = [];
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
  },
};
</script>
