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
  name: "ChildAutocomplite",
  props: {
    formValue: { type: Number, default: -99 },
    readOnly: { type: Boolean, default: false },
    clearable: { type: Boolean, default: true },
    ouType: { type: String, default: "" },
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
  },
  methods: {
    sendValue(id) {
      // this.$root.$emit('appAutocompliteOu', id)
      if (this.ouType == "cashbankDisbursementForm") {
        this.$root.$emit("appAutocompliteOuCashbankDisbursementForm", id);
      } else if (this.ouType == "cashbankTransferWithoutDeposit") {
        this.$root.$emit("appAutocompliteOuCashbankTransferWithoutDeposit", id);
      } else if (this.ouType == "cashbankDailyDisbursement") {
        this.$root.$emit("appAutocompliteOuCashbankDailyDisbursement", id);
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
          `${themeConfig.app.api_master}/ou/authorized-ou-bu-branch-list`,
          config
        )
        .then((response) => {
          if (response.data.result !== null)
            return (this.ouList = response.data.result);
          this.ouList = [];
        })
        .catch((e) => {
          this.notif("error", "Gagal", e.response.data.message);
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
