<template>
  <div>
    <v-row>
      <v-col cols="12" class="mb-0" v-show="!salesInvoiceForm">
        <sales-invoice-list></sales-invoice-list>
      </v-col>
      <v-col cols="12" class="mb-0" v-show="salesInvoiceForm">
        <sales-invoice-form></sales-invoice-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import SalesInvoiceList from "@/views/sales-invoice/SalesInvoiceList";
import SalesInvoiceForm from "@/views/sales-invoice/SalesInvoiceForm";

export default {
  name: "Parent",
  components: {
    SalesInvoiceList,
    SalesInvoiceForm,
  },
  data() {
    return {
      salesInvoiceForm: false,
    };
  },
  mounted() {
    this.$root.$on("SalesInvoice", (msg) => {
      this.salesInvoiceForm = msg;
    });
  },
};
</script>
