<template>
  <div>
    <v-row>
      <v-col cols="12" class="pb-0">
        <invoice-partner-list></invoice-partner-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import InvoicePartnerList from "@/views/invoice-ap/partner/InvoicePartnerList";

  export default {
    name: 'Parent',
    components: {
      InvoicePartnerList
    },
  }
</script>