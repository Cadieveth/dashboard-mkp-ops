<template>
  <v-autocomplete
    :label="lableTittle"
    :value="formValue"
    :items="statusList"
    item-text="propKey"
    item-value="code"
    class="mb-0"
    dense
    hide-details
    :clearable="clearable"
    :readonly="readOnly"
    @change="$emit('update:formValue', $event)"
    persistent-placeholder
    :placeholder="phDocStatus"
  ></v-autocomplete>
</template>

<script>
import axios from "@axios";
import themeConfig from "@themeConfig";
import { mdiDotsVertical } from "@mdi/js";

export default {
  name: "ChildAutocompliteStatus",
  props: {
    lableTittle: { type: String, default: "Status" },
    formValue: { type: String, default: "" },
    readOnly: { type: Boolean, default: false },
    statusType: { type: String, default: "STATUSINVOICE" },
    clearable: { type: Boolean, default: true },
  },
  data() {
    return {
      statusList: [],
      phDocStatus: themeConfig.placeholder.docStatus,
    };
  },
  mounted() {
    this.getStatusList();
  },
  methods: {
    getStatusList() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/combo/list?comboId=${this.statusType}`,
          config
        )
        .then((response) => {
          if (response.data.result !== null)
            return (this.statusList = response.data.result);
          this.statusList = [];
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
