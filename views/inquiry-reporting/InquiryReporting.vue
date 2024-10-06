<template>
  <div>
    <v-row>
      <v-col cols="12" class="mb-0">
        <inquiry-reporting-list></inquiry-reporting-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import inquiryReportingList from "@/views/inquiry-reporting/InquiryReportingList";

export default {
  name: "Parent",
  components: {
    inquiryReportingList,
  },
  data() {
    return {
      salesInvoiceForm: false,
    };
  },
};
</script>
