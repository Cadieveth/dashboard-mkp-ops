<template>
  <div>
    <v-row>
      <v-col cols="12" class="mb-0">
        <order-reporting-list></order-reporting-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import OrderReportingList from "@/views/order-reporting/OrderReportingList";

export default {
  name: "Parent",
  components: {
    OrderReportingList,
  },
  data() {
    return {
      salesInvoiceForm: false,
    };
  },
};
</script>
