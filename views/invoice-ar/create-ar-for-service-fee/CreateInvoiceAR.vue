<template>
  <div>
    <v-row>
      <v-col cols="12" class="mb-0" v-show="!formInvoiceAr">
        <invoice-a-r-for-service-fee-list></invoice-a-r-for-service-fee-list>
      </v-col>
      <v-col cols="12" class="mb-0" v-show="formInvoiceAr">
        <invoice-a-r-for-service-fee-form></invoice-a-r-for-service-fee-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import InvoiceARForServiceFeeList from "@/views/invoice-ar/create-ar-for-service-fee/InvoiceARForServiceFeeList";
import InvoiceARForServiceFeeForm from "@/views/invoice-ar/create-ar-for-service-fee/InvoiceARForServiceFeeForm";

export default {
  name: "Parent",
  components: {
    InvoiceARForServiceFeeList,
    InvoiceARForServiceFeeForm,
  },
  data() {
    return {
      formInvoiceAr: false,
    };
  },
  mounted() {
    this.$root.$on("formInvoiceAr", (msg) => {
      this.formInvoiceAr = msg;
    });
  },
};
</script>
