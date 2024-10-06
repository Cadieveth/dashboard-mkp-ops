<template>
  <div>
    <v-row>
      <v-col cols="12" class="pb-0">
        <invoice-a-r-for-service-fee-inquiry-list></invoice-a-r-for-service-fee-inquiry-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import InvoiceARForServiceFeeInquiryList from "@/views/invoice-ar/generate-outstanding/InvoiceARForServiceFeeInquiryList";

export default {
  name: "Parent",
  components: {
    InvoiceARForServiceFeeInquiryList
  }
}
</script>