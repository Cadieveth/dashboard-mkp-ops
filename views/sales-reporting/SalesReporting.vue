<template>
  <div>
    <v-row>
      <v-col cols="12" class="mb-0">
        <sales-reporting-list></sales-reporting-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import SalesReportingList from "@/views/sales-reporting/SalesReportingList";
import SalesInvoiceForm from "@/views/sales-invoice/SalesInvoiceForm";

export default {
  name: "Parent",
  components: {
    SalesReportingList,
    SalesInvoiceForm,
  },
  data() {
    return {
      salesInvoiceForm: false,
    };
  },
};
</script>
