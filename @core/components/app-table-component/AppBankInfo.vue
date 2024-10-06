<template>
  <div class="d-flex align-center">
    <v-avatar v-if="bankCode" color="#e6e6e6" size="30">
      <v-img
        :src="require(`@/assets/images/logos/bank_logo/${getLogo()}_logo.png`)"
      ></v-img>
    </v-avatar>
    <span v-else> - </span>
    <div class="d-flex flex-column ms-3">
      <span class="d-block text--primary font-weight-semibold text-truncate">{{
        accountName
      }}</span>
      <span class="text-xs">{{ accountNo }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppBankInfo",
  props: {
    bankCode: { type: String, default: "" },
    accountName: { type: String, default: "" },
    accountNo: { type: String, default: "" },
  },
  data() {
    return {};
  },
  methods: {
    getLogo() {
      console.log(this.bankCode);
      if (this.bankCode === "BCA") {
        return "BCA";
      } else if (this.bankCode === "BIF") {
        return "BIF";
      } else if (this.bankCode === "BNI") {
        return "BNI";
      } else if (this.bankCode === "BRI") {
        return "BRI";
      } else if (this.bankCode === "CASH") {
        return "CASH";
      } else if (this.bankCode === "DKI") {
        return "DKI";
      } else if (this.bankCode === "DOKU") {
        return "DOKU";
      } else if (this.bankCode === "FLIP") {
        return "FLIP";
      } else if (this.bankCode === "MANDIRI") {
        return "MANDIRI";
      } else if (this.bankCode === "BPDDIY") {
        return "BPDDIY";
      } else if (this.bankCode === "DAERAH_ISTIMEWA") {
        return "BPDDIY";
      } else {
        return "NONE";
      }
    },
  },
};
</script>
