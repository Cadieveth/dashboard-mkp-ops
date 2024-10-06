<template>
  <div>
    <v-row>
      <v-col cols="12" v-show="!formTransferCashBank">
        <transfer-cashbank-list></transfer-cashbank-list>
      </v-col>
      <v-col cols="12" v-show="formTransferCashBank">
        <transfer-cashbank-form></transfer-cashbank-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import TransferCashbankList from "@/views/transfer-cash-bank/TransferCashbankList";
  import TransferCashbankForm from "@/views/transfer-cash-bank/TransferCashbankForm";

  export default {
    name: "Parent",
    components: {
      TransferCashbankList,
      TransferCashbankForm
    },
    data() {
      return {
        formTransferCashBank: false,
      };
    },
    mounted() {
      this.$root.$on("formTransferCashBank", (msg) => {
        this.formTransferCashBank = msg;
      });
    },
  }
</script>