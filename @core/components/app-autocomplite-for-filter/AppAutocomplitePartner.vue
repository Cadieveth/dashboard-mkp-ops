<template>
  <v-autocomplete
    :label="partner"
    :value="formValue"
    :items="partnerList"
    :type="partnerType"
    item-text="partnerName"
    item-value="id"
    class="mb-0"
    persistent-placeholder
    :placeholder="phPartner"
    dense
    hide-details
    :clearable="clearable"
    :readonly="readOnly"
    @change="$emit('update:formValue', $event)"
    @keyup="getPartnerList"
    clearable
    @click:clear="getPartnerList"
  ></v-autocomplete>
</template>
<!-- @update:search-input="inputed($event)" -->

<script>
import axios from "@axios";
import themeConfig from "@themeConfig";

export default {
  name: "ChildAutocomplite",
  props: {
    formValue: { type: Number, default: -99 },
    readOnly: { type: Boolean, default: false },
    clearable: { type: Boolean, default: true },
    partnerType: { type: String, default: "" },
    type: { type: String, default: "" },
    keyword: { type: String, default: "" },
    ouId: { type: Number, default: -99 },
  },
  data() {
    return {
      partner: themeConfig.labeling.partner,
      partnerList: [],
      phPartner: themeConfig.placeholder.partner,
    };
  },
  mounted() {
    if (this.type === "filterForm") {
      if (this.formValue === -99) {
        this.partnerList = [];
      } else {
        this.getPartnerList();
      }
    } else {
      this.getPartnerList();
    }
  },
  watch: {
    formValue(newVal) {
      if (newVal === -99) {
        this.partnerList = [];
      } else {
        this.getPartnerList();
      }
    },
    ouId(newVal) {
      this.getDataList(newVal);
    },
  },
  created() {
    this.getPartnerList = this.debounce(this.getPartnerList, 300);
  },
  methods: {
    debounce(func, delay) {
      let timeoutId;
      return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
        }, delay);
      };
    },
    sendValue(id) {},
    getDataList(newVal) {
      if (
        this.type !== "" &&
        (newVal === null || newVal === undefined || newVal === -99)
      ) {
        this.partnerList = [];
      } else {
        this.getPartnerList();
      }
    },
    getPartnerList(e) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_master}/partner/list?id=${
            e === undefined ? this.formValue : -99
          }`,
          {
            keyword: e === undefined ? this.keyword : e.target.value,
            ctgrPartnerId: -99,
            ouId: this.ouId === undefined ? -99 : this.ouId,
            limit: 50,
            offset: 0,
          },
          config
        )
        .then((response) => {
          if (response.data.result !== null)
            return (this.partnerList = response.data.result);
          this.partnerList = [];
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
