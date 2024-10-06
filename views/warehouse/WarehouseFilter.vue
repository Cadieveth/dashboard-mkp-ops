<template>
  <v-autocomplete
    v-model="formFilter.warehouseType"
    :label="'Warehouse Type'"
    :items="warehouseTypeList"
    item-value="warehouseType"
    item-text="warehouseType"
    class="mb-0"
    dense
    hide-details
    :clearable="true"
    persistent-placeholder
    placeholder="Select Warehouse Type"
    @change="$emit('update:formFilter', formFilter)"
    @click:clear="clearData"></v-autocomplete>
</template>

<script>
import axios from "@axios";
import themeConfig from "@themeConfig";

export default {
  name: "WarehouseFilter",
  props: {
    formValue: { type: String, default: "" },
    formFilter: Object, // Ensure you're receiving the formFilter object as a prop
  },
  data() {
    return {
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
          `${themeConfig.app.api_master}/warehouse/list?keyword=&active=Y&limit=100&offset=0&ouId=-99`,
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
            // notify if error load option warehouseType
            this.$notify("error", error.response.data.message);
          }
        });
    },
  },
};
</script>
