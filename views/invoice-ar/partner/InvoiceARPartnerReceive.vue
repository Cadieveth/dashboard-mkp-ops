<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        class="pb-0"
        v-show="
          !invoiceARPartnerReceiveForm &&
          !invoiceARPartnerReceiveFormPaymentOrder
        "
      >
        <invoice-a-r-partner-receive-list></invoice-a-r-partner-receive-list>
      </v-col>
      <v-col cols="12" class="pb-0" v-show="invoiceARPartnerReceiveForm">
        <invoice-a-r-partner-receive-form></invoice-a-r-partner-receive-form>
      </v-col>
      <v-col
        cols="12"
        class="pb-0"
        v-show="invoiceARPartnerReceiveFormPaymentOrder"
      >
        <invoice-a-r-partner-receive-form-payment-order></invoice-a-r-partner-receive-form-payment-order>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import InvoiceARPartnerReceiveList from "@/views/invoice-ar/partner/InvoiceARPartnerReceiveList";
import InvoiceARPartnerReceiveForm from "@/views/invoice-ar/partner/InvoiceARPartnerReceiveForm";
import InvoiceARPartnerReceiveFormPaymentOrder from "@/views/invoice-ar/partner/InvoiceARPartnerReceiveFormPaymentOrder";

export default {
  name: "Parent",
  components: {
    InvoiceARPartnerReceiveList,
    InvoiceARPartnerReceiveForm,
    InvoiceARPartnerReceiveFormPaymentOrder,
  },
  data() {
    return {
      invoiceARPartnerReceiveForm: false,
      invoiceARPartnerReceiveFormPaymentOrder: false,
    };
  },
  mounted() {
    this.$root.$on("InvoiceARPertnerReceive", (msg) => {
      this.invoiceARPartnerReceiveForm = msg;
    });
    this.$root.$on("InvoiceARPertnerReceivebyPaymentOrder", (msg) => {
      this.invoiceARPartnerReceiveFormPaymentOrder = msg;
    });
  },
  methods: {},
};
</script>
