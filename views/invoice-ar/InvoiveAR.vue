<template>
  <div>
    <v-row>
      <v-col cols="12" class="pb-0">
        <invoice-a-r-for-service-fee></invoice-a-r-for-service-fee>
<!--        <invoice-a-r-list></invoice-a-r-list>-->
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import InvoiceARList from "@/views/invoice-ar/InvoiceARList";
  import InvoiceARForServiceFee from "@/views/invoice-ar/generate-outstanding/InvoiceARForServiceFee";

  export default {
    name: "Parent",
    components: {
      InvoiceARList,
      InvoiceARForServiceFee
    }
  }
</script>