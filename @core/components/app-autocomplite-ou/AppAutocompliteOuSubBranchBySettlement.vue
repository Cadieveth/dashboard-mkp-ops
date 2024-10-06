<template>
  <v-autocomplete
    :label="ouSB"
    :value="formValue"
    :items="ouList"
    item-value="ouId"
    item-text="ouName"
    class="mb-0"
    dense
    hide-details
    clearable
    :readonly="readOnly"
    :multiple="multiple"
    @change="$emit('update:formValue', $event), sendValue($event)"
    persistent-placeholder
    :placeholder="phOuSB"
  ></v-autocomplete>
</template>

<script>
import axios from "@axios";
import themeConfig from "@themeConfig";
import { mdiDotsVertical, mdiMicrosoftEdgeLegacy } from "@mdi/js";

export default {
  name: "ChildAutocompliteSubBranch",
  props: {
    formValue: "",
    readOnly: { type: Boolean, default: false },
    ouSubBranchType: { type: String, default: "" },
    multiple: { type: Boolean, default: false },
  },
  data() {
    return {
      ouSB: themeConfig.labeling.ouSB,
      ouList: [],
      phOuSB: themeConfig.placeholder.ouSB,
    };
  },
  mounted() {
    if (this.ouSubBranchType == "bankSettlement") {
      this.$root.$on("appAutocompliteOuBranchBankSettlement", (msg) => {
        if (msg != null) {
          this.getOuSubBranchList(msg);
        } else {
          this.ouList = [];
        }
      });
    }
  },
  methods: {
    sendValue(id) {
      // console.log(id);
      this.$root.$emit("appAutocompliteOuSubBranchBankSettlement", id);
    },
    getOuSubBranchList(id) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/ou/authorized-ou-sub-branch-list-by-ou-settlement-id?ouId=${id}`,
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
          this.notif("error", "Gagal", e.response.data.message);
        });
    },
  },
};
</script>
